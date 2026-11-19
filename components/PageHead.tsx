import Link from "next/link";
import { Photo } from "./Photo";

/** Aloldal fejléce erdőzöld mezőn: morzsamenü, cím, egy mondat, opcionálisan kép jobbra. */
export function PageHead({
  crumbs, title, lead, image, children,
}: {
  crumbs: { name: string; href?: string }[];
  title: string;
  lead: string;
  image?: { src: string; alt: string };
  children?: React.ReactNode;
}) {
  return (
    <section className="phead">
      <div className={`wrap phead-grid${image ? "" : " no-img"}`}>
        <div className="phead-text">
          <nav aria-label="Morzsamenü" className="crumbs">
            <ol>
              {crumbs.map((c, i) => (
                <li key={i}>
                  {c.href ? <Link href={c.href}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="t-xl">{title}</h1>
          <p className="t-lead">{lead}</p>
          {children ? <div className="phead-actions">{children}</div> : null}
        </div>
        {image ? (
          <figure className="phead-fig">
            <div className="media">
              <Photo src={image.src} alt={image.alt} width={1200} height={1500} sizes="(max-width: 899px) 92vw, 30vw" priority />
            </div>
          </figure>
        ) : null}
      </div>
    </section>
  );
}
