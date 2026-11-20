import type { Metadata } from "next";
import Image from "next/image";
import { PageHead } from "@/components/PageHead";
import { Verbs } from "@/components/Verbs";
import { Closing, NextLinks } from "@/components/Blocks";
import { accuracy, comparison, faq } from "@/lib/content";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "A módszer: kézi lézerszkennelés, pontfelhő, akár 1 cm, EOV",
  description:
    "Hogyan lesz egy 20–30 perces bejárásból kész DWG alaprajz: kézi SLAM lézerszkenner, pontfelhő, illesztőpontok, EOV. A pontosság és a határai, őszintén.",
  alternates: { canonical: "/modszer" },
};

const eov = faq.find((f) => f.q.includes("EOV"))!;
const slam = faq.find((f) => f.q.includes("hosszú"))!;

export default function MethodPage() {
  return (
    <>
      <PageHead
        crumbs={[{ name: "Kezdőlap", href: "/" }, { name: "Módszer" }]}
        title="Mérőszalag helyett lézerszkenner"
        lead="Kézi lézerszkennerrel sétálok végig az épületen. Ami látható, az a pontfelhőben a helyén van, akár 1 cm-en belül."
        image={{ src: "/img/scan/pontfelho-fak.webp", alt: "Egy kápolna és a körülötte álló fák pontfelhője sötét háttér előtt" }}
      />

      <Verbs
        label="A munka négy lépése"
        items={[
          {
            word: "Egyeztetés",
            text: "Pár mondat, a cím, és hogy milyen programban nyitja meg a rajzot. Utána írásban ajánlatot adok.",
            img: { src: "/img/illesztopont.webp", alt: "Fekete-fehér illesztőpont-jel egy régi vakolt falon" },
            cap: "Illusztráció: illesztőpont egy régi falon",
          },
          {
            word: "Bejárás",
            text: "Kézi lézerszkennerrel és a rá szerelt 360°-os kamerával végigjárom az épületet. Egy régi háznál 20–30 perc.",
            img: { src: "/img/scan/kapolna-foto.webp", alt: "Egy kis barokk kápolna oldalfala napsütésben" },
          },
          {
            word: "Pontfelhő",
            text: "Összeillesztem, illesztőpontokkal EOV-ba teszem, és ellenőrzöm, hogy a kör vége ott van-e, ahol az eleje.",
            img: { src: "/img/scan/pontfelho-kapolna.webp", alt: "A kápolna sűrű, színes pontfelhője" },
          },
          {
            word: "Átadás",
            text: "Az Ön formátumában. Ha később kell egy méret, kiszállás nélkül visszakeresem a pontfelhőből.",
            img: { src: "/img/alaprajz.webp", alt: "Pontfelhőből rajzolt, méretezett alaprajz egy mintaházról" },
            cap: "Szemléltetés: mintaház alaprajza",
            tone: "light",
          },
        ]}
      />

      <section id="pontossag" className="sec" aria-labelledby="pont-h">
        <div className="wrap split" data-reveal>
          <div className="split-l split-sticky">
            <h2 id="pont-h" className="t-xl" data-r>Akár 1 cm, mindenhol</h2>
            <p className="t-lead muted" data-r>Elég egy tervhez. Nem elég egy acélszerkezet gyártásához, és ezt előre megmondom.</p>
          </div>
          <div className="split-r">
            <h3 className="t-l" data-r style={{ fontSize: 22 }}>Erre jó</h3>
            <ul className="ticks" data-r>
              {accuracy.yes.map((a) => <li key={a}>{a}</li>)}
            </ul>
            <h3 className="t-l" data-r style={{ fontSize: 22, marginTop: 18 }}>Erre nem ezt javaslom</h3>
            <ul className="ticks no" data-r>
              {accuracy.no.map((a) => <li key={a}>{a}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="sec sec-paper2" aria-labelledby="hasonl-h">
        <div className="wrap" data-reveal>
          <h2 id="hasonl-h" className="t-xl" data-r style={{ maxWidth: "16ch", marginBottom: "clamp(32px, 4vw, 56px)" }}>Mérőszalag vagy szkenner</h2>
          <div data-r>
            <table className="compare">
              <thead>
                <tr><th scope="col"><span className="sr-only">Szempont</span></th><th scope="col">Hagyományos felmérés</th><th scope="col">Lézerszkennelés</th></tr>
              </thead>
              <tbody>
                {comparison.map((c) => (
                  <tr key={c.row}>
                    <th scope="row">{c.row}</th>
                    <td data-l="Hagyományos">{c.manual}</td>
                    <td data-l="Lézerszkennelés">{c.scan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="sec sec-forest" aria-labelledby="eov-h">
        <div className="wrap split" data-reveal>
          <div className="split-l">
            <h2 id="eov-h" className="t-xl" data-r>Miért földmérőtől</h2>
          </div>
          <div className="split-r">
            <div className="tile" data-r>
              <h3>{eov.q}</h3>
              <p>{eov.a}</p>
            </div>
            <div className="tile" data-r>
              <h3>Zárt körök, illesztőpontok</h3>
              <p>{slam.a}</p>
            </div>
            <figure data-r="img">
              <div className="media" style={{ aspectRatio: "16 / 10" }}>
                <Image src="/img/scan/pontfelho-felulrol.webp" alt="Egy kápolna pontfelhője felülről, körülötte a fák és az utak" fill sizes="(max-width: 899px) 92vw, 46vw" />
              </div>
              <figcaption className="cap">Pontfelhő felülről: az épület, a fák és az utak egy rendszerben</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <NextLinks
        items={[
          { href: "/mit-kap", kicker: "Formátumok", title: "Mit kap kézhez" },
          { href: "/szolgaltatasok", kicker: "Munkák", title: "Szolgáltatások" },
          { href: "/rolam", kicker: "Ki méri", title: `${site.owner}` },
        ]}
      />

      <Closing />
      <JsonLd data={breadcrumbSchema([{ name: "Kezdőlap", path: "/" }, { name: "Módszer", path: "/modszer" }])} />
    </>
  );
}
