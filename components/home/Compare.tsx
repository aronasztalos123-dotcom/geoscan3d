type Point = { b: string; t: string };

const manual: Point[] = [
  { b: "Lassú helyszíni munka:", t: "Egy bonyolult régi háznál 1–2 nap a helyszínen, mérőszalaggal és vázlattal." },
  { b: "Csak a lemért pontok:", t: "Ami nincs a vázlaton, az nincs meg. A ferde falat és a boltívet néhány pontból közelíti." },
  { b: "Újabb kiszállás:", t: "Ha utólag hiányzik egy parapetmagasság vagy egy gerenda, vissza kell menni a helyszínre." },
  { b: "Helyi koordináták:", t: "A rajz a helyiségekhez kötött, a telekre és a térképre kézzel kell illeszteni." },
];

const scan: Point[] = [
  { b: "20–30 perc a helyszínen:", t: "Egy bonyolult régi ház teljes bejárása. Mérőszalaggal ugyanez 1–2 nap." },
  { b: "Minden látható felület:", t: "Ferde fal, boltív, eltérő padlószint a valós alakjában, akár 1 cm-en belül, mindenhol." },
  { b: "Nincs több kiszállás:", t: "Utólag bármelyik méretet, metszetet vagy belmagasságot a pontfelhőből keresem vissza." },
  { b: "EOV koordináták:", t: "A rajz ott ül, ahol a telek, a közmű és a földhivatali térkép." },
];

const Ruler = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3.5 15.5 15.5 3.5l5 5-12 12z" />
    <path d="M7 12l2 2M10 9l1.5 1.5M13 6l2 2" />
  </svg>
);

const Scanner = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="2" />
    <path d="M12 4a8 8 0 1 0 8 8" />
    <path d="M12 8a4 4 0 1 0 4 4" />
    <path d="M13.5 10.5 20 4" />
  </svg>
);

/** Hagyományos kézi felmérés és lézerszkennelés egymás mellett, csak a briefben szereplő tényekkel. */
export function Compare() {
  return (
    <section className="sec sec-paper2" aria-labelledby="cmp-h">
      <div className="wrap" data-reveal>
        <div className="cmp-head">
          <h2 id="cmp-h" className="t-xl" data-r>Mérőszalag vagy lézerszkenner.</h2>
          <p className="t-lead muted" data-r>Ugyanaz a ház, kétféleképpen felmérve.</p>
        </div>
        <div className="cmp">
          <article className="cmp-card cmp-old" aria-labelledby="cmp-old-h" data-r>
            <header className="cmp-top">
              <span className="cmp-ico"><Ruler /></span>
              <div>
                <h3 id="cmp-old-h">Hagyományos kézi felmérés</h3>
                <p>Mérőszalag, lézeres távmérő, papírvázlat</p>
              </div>
            </header>
            <ul className="cmp-list">
              {manual.map((p) => <li key={p.b}><b>{p.b}</b> {p.t}</li>)}
            </ul>
          </article>
          <article className="cmp-card cmp-new" aria-labelledby="cmp-new-h" data-r>
            <header className="cmp-top">
              <span className="cmp-ico"><Scanner /></span>
              <div>
                <h3 id="cmp-new-h">Geoscan3D lézerszkennelés</h3>
                <p>Kézi SLAM szkenner, pontfelhő EOV-ban</p>
              </div>
            </header>
            <ul className="cmp-list">
              {scan.map((p) => <li key={p.b}><b>{p.b}</b> {p.t}</li>)}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
