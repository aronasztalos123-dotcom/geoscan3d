import Image from "next/image";
import Link from "next/link";
import { cities } from "@/lib/cities";

/** Ahol mérek: nyomtatott lap, rajta a megye 1881-es térképe és a városok. A szakasz alja levágja a lapot. */
export function Area() {
  const ordered = [...cities].sort((a, b) => b.order - a.order); // Miskolctól Budapestig
  return (
    <section id="terulet" className="area sec-paper2" aria-labelledby="area-h">
      <div className="area-card" data-reveal>
        <h2 id="area-h" className="area-h" data-r>Ahol mérek</h2>
        <figure className="area-fig" data-r>
          <Image
            src="/img/found/borsod-1881.webp"
            alt="Borsod vármegye térképe 1881-ből, a járásokkal és a településekkel"
            width={1344}
            height={1678}
            sizes="(max-width: 899px) 84vw, 46vw"
          />
        </figure>
        <p className="area-names" data-r>
          {ordered.map((c, i) => (
            <span key={c.slug}>
              <Link href={`/lezerszkenneles/${c.slug}`}>{c.name}</Link>
              {i < ordered.length - 1 ? <span aria-hidden="true">{" · "} </span> : null}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
