import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { Closing, NextLinks } from "@/components/Blocks";
import { PriceCalculator } from "@/components/PriceCalculator";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Árkalkulátor: mennyibe kerül egy lézerszkenneres felmérés?",
  description:
    "Számolja ki percek alatt, nagyjából mennyibe kerül az épületfelmérés, a 3D bejárás, a térfogatszámítás, a közmű-állapotrögzítés vagy a tetőfelmérés. Nettó irányár, kiszállással.",
  alternates: { canonical: "/arkalkulator" },
};

export default function PricePage() {
  return (
    <>
      <PageHead
        crumbs={[{ name: "Kezdőlap", href: "/" }, { name: "Árkalkulátor" }]}
        title="Mennyibe kerül?"
        lead="Válassza ki, mit kell felmérni, és mekkora. A kalkulátor nettó irányárat ad; a pontos árat a munka előtt írásban kapja meg."
        image={{ src: "/img/scan/pontfelho-kapolna.webp", alt: "Egy kápolna sűrű, színes pontfelhője" }}
      />
      <section className="sec-tight" aria-label="Árkalkulátor">
        <div className="wrap">
          <PriceCalculator />
        </div>
      </section>
      <NextLinks
        items={[
          { href: "/mit-kap", kicker: "Formátumok", title: "Mit kap kézhez" },
          { href: "/modszer", kicker: "Pontosság", title: "A módszer" },
          { href: "/gyik", kicker: "Kérdések", title: "GYIK" },
        ]}
      />
      <Closing />
      <JsonLd data={breadcrumbSchema([{ name: "Kezdőlap", path: "/" }, { name: "Árkalkulátor", path: "/arkalkulator" }])} />
    </>
  );
}
