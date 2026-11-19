/**
 * Mintaház a hero jelenethez. Szemléltetés, nem ügyfélmunka: egy régi, vastag falú
 * parasztház, amelynek keleti fala 0,15 m-t dől (a régi házak ritkán derékszögűek).
 * Egységek: méter. x kelet, y észak, z fel.
 */

export type Opening = { at: number; w: number; kind: "door" | "window"; swing?: 1 | -1; hinge?: 1 | -1 };
export type Wall = { a: [number, number]; b: [number, number]; t: number; outer?: boolean; openings?: Opening[] };

export const H = 3.05; // belmagasság a födém aljáig
export const SILL = 0.9;
export const HEAD = 2.1;
export const CUT = 1.2; // alaprajzi metszősík

const EX = 14.2; // déli homlokzat hossza
const EXN = 14.05; // északi homlokzat hossza (dőlt keleti fal)
const NY = 9.4;
const eastX = (y: number) => EX + (EXN - EX) * (y / NY);

export const walls: Wall[] = [
  // Külső falak, 55 cm
  {
    a: [0, 0], b: [EX, 0], t: 0.55, outer: true,
    openings: [
      { at: 2.4, w: 1.2, kind: "window" },
      { at: 6.6, w: 1.0, kind: "door", swing: 1, hinge: -1 },
      { at: 11.4, w: 1.2, kind: "window" },
    ],
  },
  { a: [EX, 0], b: [EXN, NY], t: 0.55, outer: true, openings: [{ at: 3.3, w: 1.2, kind: "window" }] },
  {
    a: [EXN, NY], b: [0, NY], t: 0.55, outer: true,
    openings: [
      { at: EXN - 11.8, w: 0.8, kind: "window" },
      { at: EXN - 7.0, w: 1.0, kind: "window" },
      { at: EXN - 2.4, w: 1.2, kind: "window" },
    ],
  },
  {
    a: [0, NY], b: [0, 0], t: 0.55, outer: true,
    openings: [
      { at: NY - 7.3, w: 1.0, kind: "window" },
      { at: NY - 2.6, w: 1.0, kind: "window" },
    ],
  },
  // Belső főfalak, 40 cm
  {
    a: [4.8, 0], b: [4.8, NY], t: 0.4,
    openings: [
      { at: 2.0, w: 0.9, kind: "door", swing: -1, hinge: 1 },
      { at: 7.4, w: 0.9, kind: "door", swing: -1, hinge: -1 },
    ],
  },
  { a: [9.4, 0], b: [9.4, NY], t: 0.4, openings: [{ at: 2.2, w: 0.9, kind: "door", swing: 1, hinge: 1 }] },
  // Válaszfalak
  { a: [0, 5.2], b: [4.8, 5.2], t: 0.3 },
  { a: [4.8, 4.0], b: [9.4, 4.0], t: 0.15, openings: [{ at: 2.8, w: 0.9, kind: "door", swing: 1, hinge: 1 }] },
  { a: [9.4, 6.6], b: [eastX(6.6), 6.6], t: 0.15, openings: [{ at: 3.2, w: 0.8, kind: "door", swing: 1, hinge: -1 }] },
];

export type Room = { name: string; x0: number; x1: number; y0: number; y1: number; floor: "wood" | "tile" | "brick" | "bath" };

/** Nettó helyiségek (falsíkok között). A terület ebből számolódik, nem beírt szám. */
export const rooms: Room[] = [
  { name: "Szoba", x0: 0.275, x1: 4.6, y0: 0.275, y1: 5.05, floor: "wood" },
  { name: "Szoba", x0: 0.275, x1: 4.6, y0: 5.35, y1: 9.125, floor: "wood" },
  { name: "Előszoba", x0: 5.0, x1: 9.2, y0: 0.275, y1: 3.925, floor: "brick" },
  { name: "Konyha", x0: 5.0, x1: 9.2, y0: 4.075, y1: 9.125, floor: "tile" },
  { name: "Nappali", x0: 9.6, x1: 13.86, y0: 0.275, y1: 6.525, floor: "wood" },
  { name: "Fürdő", x0: 9.6, x1: 13.75, y0: 6.675, y1: 9.125, floor: "bath" },
];

export const roomArea = (r: Room) => (r.x1 - r.x0) * (r.y1 - r.y0);

export const bounds = { x0: -0.275, x1: EX + 0.275, y0: -0.275, y1: NY + 0.275, w: EX, h: NY };

type Box = { x: number; y: number; w: number; d: number; h: number; col: [number, number, number] };
const furniture: Box[] = [
  { x: 1.2, y: 2.3, w: 1.6, d: 2.0, h: 0.5, col: [0.62, 0.6, 0.55] }, // ágy
  { x: 0.4, y: 0.45, w: 1.4, d: 0.6, h: 2.0, col: [0.45, 0.31, 0.2] }, // szekrény
  { x: 5.2, y: 8.45, w: 3.4, d: 0.6, h: 0.9, col: [0.58, 0.44, 0.3] }, // konyhapult
  { x: 6.2, y: 5.6, w: 1.6, d: 0.9, h: 0.76, col: [0.5, 0.36, 0.24] }, // asztal
  { x: 10.4, y: 0.7, w: 2.3, d: 0.95, h: 0.8, col: [0.38, 0.42, 0.37] }, // kanapé
  { x: 11.8, y: 8.25, w: 1.7, d: 0.75, h: 0.6, col: [0.9, 0.9, 0.88] }, // kád
  { x: 1.4, y: 7.6, w: 1.8, d: 0.9, h: 0.75, col: [0.52, 0.37, 0.25] }, // íróasztal
];

/** A SLAM bejárás útvonala (szemléltetés). */
export const walkPath: [number, number][] = [
  [6.6, -2.2], [6.6, 1.2], [5.6, 2.0], [2.6, 2.2], [2.2, 4.0], [5.6, 2.2], [7.6, 3.2], [7.6, 6.8],
  [5.4, 7.4], [2.4, 7.2], [2.6, 6.0], [5.4, 7.4], [7.8, 6.2], [8.2, 2.4], [10.2, 2.2], [12.0, 3.4],
  [12.6, 5.8], [12.6, 7.6], [12.2, 5.4], [10.4, 2.4], [8.0, 1.6], [6.6, 1.0], [6.6, -2.2],
];

/**
 * Minta-EOV: a ház helyi rendszere tengelyirányban EOV-ra tolva (Borsod megyei nagyságrend).
 * Szemléltetés, nem valós telek. Y kelet, X észak, méterben.
 */
export const EOV0 = { Y: 784314.06, X: 308846.72 };
export const eov = (x: number, y: number) => ({ Y: EOV0.Y + x, X: EOV0.X + y });
const grp = (n: number) => {
  const [i, d] = n.toFixed(2).split(".");
  return `${i.replace(/\B(?=(\d{3})+(?!\d))/g, " ")},${d}`;
};
export const fmtEov = (n: number) => grp(n);

/** EOV illesztőpontok a szemléltetéshez (mintaértékek, a fenti eltolással számolva). */
export const controlPoints = [
  { x: -1.6, y: -1.6, id: "IP-1" },
  { x: 15.6, y: -1.6, id: "IP-2" },
  { x: 15.4, y: 11.0, id: "IP-3" },
].map((c) => ({ ...c, eovY: grp(eov(c.x, c.y).Y), eovX: grp(eov(c.x, c.y).X) }));

/** A minta telekhatára (a ház körül, utcafronttal délen). */
export const parcel: [number, number][] = [
  [-3.4, -4.6], [18.2, -4.6], [18.6, 14.2], [-3.0, 14.6],
];

/** A keleti fal külső síkja: délen x = 14,475, északon x = 14,325 (15 cm dőlés 9,4 m-en). */
export const eastFace = { south: [EX + 0.275, -0.275] as [number, number], north: [EXN + 0.275, NY + 0.275] as [number, number] };
export const LEAN = EX - EXN;

// ---------------------------------------------------------------- pontfelhő

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function vnoise(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

export const KIND = { floor: 0, wall: 1, furn: 2, ground: 3, path: 4 } as const;

export type Cloud = { pos: Float32Array; col: Float32Array; kind: Float32Array; count: number };

/**
 * density: pont / m² falon. Asztali gépen ~1.0, telefonon ~0.5.
 */
export function buildCloud(density = 1): Cloud {
  const r = rng(20261114);
  const P: number[] = [], C: number[] = [], K: number[] = [];
  const jitter = () => (r() - 0.5) * 0.02; // ±1 cm zaj

  const push = (x: number, y: number, z: number, c: [number, number, number], k: number, shade = 1) => {
    const n = 0.92 + r() * 0.16;
    P.push(x + jitter(), y + jitter(), z + jitter());
    C.push(Math.min(1, c[0] * shade * n), Math.min(1, c[1] * shade * n), Math.min(1, c[2] * shade * n));
    K.push(k);
  };

  const light = (nx: number, ny: number) => 0.78 + 0.22 * (nx * -0.55 + ny * -0.83);

  // Falak: mindkét felület, nyílások kihagyva
  for (const w of walls) {
    const dx = w.b[0] - w.a[0], dy = w.b[1] - w.a[1];
    const L = Math.hypot(dx, dy);
    const ux = dx / L, uy = dy / L;
    const nx = -uy, ny = ux;
    const faces = [1, -1];
    const n = Math.round(L * H * 200 * density);
    for (const f of faces) {
      for (let i = 0; i < n; i++) {
        const s = r() * L;
        const z = r() * H;
        const op = w.openings?.find((o) => Math.abs(s - o.at) < o.w / 2);
        if (op) {
          if (op.kind === "door" && z < HEAD) continue;
          if (op.kind === "window" && z > SILL && z < HEAD) continue;
        }
        const off = (w.t / 2) * f;
        const x = w.a[0] + ux * s + nx * off;
        const y = w.a[1] + uy * s + ny * off;
        // homlokzat kívül: kopottabb vakolat, belül meszelt fal, foltokban kilátszó tégla
        const outside = w.outer && f === -1;
        let c: [number, number, number] = outside ? [0.78, 0.74, 0.66] : [0.9, 0.88, 0.83];
        const patch = vnoise(s * 0.9 + w.a[0] * 3.1, z * 1.1 + w.a[1] * 1.7);
        if (patch > 0.7 && !outside) c = [0.68, 0.5, 0.38];
        else if (patch > 0.64 && !outside) c = [0.76, 0.66, 0.54];
        if (z < 0.18) c = [c[0] * 0.72, c[1] * 0.7, c[2] * 0.68];
        push(x, y, z, c, KIND.wall, light(nx * f, ny * f));
      }
    }
  }

  // Padló helyiségenként
  for (const room of rooms) {
    const area = roomArea(room);
    const n = Math.round(area * 150 * density);
    for (let i = 0; i < n; i++) {
      const x = room.x0 + r() * (room.x1 - room.x0);
      const y = room.y0 + r() * (room.y1 - room.y0);
      let c: [number, number, number];
      if (room.floor === "wood") {
        const plank = Math.floor((x - room.x0) / 0.16);
        const v = 0.85 + hash(plank, 3) * 0.3;
        c = [0.56 * v, 0.39 * v, 0.25 * v];
      } else if (room.floor === "tile") {
        const t = (Math.floor(x / 0.3) + Math.floor(y / 0.3)) % 2;
        c = t ? [0.74, 0.72, 0.67] : [0.6, 0.58, 0.54];
      } else if (room.floor === "bath") {
        c = [0.7, 0.75, 0.77];
      } else {
        const b = hash(Math.floor(x / 0.25), Math.floor(y / 0.12));
        c = [0.6 + b * 0.08, 0.38 + b * 0.05, 0.28];
      }
      push(x, y, 0, c, KIND.floor);
    }
  }

  // Bútor: felső lap és oldalak
  for (const b of furniture) {
    const top = Math.round(b.w * b.d * 320 * density);
    for (let i = 0; i < top; i++) push(b.x + r() * b.w, b.y + r() * b.d, b.h, b.col, KIND.furn, 1.05);
    const per = 2 * (b.w + b.d);
    const side = Math.round(per * b.h * 240 * density);
    for (let i = 0; i < side; i++) {
      const t = r() * per;
      const z = r() * b.h;
      let x: number, y: number, sh: number;
      if (t < b.w) { x = b.x + t; y = b.y; sh = 0.86; }
      else if (t < b.w + b.d) { x = b.x + b.w; y = b.y + (t - b.w); sh = 0.8; }
      else if (t < 2 * b.w + b.d) { x = b.x + (t - b.w - b.d); y = b.y + b.d; sh = 0.95; }
      else { x = b.x; y = b.y + (t - 2 * b.w - b.d); sh = 0.9; }
      push(x, y, z, b.col, KIND.furn, sh);
    }
  }

  // Udvar a ház körül: fű és kavics, ritkán
  const gn = Math.round(9000 * density);
  for (let i = 0; i < gn; i++) {
    const x = -3.2 + r() * 20.6;
    const y = -3.2 + r() * 15.8;
    if (x > -0.3 && x < EX + 0.3 && y > -0.3 && y < NY + 0.3) continue;
    const gravel = y < 0 && x > 5.2 && x < 8.2;
    const g = vnoise(x * 1.7, y * 1.7);
    const c: [number, number, number] = gravel ? [0.6, 0.58, 0.53] : [0.32 + g * 0.12, 0.42 + g * 0.12, 0.24];
    push(x, y, -0.05 + g * 0.05, c, KIND.ground);
  }

  // Bejárás útvonala: Catmull-Rom görbe 1,1 m magasan
  const pts = walkPath;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const seg = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
    const steps = Math.max(8, Math.round(seg * 70));
    for (let s = 0; s < steps; s++) {
      const t = s / steps, t2 = t * t, t3 = t2 * t;
      const cr = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      const x = cr(p0[0], p1[0], p2[0], p3[0]);
      const y = cr(p0[1], p1[1], p2[1], p3[1]);
      P.push(x, y, 1.1);
      C.push(1, 0.69, 0.13);
      K.push(KIND.path);
    }
  }

  return {
    pos: new Float32Array(P),
    col: new Float32Array(C),
    kind: new Float32Array(K),
    count: K.length,
  };
}

// ---------------------------------------------------------------- alaprajz (SVG, méterben)

/** Falszakaszok sokszögei a metszősíkon (ajtó és ablak is nyílás). */
export function wallPolygons(): string[] {
  const out: string[] = [];
  for (const w of walls) {
    const dx = w.b[0] - w.a[0], dy = w.b[1] - w.a[1];
    const L = Math.hypot(dx, dy);
    const ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    const ext = w.outer ? w.t / 2 : 0;
    const cuts = (w.openings ?? []).map((o) => [o.at - o.w / 2, o.at + o.w / 2]).sort((a, b) => a[0] - b[0]);
    let s = -ext;
    const pieces: [number, number][] = [];
    for (const [c0, c1] of cuts) {
      pieces.push([s, c0]);
      s = c1;
    }
    pieces.push([s, L + ext]);
    for (const [s0, s1] of pieces) {
      if (s1 - s0 < 0.01) continue;
      const h = w.t / 2;
      const p = (s: number, o: number) => `${(w.a[0] + ux * s + nx * o).toFixed(3)},${(w.a[1] + uy * s + ny * o).toFixed(3)}`;
      out.push(`${p(s0, -h)} ${p(s1, -h)} ${p(s1, h)} ${p(s0, h)}`);
    }
  }
  return out;
}

/** Ablakok (három vonal a falvastagságban) és ajtók (lap + nyitásív) path adatként. */
export function openingPaths(): { windows: string; doors: string } {
  let windows = "", doors = "";
  for (const w of walls) {
    const dx = w.b[0] - w.a[0], dy = w.b[1] - w.a[1];
    const L = Math.hypot(dx, dy);
    const ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    const at = (s: number, o: number) => [w.a[0] + ux * s + nx * o, w.a[1] + uy * s + ny * o];
    for (const o of w.openings ?? []) {
      const s0 = o.at - o.w / 2, s1 = o.at + o.w / 2;
      if (o.kind === "window") {
        for (const off of [-w.t / 2, 0, w.t / 2]) {
          const [x0, y0] = at(s0, off), [x1, y1] = at(s1, off);
          windows += `M${x0.toFixed(3)} ${y0.toFixed(3)}L${x1.toFixed(3)} ${y1.toFixed(3)}`;
        }
      } else {
        const side = (o.swing ?? 1) * (w.t / 2);
        const hingeS = (o.hinge ?? 1) === 1 ? s0 : s1;
        const freeS = (o.hinge ?? 1) === 1 ? s1 : s0;
        const [hx, hy] = at(hingeS, side);
        const [fx, fy] = at(freeS, side);
        const leafLen = o.w;
        const lx = hx + nx * Math.sign(side) * leafLen, ly = hy + ny * Math.sign(side) * leafLen;
        doors += `M${hx.toFixed(3)} ${hy.toFixed(3)}L${lx.toFixed(3)} ${ly.toFixed(3)}`;
        doors += `M${lx.toFixed(3)} ${ly.toFixed(3)}A${leafLen} ${leafLen} 0 0 ${sweepFlag(hx, hy, lx, ly, fx, fy)} ${fx.toFixed(3)} ${fy.toFixed(3)}`;
      }
    }
  }
  return { windows, doors };
}

function sweepFlag(cx: number, cy: number, ax: number, ay: number, bx: number, by: number) {
  const cross = (ax - cx) * (by - cy) - (ay - cy) * (bx - cx);
  return cross > 0 ? 1 : 0;
}

export const fmt = (n: number, d = 2) => n.toFixed(d).replace(".", ",");
