import { itinerary } from "@/lib/content";

/** A munka menete egy cédulán, a pasztell színskála-mezőn. */
export function Process() {
  return (
    <section id="folyamat" className="sec sec-ramp proc" aria-labelledby="proc-h">
      <div className="wrap proc-grid" data-reveal>
        <div className="proc-text">
          <h2 id="proc-h" className="t-head" data-r>Hogyan dolgozom</h2>
          <p className="t-lead" data-r>Írásos ajánlat a munka előtt.</p>
        </div>
        <div className="slip-sheet" data-r>
          <dl>
            {itinerary.map(([what, val]) => (
              <div key={what} className="it-row">
                <dt>{what}</dt>
                <span className="it-dots" aria-hidden="true" />
                <dd className="tnum">{val}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
