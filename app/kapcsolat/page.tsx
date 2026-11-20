import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageHead } from "@/components/PageHead";
import { QuoteForm } from "@/components/QuoteForm";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { serviceBySlug } from "@/lib/services";
import { software } from "@/lib/content";
import { mailHref, site, telHref } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Kapcsolat és ajánlatkérés",
  description: `Kérjen írásos ajánlatot lézerszkenneres felmérésre. ${site.owner}, ${site.phoneDisplay}, ${site.email}.`,
  path: "/kapcsolat",
});

type Props = { searchParams: Promise<{ szolgaltatas?: string; program?: string; becsles?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const { szolgaltatas, program, becsles } = await searchParams;
  const preset = szolgaltatas ? serviceBySlug(szolgaltatas)?.name : undefined;
  const sw = software.find((s) => s.id === program)?.name;
  return (
    <>
      <PageHead
        crumbs={[{ name: "Kezdőlap", href: "/" }, { name: "Kapcsolat" }]}
        title="Kérjen ajánlatot"
        lead="Pár mondat elég: mit kell felmérni, hol, és miben nyitja meg. Írásban válaszolok, a munka előtt."
        image={{ src: "/img/found/mezokovesd-emlekhaz.webp", alt: "Fehérre meszelt, nádtetős régi parasztház Mezőkövesden", cap: "Kisjankó Bori emlékház, Mezőkövesd. Fotó: Globetrotter19, CC BY-SA 3.0" }}
      />
      <section className="sec-tight" aria-labelledby="urlap-h">
        <div className="wrap contact-grid">
          <aside className="contact-side" aria-label="Közvetlen elérhetőség">
            <div className="contact-card dark">
              <span className="k">Telefon</span>
              <a href={telHref}>{site.phoneDisplay}</a>
            </div>
            <div className="contact-card">
              <span className="k">E-mail</span>
              <a href={mailHref}>{site.email}</a>
            </div>
            <div className="contact-card">
              <span className="k">Felmérést végzi</span>
              <p style={{ fontWeight: 600, fontSize: 19 }}>{site.owner}, földmérő</p>
              <p className="muted" style={{ fontSize: 16 }}>{site.area}</p>
            </div>
          </aside>
          <div className="contact-form">
            <h2 id="urlap-h" className="t-l" style={{ marginBottom: 24 }}>Ajánlatkérő űrlap</h2>
            <QuoteForm defaultService={preset} defaultSoftware={sw} defaultMessage={becsles?.slice(0, 1200)} />
          </div>
        </div>
      </section>
      <JsonLd data={breadcrumbSchema([{ name: "Kezdőlap", path: "/" }, { name: "Kapcsolat", path: "/kapcsolat" }])} />
    </>
  );
}
