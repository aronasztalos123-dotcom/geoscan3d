# 3D lézerszkennelés (laser-scanning service site)

Next.js 16 (App Router, Turbopack), Tailwind v4, framer-motion (LazyMotion). Static except `/api/ajanlat`.

```bash
npm install
npm run dev      # http://localhost:3340
npm run build && npm start
```

Deploy: import the folder into Vercel as-is (framework preset Next.js, no root-directory change).

## Fill these in before launch

All client facts live in **`lib/site.ts`**. Anything still in `[BRACKETS]` is a placeholder; it is kept out of the JSON-LD automatically until replaced.

| Placeholder | Where | Notes |
| --- | --- | --- |
| `[CÉGNÉV]` | `site.brand` | header, footer mark, titles, schema |
| `[NÉV]` | `site.owner` | surveyor panel, footer, schema `founder` |
| `[JOGOSULTSÁGI SZÁM]` | `site.license` | optional; shown after the name |
| `[TELEFON]` | `site.phoneDisplay` + `site.phoneHref` | `phoneHref` without spaces, e.g. `+36301234567` |
| `[EMAIL]` | `site.email` | |
| `[DOMAIN]` | `site.domain` | drives canonical URLs, sitemap, robots, OG |
| `[LOGÓ]` | `site.logo` | URL of the logo for schema; the header uses the target mark until a logo exists |
| `[3D DEMÓ LINK]` | `site.demoUrl` | embeddable Gaussian Splat / 3D viewer URL; loads only on click |
| address | `site.address` | optional; leave `null` for a service-area business |

Prices are **not shown** anywhere (the brief's ranges are unconfirmed). Every CTA reads "Kérjen egyedi ajánlatot" / "Ajánlatot kérek".

## Quote form

`app/api/ajanlat/route.ts` sends mail through the Forpsi SMTP server (from and to the `ajanlat@geoscan3d.hu` mailbox) when these env vars are set (see `.env.example`). Only quote-form mail goes to `ajanlat@`; every other address on the site (`site.email`) stays `info@geoscan3d.hu`.

```
QUOTE_TO_EMAIL=ajanlat@geoscan3d.hu
QUOTE_FROM_EMAIL="Ajánlatkérés <ajanlat@geoscan3d.hu>"
SMTP_HOST=smtp.forpsi.com
SMTP_PORT=587
SMTP_USER=ajanlat@geoscan3d.hu
SMTP_PASS=            # the ajanlat@ mailbox password
```

`RESEND_API_KEY` is an optional fallback when no SMTP is set. Without either, the API answers 503 and the form shows a call / pre-filled e-mail fallback. It never fakes a success.

## The hero

`components/ScanHero.tsx` + `lib/scan/*`: a procedurally generated sample house (`lib/scan/house.ts`, labelled "Szemléltetés" on the page) rendered as a WebGL point cloud. The points are built in a Web Worker (`cloud.worker.ts`) after first paint. Scroll drives the camera from oblique to top-down, a 1.2 m cut plane, the scan-to-paper ground change, and a sweep that resolves the SVG DWG plan, which is projection-locked to the cloud. Phones get their own portrait composition with ~55k points. Reduced motion and Save-Data get one static screen with the finished plan. Room areas are computed from the geometry; the EOV coordinates are sample values.

When real scans exist, the natural upgrade is to replace `buildCloud()` with a decimated real LAS/E57 export (same `Cloud` shape: positions, colours, kinds).

## Images

No client photos exist yet. Everything is illustrative and captioned as such on the page.

| File | Source |
| --- | --- |
| `public/img/as-built.webp`, `virtualis-bejaras.webp`, `terfogat.webp` | Generated (gpt-image-2 via Fish Audio), 2026-11-14 |
| `public/img/illesztopont.webp` | Crop of the as-built image (interim, until a dedicated control-target image) |
| `public/img/pontfelho.webp`, `alaprajz.webp` | Renders of this site's own hero engine |
| `public/img/kozmu.webp`, `teto.webp` | See the delivery notes; until present, `components/Photo.tsx` renders a labelled placeholder |

Replace with real project photos as they come in; keep the same file names or update `lib/services.ts`.

## SEO

- Service pages: `/szolgaltatasok/[slug]` (5), city pages: `/lezerszkenneles/[city]` (Miskolc, Eger, Gyöngyös, Hatvan, Gödöllő, Budapest). Copy in `lib/services.ts`, `lib/cities.ts`, `lib/content.ts`.
- JSON-LD: ProfessionalService (area-served, no address until one is set), Service per page, FAQPage, BreadcrumbList.
- Title keywords follow an OpenSEO pull (HU, 2026-11): "földmérő + város" is the strongest local query (Miskolc 70/mo, Budapest 50, Eger/Gödöllő 30), "alaprajz készítés" 1.3k. "térfogatszámítás" (2.4k) is homework intent, so that page targets "depónia térfogatszámítás".
- After launch: create a Google Business Profile (service-area business, no public address needed), connect Search Console, submit `/sitemap.xml`.

## Performance

See `PERF.md` for the measured ledger (Lighthouse mobile).
