import Image from "next/image";

const forms = [
  { src: "/img/scan/pontfelho-kapolna.webp", alt: "Egy kápolna sűrű, színes pontfelhője", t: "Pontfelhő", p: "E57, LAS, LAZ. A nyers mérés, EOV koordinátákkal." },
  { src: "/img/scan/kapolna-foto.webp", alt: "Ugyanaz a kápolna fotórealisztikus 3D modellként, napsütésben", t: "3D modell", p: "Böngészőben bejárható, telefonon is." },
  { src: "/img/alaprajz.webp", alt: "Pontfelhőből rajzolt, méretezett alaprajz egy mintaházról", t: "Rajz", p: "DWG, DXF, PDF. Szemléltetés: mintaház." },
];

/** Egy bejárás, három alak: ugyanabból a mérésből pontfelhő, 3D modell és rajz. */
export function ThreeForms({ title = "Egy bejárás, három alak" }: { title?: string }) {
  return (
    <section className="sec-tight" aria-labelledby="harom-h">
      <div className="wrap" data-reveal>
        <h2 id="harom-h" className="t-l" data-r style={{ marginBottom: 28 }}>{title}</h2>
        <ul className="forms">
          {forms.map((f) => (
            <li key={f.t} data-r>
              <div className="media" style={{ aspectRatio: "4 / 5" }}>
                <Image src={f.src} alt={f.alt} fill sizes="(max-width: 767px) 92vw, 30vw" />
              </div>
              <h3>{f.t}</h3>
              <p className="muted">{f.p}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
