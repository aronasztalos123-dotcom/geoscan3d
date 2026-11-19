"use client";

import { useId, useState } from "react";
import { formats, software, type SoftwareId } from "@/lib/content";

/**
 * A látogató kiválasztja, miben dolgozik, és csak azokat a fájlokat látja, amelyeket kap.
 * A választás az ajánlatkérő űrlapba is átmegy.
 */
export function FormatPicker() {
  const [pick, setPick] = useState<SoftwareId>("archicad");
  const sw = software.find((s) => s.id === pick)!;
  const name = useId();
  const files = sw.get.map((id) => formats.find((f) => f.id === id)!);

  const choose = (id: SoftwareId) => {
    setPick(id);
    window.dispatchEvent(new CustomEvent("software-pick", { detail: id }));
  };

  return (
    <div className="picker" data-reveal>
      <fieldset className="picker-set" data-r>
        <legend className="picker-legend">Miben dolgozik?</legend>
        <div className="picker-chips">
          {software.map((s) => (
            <label key={s.id} className="chip" data-on={pick === s.id}>
              <input type="radio" name={name} value={s.id} checked={pick === s.id} onChange={() => choose(s.id)} />
              {s.name}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="picker-out" data-r>
        <p className="picker-note" aria-live="polite">{sw.note}</p>
        <ul className="picker-files">
          {files.map((f) => (
            <li key={f.id}>
              <span className="pf-name">{f.name}</span>
              <span className="pf-text">{f.text}</span>
            </li>
          ))}
        </ul>
        <a href="#ajanlat" className="btn btn-ink">
          Ezzel kérek ajánlatot <span className="arr" aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}
