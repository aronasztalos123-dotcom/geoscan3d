"use client";

import Image from "next/image";
import { useState } from "react";
import { isSet, site } from "@/lib/site";

type Item = { id: string; name: string; img: string; alt: string; fact: string };

const items: Item[] = [
  {
    id: "plan",
    name: "DWG alaprajz",
    img: "/img/alaprajz.webp",
    alt: "A mintaház pontfelhőből rajzolt alaprajza méretekkel és helyiségterületekkel",
    fact: "Rétegezett DWG/DXF és PDF, kérésre EOV koordinátákkal.",
  },
  {
    id: "cloud",
    name: "Színes pontfelhő",
    img: "/img/pontfelho.webp",
    alt: "A mintaház színes pontfelhője a bejárás útvonalával",
    fact: "E57, LAS vagy LAZ. Ebből utólag is visszakereshető bármely méret.",
  },
  {
    id: "web",
    name: "Webes 3D bejárás",
    img: "/img/virtualis-bejaras.webp",
    alt: "Rendezvénytérré alakított présház belső tere, a bejárás előnézete",
    fact: "Böngészőben fut, telefonon is. A tér mérhető, a link beágyazható.",
  },
];

/** Három eredmény, egy nagy képen. A 3D nézegető csak kattintásra töltődik be. */
export function Demo() {
  const [cur, setCur] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const hasDemo = isSet(site.demoUrl);
  const it = items[cur];

  return (
    <div className="demo" data-reveal>
      <div className="seg" role="tablist" aria-label="Eredmény" data-r>
        {items.map((x, i) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            id={`demo-tab-${x.id}`}
            aria-selected={i === cur}
            aria-controls="demo-panel"
            className="seg-btn"
            onClick={() => setCur(i)}
          >
            {x.name}
          </button>
        ))}
      </div>

      <div id="demo-panel" role="tabpanel" aria-labelledby={`demo-tab-${it.id}`} className="demo-panel" data-r>
        <div className="demo-frame">
          {it.id === "web" && loaded && hasDemo ? (
            <iframe src={site.demoUrl} title="3D virtuális bejárás demó" loading="lazy" allow="fullscreen; xr-spatial-tracking" />
          ) : (
            items.map((x, i) => (
              <Image
                key={x.id}
                src={x.img}
                alt={i === cur ? x.alt : ""}
                aria-hidden={i !== cur}
                width={1600}
                height={1200}
                sizes="(max-width: 899px) 92vw, 90vw"
                data-on={i === cur}
                className={x.id === "plan" ? "is-plan" : undefined}
              />
            ))
          )}
          {it.id === "web" && !(loaded && hasDemo) ? (
            <div className="demo-overlay">
              {hasDemo ? (
                <button type="button" className="btn btn-accent" onClick={() => setLoaded(true)}>
                  3D demó betöltése
                </button>
              ) : (
                <p className="demo-pending">[3D DEMÓ LINK] Itt fog betöltődni a bejárás.</p>
              )}
            </div>
          ) : null}
        </div>
        <div className="demo-cap">
          <p className="demo-fact">{it.fact}</p>
          <p className="demo-note">Szemléltetés, nem ügyfélmunka</p>
        </div>
      </div>
    </div>
  );
}
