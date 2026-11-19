"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { slips, software, type SoftwareId } from "@/lib/content";

/**
 * Mit kap kézhez: a látogató kiválasztja a programját, és a hozzá tartozó cédulák felállnak.
 * A választás az ajánlatkérő űrlapba is átmegy (software-pick esemény).
 */
export function Outputs() {
  const [pick, setPick] = useState<SoftwareId>("archicad");
  const sw = software.find((s) => s.id === pick)!;
  const name = useId();
  const on = (formats: string[]) => formats.some((f) => (sw.get as string[]).includes(f));

  const choose = (id: SoftwareId) => {
    setPick(id);
    window.dispatchEvent(new CustomEvent("software-pick", { detail: id }));
  };

  return (
    <section id="formatumok" className="outs" aria-labelledby="outs-h">
      <Image
        src="/img/as-built.webp"
        alt="Felújítás előtti régi ház szobája, a falon illesztőpont-tábla"
        fill
        sizes="100vw"
        className="outs-photo"
      />
      <div className="outs-copy" data-reveal>
        <h2 id="outs-h" className="t-head" data-r>Mit kap kézhez</h2>
        <p className="t-lead" data-r>Miben dolgozik?</p>
        <fieldset className="outs-pick" data-r>
          <legend className="sr-only">Miben dolgozik?</legend>
          {software.map((s) => (
            <label key={s.id} className="chip" data-on={pick === s.id}>
              <input type="radio" name={name} value={s.id} checked={pick === s.id} onChange={() => choose(s.id)} />
              {s.name}
            </label>
          ))}
        </fieldset>
        <p className="sr-only" aria-live="polite">{sw.note}</p>
      </div>

      <ul className="slips" aria-label="Átadott fájlok">
        {slips.map((s, i) => {
          const active = on(s.formats);
          return (
            <li key={s.id} className="slip" data-on={active} style={{ ["--h" as string]: `${[38, 30, 44, 27, 34, 40][i]}svh`, ["--r" as string]: `${[-1.5, 0, 1.2, 0, -0.8, 0][i]}deg` }}>
              <p className="slip-file">{s.file}</p>
              <ul className="slip-lines">
                {s.lines.slice(0, 3).map((l) => <li key={l}>{l}</li>)}
              </ul>
              <span className="sr-only">{active ? "Ezt megkapja." : "Ehhez a programhoz nem kell."}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
