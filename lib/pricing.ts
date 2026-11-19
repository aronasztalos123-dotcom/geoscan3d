/**
 * Az árkalkulátor díjtételei, nettó forintban.
 * TODO(ügyfél): ezek induló becslések. Írja át a saját díjaira; a kalkulátor és az oldal minden szövege ebből számol.
 * Az eredmény irányár-sáv (lásd RANGE), nem ajánlat.
 */

export type Extra = { id: string; label: string; hint?: string } & (
  | { kind: "fixed"; amount: number }
  | { kind: "pct"; pct: number }
  | { kind: "perUnit"; amount: number }
);

export type PriceService = {
  slug: string; // egyezik a lib/services.ts slugjával
  short: string;
  unit: string; // mértékegység a mennyiséghez
  qtyLabel: string;
  qty: { min: number; max: number; step: number; initial: number };
  /** Első egység díja (pl. az első depónia); ha nincs, minden egység unitPrice. */
  firstUnitPrice?: number;
  unitPrice: number;
  minimum: number;
  included: string[];
  extras: Extra[];
};

export const priceServices: PriceService[] = [
  {
    slug: "as-built-felmeres",
    short: "As-Built felmérés",
    unit: "m²",
    qtyLabel: "Felmérendő bruttó alapterület",
    qty: { min: 30, max: 5000, step: 10, initial: 150 },
    unitPrice: 450,
    minimum: 60000,
    included: ["Szintenkénti alaprajz DWG/DXF és PDF", "EOV-ba illesztés", "Webes 3D link"],
    extras: [
      { id: "homlokzat", label: "Homlokzatrajzok", kind: "pct", pct: 0.25 },
      { id: "metszet", label: "Metszetek", kind: "pct", pct: 0.15 },
      { id: "pontfelho", label: "Nyers pontfelhő (E57, LAS, LAZ)", kind: "fixed", amount: 15000 },
    ],
  },
  {
    slug: "3d-virtualis-bejaras",
    short: "3D virtuális bejárás",
    unit: "m²",
    qtyLabel: "Bejárható alapterület",
    qty: { min: 30, max: 3000, step: 10, initial: 120 },
    unitPrice: 350,
    minimum: 80000,
    included: ["Böngészőben bejárható, mérhető 3D modell", "Megosztható link"],
    extras: [
      { id: "alaprajz", label: "Méretarányos alaprajz", kind: "perUnit", amount: 150 },
      { id: "kulter", label: "Kert és homlokzat is", kind: "pct", pct: 0.2 },
    ],
  },
  {
    slug: "terfogatszamitas",
    short: "Térfogatszámítás",
    unit: "db",
    qtyLabel: "Depóniák, halmok száma",
    qty: { min: 1, max: 30, step: 1, initial: 2 },
    firstUnitPrice: 45000,
    unitPrice: 20000,
    minimum: 45000,
    included: ["Térfogat m³-ben, halmonként", "Rövid jelentés PDF-ben"],
    extras: [{ id: "pontfelho", label: "Nyers pontfelhő (E57, LAS, LAZ)", kind: "fixed", amount: 15000 }],
  },
  {
    slug: "kozmu-allapotrogzites",
    short: "Közmű-állapotrögzítés",
    unit: "fm",
    qtyLabel: "Nyomvonal vagy útszakasz hossza",
    qty: { min: 20, max: 3000, step: 10, initial: 200 },
    unitPrice: 250,
    minimum: 60000,
    included: ["3D pontfelhő EOV-ban", "Webes 3D link a dokumentáláshoz"],
    extras: [
      { id: "rajz", label: "Nyomvonalrajz DWG-ben", kind: "pct", pct: 0.3 },
      { id: "pontfelho", label: "Nyers pontfelhő (E57, LAS, LAZ)", kind: "fixed", amount: 15000 },
    ],
  },
  {
    slug: "tetofelmeres",
    short: "Tetőfelmérés",
    unit: "m²",
    qtyLabel: "Tetőfelület (becsülve)",
    qty: { min: 30, max: 2000, step: 10, initial: 160 },
    unitPrice: 250,
    minimum: 45000,
    included: ["Tetősíkok mérete és hajlásszöge", "Kémények, tetőablakok helye"],
    extras: [
      { id: "fak", label: "Környező fák magassága (árnyékoláshoz)", kind: "fixed", amount: 15000 },
      { id: "rajz", label: "Tetőrajz DWG-ben", kind: "pct", pct: 0.2 },
    ],
  },
];

export const travelZones = [
  { id: "kozel", label: "Miskolc és 30 km-en belül", amount: 0 },
  { id: "borsod", label: "Borsod-Abaúj-Zemplén többi része", amount: 15000 },
  { id: "heves", label: "Eger, Gyöngyös, Hatvan", amount: 25000 },
  { id: "budapest", label: "Gödöllő, Budapest", amount: 35000 },
];

export const urgent = { label: "Sürgős, 5 munkanapon belül", pct: 0.3 };

/** Az irányár-sáv a számolt összeg körül. */
export const RANGE = { low: 0.9, high: 1.15 };

export type Line = { label: string; amount: number };

export function estimate(svc: PriceService, qty: number, extras: string[], zoneId: string, isUrgent: boolean) {
  const lines: Line[] = [];
  const base = svc.firstUnitPrice !== undefined ? svc.firstUnitPrice + Math.max(0, qty - 1) * svc.unitPrice : qty * svc.unitPrice;
  const work = Math.max(base, svc.minimum);
  lines.push({ label: base < svc.minimum ? `${svc.short}, minimális díj` : `${svc.short}, ${fmtNum(qty)} ${svc.unit}`, amount: work });

  for (const x of svc.extras) {
    if (!extras.includes(x.id)) continue;
    const amount = x.kind === "fixed" ? x.amount : x.kind === "pct" ? work * x.pct : qty * x.amount;
    lines.push({ label: x.label, amount });
  }
  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  if (isUrgent) lines.push({ label: urgent.label, amount: subtotal * urgent.pct });

  const zone = travelZones.find((z) => z.id === zoneId) ?? travelZones[0];
  lines.push({ label: `Kiszállás: ${zone.label}`, amount: zone.amount });

  const total = lines.reduce((s, l) => s + l.amount, 0);
  return { lines, total, low: round5k(total * RANGE.low), high: round5k(total * RANGE.high) };
}

const round5k = (n: number) => Math.round(n / 5000) * 5000;
export const fmtNum = (n: number) => new Intl.NumberFormat("hu-HU").format(Math.round(n));
export const fmtFt = (n: number) => `${fmtNum(n)} Ft`;
