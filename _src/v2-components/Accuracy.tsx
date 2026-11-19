import { accuracy } from "@/lib/content";

export function Accuracy() {
  return (
    <section id="pontossag" className="sec sec-ink acc" aria-labelledby="acc-h">
      <div className="wrap acc-grid">
        <div className="acc-intro" data-reveal>
          <h2 id="acc-h" className="h-head" data-r>Mire elég a&nbsp;±2&nbsp;cm?</h2>
          <p className="t-lead" data-r>
            Ha milliméter kell, megmondom. Ezt az ajánlatban előre leírom, nem a rajz átadásakor derül ki.
          </p>
        </div>
        <div className="acc-lists" data-reveal>
          <div className="acc-group" data-r>
            <h3 className="acc-h">Erre elég</h3>
            <ul>
              {accuracy.yes.map((y) => (
                <li key={y} className="acc-item is-yes">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5" /></svg>
                  {y}
                </li>
              ))}
            </ul>
          </div>
          <div className="acc-group" data-r>
            <h3 className="acc-h">Ehhez milliméter kell</h3>
            <ul>
              {accuracy.no.map((n) => (
                <li key={n} className="acc-item is-no">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
