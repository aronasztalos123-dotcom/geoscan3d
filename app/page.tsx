import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ServiceIndex } from "@/components/ServiceIndex";
import { Verbs } from "@/components/Verbs";
import { SoftwarePicker } from "@/components/SoftwarePicker";
import { Closing, Marquee } from "@/components/Blocks";
import { services } from "@/lib/services";
import { figures } from "@/lib/content";

/** Kezdőlap: rövid. Minden részlet a saját aloldalán él, innen csak egy-egy ajtó nyílik oda. */
export default function Home() {
  const items = services.map((s) => ({ slug: s.slug, name: s.name, lead: s.lead, image: s.image }));
  return (
    <>
      <Hero />

      <section id="bemutatkozas" className="sec" aria-labelledby="intro-h">
        <div className="wrap intro-grid" data-reveal>
          <div className="intro-statement">
            <h2 id="intro-h" className="t-xl" data-r>Egy bejárás, és kész a rajz.</h2>
            <p className="t-lead" data-r>
              Kézi lézerszkennerrel járom be az épületet. A pontfelhőből abban a programban kap rajzot, amiben dolgozik,
              EOV koordinátákkal. <Link href="/modszer" className="link">Így dolgozom</Link>
            </p>
          </div>
          <ul className="figs">
            {figures.map((f) => (
              <li key={f.value} className="fig" data-r>
                <b>{f.value}</b>
                <span>{f.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec sec-paper2" aria-labelledby="szolg-h" style={{ paddingTop: "clamp(88px, 10vw, 160px)" }}>
        <div className="wrap sindex" data-reveal>
          <div className="sindex-head">
            <h2 id="szolg-h" className="t-xl" data-r>Mit mérek fel</h2>
            <p data-r>
              <Link href="/szolgaltatasok" className="arrow-link">Összes szolgáltatás <span className="ar" aria-hidden="true">→</span></Link>
            </p>
          </div>
          <ServiceIndex items={items} headingId="szolg-h" />
        </div>
      </section>

      <Marquee words={["Pontfelhőből kész rajz", "±2 cm mindenhol", "EOV koordinátákkal", "Kiszállás nélküli utólagos méret"]} />

      <Verbs
        label="A munka három lépésben"
        items={[
          {
            word: "Bejárás",
            text: "Egy régi családi ház 20–30 perc. Mérőszalaggal ugyanez 1–2 nap.",
            img: { src: "/img/scan/kapolna-foto.webp", alt: "Egy kis barokk kápolna oldalfala és ablaka napsütésben, kopasz fák között" },
          },
          {
            word: "Pontfelhő",
            text: "Minden látható felület milliónyi mért pontként, a helyén.",
            img: { src: "/img/scan/pontfelho-kapolna.webp", alt: "Ugyanannak a kápolnának a sűrű, színes pontfelhője a környező fákkal" },
          },
          {
            word: "Rajz",
            text: "DWG, PDF, E57 vagy webes 3D link. Abban, amiben Ön dolgozik.",
            img: { src: "/img/alaprajz.webp", alt: "Pontfelhőből rajzolt, méretezett alaprajz egy mintaházról" },
            cap: "Szemléltetés: mintaház alaprajza",
            tone: "light",
          },
        ]}
      />

      <section className="sec" aria-labelledby="program-h">
        <div className="wrap" data-reveal>
          <SoftwarePicker headingId="program-h" />
        </div>
      </section>

      <Closing />
    </>
  );
}
