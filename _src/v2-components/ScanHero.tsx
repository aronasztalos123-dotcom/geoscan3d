"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  bounds, buildCloud, controlPoints, CUT, fmt, H, openingPaths, roomArea, rooms, wallPolygons, type Cloud,
} from "@/lib/scan/house";
import { createRenderer, type Renderer } from "@/lib/scan/gl";
import { mul, perspective, project, rotX, rotZ, translate } from "@/lib/scan/mat4";
import { site, telHref, isSet } from "@/lib/site";
import { Target } from "./Target";

const deg = Math.PI / 180;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

type Layout = {
  W: number; H: number; portrait: boolean;
  frame0: number; frame1: number; s0: [number, number]; s1: [number, number]; yaw0: number; yaw1: number;
};

function layoutFor(W: number, Hh: number, copyBottom = Hh * 0.42): Layout {
  const portrait = W / Hh < 0.9;
  if (portrait) {
    // A ház 90°-kal elforgatva, hosszanti oldala függőleges; a rajz a gombok alatti teljes helyet kapja.
    const top = copyBottom + 20, bottom = Hh - 14;
    const ppm = Math.min((0.86 * W) / 15.5, (bottom - top) / 19);
    const cy = 1 - (top + bottom) / Hh;
    return {
      W, H: Hh, portrait,
      frame0: 14, frame1: Hh / 2 / ppm,
      s0: [0, cy], s1: [0, cy],
      yaw0: 58 * deg, yaw1: 90 * deg,
    };
  }
  // Rajzterület: a szöveghasáb mellett jobbra, a címsor alatt (x 0,42–0,97 W, y 0,27–0,95 H).
  const ppm = Math.min((0.55 * W) / 22, (0.66 * Hh) / 14.2);
  return {
    W, H: Hh, portrait,
    frame0: 8.8, frame1: Hh / 2 / ppm,
    s0: [0.4, -0.34], s1: [0.32, -0.22],
    yaw0: -34 * deg, yaw1: 0,
  };
}

const PLAN_CENTER: [number, number] = [7.0, 4.7];

function stateAt(p: number, L: Layout) {
  const cam = ss(0.03, 0.56, p);
  const elev = lerp(30 * deg, 90 * deg, cam);
  const yaw = lerp(L.yaw0, L.yaw1, cam);
  const fov = lerp(42 * deg, 4 * deg, ss(0.22, 0.6, p));
  const frame = lerp(L.frame0, L.frame1, cam);
  const dist = frame / Math.tan(fov / 2);
  const sx = lerp(L.s0[0], L.s1[0], cam);
  const sy = lerp(L.s0[1], L.s1[1], cam);
  const tz = lerp(1.0, 0.6, cam);
  const aspect = L.W / L.H;
  const proj = perspective(fov, aspect, Math.max(0.1, dist - 40), dist + 40, sx, sy);
  const view = mul(
    mul(mul(translate(0, 0, -dist), rotX(-(Math.PI / 2 - elev))), rotZ(-yaw)),
    translate(-PLAN_CENTER[0], -PLAN_CENTER[1], -tz),
  );
  const mvp = mul(proj, view);
  return {
    mvp, dist, frame,
    cut: lerp(H + 0.05, CUT, ss(0.1, 0.42, p)),
    fade: [1 - 0.82 * ss(0.38, 0.6, p), 1 - ss(0.28, 0.46, p), 1 - ss(0.3, 0.5, p), 1 - ss(0.5, 0.66, p)] as [number, number, number, number],
    ink: ss(0.42, 0.62, p),
    bgp: ss(0.4, 0.62, p),
    alpha: 1 - 0.72 * ss(0.62, 0.82, p),
    sweep: ss(0.58, 0.82, p),
    detail: ss(0.8, 0.93, p),
    stage: p < 0.3 ? 0 : p < 0.62 ? 1 : 2,
  };
}

const stages = [
  { name: "Bejárás", note: "A szkenner minden látható felületet rögzít. Egy régi háznál 20–30 perc." },
  { name: "Metszés", note: "A pontfelhőt 1,2 m magasan elvágom, kirajzolódnak a falak és a nyílások." },
  { name: "Átadás", note: "Kész DWG alaprajz, EOV koordinátákkal, egyenesen az Ön tervébe." },
];

const polys = wallPolygons();
const { windows, doors } = openingPaths();
const dimY = -1.15, dimX = -1.15;
const dims = [
  { x: (bounds.x0 + bounds.x1) / 2, y: dimY - 0.45, text: fmt(bounds.x1 - bounds.x0) },
  { x: dimX - 0.45, y: (bounds.y0 + bounds.y1) / 2, text: fmt(bounds.y1 - bounds.y0), vertical: true },
];
const tick = (x: number, y: number) => `M${x - 0.18} ${y - 0.18}L${x + 0.18} ${y + 0.18}`;
const dimPath =
  `M${bounds.x0} ${dimY}L${bounds.x1} ${dimY}` +
  `M${bounds.x0} -0.4L${bounds.x0} ${dimY - 0.25}M${bounds.x1} -0.4L${bounds.x1} ${dimY - 0.25}` +
  tick(bounds.x0, dimY) + tick(bounds.x1, dimY) +
  `M${dimX} ${bounds.y0}L${dimX} ${bounds.y1}` +
  `M-0.4 ${bounds.y0}L${dimX - 0.25} ${bounds.y0}M-0.4 ${bounds.y1}L${dimX - 0.25} ${bounds.y1}` +
  tick(dimX, bounds.y0) + tick(dimX, bounds.y1);

/** Mozgáscsökkentés vagy adatkímélő mód: a jelenet egy képernyőn, a kész rajzzal áll. */
function readMotion(): "scroll" | "static" {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches || !!conn?.saveData ? "static" : "scroll";
}
function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function ScanHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const planRef = useRef<SVGGElement>(null);
  const clipRef = useRef<SVGRectElement>(null);
  const sweepRef = useRef<SVGLineElement>(null);
  const labelRefs = useRef<(HTMLElement | null)[]>([]);
  const [stage, setStage] = useState(0);
  const mode = useSyncExternalStore(subscribeMotion, readMotion, () => "scroll" as const);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current!, sticky = stickyRef.current!, canvas = canvasRef.current!;
    const isStatic = readMotion() === "static";

    let renderer: Renderer | null = null;
    let L = layoutFor(sticky.clientWidth, sticky.clientHeight);
    let target = isStatic ? 1 : 0;
    let cur = target;
    let raf = 0;
    let lastStage = -1;
    let inView = true;
    let dirty = true;
    let disposed = false;

    const dpr = () => Math.min(window.devicePixelRatio || 1, L.portrait ? 1.75 : 2);

    const copyBottom = () => {
      const a = sticky.querySelector(".scan-actions");
      return a ? a.getBoundingClientRect().bottom - sticky.getBoundingClientRect().top : undefined;
    };
    const measure = () => {
      L = layoutFor(sticky.clientWidth, sticky.clientHeight, copyBottom());
      section.dataset.portrait = String(L.portrait);
      if (renderer) renderer.resize(Math.round(L.W * dpr()), Math.round(L.H * dpr()));
      dirty = true;
    };

    const readScroll = () => {
      if (isStatic) return;
      const r = section.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      target = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
    };

    const frame = () => {
      raf = 0;
      const d = target - cur;
      cur = Math.abs(d) < 0.0004 ? target : cur + d * 0.14;
      const s = stateAt(cur, L);

      document.documentElement.style.setProperty("--bgp", s.bgp.toFixed(3));
      sticky.style.setProperty("--detail", s.detail.toFixed(3));

      if (renderer) {
        const ppm = L.H / 2 / s.frame;
        renderer.draw({
          mvp: s.mvp,
          cut: s.cut,
          size: Math.min(3.4, Math.max(1.3, ppm * 0.05)) * dpr(),
          wref: s.dist,
          ink: s.ink,
          alpha: s.alpha,
          fade: s.fade,
        });
      }

      // A rajz síkja: ugyanazzal a mátrixszal vetítve, mint a pontok (z = 0,6 m).
      const toPx = (x: number, y: number) => {
        const [nx, ny] = project(s.mvp, x, y, 0.6);
        return [((nx + 1) / 2) * L.W, ((1 - ny) / 2) * L.H];
      };
      const [ex, ey] = toPx(0, 0), [ax, ay] = toPx(1, 0), [cx, cy] = toPx(0, 1);
      planRef.current?.setAttribute("transform", `matrix(${ax - ex} ${ay - ey} ${cx - ex} ${cy - ey} ${ex} ${ey})`);
      const sx = lerp(bounds.x0 - 2.6, bounds.x1 + 2.6, s.sweep);
      clipRef.current?.setAttribute("width", String(Math.max(0, sx - (bounds.x0 - 2.6))));
      if (sweepRef.current) {
        sweepRef.current.setAttribute("x1", String(sx));
        sweepRef.current.setAttribute("x2", String(sx));
        sweepRef.current.style.opacity = s.sweep > 0 && s.sweep < 1 ? "1" : "0";
      }
      const labelPts: [number, number][] = [
        ...rooms.map((r) => [(r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2] as [number, number]),
        ...dims.map((d) => [d.x, d.y] as [number, number]),
        ...controlPoints.map((c) => [c.x, c.y] as [number, number]),
      ];
      labelPts.forEach(([x, y], i) => {
        const el = labelRefs.current[i];
        if (!el) return;
        const [px, py] = toPx(x, y);
        el.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0)`;
      });

      if (s.stage !== lastStage) {
        lastStage = s.stage;
        setStage(s.stage);
      }
      dirty = false;
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

    // WebGL a első festés után indul, hogy a címsor legyen az LCP.
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
      const density = L.portrait ? 0.45 : 1;
      try {
        worker = new Worker(new URL("../lib/scan/cloud.worker.ts", import.meta.url), { type: "module" });
        worker.onmessage = (e: MessageEvent<Cloud>) => {
          start(e.data);
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

    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView && (dirty || cur !== target)) schedule();
    });
    io.observe(section);

    readScroll();
    cur = target;
    measure();
    schedule();
    if (!isStatic) window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      worker?.terminate();
      if (raf) cancelAnimationFrame(raf);
      if (!idle) window.clearTimeout(idleId);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer?.dispose();
      document.documentElement.style.removeProperty("--bgp");
    };
  }, []);

  let li = 0;
  const ref = (el: HTMLElement | null, i: number) => {
    labelRefs.current[i] = el;
  };

  return (
    <section
      ref={sectionRef}
      className="scan"
      data-mode={mode}
      aria-labelledby="hero-title"
    >
      <div ref={stickyRef} className="scan-sticky">
        <canvas ref={canvasRef} className="scan-canvas" data-ready={ready} aria-hidden="true" />

        <svg className="scan-plan" aria-hidden="true">
          <defs>
            <clipPath id="plan-sweep" clipPathUnits="userSpaceOnUse">
              <rect ref={clipRef} x={bounds.x0 - 2.6} y={-6} width={0} height={24} />
            </clipPath>
          </defs>
          <g ref={planRef}>
            <g clipPath="url(#plan-sweep)">
              {polys.map((pts, i) => (
                <polygon key={i} points={pts} className="plan-wall" />
              ))}
              <path d={windows} className="plan-thin" />
              <path d={doors} className="plan-thin" />
            </g>
            <path d={dimPath} className="plan-dim" />
            <line ref={sweepRef} x1={0} x2={0} y1={-3} y2={bounds.y1 + 2.4} className="plan-sweep" />
          </g>
        </svg>

        <div className="scan-labels" aria-hidden="true">
          {rooms.map((r) => {
            const i = li++;
            return (
              <span key={`r${i}`} ref={(el) => ref(el, i)} className="scan-label scan-room">
                <b>{r.name}</b>
                <span>{fmt(roomArea(r))} m²</span>
              </span>
            );
          })}
          {dims.map((d) => {
            const i = li++;
            return (
              <span key={`d${i}`} ref={(el) => ref(el, i)} className={`scan-label scan-dim${d.vertical ? " is-v" : ""}`}>
                <span className="scan-dim-t">{d.text}</span>
              </span>
            );
          })}
          {controlPoints.map((c) => {
            const i = li++;
            return (
              <span key={c.id} ref={(el) => ref(el, i)} className="scan-label scan-cp">
                <Target className="scan-cp-mark" />
                <span className="scan-cp-text">
                  <b>{c.id}</b>
                  <span className="scan-cp-eov">EOV Y {c.eovY}</span>
                  <span className="scan-cp-eov">X {c.eovX}</span>
                </span>
              </span>
            );
          })}
        </div>

        <div className="scan-copy wrap">
          <h1 id="hero-title" className="scan-title">
            3D lézerszkennelés, <span className="nowrap">földmérőtől</span>
          </h1>
          <div className="scan-lower">
            <p className="scan-lead">
              Épületfelmérés kézi lézerszkennerrel, Borsodtól Budapestig. Kész <span className="nowrap">DWG alaprajz</span>,{" "}
              <span className="nowrap">EOV-ba</span> illesztve.
            </p>
            <div className="scan-actions">
              <a href="#ajanlat" className="btn btn-accent">Ajánlatot kérek <span className="arr" aria-hidden="true">→</span></a>
              <a href={telHref} className="scan-phone">
                {isSet(site.phoneDisplay) ? site.phoneDisplay : "[TELEFON]"}
              </a>
            </div>
          </div>
        </div>

        <div className="scan-foot">
          <ol className="scan-steps">
            {stages.map((st, i) => (
              <li key={st.name} className="scan-step" data-on={i === (mode === "static" ? 2 : stage)} aria-current={i === (mode === "static" ? 2 : stage) ? "step" : undefined}>
                {st.name}
              </li>
            ))}
          </ol>
          <p className="scan-note" aria-live="off">{stages[(mode === "static" ? 2 : stage)].note}</p>
        </div>
        <p className="scan-sample">Szemléltetés egy mintaházon</p>
      </div>
    </section>
  );
}
