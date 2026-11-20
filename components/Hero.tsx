"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { site } from "@/lib/site";

/**
 * Kezdőlapi hero: hurkolt háttérvideó (egy kápolna pontfelhője és 3D modellje), középen a logó a névvel
 * és egyetlen sor. Semmi más: a cselekvés a menüsávban él.
 * Csökkentett mozgásnál a videó nem indul, a poszterkép marad. Ha a hero kiér a képből, a videó megáll.
 */
export function Hero() {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Telefonon a 720p változat, máshol az eredeti 1080p, újratömörítés nélkül.
    v.src = window.matchMedia("(max-width: 767px)").matches ? "/video/hero-720.mp4" : "/video/hero-1080.mp4";
    const onReady = () => setReady(true);
    v.addEventListener("canplay", onReady, { once: true });
    v.play().catch(() => {});

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => {
      io.disconnect();
      v.removeEventListener("canplay", onReady);
    };
  }, []);

  return (
    <section className="hero" aria-labelledby="hero-h">
      <div className="hero-media" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/video/hero-poster.webp" alt="" fetchPriority="high" decoding="async" />
        <video ref={ref} muted loop playsInline preload="none" poster="/video/hero-poster.webp" data-ready={ready} />
      </div>

      <div className="hero-center">
        <h1 id="hero-h" className="hero-title">
          <span className="sr-only">{site.brand}: épületfelmérés és 3D lézerszkennelés földmérőtől</span>
          <Logo tone="dark" />
        </h1>
        <p className="hero-sub">Épületfelmérés lézerszkennerrel: kész alaprajz, metszet és 3D bejárás.</p>
      </div>
    </section>
  );
}
