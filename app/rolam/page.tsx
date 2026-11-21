import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { Closing } from "@/components/Blocks";
import { ThreeForms } from "@/components/ThreeForms";
import { AreaMap } from "@/components/AreaMap";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import { areaFee, areas } from "@/lib/areas";
import { fmtFt } from "@/lib/pricing";

export const metadata: Metadata = pageMeta({
  title: `${site.owner}, földmérő Miskolcon`,
  description: `${site.owner} miskolci földmérő. Kézi lézerszkennerrel mér Miskolcon, Borsodban, Egerben, Gyöngyösön, Hatvanban és Budapestig. Kiszállási díjak városonként.`,
  path: "/rolam",
});

const promises = [
  { t: "Előre megmondom, mire elég", p: "Az akár 1 cm-es pontosság építészeti tervhez elég, gépészeti illesztéshez nem. Ezt az ajánlatban leírom, nem a munka után derül ki." },
  { t: "Minden pontnak koordinátája van", p: "A pontfelhőt illesztőpontokkal EOV-ba teszem, így a rajz ott ül, ahol a telek és a közmű." },
  { t: "A hiányzó méretért nem megyek ki újra", p: "Ha később kell egy méret, visszakeresem a pontfelhőből. Önnek ez nem kerül újabb kiszállásba." },
  { t: "Írásban, a munka előtt", p: "Az árkalkulátor irányárat ad; a végleges árat a felmért terület és a kért rajzok alapján, írásban adom meg." },
];

export default function AboutPage() {
  return (
    <>
      <PageHead
        crumbs={[{ name: "Kezdőlap", href: "/" }, { name: "Rólam" }]}
        title={`${site.owner}, földmérő`}
        lead="Földmérőként dolgozom. Nálam a lézerszkenner mérőműszer, nem látványeszköz."
        image={{ src: "/img/scan/pontfelho-kapolna.webp", alt: "Egy kápolna sűrű, színes pontfelhője" }}
      >
        <Link href="/kapcsolat" className="btn btn-lime">Ajánlatot kérek <span className="ar" aria-hidden="true">→</span></Link>
      </PageHead>

      <section className="sec" aria-labelledby="iger-h">
        <div className="wrap split" data-reveal>
          <div className="split-l split-sticky">
            <h2 id="iger-h" className="t-xl" data-r>Amit vállalok</h2>
            <figure data-r="img">
              <div className="media" style={{ aspectRatio: "4 / 3" }}>
                <Image src="/img/found/mezokovesd-zsupfedeles.webp" alt="Nádtetős, műemlék régi ház Mezőkövesden" fill sizes="(max-width: 899px) 92vw, 38vw" />
              </div>
              <figcaption className="cap">Mezőkövesd, műemlék ház. Fotó: Globetrotter19, CC BY-SA 3.0</figcaption>
            </figure>
          </div>
          <ul className="split-r tiles" style={{ gridTemplateColumns: "1fr" }}>
            {promises.map((x) => (
              <li key={x.t} className="tile" data-r>
                <h3>{x.t}</h3>
                <p>{x.p}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec sec-paper2" aria-labelledby="eszk-h">
        <div className="wrap" data-reveal>
          <h2 id="eszk-h" className="t-xl" data-r style={{ marginBottom: "clamp(32px, 4vw, 56px)" }}>Amivel mérek</h2>
          <ul className="kit">
            <li data-r style={{ background: "var(--paper)" }}><b>Kézi lézerszkenner</b><span>SLAM lézerszkenner, 50–100 m hatótáv, menet közben számolja a saját helyét.</span></li>
            <li data-r style={{ background: "var(--paper)" }}><b>360°-os kamera</b><span>A szkennerre szerelve: a színek és a webes 3D bejárás képei.</span></li>
            <li data-r style={{ background: "var(--paper)" }}><b>Illesztőpontok</b><span>Bemért jelek a falon és a terepen, ezek kötik a felmérést az EOV-hoz.</span></li>
            <li data-r style={{ background: "var(--forest)", color: "var(--paper)" }}><b>Akár 1 cm</b><span style={{ color: "var(--on-dark-2)" }}>A pontfelhő pontossága, a bejárt terek minden látható felületén.</span></li>
          </ul>
        </div>
      </section>

      <ThreeForms title="Amit egy bejárásból kap" />

      <section id="terulet" className="sec sec-forest" aria-labelledby="ter-h">
        <div className="wrap split" data-reveal>
          <div className="split-l">
            <h2 id="ter-h" className="t-xl" data-r>Ahol dolgozom</h2>
            <p className="t-lead muted" data-r>
              Miskolci földmérő vagyok. Kiszállok Borsod-Abaúj-Zemplén egészébe, Hevesbe, és az M3 mentén Budapestig.
            </p>
          </div>
          <figure className="split-r" data-r="img">
            <div style={{ background: "var(--forest-2)", borderRadius: "var(--r)", padding: "clamp(12px, 2vw, 24px)" }}>
              <AreaMap />
            </div>
            <figcaption className="cap">Kiszállok a megye egészébe, és az M3 mentén Budapestig. Vázlatos térkép.</figcaption>
          </figure>
        </div>
        <div className="wrap" data-reveal>
          <ul className="areas">
            {areas.map((a) => {
              const fee = areaFee(a);
              return (
                <li key={a.id} id={a.id} className="area" data-r>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                  <p className="area-towns">{a.cities.join(", ")}</p>
                  <p className="area-fee">Kiszállás: <b>{fee ? `nettó ${fmtFt(fee)}` : "díjtalan"}</b></p>
                </li>
              );
            })}
          </ul>
          <p className="muted" data-r style={{ marginTop: 24 }}>
            Pontos irányár a kiszállással együtt: <Link href="/arkalkulator" className="link">árkalkulátor</Link>.
          </p>
        </div>
      </section>

      <Closing />
      <JsonLd data={breadcrumbSchema([{ name: "Kezdőlap", path: "/" }, { name: "Rólam", path: "/rolam" }])} />
    </>
  );
}
