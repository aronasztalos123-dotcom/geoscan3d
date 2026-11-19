"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  bounds, buildCloud, controlPoints, CUT, eastFace, eov, fmt, fmtEov, H, LEAN, openingPaths, parcel, roomArea, rooms,
  wallPolygons, type Cloud,
} from "@/lib/scan/house";
import { createRenderer, type Renderer } from "@/lib/scan/gl";
import { mul, perspective, project, rotX, rotZ, translate } from "@/lib/scan/mat4";
import { isSet, site, telHref } from "@/lib/site";
import { Target } from "./Target";

/* ------------------------------------------------------------------ kulcsállapotok */

type Key = {
  cx: number; cy: number; tz: number; elev: number; yaw: number; fov: number; hw: number; hh: number;
  cut: number; fade: [number, number, number, number]; ink: number; bg: number; alpha: number; size: number;
  sweep: number; wall: number; rooms: number; dims: number; lean: number; band: number; cp: number; parcel: number;
};

const faceX = (y: number) =>
  eastFace.south[0] + ((eastFace.north[0] - eastFace.south[0]) * (y - eastFace.south[1])) / (eastFace.north[1] - eastFace.south[1]);

const base: Key = {
  cx: 7.1, cy: 4.7, tz: 0.6, elev: 90, yaw: 90, fov: 4, hw: 5.7, hh: 8.6,
  cut: CUT, fade: [0.18, 0, 0, 0], ink: 1, bg: 1, alpha: 0.3, size: 1,
  sweep: 1, wall: 1, rooms: 1, dims: 1, lean: 0, band: 0, cp: 0, parcel: 0,
};

/** Hat állapot, egy-egy olvasási blokkhoz. A kamera mindig ugyanaz, csak mozog. */
const KEYS: Key[] = [
  // Bejárás: ferde nézet, valós színek, sötétben
  { ...base, tz: 1.0, elev: 32, yaw: 56, fov: 42, hw: 8.6, hh: 8.6, cut: H + 0.05, fade: [1, 1, 1, 1], ink: 0, bg: 0, alpha: 1, sweep: 0, wall: 1, rooms: 0, dims: 0 },
  // Metszés: a sík leér 1,2 m-re, a bútor és a környezet elmegy
  { ...base, tz: 0.9, elev: 56, yaw: 72, fov: 26, hw: 8.0, hh: 8.0, cut: CUT, fade: [0.9, 0, 0.15, 0.25], ink: 0.15, bg: 0, alpha: 1, sweep: 0, rooms: 0, dims: 0 },
  // Alaprajz: felülről, papír, tömör falak
  { ...base },
  // A ferde fal: a keleti fal északi fele, szaggatott derékszög mellett
  { ...base, cx: faceX(7.7) - 0.25, cy: 7.7, hw: 2.15, hh: 1.5, alpha: 0.6, wall: 0.22, rooms: 0, dims: 0, lean: 1 },
  // ±2 cm: a külső falsík közelről
  { ...base, cx: faceX(8.2), cy: 8.2, hw: 0.42, hh: 0.3, alpha: 0.95, size: 1.15, wall: 0.3, rooms: 0, dims: 0, lean: 0, band: 1 },
  // EOV: kifelé, illesztőpontok és telekhatár
  { ...base, cx: 8.2, cy: 4.9, hw: 14.5, hh: 13, alpha: 0.22, rooms: 0, dims: 0, cp: 1, parcel: 1 },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const deg = Math.PI / 180;

function mix(a: Key, b: Key, t: number): Key {
  const o = {} as Key;
  for (const k of Object.keys(a) as (keyof Key)[]) {
    const va = a[k], vb = b[k];
    if (Array.isArray(va)) (o[k] as number[]) = va.map((v, i) => lerp(v, (vb as number[])[i], t));
    else if (k === "hw" || k === "hh") (o[k] as number) = Math.exp(lerp(Math.log(va as number), Math.log(vb as number), t));
    else (o[k] as number) = lerp(va as number, vb as number, t);
  }
  return o;
}

/** f: tört index a kulcsok között. A blokkok közepén a kamera megáll (dwell). */
function keyAt(f: number, snap: boolean): Key {
  const n = KEYS.length - 1;
  const c = Math.min(n, Math.max(0, f));
  const i = Math.min(n - 1, Math.floor(c));
  const t = c - i;
  if (snap) return KEYS[t < 0.5 ? i : i + 1];
  // A metszés és a papír átmenete külön ütemű: előbb vág, aztán világosodik.
  const k = mix(KEYS[i], KEYS[i + 1], ss(0.14, 0.86, t));
  if (i === 1) {
    k.bg = ss(0.25, 0.75, t);
    k.sweep = ss(0.45, 0.95, t);
    k.ink = lerp(KEYS[1].ink, 1, ss(0.2, 0.6, t));
  }
  return k;
}

/** frac: a rajz látható magassága a színpad arányában (telefonon a felső rész, alul a szöveg úszik át). */
function matrices(k: Key, W: number, Hh: number, frac = 1) {
  const ppm = Math.min(W / 2 / k.hw, (Hh * frac) / 2 / k.hh);
  const frame = Hh / 2 / ppm;
  const fov = k.fov * deg;
  const dist = frame / Math.tan(fov / 2);
  const proj = perspective(fov, W / Hh, Math.max(0.05, dist - 40), dist + 40, 0, 1 - frac);
  const view = mul(
    mul(mul(translate(0, 0, -dist), rotX(-(Math.PI / 2 - k.elev * deg))), rotZ(-k.yaw * deg)),
    translate(-k.cx, -k.cy, -k.tz),
  );
  return { mvp: mul(proj, view), ppm, dist };
}

/* ------------------------------------------------------------------ rajz (méterben) */

const polys = wallPolygons();
const { windows, doors } = openingPaths();
const dimY = -1.15, dimX = -1.15;
const dims = [
  { x: (bounds.x0 + bounds.x1) / 2, y: dimY - 0.5, text: fmt(bounds.x1 - bounds.x0) },
  { x: dimX - 0.5, y: (bounds.y0 + bounds.y1) / 2, text: fmt(bounds.y1 - bounds.y0) },
];
const tick = (x: number, y: number) => `M${x - 0.18} ${y - 0.18}L${x + 0.18} ${y + 0.18}`;
const dimPath =
  `M${bounds.x0} ${dimY}L${bounds.x1} ${dimY}` +
  `M${bounds.x0} -0.4L${bounds.x0} ${dimY - 0.25}M${bounds.x1} -0.4L${bounds.x1} ${dimY - 0.25}` +
  tick(bounds.x0, dimY) + tick(bounds.x1, dimY) +
  `M${dimX} ${bounds.y0}L${dimX} ${bounds.y1}` +
  `M-0.4 ${bounds.y0}L${dimX - 0.25} ${bounds.y0}M-0.4 ${bounds.y1}L${dimX - 0.25} ${bounds.y1}` +
  tick(dimX, bounds.y0) + tick(dimX, bounds.y1);

const [sx0, sy0] = eastFace.south, [nx0, ny0] = eastFace.north;
const leanRef = `M${sx0} ${sy0 - 0.4}L${sx0} ${ny0 + 1.1}`;
const leanDimY = ny0 + 0.3;
const leanDim = `M${nx0} ${leanDimY}L${sx0} ${leanDimY}M${nx0} ${ny0}L${nx0} ${leanDimY + 0.2}`;
const fl = Math.hypot(nx0 - sx0, ny0 - sy0);
const nrm: [number, number] = [(ny0 - sy0) / fl, -(nx0 - sx0) / fl];
const B = 0.02;
const bandPoly = [
  [sx0 + nrm[0] * B, sy0 + nrm[1] * B], [nx0 + nrm[0] * B, ny0 + nrm[1] * B],
  [nx0 - nrm[0] * B, ny0 - nrm[1] * B], [sx0 - nrm[0] * B, sy0 - nrm[1] * B],
].map((p) => p.join(",")).join(" ");
const faceLine = `M${sx0} ${sy0}L${nx0} ${ny0}`;
const parcelPts = parcel.map((p) => p.join(",")).join(" ");

/* ------------------------------------------------------------------ olvasási blokkok */

type Act = { id: string; title: string; body: string[]; fig?: { src: string; w: number; h: number; alt: string; cap: string } };
const acts: Act[] = [
  { id: "metszes", title: "1,2 méteren elvágom", body: ["Ami a vágás fölött van, eltűnik. Marad a falak valós helye."] },
  { id: "alaprajz", title: "Ebből lesz a DWG", body: ["Rétegezett alaprajz, metszet, homlokzat. AutoCAD-ben és ArchiCAD-ben nyílik."] },
  { id: "ferde-fal", title: "A ferde fal ferde marad", body: [`Ez a fal ${Math.round(LEAN * 100)} cm-t dől. A rajz is így mutatja.`] },
  { id: "pontossag", title: "±2 cm, mindenhol", body: ["Tervhez, látványhoz, térfogathoz elég. Gépészeti illesztéshez nem."] },
  { id: "eov", title: "Földmérő méri, EOV-ban", body: ["A rajz ott ül, ahol a telek és a közmű."] },
]

/* ------------------------------------------------------------------ mozgásmód */

function readSnap() {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches || !!conn?.saveData;
}

export function ScanStage() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const planRef = useRef<SVGGElement>(null);
  const clipRef = useRef<SVGRectElement>(null);
  const sweepRef = useRef<SVGLineElement>(null);
  const eovRef = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const root = rootRef.current!, stage = stageRef.current!, canvas = canvasRef.current!;
    const snap = readSnap();
    const labels = Array.from(stage.querySelectorAll<HTMLElement>(".lbl"));
    let renderer: Renderer | null = null;
    let W = stage.clientWidth, Hh = stage.clientHeight;
    let anchors: number[] = [];
    let focus = 0.5;
    let frac = 1;
    let target = 0, cur = 0;
    let raf = 0, inView = true, disposed = false, lastEov = "";

    const dpr = () => Math.min(window.devicePixelRatio || 1, W < 600 ? 1.75 : 2);

    const measure = () => {
      W = stage.clientWidth;
      Hh = stage.clientHeight;
      renderer?.resize(Math.round(W * dpr()), Math.round(Hh * dpr()));
      // Telefonon a szöveg a rajz alsó részén úszik át, ezért a rajz a felső 56%-ba kerül.
      const stacked = stage.getBoundingClientRect().width > window.innerWidth * 0.8;
      frac = stacked ? 0.56 : 1;
      focus = window.innerHeight * 0.5;
      const sy = window.scrollY;
      anchors = Array.from(root.querySelectorAll<HTMLElement>("[data-act]")).map((el) => {
        const b = el.getBoundingClientRect();
        return b.top + sy + b.height / 2;
      });
    };

    const readScroll = () => {
      const y = window.scrollY + focus;
      if (!anchors.length) return;
      if (y <= anchors[0]) target = 0;
      else if (y >= anchors[anchors.length - 1]) target = anchors.length - 1;
      else {
        let i = 0;
        while (y > anchors[i + 1]) i++;
        target = i + (y - anchors[i]) / (anchors[i + 1] - anchors[i]);
      }
    };

    const frame = () => {
      raf = 0;
      const d = target - cur;
      cur = snap || Math.abs(d) < 0.0005 ? target : cur + d * 0.12;
      const k = keyAt(cur, snap);
      const { mvp, ppm, dist } = matrices(k, W, Hh, frac);

      stage.style.setProperty("--bg", k.bg.toFixed(3));
      stage.dataset.dark = String(k.bg < 0.5);
      for (const p of ["wall", "rooms", "dims", "lean", "band", "cp", "parcel"] as const) {
        stage.style.setProperty(`--${p}`, k[p].toFixed(3));
      }

      renderer?.draw({
        mvp, cut: k.cut, wref: dist, ink: k.ink, alpha: k.alpha, fade: k.fade,
        size: Math.min(3.6, Math.max(1.3, ppm * 0.045)) * k.size * dpr(),
      });

      const toPx = (x: number, y: number) => {
        const [px, py] = project(mvp, x, y, 0.6);
        return [((px + 1) / 2) * W, ((1 - py) / 2) * Hh];
      };
      const [ex, ey] = toPx(0, 0), [ax, ay] = toPx(1, 0), [bx, by] = toPx(0, 1);
      planRef.current?.setAttribute("transform", `matrix(${ax - ex} ${ay - ey} ${bx - ex} ${by - ey} ${ex} ${ey})`);
      const sweepX = lerp(bounds.x0 - 2.6, bounds.x1 + 2.6, k.sweep);
      clipRef.current?.setAttribute("width", String(Math.max(0, sweepX - (bounds.x0 - 2.6))));
      if (sweepRef.current) {
        sweepRef.current.setAttribute("x1", String(sweepX));
        sweepRef.current.setAttribute("x2", String(sweepX));
        sweepRef.current.style.opacity = k.sweep > 0.01 && k.sweep < 0.99 ? "1" : "0";
      }

      const pts: [number, number][] = [
        ...rooms.map((r) => [(r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2] as [number, number]),
        ...dims.map((d) => [d.x, d.y] as [number, number]),
        ...controlPoints.map((c) => [c.x, c.y] as [number, number]),
        [sx0 + 0.32, ny0 - 0.35],
        [faceX(8.2) + 0.05, 8.2 + 0.06],
      ];
      pts.forEach(([x, y], i) => {
        const el = labels[i];
        if (!el) return;
        const [px, py] = toPx(x, y);
        el.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0)`;
      });

      const e = eov(k.cx, k.cy);
      const txt = `EOV Y ${fmtEov(e.Y)}   X ${fmtEov(e.X)}`;
      if (txt !== lastEov && eovRef.current) {
        eovRef.current.textContent = txt;
        lastEov = txt;
      }
      if (cur !== target) schedule();
    };

    const schedule = () => {
      if (!raf && inView && !disposed) raf = requestAnimationFrame(frame);
    };
    const onScroll = () => {
      readScroll();
      schedule();
    };
    const onResize = () => {
      measure();
      readScroll();
      schedule();
    };

    // A WebGL az első festés után indul, hogy a címsor legyen az LCP; a felhő Web Workerben készül.
    const start = (cloud: Cloud) => {
      if (disposed) return;
      try {
        renderer = createRenderer(canvas, cloud);
      } catch {
        renderer = null;
      }
      measure();
      setReady(true);
      schedule();
    };
    let worker: Worker | null = null;
    const init = () => {
      if (disposed) return;
      const density = W < 600 ? 0.45 : 1;
      try {
        worker = new Worker(new URL("../lib/scan/cloud.worker.ts", import.meta.url), { type: "module" });
        worker.onmessage = (ev: MessageEvent<Cloud>) => {
          start(ev.data);
          worker?.terminate();
          worker = null;
        };
        worker.onerror = () => {
          worker?.terminate();
          worker = null;
          start(buildCloud(density));
        };
        worker.postMessage({ density });
      } catch {
        start(buildCloud(density));
      }
    };
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const idleId = idle ? idle(init, { timeout: 900 }) : window.setTimeout(init, 200);

    const io = new IntersectionObserver(([en]) => {
      inView = en.isIntersecting;
      if (inView) schedule();
    });
    io.observe(root);
    const ro = new ResizeObserver(onResize);
    ro.observe(root);

    measure();
    readScroll();
    cur = target;
    schedule();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(onResize);

    return () => {
      disposed = true;
      worker?.terminate();
      if (raf) cancelAnimationFrame(raf);
      if (!idle) window.clearTimeout(idleId);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer?.dispose();
    };
  }, []);

  return (
    <section ref={rootRef} className="scan" aria-labelledby="hero-title">
      <div className="scan-read">
        <div className="scan-card" data-act="0">
          <div className="scale" aria-hidden="true" />
          <div className="scan-card-body">
            <h1 id="hero-title" className="t-display">
              3D lézerszkennelés, <span className="nowrap">földmérőtől</span>
            </h1>
            <p className="t-lead scan-lead">
              Meglévő épületről <span className="nowrap">DWG alaprajz</span> tervezőknek, <span className="nowrap">EOV-ban</span>.
              Borsodtól Budapestig.
            </p>
            <div className="scan-actions">
              <a href="#ajanlat" className="btn btn-accent">Ajánlatot kérek</a>
              <a href={telHref} className="link-strong">{isSet(site.phoneDisplay) ? site.phoneDisplay : "[TELEFON]"}</a>
            </div>
          </div>
        </div>

        {acts.map((a, i) => (
          <article key={a.id} id={a.id} className="scan-act" data-act={i + 1} aria-labelledby={`${a.id}-h`}>
            <div className="scan-act-body">
            <h2 id={`${a.id}-h`} className="t-head">{a.title}</h2>
            {a.body.map((p, j) => (
              <p key={j} className={j === 0 ? "t-lead" : undefined}>
                {p}
              </p>
            ))}
            {a.fig ? (
              <figure className="scan-fig">
                <Image src={a.fig.src} alt={a.fig.alt} width={a.fig.w} height={a.fig.h} sizes="(max-width: 899px) 70vw, 22rem" />
                <figcaption>{a.fig.cap}</figcaption>
              </figure>
            ) : null}
            </div>
          </article>
        ))}
      </div>

      <div ref={stageRef} className="scan-stage" data-ready={ready} data-dark="true">
        <canvas ref={canvasRef} className="scan-canvas" aria-hidden="true" />
        <svg className="scan-plan" aria-hidden="true">
          <defs>
            <clipPath id="plan-sweep" clipPathUnits="userSpaceOnUse">
              <rect ref={clipRef} x={bounds.x0 - 2.6} y={-6} width={0} height={24} />
            </clipPath>
          </defs>
          <g ref={planRef}>
            <polygon points={parcelPts} className="plan-parcel" vectorEffect="non-scaling-stroke" />
            <g clipPath="url(#plan-sweep)">
              {polys.map((pts, i) => (
                <polygon key={i} points={pts} className="plan-wall" />
              ))}
              <path d={windows} className="plan-thin" vectorEffect="non-scaling-stroke" />
              <path d={doors} className="plan-thin" vectorEffect="non-scaling-stroke" />
            </g>
            <path d={dimPath} className="plan-dim" vectorEffect="non-scaling-stroke" />
            <g className="plan-lean">
              <path d={leanRef} className="plan-ref" vectorEffect="non-scaling-stroke" />
              <path d={faceLine} className="plan-face" vectorEffect="non-scaling-stroke" />
              <path d={leanDim} className="plan-thin" vectorEffect="non-scaling-stroke" />
            </g>
            <g className="plan-band">
              <polygon points={bandPoly} className="plan-band-fill" />
              <path d={faceLine} className="plan-face" vectorEffect="non-scaling-stroke" />
            </g>
            <line ref={sweepRef} x1={0} x2={0} y1={-3} y2={bounds.y1 + 2.4} className="plan-sweep" vectorEffect="non-scaling-stroke" />
          </g>
        </svg>

        <div className="scan-labels" aria-hidden="true">
          {rooms.map((r, i) => (
            <span key={`r${i}`} className="lbl lbl-room">
              <b>{r.name}</b>
              <span>{fmt(roomArea(r))} m²</span>
            </span>
          ))}
          {dims.map((d, i) => (
            <span key={`d${i}`} className="lbl lbl-dim">{d.text}</span>
          ))}
          {controlPoints.map((c) => (
            <span key={c.id} className="lbl lbl-cp">
              <Target className="lbl-cp-mark" />
              <span>
                <b>{c.id}</b>
                <span className="tnum">Y {c.eovY}</span>
                <span className="tnum">X {c.eovX}</span>
              </span>
            </span>
          ))}
          <span className="lbl lbl-lean">{Math.round(LEAN * 100)} cm</span>
          <span className="lbl lbl-band">±2 cm</span>
        </div>

        <p className="scan-meta">
          <span>Szemléltetés egy mintaházon</span>
          <span ref={eovRef} className="tnum scan-eov" />
        </p>
      </div>
    </section>
  );
}
