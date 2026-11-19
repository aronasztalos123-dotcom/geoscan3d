import Image from "next/image";
import { figures } from "@/lib/content";
import { isSet, site } from "@/lib/site";

/** Ki mér, és a három szám, ami a szkennert indokolja. */
export function Surveyor() {
  const name = isSet(site.owner) ? site.owner : "[NÉV]";
  return (
    <section id="foldmero" className="sec sec-paper about" aria-labelledby="about-h">
      <div className="wrap">
        <div className="about-grid" data-reveal>
          <figure className="about-fig" data-r>
            <Image
              src="/img/illesztopont.webp"
              alt="Illesztőpont-tábla egy felújítás előtti régi ház falán"
              width={1200}
              height={1200}
              sizes="(max-width: 899px) 92vw, 40vw"
            />
          </figure>
          <div className="about-text">
            <h2 id="about-h" className="h-head" data-r>Földmérő a&nbsp;szkenner mögött</h2>
            <p className="t-lead" data-r>
              {name} vagyok, jogosult földmérő{isSet(site.license) ? ` (${site.license})` : ""}. Minden mérésemnek
              koordinátája van, és a hibáját előre megmondom.
            </p>
            <p data-r>
              Nagyobb munkáknál illesztőpontokat mérek be, és a pontfelhőt EOV-ba teszem. A rajz így ugyanott ül, ahol a
              telek, a közmű és a szomszéd épület.
            </p>
          </div>
        </div>

        <ul className="figs" data-reveal aria-label="A szkennelés három száma">
          {figures.map((f) => (
            <li key={f.value} className="fig" data-r>
              <p className="fig-v tnum">{f.value}</p>
              <p className="fig-l">{f.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
