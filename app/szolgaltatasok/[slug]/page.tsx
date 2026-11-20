import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHead } from "@/components/PageHead";
import { Photo } from "@/components/Photo";
import { Closing, Faq } from "@/components/Blocks";
import { ThreeForms } from "@/components/ThreeForms";
import { JsonLd, breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { serviceBySlug, services } from "@/lib/services";
import { site, telHref } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) return {};
  return {
    title: s.seoTitle,
    description: s.seoDescription,
    alternates: { canonical: `/szolgaltatasok/${s.slug}` },
    openGraph: { title: s.seoTitle, description: s.seoDescription, url: `/szolgaltatasok/${s.slug}`, images: [{ url: s.image.src }] },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) notFound();
  const idx = services.findIndex((o) => o.slug === s.slug);
  const next = services[(idx + 1) % services.length];
  const fig = s.slug === "as-built-felmeres"
    ? { src: "/img/alaprajz.webp", alt: "Pontfelhőből rajzolt, méretezett alaprajz egy mintaházról", cap: "Szemléltetés: alaprajz egy mintaház pontfelhőjéből" }
    : { src: "/img/scan/pontfelho-apszis.webp", alt: "Egy kápolna íves apszisa pontfelhőként, a környező fákkal", cap: "Pontfelhő: egy kápolna íves fala" };

  return (
    <>
      <PageHead
        crumbs={[{ name: "Kezdőlap", href: "/" }, { name: "Szolgáltatások", href: "/szolgaltatasok" }, { name: s.name }]}
        title={s.name}
        lead={s.lead}
        image={{ src: s.image.src, alt: s.image.alt }}
      >
        <Link href={`/kapcsolat?szolgaltatas=${s.slug}`} className="btn btn-lime">Ajánlatot kérek <span className="ar" aria-hidden="true">→</span></Link>
        <a href={telHref} className="btn btn-ghost">{site.phoneDisplay}</a>
      </PageHead>

      {/* Mi ez és mit kap: szöveg balra, a kézbe kapott dolgok jobbra */}
      <section className="sec" aria-labelledby="mi-h">
        <div className="wrap split" data-reveal>
          <div className="split-l">
            <h2 id="mi-h" className="t-l" data-r>Mi ez, és mit kap</h2>
            <div className="prose" data-r>
              {s.page.intro.map((p) => <p key={p}>{p}</p>)}
            </div>
            <p className="muted" data-r><b style={{ color: "var(--ink)" }}>Kinek szól: </b>{s.forWhom}</p>
          </div>
          <div className="split-r">
            <ul className="ticks" data-r>
              {s.deliverables.map((d) => <li key={d}>{d}</li>)}
            </ul>
            <figure data-r="img">
              <div className="media" style={{ aspectRatio: "4 / 3" }}>
                <Photo src={fig.src} alt={fig.alt} width={1440} height={1080} sizes="(max-width: 899px) 92vw, 46vw" />
              </div>
              <figcaption className="cap">{fig.cap}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="sec sec-forest" aria-labelledby="mikor-h">
        <div className="wrap" data-reveal>
          <h2 id="mikor-h" className="t-xl" data-r style={{ marginBottom: "clamp(36px, 5vw, 64px)", maxWidth: "14ch" }}>Mikor kérik leggyakrabban</h2>
          <ul className="tiles">
            {s.page.situations.map((x) => (
              <li key={x.title} className="tile" data-r>
                <h3>{x.title}</h3>
                <p>{x.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec" aria-labelledby="menet-h">
        <div className="wrap split" data-reveal>
          <div className="split-l split-sticky">
            <h2 id="menet-h" className="t-l" data-r>A munka menete</h2>
            <p className="muted" data-r>Minden lépés előtt írásban egyeztetünk, a végén az Ön formátumában adom át.</p>
          </div>
          <ol className="steps split-r" data-r>
            {s.page.steps.map((st) => <li key={st}><span style={{ color: "var(--ink)" }}>{st}</span></li>)}
          </ol>
        </div>
      </section>

      <ThreeForms title="Ugyanabból a bejárásból" />

      <section className="sec-tight sec-paper2" aria-labelledby="hatar-h">
        <div className="wrap split" data-reveal>
          <h2 id="hatar-h" className="t-l split-l" data-r>Amire nem ezt javaslom</h2>
          <div className="split-r" data-r>
            <p className="t-lead">{s.page.limits}</p>
            <p><Link href="/modszer#pontossag" className="arrow-link">A pontosságról <span className="ar" aria-hidden="true">→</span></Link></p>
          </div>
        </div>
      </section>

      <section className="sec" aria-labelledby="szolg-kerdesek-h">
        <div className="wrap">
          <Faq items={s.page.faq} id="szolg-kerdesek" title="Kérdések erről" more />
        </div>
      </section>

      <section className="sec-tight sec-forest" aria-labelledby="hol-h">
        <div className="wrap split" data-reveal>
          <div className="split-l">
            <h2 id="hol-h" className="t-l" data-r>Hol vállalom</h2>
            <p className="muted" data-r>Borsod-Abaúj-Zemplén és az M3 mentén Budapestig.</p>
          </div>
          <div className="split-r" data-r>
            <p>
              <Link href={`/szolgaltatasok/${next.slug}`} className="arrow-link">Következő: {next.name} <span className="ar" aria-hidden="true">→</span></Link>
            </p>
          </div>
        </div>
      </section>

      <Closing />

      <JsonLd data={serviceSchema(s)} />
      <JsonLd data={faqSchema(s.page.faq)} />
      <JsonLd data={breadcrumbSchema([{ name: "Kezdőlap", path: "/" }, { name: "Szolgáltatások", path: "/szolgaltatasok" }, { name: s.name, path: `/szolgaltatasok/${s.slug}` }])} />
    </>
  );
}
