import Image from "next/image";

export type Verb = { word: string; text: string; img: { src: string; alt: string }; cap?: string; tone?: "light" };

/**
 * Egy ige egyszerre: teljes képernyős panelek, mindegyikben egy kép; a szó a képernyő közepén áll,
 * amíg a képe elhalad mögötte, aztán a következő panel szava kiszorítja. Csak CSS (sticky).
 */
export function Verbs({ items, label }: { items: Verb[]; label: string }) {
  return (
    <section className="verbs" aria-label={label}>
      {items.map((v, i) => (
        <article key={v.word} className="verb" data-tone={v.tone} data-reveal>
          <div className="verb-img">
            <Image src={v.img.src} alt={v.img.alt} fill sizes="100vw" />
          </div>
          <div className="verb-stick">
            <h2 className="verb-word">
              {v.word}<em>.</em>
            </h2>
            <div className="verb-text">
              <p>{v.text}</p>
              {v.cap ? <p className="cap">{v.cap}</p> : null}
            </div>
            <p className="verb-step" aria-hidden="true"><b>{i + 1}</b> / {items.length}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
