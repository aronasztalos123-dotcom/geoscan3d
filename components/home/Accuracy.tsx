import Link from "next/link";
import { accuracy } from "@/lib/content";

/** A pontosság és a határa egy helyen: a ±2 cm, mire elég, és mire nem ezt javaslom. */
export function Accuracy() {
  return (
    <section className="sec acc-sec" aria-labelledby="acc-h">
      <div className="wrap acc" data-reveal>
        <div className="acc-fig" data-r>
          <p className="acc-big num" aria-hidden="true">±2<span>cm</span></p>
          <p className="acc-sub">Mindenhol a bejárt térben, nem csak néhány lemért ponton.</p>
        </div>
        <div className="acc-copy">
          <h2 id="acc-h" className="t-l" data-r>Mire elég a <span style={{ whiteSpace: "nowrap" }}>±2 cm</span>, és mire nem.</h2>
          <div className="acc-lists">
            <div data-r>
              <h3 className="acc-k">Erre elég</h3>
              <ul className="acc-list acc-yes">
                {accuracy.yes.map((y) => <li key={y}>{y}</li>)}
              </ul>
            </div>
            <div data-r>
              <h3 className="acc-k">Erre nem ezt javaslom</h3>
              <ul className="acc-list acc-no">
                {accuracy.no.map((n) => <li key={n}>{n}</li>)}
              </ul>
              <p className="acc-note">Ahol milliméter kell, ott ezt előre megmondom, az ajánlat előtt.</p>
            </div>
          </div>
          <p data-r>
            <Link href="/modszer" className="arrow-link">A módszer és a pontosság <span className="ar" aria-hidden="true">→</span></Link>
          </p>
        </div>
      </div>
    </section>
  );
}
