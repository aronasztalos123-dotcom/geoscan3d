"use client";

import Link from "next/link";
import { useState } from "react";
import { formats, software, type SoftwareId } from "@/lib/content";

/** Az oldal egy élő eleme: válassza ki, miben dolgozik, és rögtön látja, milyen fájlokat kap. */
export function SoftwarePicker({ headingId, title = "Miben nyitja meg?" }: { headingId: string; title?: string }) {
  const [id, setId] = useState<SoftwareId>("archicad");
  const sw = software.find((s) => s.id === id)!;
  const files = sw.get.map((f) => formats.find((x) => x.id === f)!);

  return (
    <div className="picker">
      <div className="picker-q" data-r>
        <h2 id={headingId} className="t-xl">{title}</h2>
        <p className="t-lead muted">Válassza ki a programját, és megmutatom, mit kap kézhez.</p>
        <div className="picker-chips" role="group" aria-label="Program kiválasztása">
          {software.map((s) => (
            <button
              key={s.id}
              type="button"
              className="chip"
              aria-pressed={s.id === id}
              onClick={() => {
                setId(s.id);
                window.dispatchEvent(new CustomEvent("software-pick", { detail: s.id }));
              }}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="picker-a" data-r aria-live="polite">
        <p className="t-l">{sw.name === "Nem dolgozom CAD-del" ? "CAD nélkül" : sw.name}</p>
        <p className="picker-note">{sw.note}</p>
        <ul className="files" key={id}>
          {files.map((f, i) => (
            <li key={f.id} className="file" style={{ ["--i" as string]: i }}>
              <b>{f.id === "web" ? "Link" : f.id === "orto" ? "Ortofotó" : f.id.toUpperCase()}</b>
              <span>{f.name}</span>
              <small>{f.text}</small>
            </li>
          ))}
        </ul>
        <Link href={`/kapcsolat?program=${sw.id}`} className="btn btn-lime" style={{ justifySelf: "start" }}>
          Ajánlatot kérek ehhez <span className="ar" aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
