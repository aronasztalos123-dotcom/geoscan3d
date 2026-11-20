/**
 * Vázlatos munkaterület-térkép: Borsod-Abaúj-Zemplén és az M3 Budapestig.
 * Egyszerű vetület: x = (λ − 18.9°) · 200.7, y = (48.6° − φ) · 300 (cos 48° torzítással).
 */
const towns: { n: string; x: number; y: number; big?: boolean; anchor?: "start" | "end"; dy?: number }[] = [
  { n: "Budapest", x: 28, y: 330, big: true, anchor: "start", dy: 24 },
  { n: "Gödöllő", x: 92, y: 300, dy: 22 },
  { n: "Hatvan", x: 155, y: 279, dy: 22 },
  { n: "Gyöngyös", x: 207, y: 246, dy: -12 },
  { n: "Eger", x: 297, y: 210, anchor: "end", dy: -8 },
  { n: "Mezőkövesd", x: 335, y: 237, dy: 24 },
  { n: "Miskolc", x: 377, y: 150, big: true, anchor: "start", dy: -12 },
  { n: "Ózd", x: 279, y: 114, anchor: "end", dy: 5 },
  { n: "Kazincbarcika", x: 345, y: 105, anchor: "end", dy: -10 },
  { n: "Encs", x: 446, y: 81, anchor: "start", dy: -8 },
  { n: "Szerencs", x: 462, y: 132, anchor: "start", dy: -10 },
  { n: "Tokaj", x: 504, y: 144, anchor: "start", dy: 20 },
  { n: "Sátoraljaújhely", x: 554, y: 60, anchor: "end", dy: -10 },
];

// Megyehatár, erősen egyszerűsítve.
const county =
  "M231 129 L271 84 L331 15 L431 24 L512 9 L572 24 L612 90 L532 165 L452 225 L391 225 L351 195 L301 165 Z";
// M3 Budapest → Polgár, M30 Emőd → Miskolc.
const m3 = "M28 330 L92 300 L155 279 L207 246 L303 255 L335 237 L383 201 L446 219";
const m30 = "M383 201 L377 150";

export function AreaMap() {
  return (
    <svg
      viewBox="0 0 640 360"
      role="img"
      aria-labelledby="areamap-t"
      style={{ display: "block", width: "100%", height: "auto" }}
    >
      <title id="areamap-t">Munkaterület: Borsod-Abaúj-Zemplén megye és az M3 autópálya mentén Budapestig</title>
      <defs>
        <pattern id="areamap-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="var(--paper)" strokeOpacity="0.07" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="640" height="360" fill="url(#areamap-grid)" />

      <path d={county} fill="var(--lime)" fillOpacity="0.12" stroke="var(--lime)" strokeOpacity="0.7" strokeWidth="1.5" strokeDasharray="6 5" strokeLinejoin="round" />
      <text x="432" y="178" fill="var(--lime)" fontSize="12" fontWeight="650" letterSpacing="1.2" textAnchor="middle" opacity="0.85">
        <tspan x="432">BORSOD-ABAÚJ-</tspan>
        <tspan x="432" dy="15">ZEMPLÉN</tspan>
      </text>

      <path d={m3} fill="none" stroke="var(--forest)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d={m3} fill="none" stroke="var(--lime)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={m30} fill="none" stroke="var(--lime)" strokeWidth="3.5" strokeLinecap="round" />
      <g transform="translate(240 268)">
        <rect x="-17" y="-11" width="34" height="22" rx="5" fill="var(--lime)" />
        <text y="5" textAnchor="middle" fontSize="13" fontWeight="750" fill="var(--forest)">M3</text>
      </g>

      {towns.map((t) => (
        <g key={t.n}>
          {t.big && <circle cx={t.x} cy={t.y} r="13" fill="var(--lime)" fillOpacity="0.18" />}
          <circle cx={t.x} cy={t.y} r={t.big ? 6 : 4} fill={t.big ? "var(--lime)" : "var(--paper)"} stroke="var(--forest)" strokeWidth="2" />
          <text
            x={t.x + (t.anchor === "start" ? 10 : t.anchor === "end" ? -10 : 0)}
            y={t.y + (t.dy ?? -12)}
            textAnchor={t.anchor ?? "middle"}
            fontSize={t.big ? 19 : 14}
            fontWeight={t.big ? 700 : 500}
            fill={t.big ? "var(--paper)" : "var(--on-dark-2)"}
          >
            {t.n}
          </text>
        </g>
      ))}

      <g transform="translate(604 326)" fill="var(--on-dark-2)">
        <path d="M0 -22 L6 -6 L0 -10 L-6 -6 Z" fill="var(--paper)" />
        <text y="8" textAnchor="middle" fontSize="12" fontWeight="650">É</text>
      </g>
    </svg>
  );
}
