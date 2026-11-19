import Image from "next/image";
import { telHref } from "@/lib/site";

/**
 * Kérdések. A kezdőlapon kép mellett (magas fotó + átfedő négyzet), aloldalon a kép elmarad
 * és a lista a jobb oldali hasábba kerül.
 */
export function Faq({ items, id = "kerdesek", title = "Kérdések", withPhotos = false, tone = "paper" }: {
  items: { q: string; a: string }[];
  id?: string;
  title?: string;
  withPhotos?: boolean;
  tone?: "paper" | "card";
}) {
  return (
    <section id={id} className={`faq sec-${tone}${withPhotos ? " faq-photo" : ""}`} aria-labelledby={`${id}-h`}>
      <div className="wrap faq-grid">
        <div className="faq-col" data-reveal>
          <h2 id={`${id}-h`} className="t-head" data-r>{title}</h2>
          <div className="faq-list">
            {items.map((f) => (
              <details key={f.q} name={`${id}-acc`} className="faq-item" data-r>
                <summary>
                  <span>{f.q}</span>
                  <span className="faq-chev" aria-hidden="true" />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          {withPhotos ? (
            <div className="faq-actions" data-r>
              <a href="#ajanlat" className="btn btn-ink">Ajánlatot kérek</a>
              <a href={telHref} className="link-strong">Inkább hívjon</a>
            </div>
          ) : null}
        </div>
        {withPhotos ? (
          <div className="faq-media">
            <Image
              src="/img/found/mezokovesd-zsupfedeles.webp"
              alt="Nádtetős, műemlék régi ház Mezőkövesden"
              width={1600}
              height={1200}
              sizes="(max-width: 899px) 92vw, 50vw"
              className="faq-tall"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
