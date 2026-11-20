"use client";

import Link from "next/link";
import { useState } from "react";
import { formats, software, type FormatId, type SoftwareId } from "@/lib/content";

/** Szemléltető fájlnevek az átadási mappához. */
const fileName: Record<FormatId, string> = {
  dwg: "alaprajz.dwg",
  dxf: "alaprajz.dxf",
  pdf: "alaprajz_M50.pdf",
  orto: "metszet_ortofoto.tif",
  web: "3D link",
  e57: "pontfelho.e57",
  las: "pontfelho.las",
  laz: "pontfelho.laz",
  obj: "haz_textura.obj",
  ply: "pontfelho.ply",
};

/** Az oldal egy élő eleme: válassza ki, miben dolgozik, és az átadási mappában rögtön látja, mit kap. */
export function SoftwarePicker({ headingId, title = "Miben nyitja meg?" }: { headingId: string; title?: string }) {
  const [id, setId] = useState<SoftwareId>("archicad");
  const sw = software.find((s) => s.id === id)!;
  const files = sw.get.map((f) => formats.find((x) => x.id === f)!);
  const label = sw.id === "none" ? "CAD nélkül" : sw.name;

  return (
    <div className="picker">
      <div className="picker-q" data-r>
        <h2 id={headingId} className="t-xl">{title}</h2>
        <p className="t-lead muted">Válassza ki a programját, és megmutatom, mit kap kézhez.</p>
        <div className="picker-list" role="group" aria-label="Program kiválasztása">
          {software.map((s) => (
            <button
              key={s.id}
              type="button"
              className="picker-opt"
              aria-pressed={s.id === id}
              onClick={() => {
                setId(s.id);
                window.dispatchEvent(new CustomEvent("software-pick", { detail: s.id }));
              }}
            >
              <span>{s.name}</span>
              <small className="num">{s.get.length} fájl</small>
            </button>
          ))}
        </div>
      </div>

      <div className="picker-a" data-r aria-live="polite">
        <div className="picker-bar">
          <span className="picker-path">Átadás <i aria-hidden="true">/</i> <b>{label}</b></span>
          <span className="num">{files.length} elem</span>
        </div>
        <p className="picker-note">{sw.note}</p>
        <ul className="files" key={id}>
          {files.map((f, i) => (
            <li key={f.id} className="file" style={{ ["--i" as string]: i }}>
              <span className="file-ext" aria-hidden="true">{f.id === "web" ? "3D" : f.id === "orto" ? "TIF" : f.id.toUpperCase()}</span>
              <span className="file-name">{fileName[f.id]}</span>
              <small>{f.name}. {f.text}</small>
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
