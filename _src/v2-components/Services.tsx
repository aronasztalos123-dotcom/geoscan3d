import fs from "node:fs";
import path from "node:path";
import { services } from "@/lib/services";
import { ServiceIndex } from "./ServiceIndex";

/** Öt szolgáltatás egy indexben: balra a kép, jobbra a lista. */
export function Services() {
  // Ha egy szolgáltatásnak még nincs fotója, a mintaház pontfelhője áll a helyén (szemléltetés).
  const items = services.map((s) => {
    const has = fs.existsSync(path.join(process.cwd(), "public", s.image.src));
    return {
      slug: s.slug,
      name: s.name,
      lead: s.lead,
      img: has ? s.image.src : "/img/pontfelho.webp",
      alt: has ? s.image.alt : "Egy mintaház színes pontfelhője",
      caption: has ? s.image.caption : "Szemléltetés: pontfelhő egy mintaházról",
    };
  });

  return (
    <section id="szolgaltatasok" className="sec sec-ink svc" aria-labelledby="svc-h">
      <div className="wrap">
        <div className="sec-head" data-reveal>
          <h2 id="svc-h" className="h-head" data-r>Szolgáltatások</h2>
          <p className="t-lead" data-r>
            Öt munka, egy szkenner és ugyanaz a földmérői pontosság. Mindegyikről külön oldalon olvashat.
          </p>
        </div>
        <ServiceIndex items={items} />
      </div>
    </section>
  );
}
