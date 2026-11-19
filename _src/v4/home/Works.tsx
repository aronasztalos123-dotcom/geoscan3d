"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

type Item = { slug: string; name: string; lead: string; tag: string };

/**
 * Öt munka egy pakliban. Asztali gépen a görgetés behúzza a következő lapot, a korábbiak
 * gerinccé szűkülnek a bal szélen; egy gerincre kattintva a lap visszajön. Telefonon egymás alatt.
 */
export function Works({ items }: { items: Item[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  useEffect(() => {
    const wrap = wrapRef.current!, deck = deckRef.current!;
    const cards = Array.from(deck.querySelectorAll<HTMLElement>(".work"));
    const mq = window.matchMedia("(min-width: 900px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;

    const layout = () => {
      raf = 0;
      if (!mq.matches) {
        cards.forEach((c) => (c.style.transform = ""));
        return;
      }
      const r = wrap.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, span))) * (cards.length - 1);
      progress.current = p;
      const S = parseFloat(getComputedStyle(deck).getPropertyValue("--spine")) || 120;
      const W = deck.clientWidth;
      const xs = cards.map((_, i) => {
        let t = i === 0 ? 1 : Math.min(1, Math.max(0, p - (i - 1)));
        if (reduce.matches) t = t > 0.5 ? 1 : 0;
        return i === 0 ? 0 : W + (i * S - W) * (1 - Math.pow(1 - t, 3));
      });
      cards.forEach((c, i) => {
        c.style.transform = `translate3d(${xs[i].toFixed(1)}px,0,0)`;
        const next = xs[i + 1];
        c.dataset.spine = String(next !== undefined && next < xs[i] + c.offsetWidth - 2);
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(layout);
    };
    layout();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    mq.addEventListener("change", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      mq.removeEventListener("change", schedule);
    };
  }, []);

  /** A lapot előre hozza: görget addig, ahol ő a legfelső. */
  const bring = (i: number) => {
    const wrap = wrapRef.current;
    if (!wrap || !window.matchMedia("(min-width: 900px)").matches) return;
    const n = items.length - 1;
    const span = wrap.offsetHeight - window.innerHeight;
    const top = wrap.getBoundingClientRect().top + window.scrollY;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: top + (span * i) / n + 2, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section id="szolgaltatasok" className="works sec-ink" aria-labelledby="works-h">
      <div className="wrap works-head">
        <h2 id="works-h" className="t-head">Más munkák</h2>
      </div>
      <div ref={wrapRef} className="works-wrap" style={{ ["--n" as string]: items.length }}>
        <div className="works-stage">
          <div className="wrap works-inner">
            <div ref={deckRef} className="works-deck">
              {items.map((it, i) => (
                <article
                  key={it.slug}
                  className={`work work-t${i % 3}`}
                  style={{ zIndex: i + 1 }}
                  onClick={(e) => {
                    if ((e.currentTarget as HTMLElement).dataset.spine === "true") {
                      e.preventDefault();
                      bring(i);
                    }
                  }}
                  onFocus={() => {
                    if (Math.round(progress.current) !== i) bring(i);
                  }}
                >
                  <span className="work-spine" aria-hidden="true">{it.name}</span>
                  <h3 className="work-name">{it.name}</h3>
                  <p className="work-lead">{it.lead}</p>
                  <div className="work-foot">
                    <span />
                    <Link href={`/szolgaltatasok/${it.slug}`} className="link-strong">
                      Részletek<span className="sr-only">: {it.name}</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
