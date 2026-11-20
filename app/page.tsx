import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { Hero } from "@/components/Hero";
import { ServiceIndex } from "@/components/ServiceIndex";
import { Process } from "@/components/home/Process";
import { Compare } from "@/components/home/Compare";
import { Accuracy } from "@/components/home/Accuracy";
import { Request } from "@/components/home/Request";
import { services } from "@/lib/services";
import { figures } from "@/lib/content";

// Kulcsszavak (HU, 2026-11): "földmérő" ~1000/hó, "alaprajz készítés" ~1300/hó, "épületfelmérés", "3d szkennelés".
export const metadata: Metadata = pageMeta({
  title: `Földmérő lézerszkennerrel: épületfelmérés, alaprajz | ${site.brand}`,
  absoluteTitle: true,
  description:
    "Épületfelmérés kézi lézerszkennerrel, földmérőtől. Kész DWG/DXF alaprajz, metszet, 3D bejárás és térfogatszámítás EOV-ban. Miskolc, Eger, Gyöngyös, Hatvan, Budapest.",
  path: "/",
});

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

      <Process />

      <Compare />

      <Accuracy />

      <Request />
    </>
  );
}
