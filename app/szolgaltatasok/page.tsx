import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { ServiceIndex } from "@/components/ServiceIndex";
import { Closing, NextLinks } from "@/components/Blocks";
import { services } from "@/lib/services";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Szolgáltatások: épületfelmérés, 3D bejárás, térfogat",
  description:
    "Öt munka, egy módszer: kézi lézerszkenneres As-Built felmérés, 3D virtuális bejárás, depónia-térfogat, közmű-állapotrögzítés és tetőfelmérés, EOV-ba illesztve.",
  path: "/szolgaltatasok",
  image: { url: "/img/scan/pontfelho-apszis.webp", alt: "Egy kápolna íves apszisa pontfelhőként" },
});

export default function ServicesPage() {
  const items = services.map((s) => ({ slug: s.slug, name: s.name, lead: s.lead, image: s.image }));
  return (
    <>
      <PageHead
        crumbs={[{ name: "Kezdőlap", href: "/" }, { name: "Szolgáltatások" }]}
        title="Öt munka, egy módszer"
        lead="Mindegyik ugyanazzal a kézi lézerszkennerrel készül. A különbség az, amit a pontfelhőből átadok."
        image={{ src: "/img/scan/pontfelho-apszis.webp", alt: "Egy kápolna íves apszisa pontfelhőként, a környező fákkal" }}
      />

      <section className="sec" aria-labelledby="lista-h">
        <div className="wrap sindex" data-reveal>
          <div className="sindex-head">
            <h2 id="lista-h" className="t-l" data-r>Válasszon munkát</h2>
          </div>
          <ServiceIndex items={items} headingId="lista-h" />
        </div>
      </section>

      <NextLinks
        items={[
          { href: "/modszer", kicker: "Hogyan készül", title: "A módszer és a pontosság" },
          { href: "/mit-kap", kicker: "Formátumok", title: "Mit kap kézhez" },
          { href: "/gyik", kicker: "Kérdések", title: "Gyakori kérdések" },
        ]}
      />

      <Closing />
      <JsonLd data={breadcrumbSchema([{ name: "Kezdőlap", path: "/" }, { name: "Szolgáltatások", path: "/szolgaltatasok" }])} />
    </>
  );
}
