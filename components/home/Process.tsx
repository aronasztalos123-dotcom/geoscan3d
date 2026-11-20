import Image from "next/image";

type Panel = { n: string; word: string; where: string; text: string; img: { src: string; alt: string }; cap?: string };

const panels: Panel[] = [
  {
    n: "01",
    word: "Bejárás",
    where: "A helyszínen, 20–30 perc",
    text: "Egy régi családi házat kézi szkennerrel járok be. Mérőszalaggal ugyanez 1–2 nap.",
    img: { src: "/img/scan/kapolna-foto.webp", alt: "Egy kis barokk kápolna oldalfala és ablaka napsütésben, kopasz fák között" },
  },
  {
    n: "02",
    word: "Pontfelhő",
    where: "Az irodában, EOV-ba illesztve",
    text: "Minden látható felület milliónyi mért pontként, a valódi helyén. Ha később hiányzik egy méret, innen keresem vissza.",
    img: { src: "/img/scan/pontfelho-kapolna.webp", alt: "Ugyanannak a kápolnának a sűrű, színes pontfelhője a környező fákkal" },
  },
  {
    n: "03",
    word: "Rajz",
    where: "Átadás az Ön formátumában",
    text: "DWG, PDF, E57 vagy webes 3D link. Abban a programban nyitja meg, amiben dolgozik.",
    img: { src: "/img/alaprajz.webp", alt: "Pontfelhőből rajzolt, méretezett alaprajz egy mintaházról" },
    cap: "Szemléltetés: mintaház",
  },
];

/**
 * A munka három alakja egymás mellett. Asztali gépen a panel, amely fölé áll az egér, kiszélesedik;
 * minden szöveg szűk állapotban is olvasható, így a mozgás csak díszítés. Csak CSS.
 */
export function Process() {
  return (
    <section className="proc-sec" aria-labelledby="proc-h">
      <div className="wrap" data-reveal>
        <div className="proc-head">
          <h2 id="proc-h" className="t-xl" data-r>Egy bejárás,<br />három alak.</h2>
          <p className="t-lead" data-r>
            A helyszínen csak a szkennelés történik. Minden más az irodában készül, újabb kiszállás nélkül.
          </p>
        </div>
        <ol className="proc" data-r="img">
          {panels.map((p) => (
            <li key={p.n} className="proc-p">
              <Image src={p.img.src} alt={p.img.alt} fill sizes="(max-width: 899px) 100vw, 50vw" />
              <span className="proc-n" aria-hidden="true">{p.n}</span>
              {p.cap ? <span className="proc-cap">{p.cap}</span> : null}
              <div className="proc-body">
                <p className="proc-where">{p.where}</p>
                <h3>{p.word}<em>.</em></h3>
                <p className="proc-text">{p.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
