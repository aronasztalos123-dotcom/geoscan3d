import Link from "next/link";
import { mailHref, site, telHref } from "@/lib/site";

/** Kérdések: széles cím balra, a kérdések beljebb húzva. <details>, script nélkül is működik. */
export function Faq({ items, id = "kerdesek", title = "Gyakori kérdések", more }: {
  items: { q: string; a: string }[];
  id?: string;
  title?: string;
  more?: boolean;
}) {
  return (
    <div data-reveal>
      <h2 id={`${id}-h`} className="faq-h" data-r>{title}</h2>
      <div className="faq-list" data-r>
        {items.map((f) => (
          <details key={f.q} name={`${id}-acc`} className="faq-item">
            <summary>
              <span>{f.q}</span>
              <span className="faq-chev" aria-hidden="true" />
            </summary>
            <p className="faq-a">{f.a}</p>
          </details>
        ))}
      </div>
      {more ? (
        <p className="faq-more" data-r>
          <Link href="/gyik" className="arrow-link">Minden kérdés <span className="ar" aria-hidden="true">→</span></Link>
        </p>
      ) : null}
    </div>
  );
}

/** Zárás minden oldal alján: egy mondat, az e-mail-cím kijelző méretben, telefon és gomb. */
export function Closing({ line = "Írjon pár mondatot a munkáról. Írásban válaszolok, a munka előtt." }: { line?: string }) {
  const [user, domain] = site.email.split("@");
  return (
    <section className="closing" aria-labelledby="zaras-h">
      <div className="wrap">
        <div className="closing-top">
          <h2 id="zaras-h" className="sr-only">Kapcsolat</h2>
          <p>{line}</p>
        </div>
        <a href={mailHref} className="closing-mail">
          {user}<span className="at">@</span><span className="dom">{domain}</span>
        </a>
        <div className="closing-foot">
          <span>Telefon: <a href={telHref}>{site.phoneDisplay}</a></span>
          <span>{site.owner}, földmérő</span>
          <Link href="/kapcsolat" className="btn btn-lime">
            Ajánlatkérő űrlap <span className="ar" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Továbbvezető kártyák a következő oldalakra. */
export function NextLinks({ items, title = "Merre tovább" }: { items: { href: string; kicker: string; title: string }[]; title?: string }) {
  return (
    <section className="sec-tight" aria-labelledby="tovabb-h">
      <div className="wrap" data-reveal>
        <h2 id="tovabb-h" className="t-l" data-r style={{ marginBottom: 28 }}>{title}</h2>
        <div className="next">
          {items.map((it) => (
            <Link key={it.href} href={it.href} data-r>
              <span>{it.kicker}</span>
              <b>{it.title} <span className="ar" aria-hidden="true">→</span></b>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** A lassú, sávnyi futószöveg: valódi állítások, nem kulcsszólista. */
export function Marquee({ words }: { words: string[] }) {
  const run = [...words, ...words];
  return (
    <div className="marquee" role="presentation">
      <p className="sr-only">{words.join(". ")}</p>
      <div className="marquee-track" aria-hidden="true">
        {run.map((w, i) => <span key={i}>{w}</span>)}
      </div>
    </div>
  );
}
