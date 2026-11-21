# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary (confirmed 2026-11-15): architects, building designers and interior designers who need an as-built drawing of an existing building in the program they already work in (AutoCAD, ArchiCAD, Revit, QGIS). They arrive with a job in hand: a renovation, extension or change of use where no usable plans exist, and they need measured floor plans, sections and elevations before they can start designing.

Secondary paths: private owners of old houses renovating without plans; businesses needing cubic-metre volume reports (gravel/sand pits, covered grain halls, soil heaps under trees, building-material yards); utilities and municipalities documenting state before backfill; roof measurement for solar layout. All in Hungarian; service area Borsod-Abaúj-Zemplén and along the M3 to Budapest (Miskolc, Eger, Gyöngyös, Hatvan, Gödöllő, Budapest).

## Product Purpose

A licensed land surveyor (földmérő) offers handheld LiDAR scanning as a service: a 20–30 minute walk-through of an old family house replaces 1–2 days of tape measuring, and the point cloud is turned into finished deliverables (layered DWG/DXF plans, PDF plans, orthophoto sections, browser 3D walkthrough, raw LAS/LAZ/E57, OBJ/PLY meshes), georeferenced in EOV with control points. Success: a designer requests a written quote through the form or phone.

## Positioning

The scanner is operated by a licensed surveyor, not a 3D-scanning hobbyist or a drone operator: every measurement has a coordinate (EOV), the accuracy (±2 cm) is stated up front including what it is NOT good enough for (steel fabrication drawings, mechanical fit-up), long scans are closed in loops and checked against control points to catch SLAM drift. A missing dimension later is looked up in the point cloud with no second site visit.

## Operating Context

Designer's world: CAD layers, DWG files, plan sheets with title blocks, sections cut at 1.2 m, EOV Y/X coordinates, control-point targets (black/white quadrant targets) on walls, Autodesk ReCap for E57 import. Equipment: 3DMakerpro Raven handheld scanner, Insta360 X4 camera. Process: brief (address + which program) → on-site scan → registration, EOV placement, drafting → delivery in the client's format.

## Capabilities and Constraints

- Next.js 16 App Router (Turbopack), Tailwind v4 + plain CSS, framer-motion (LazyMotion), static except `/api/ajanlat` (quote form: Forpsi SMTP, Resend fallback). Deploy target Vercel.
- Routes: `/`, `/szolgaltatasok/[slug]` (5 services), `/lezerszkenneles/[city]` (6 cities), `/adatkezeles`, 404.
- Existing WebGL point-cloud engine (`lib/scan/`, procedural sample house, built in a Web Worker) that projects to an SVG plan; this is the product's own demonstration material and stays.
- Prices are not shown (brief's ranges unconfirmed); quote is individual and written before work starts.
- All facts in `[BRACKETS]` in `lib/site.ts` are placeholders and stay out of JSON-LD until set.

## Brand Commitments

None yet: brand name, logo, phone, email, domain, owner name, licence number and 3D demo link are all placeholders. The black/white control-point target is the only recurring mark so far (not client-confirmed). Copy rules from the agency: no em dashes in copy.

## Evidence on Hand

- Real: the brief's figures (20–30 min vs 1–2 days, ±2 cm, 50–100 m range), equipment names, format list, process, FAQ answers.
- Synthetic, labelled as such: the sample house point cloud and plan rendered by the site's own engine; AI-generated illustrative photos in `public/img/` (old wall with control target, depot, grain hall, venue, as-built sheet).
- Absent, must not be fabricated: client projects, testimonials, client logos, project counts, prices, years in business, real scans.

## Product Principles

1. Lead with the deliverable the designer opens, not with the scanner.
2. State accuracy and its limits plainly; trust comes from saying what it is not good for.
3. Every claim on the page traces to the brief; demonstration material is labelled as a sample.
4. One action everywhere: request a written quote.

## Accessibility & Inclusion

WCAG 2.1 AA; Hungarian language (`lang="hu"`), full keyboard operation of every control including the scan demonstration, reduced-motion fallback that keeps all content.
