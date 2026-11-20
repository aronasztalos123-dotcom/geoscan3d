import Link from "next/link";
import { accuracy } from "@/lib/content";

/** Geodéziai illesztőpontos pontosítás menete (felár ellenében kérhető). */
const gcp = [
  { t: "Jelek kihelyezése", p: "Fekete-fehér illesztőpont-jeleket teszek a falakra és a terepre, néhány méterenként, hogy a szkenner mindegyiket lássa." },
  { t: "Bemérés mérőállomással vagy GNSS-szel", p: "A jelek EOV koordinátáját geodéziai műszerrel mérem be, milliméteres nagyságrendű pontossággal." },
  { t: "Szkennelés zárt körökben", p: "A bejárás minden jelen áthalad, és ahol elindult, ott ér véget." },
  { t: "Illesztés és ellenőrzés", p: "A pontfelhőt a bemért pontokra kényszerítem, így a hosszú bejárás csúszása kiesik. Az eltéréseket pontonként ellenőrzöm és átadom." },
];

/** A pontosság és a határa: akár 1 cm illesztőpontokkal, alapból ±2 cm; mire elég, és hogyan lesz pontosabb. */
export function Accuracy() {
  return (
    <section className="sec acc-sec" aria-labelledby="acc-h">
      <div className="wrap" data-reveal>
        <div className="acc">
          <div className="acc-fig" data-r>
            <div className="acc-fig-row">
              <p className="acc-k-dark">Geodéziai illesztőpontokkal</p>
              <p className="acc-big num"><small>akár</small>1<span>cm</span></p>
            </div>
            <div className="acc-fig-row acc-fig-plus">
              <p className="acc-k-dark">Alapfelmérés</p>
              <p className="acc-mid num">±2<span>cm</span></p>
            </div>
            <p className="acc-sub">Mindenhol a bejárt térben, nem csak néhány lemért ponton.</p>
          </div>

          <div className="acc-copy">
            <div className="acc-intro" data-r>
              <h2 id="acc-h" className="t-l">Mire elég az <span style={{ whiteSpace: "nowrap" }}>akár 1 cm</span>, és mire nem.</h2>
              <p className="muted">
                A kézi szkenner menet közben számolja a saját helyét. Egy háznyi bejárásnál ez ±2&nbsp;cm-en belül marad,
                hosszú, nagy területen viszont lassan elcsúszhat. Ezt fogják meg az illesztőpontok.
              </p>
            </div>
            <div className="acc-lists">
              <div data-r>
                <h3 className="acc-k">Erre elég</h3>
                <ul className="acc-list acc-yes">
                  {accuracy.yes.map((y) => <li key={y}>{y}</li>)}
                  <li>Nagy épület, csarnok, telek EOV-ban <small>illesztőpontokkal</small></li>
                </ul>
              </div>
              <div data-r>
                <h3 className="acc-k">Erre nem ezt javaslom</h3>
                <ul className="acc-list acc-no">
                  {accuracy.no.map((n) => <li key={n}>{n}</li>)}
                </ul>
                <p className="acc-note">Ahol milliméter kell, ott ezt előre megmondom, az ajánlat előtt. Ezen az illesztőpont sem változtat.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="acc-plus" data-r>
          <div className="acc-plus-head">
            <span className="acc-plus-tag">Felár ellenében</span>
            <h3>Pontosabb kell? Így lesz belőle akár 1&nbsp;cm.</h3>
            <p>
              A szkenner saját mérése nem lesz élesebb, de a hibája nem halmozódik: néhány méterenként egy geodéziailag
              bemért pont rögzíti a pontfelhőt. Így a teljes épület, a csarnok vagy a telek egyben is pontos, és pontosan
              a helyén ül EOV-ban.
            </p>
          </div>
          <ol className="acc-steps">
            {gcp.map((s, i) => (
              <li key={s.t}>
                <span className="acc-n num">{String(i + 1).padStart(2, "0")}</span>
                <b>{s.t}</b>
                <span>{s.p}</span>
              </li>
            ))}
          </ol>
          <p className="acc-src">
            Szakirodalmi mérésekben az illesztőpontokra kötött SLAM pontfelhők eltérése 1–2 cm körül volt. A pontos értéket a helyszín ismeretében, az ajánlatban írom meg.
          </p>
        </div>

        <p className="acc-more" data-r>
          <Link href="/modszer" className="arrow-link">A módszer és a pontosság <span className="ar" aria-hidden="true">→</span></Link>
        </p>
      </div>
    </section>
  );
}
