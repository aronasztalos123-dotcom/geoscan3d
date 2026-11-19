"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Item = { slug: string; name: string; lead: string; img: string; alt: string; caption: string };

/** A sor fölé vitt egér vagy fókusz cseréli a bal oldali képet. Telefonon minden sor a saját kis képét mutatja. */
export function ServiceIndex({ items }: { items: Item[] }) {
  const [cur, setCur] = useState(0);
  const it = items[cur];

  return (
    <div className="svc-grid">
      <figure className="svc-fig" aria-hidden="true">
        <div className="svc-frame">
          {items.map((x, i) => (
            <Image
              key={x.slug}
              src={x.img}
              alt=""
              width={1600}
              height={1200}
              sizes="(max-width: 899px) 1px, 44vw"
              data-on={i === cur}
            />
          ))}
        </div>
        <figcaption>{it.caption}</figcaption>
      </figure>

      <ul className="svc-list" data-reveal>
        {items.map((x, i) => (
          <li key={x.slug} id={x.slug} data-r>
            <Link
              href={`/szolgaltatasok/${x.slug}`}
              className="svc-row"
              data-on={i === cur}
              onMouseEnter={() => setCur(i)}
              onFocus={() => setCur(i)}
            >
              <Image className="svc-thumb" src={x.img} alt={x.alt} width={320} height={240} sizes="96px" />
              <span className="svc-text">
                <span className="svc-name">{x.name}</span>
                <span className="svc-lead">{x.lead}</span>
              </span>
              <span className="svc-arr" aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
