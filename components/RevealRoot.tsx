"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Szakaszok belépő mozgása: a [data-reveal] konténer [data-r] gyerekei egymás után (80 ms) emelkednek be, egyszer.
 * Script nélkül minden látható, mert a rejtett kezdőállapot csak a html.js osztály alatt él.
 * Ha valaki átugrik egy szakaszt (horgony, gyors görgetés), a görgetés-figyelő azt is láthatóvá teszi.
 */
export function RevealRoot() {
  const path = usePathname();
  useEffect(() => {
    document.documentElement.classList.add("js");
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-in])"));
    const show = (el: HTMLElement) => {
      el.dataset.in = "true";
      io.unobserve(el);
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) show(e.target as HTMLElement);
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    els.forEach((el) => {
      el.querySelectorAll<HTMLElement>("[data-r]").forEach((c, i) => c.style.setProperty("--i", String(i)));
      io.observe(el);
    });

    let raf = 0;
    const sweep = () => {
      raf = 0;
      const limit = window.innerHeight * 0.92;
      for (const el of els) if (!el.dataset.in && el.getBoundingClientRect().top < limit) show(el);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sweep);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    sweep();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [path]);
  return null;
}
