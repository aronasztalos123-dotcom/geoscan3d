"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isSet, site } from "@/lib/site";

const KEY = "gs-consent";
type Choice = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function read(): Choice | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

function save(v: Choice) {
  try {
    localStorage.setItem(KEY, v);
  } catch {
    /* privát mód: a döntés csak erre a látogatásra él */
  }
}

/** A Google Analytics csak hozzájárulás után töltődik be (Consent Mode "basic"): előtte egyetlen kérés sem megy a Google-hoz. */
function loadGa(id: string) {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // A gtag.js az arguments objektumot várja, nem tömböt.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted",
  });
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);
}

/** Esemény küldése, ha a látogató engedélyezte a mérést; különben semmi. */
export function track(event: string, params?: Record<string, unknown>) {
  window.gtag?.("event", event, params);
}

/** Süti-sáv és a GA betöltése. A láblécben lévő "Sütibeállítások" gomb újra megnyitja. */
export function Analytics() {
  const id = site.gaId;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isSet(id)) return;
    const c = read();
    if (c === "granted") loadGa(id);
    // A sáv a hidratálás utáni első képkockán jelenik meg, hogy ne lassítsa az első rajzolást.
    const raf = c === null ? requestAnimationFrame(() => setOpen(true)) : 0;
    const reopen = () => setOpen(true);
    window.addEventListener("gs-consent-open", reopen);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("gs-consent-open", reopen);
    };
  }, [id]);

  if (!isSet(id) || !open) return null;

  const decide = (v: Choice) => {
    save(v);
    setOpen(false);
    if (v === "granted") loadGa(id);
    else if (window.gtag) {
      // Visszavont hozzájárulás: a mérés leáll, a következő oldalbetöltéstől a GA be sem töltődik.
      window.gtag("consent", "update", { analytics_storage: "denied" });
    }
  };

  return (
    <div className="consent" role="dialog" aria-labelledby="consent-h" aria-describedby="consent-p">
      <div className="consent-text">
        <h2 id="consent-h">Látogatottság mérése</h2>
        <p id="consent-p">
          Google Analytics-szel mérném, melyik oldalt olvassák, hogy jobbá tegyem az oldalt. Hirdetési célra nem használom.
          Részletek: <Link href="/adatkezeles">adatkezelés</Link>.
        </p>
      </div>
      <div className="consent-actions">
        <button type="button" className="btn btn-sm btn-paper" onClick={() => decide("denied")}>Elutasítom</button>
        <button type="button" className="btn btn-sm btn-paper" onClick={() => decide("granted")}>Elfogadom</button>
      </div>
    </div>
  );
}

/** Lábléc-gomb a döntés megváltoztatásához. */
export function ConsentLink() {
  if (!isSet(site.gaId)) return null;
  return (
    <button type="button" className="consent-link" onClick={() => window.dispatchEvent(new Event("gs-consent-open"))}>
      Sütibeállítások
    </button>
  );
}
