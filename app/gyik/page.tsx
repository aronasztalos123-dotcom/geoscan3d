import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { Closing, Faq, NextLinks } from "@/components/Blocks";
import { faq } from "@/lib/content";
import { ThreeForms } from "@/components/ThreeForms";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Gyakori kérdések a lézerszkennelésről",
  description: "Formátum, pontosság, határidő, előkészítés, ár, EOV, SLAM és a drónos felmérés: rövid, őszinte válaszok.",
  alternates: { canonical: "/gyik" },
};

export default function FaqPage() {
  return (
    <>
      <PageHead
        crumbs={[{ name: "Kezdőlap", href: "/" }, { name: "GYIK" }]}
        title="Kérdések, röviden"
        lead="Ha a válasza nincs itt, hívjon vagy írjon. Pár mondatból kiderül, mire van szüksége."
        image={{ src: "/img/illesztopont.webp", alt: "Fekete-fehér illesztőpont-jel egy régi vakolt falon" }}
      />
      <section className="sec" aria-labelledby="kerdesek-h">
        <div className="wrap">
          <Faq items={faq} title="Mielőtt ajánlatot kér" />
        </div>
      </section>
      <ThreeForms />
      <NextLinks
        items={[
          { href: "/modszer", kicker: "Pontosság", title: "A módszer" },
          { href: "/mit-kap", kicker: "Formátumok", title: "Mit kap kézhez" },
          { href: "/kapcsolat", kicker: "Ajánlat", title: "Kérjen ajánlatot" },
        ]}
      />
      <Closing />
      <JsonLd data={faqSchema(faq)} />
      <JsonLd data={breadcrumbSchema([{ name: "Kezdőlap", path: "/" }, { name: "GYIK", path: "/gyik" }])} />
    </>
  );
}
