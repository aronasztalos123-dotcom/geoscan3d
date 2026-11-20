import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageHead } from "@/components/PageHead";
import { SoftwarePicker } from "@/components/SoftwarePicker";
import { Closing, NextLinks } from "@/components/Blocks";
import { formats } from "@/lib/content";
import { ThreeForms } from "@/components/ThreeForms";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = pageMeta({
  title: "Mit kap kézhez: DWG, DXF, PDF, E57, LAS, webes 3D",
  description: "Rétegezett DWG/DXF rajz, PDF alaprajz, ortofotó-metszet, webes 3D link és nyers pontfelhő (E57, LAS, LAZ). AutoCAD, ArchiCAD, Revit, QGIS: melyikhez mit adok.",
  path: "/mit-kap",
  image: { url: "/img/scan/pontfelho-felulrol.webp", alt: "Egy kápolna pontfelhője felülről" },
});

export default function FormatsPage() {
  return (
    <>
      <PageHead
        crumbs={[{ name: "Kezdőlap", href: "/" }, { name: "Mit kap" }]}
        title="Olyan formátum, amiben dolgozik"
        lead="A formátumot az ajánlat előtt egyeztetjük. Itt kipróbálhatja, melyik programhoz mit adok."
        image={{ src: "/img/scan/pontfelho-felulrol.webp", alt: "Egy kápolna pontfelhője felülről, körülötte a fák és az utak" }}
      />

      <section className="sec" aria-labelledby="valaszto-h">
        <div className="wrap" data-reveal>
          <SoftwarePicker headingId="valaszto-h" title="Válassza ki a programját" />
        </div>
      </section>

      <ThreeForms />

      <section className="sec sec-paper2" aria-labelledby="mind-h">
        <div className="wrap split" data-reveal>
          <div className="split-l split-sticky">
            <h2 id="mind-h" className="t-xl" data-r>Minden formátum</h2>
            <p className="t-lead muted" data-r>Kérésre több is, egy csomagban.</p>
          </div>
          <ul className="split-r files-light" data-r>
            {formats.map((f) => (
              <li key={f.id} className="tile" style={{ background: "var(--paper)" }}>
                <h3>{f.name}</h3>
                <p className="muted">{f.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <NextLinks
        items={[
          { href: "/modszer", kicker: "Pontosság", title: "A módszer és az akár 1 cm" },
          { href: "/szolgaltatasok", kicker: "Munkák", title: "Szolgáltatások" },
          { href: "/kapcsolat", kicker: "Ajánlat", title: "Kérjen ajánlatot" },
        ]}
      />

      <Closing />
      <JsonLd data={breadcrumbSchema([{ name: "Kezdőlap", path: "/" }, { name: "Mit kap", path: "/mit-kap" }])} />
    </>
  );
}
