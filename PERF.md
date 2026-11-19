# Teljesítmény-napló

Mérés: Lighthouse 12.8.2, mobil profil (Slow 4G, 4× CPU), `next start`, Edge headless, Windows fejlesztői gép.
A futások közti szórás nagy (TBT ±150 ms, SI 1,3–5,4 s), ezért minden változtatást legalább kétszer mértünk.

| Ötlet | Előtte → utána | Döntés | Miért |
|---|---|---|---|
| Pontfelhő generálása Web Workerben (`lib/scan/cloud.worker.ts`) | TBT 520 ms → 160–330 ms, Perf 85 → 91–95; a 369 ms-os hosszú feladat eltűnt | megtartva | A ~130 ezer pont előállítása volt a legnagyobb fő szálas feladat. |
| framer-motion `LazyMotion` + `m` (csak `domAnimation`) | JS átvitel 212 KB → 197 KB; TBT, LCP a szóráson belül | megtartva | Mérhető bájtcsökkenés, mellékhatás nélkül. |
| (vizsgálat) SI romlás a LazyMotion után | SI 4–5 s visszaállítva is | nem a LazyMotion okozta | A korai 1,3 s-os futások voltak a kiugrók. |

Kezdőállapot (első mérés): Perf 85, LCP 2,2 s, TBT 520 ms, CLS 0, A11y 100, BP 100, SEO 100.

## v3 újratervezés (2026-11-15)

| Ötlet | Előtte → utána | Döntés | Miért |
|---|---|---|---|
| v3: Schibsted Grotesk (next/font/google, latin + latin-ext), szkennelés-fejezet 6 kameraállapottal, kártyapakli | Perf 91–95 → 95 / 95; TBT 160–330 → 190 / 200 ms; LCP 2,2 → 2,5 s; CLS 0 → 0; A11y/BP/SEO 100 | megtartva | Két futás, `next start`, Lighthouse 12.8.2 mobil, Edge. Az LCP a „jó” határán van (a címsor, betűcsere); ha nő, a latin-ext alkészletet érdemes előtölteni vagy a címsort `font-display: optional`-lal mérni. |
