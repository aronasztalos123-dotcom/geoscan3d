import { Demo } from "./Demo";
import { FormatPicker } from "./FormatPicker";

/** Mit kap kézhez: fent a három eredmény képe, alatta a fájlok a látogató programja szerint. */
export function Formats() {
  return (
    <section id="formatumok" className="sec sec-paper fmts" aria-labelledby="fmt-h">
      <div className="wrap">
        <div className="sec-head" data-reveal>
          <h2 id="fmt-h" className="h-head" data-r>Mit kap kézhez</h2>
          <p className="t-lead" data-r>
            A rajzot abban a formátumban kapja, amit a saját programja megnyit. A nyers pontfelhőt csak akkor, ha kéri.
          </p>
        </div>
        <Demo />
        <FormatPicker />
      </div>
    </section>
  );
}
