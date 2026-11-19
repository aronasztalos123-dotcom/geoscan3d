"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export type IndexItem = { slug: string; name: string; lead: string; image: { src: string; alt: string; caption: string } };

/**
 * Szolgáltatások listája egy betűméreten; asztali gépen a sor fölé állva (vagy fókuszra)
 * jobbra a hozzá tartozó kép cserélődik. Telefonon a kép kis bélyegként a sor elején ül.
 */
export function ServiceIndex({ items, headingId }: { items: IndexItem[]; headingId: string }) {
  const [active, setActive] = useState(0);
  return (
    <>
      <ul className="sindex-list" aria-labelledby={headingId}>
        {items.map((s, i) => (
          <li key={s.slug} data-r>
            <Link
              href={`/szolgaltatasok/${s.slug}`}
              className="sindex-row"
              data-active={active === i}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="sindex-thumb" aria-hidden="true">
                <Image src={s.image.src} alt="" width={176} height={176} sizes="88px" />
              </span>
              <h3>{s.name}</h3>
              <p>{s.lead}</p>
              <span className="ar" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="sindex-peek" aria-hidden="true" data-r="img">
        {items.map((s, i) => (
          <figure key={s.slug} data-active={active === i}>
            <div className="media">
              <Image src={s.image.src} alt="" fill sizes="(max-width: 899px) 0px, 30vw" />
            </div>
            <figcaption>{s.image.caption}</figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
