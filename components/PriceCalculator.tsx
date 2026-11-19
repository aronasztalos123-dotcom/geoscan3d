"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { estimate, fmtFt, fmtNum, priceServices, travelZones, urgent } from "@/lib/pricing";

/** Irányár-kalkulátor: szolgáltatás, mennyiség, kiegészítők, kiszállás, sürgősség. */
export function PriceCalculator() {
  const uid = useId();
  const [slug, setSlug] = useState(priceServices[0].slug);
  const svc = priceServices.find((s) => s.slug === slug)!;
  const [qtyBy, setQtyBy] = useState<Record<string, number>>({});
  const [extrasBy, setExtrasBy] = useState<Record<string, string[]>>({});
  const [zone, setZone] = useState(travelZones[0].id);
  const [isUrgent, setUrgent] = useState(false);

  const qty = qtyBy[slug] ?? svc.qty.initial;
  const extras = extrasBy[slug] ?? [];
  const setQty = (n: number) => {
    if (Number.isNaN(n)) return;
    setQtyBy((q) => ({ ...q, [slug]: Math.min(svc.qty.max, Math.max(svc.qty.min, Math.round(n))) }));
  };
  const toggleExtra = (id: string) =>
    setExtrasBy((e) => ({ ...e, [slug]: extras.includes(id) ? extras.filter((x) => x !== id) : [...extras, id] }));

  const result = estimate(svc, qty, extras, zone, isUrgent);

  const summary = [
    `Irányár a kalkulátorból: ${fmtFt(result.low)} – ${fmtFt(result.high)} + ÁFA`,
    `${svc.short}, ${fmtNum(qty)} ${svc.unit}`,
    ...svc.extras.filter((x) => extras.includes(x.id)).map((x) => `+ ${x.label}`),
    isUrgent ? `+ ${urgent.label}` : "",
    `Kiszállás: ${travelZones.find((z) => z.id === zone)?.label}`,
  ].filter(Boolean).join("\n");
  const quoteHref = `/kapcsolat?szolgaltatas=${svc.slug}&becsles=${encodeURIComponent(summary)}`;

  return (
    <div className="calc">
      <div className="calc-q">
        <fieldset className="calc-step">
          <legend><span className="calc-n">1</span>Mit kell felmérni?</legend>
          <div className="picker-chips">
            {priceServices.map((s) => (
              <button key={s.slug} type="button" className="chip" aria-pressed={s.slug === slug} onClick={() => setSlug(s.slug)}>
                {s.short}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="calc-step">
          <legend><span className="calc-n">2</span><label htmlFor={`${uid}-qty`}>{svc.qtyLabel}</label></legend>
          <div className="calc-qty">
            <input
              type="range"
              min={svc.qty.min}
              max={Math.min(svc.qty.max, svc.qty.initial * 10)}
              step={svc.qty.step}
              value={Math.min(qty, svc.qty.initial * 10)}
              onChange={(e) => setQty(Number(e.target.value))}
              aria-label={`${svc.qtyLabel}, csúszka`}
            />
            <div className="calc-num">
              <input id={`${uid}-qty`} type="number" inputMode="numeric" min={svc.qty.min} max={svc.qty.max} step={svc.qty.step} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
              <span>{svc.unit}</span>
            </div>
          </div>
        </fieldset>

        <fieldset className="calc-step">
          <legend><span className="calc-n">3</span>Kiegészítők</legend>
          <ul className="calc-incl" aria-label="Az árban benne van">
            {svc.included.map((t) => <li key={t}>{t}</li>)}
          </ul>
          <div className="picker-chips">
            {svc.extras.map((x) => (
              <button key={x.id} type="button" className="chip" aria-pressed={extras.includes(x.id)} onClick={() => toggleExtra(x.id)}>
                {extras.includes(x.id) ? "✓ " : "+ "}{x.label}
              </button>
            ))}
            <button type="button" className="chip" aria-pressed={isUrgent} onClick={() => setUrgent((u) => !u)}>
              {isUrgent ? "✓ " : "+ "}{urgent.label}
            </button>
          </div>
        </fieldset>

        <fieldset className="calc-step">
          <legend><span className="calc-n">4</span>Hol van a helyszín?</legend>
          <div className="picker-chips">
            {travelZones.map((z) => (
              <button key={z.id} type="button" className="chip" aria-pressed={z.id === zone} onClick={() => setZone(z.id)}>
                {z.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <aside className="calc-a" aria-live="polite" aria-label="Becsült ár">
        <span className="calc-k">Irányár, nettó</span>
        <p className="calc-total">
          {fmtNum(result.low)}<span className="calc-dash">–</span>{fmtNum(result.high)} <small>Ft</small>
        </p>
        <p className="calc-vat">+ 27% ÁFA</p>
        <ul className="calc-lines">
          {result.lines.map((l) => (
            <li key={l.label}><span>{l.label}</span><b>{l.amount ? fmtFt(Math.round(l.amount / 100) * 100) : "díjmentes"}</b></li>
          ))}
        </ul>
        <p className="calc-note">Becslés, nem ajánlat. A végleges árat a helyszín és a kért rajzok ismeretében, a munka előtt írásban adom meg.</p>
        <Link href={quoteHref} className="btn btn-lime">Ajánlatot kérek erre <span className="ar" aria-hidden="true">→</span></Link>
      </aside>
    </div>
  );
}
