import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHead } from "@/components/PageHead";
import { Closing, Faq } from "@/components/Blocks";
import { ThreeForms } from "@/components/ThreeForms";
import { cities, cityBySlug } from "@/lib/cities";
import { faq } from "@/lib/content";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { serviceBySlug, services } from "@/lib/services";
import { siteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

type Props = { params: Promise<{ city: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const c = cityBySlug(city);
  if (!c) return {};
  return {
    title: c.seoTitle,
    description: c.seoDescription,
    alternates: { canonical: `/lezerszkenneles/${c.slug}` },
    openGraph: { title: c.seoTitle, description: c.seoDescription, url: `/lezerszkenneles/${c.slug}` },
  };
}

// Városoldalon a pontosság, a formátum és az ár kérdése a legfontosabb.
const cityFaq = faq.filter((f) => /formátum|pontos|ár\?|EOV/.test(f.q));

export default async function CityPage({ params }: Props) {
  const { city } = await params;
  const c = cityBySlug(city);
  if (!c) notFound();
  const near = cities
    .filter((x) => x.slug !== c.slug)
    .sort((a, b) => Math.abs(a.order - c.order) - Math.abs(b.order - c.order))
    .slice(0, 3);
  const img = serviceBySlug(c.photo)?.image;

  return (
    <>
      <PageHead
        crumbs={[{ name: "Kezdőlap", href: "/" }, { name: "Rólam", href: "/rolam" }, { name: c.name }]}
        title={`Lézerszkennelés ${c.loc}`}
        lead={`Kézi lézerszkenneres felmérés jogosult földmérőtől ${c.loc} és környékén, EOV-ba illesztve.`}
        image={img ? { src: img.src, alt: img.alt } : undefined}
      >
        <Link href="/kapcsolat" className="btn btn-lime">Ajánlatot kérek <span className="ar" aria-hidden="true">→</span></Link>
      </PageHead>

      <section className="sec" aria-labelledby="helyi-h">
        <div className="wrap split" data-reveal>
          <div className="split-l">
            <h2 id="helyi-h" className="t-l" data-r>{c.name} és környéke</h2>
            <div className="prose" data-r>
              {c.intro.map((p) => <p key={p}>{p}</p>)}
            </div>
          </div>
          <figure className="split-r" data-r="img">
            <div className="media" style={{ aspectRatio: "4 / 3" }}>
              <Image src="/img/found/mezokovesd-emlekhaz.webp" alt="Fehérre meszelt, nádtetős régi parasztház Mezőkövesden" fill sizes="(max-width: 899px) 92vw, 46vw" />
            </div>
            <figcaption className="cap">Mezőkövesd, régi parasztház. Fotó: Globetrotter19, CC BY-SA 3.0</figcaption>
          </figure>
        </div>
      </section>

      <section className="sec sec-forest" aria-labelledby="munkak-h">
        <div className="wrap" data-reveal>
          <h2 id="munkak-h" className="t-xl" data-r style={{ marginBottom: "clamp(32px, 4vw, 56px)", maxWidth: "16ch" }}>Jellemző munkák {c.loc}</h2>
          <ul className="tiles">
            {c.jobs.map((j) => {
              const s = serviceBySlug(j.service)!;
              return (
                <li key={j.service} className="tile" data-r>
                  <h3><Link href={`/szolgaltatasok/${s.slug}`} className="link">{s.name}</Link></h3>
                  <p>{j.text}</p>
                </li>
              );
            })}
            <li className="tile" data-r>
              <h3>Minden szolgáltatás</h3>
              <ul style={{ display: "grid", gap: 6 }}>
                {services.map((s) => <li key={s.slug}><Link href={`/szolgaltatasok/${s.slug}`} className="link">{s.name}</Link></li>)}
              </ul>
            </li>
          </ul>
        </div>
      </section>

      <ThreeForms />

      <section className="sec" aria-labelledby="varos-kerdesek-h">
        <div className="wrap">
          <Faq items={cityFaq} id="varos-kerdesek" title="Gyakori kérdések" more />
        </div>
      </section>

      <section className="sec-tight sec-paper2" aria-labelledby="kozel-h">
        <div className="wrap split" data-reveal>
          <h2 id="kozel-h" className="t-l split-l" data-r>A közelben is</h2>
          <div className="split-r" data-r>
            <div className="cities">
              {near.map((n) => <Link key={n.slug} href={`/lezerszkenneles/${n.slug}`}>{n.name}</Link>)}
            </div>
          </div>
        </div>
      </section>

      <Closing />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `Lézerszkennelés és épületfelmérés, ${c.name}`,
          serviceType: "3D lézerszkennelés, épületfelmérés",
          provider: { "@id": `${siteUrl}/#ceg` },
          areaServed: { "@type": "City", name: c.name },
          url: `${siteUrl}/lezerszkenneles/${c.slug}`,
        }}
      />
      <JsonLd data={faqSchema(cityFaq)} />
      <JsonLd data={breadcrumbSchema([{ name: "Kezdőlap", path: "/" }, { name: c.name, path: `/lezerszkenneles/${c.slug}` }])} />
    </>
  );
}
