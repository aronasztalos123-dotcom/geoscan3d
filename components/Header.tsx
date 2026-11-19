"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { nav, site, telHref } from "@/lib/site";

/**
 * Üveges sáv a hero fölött; görgetés után papírszínű, tömör sáv.
 * A kezdőlapon a márkajel addig rejtve marad, amíg a hero közepén a nagy logó látszik.
 */
export function Header() {
  const path = usePathname();
  const home = path === "/";
  const [solid, setSolid] = useState(false);
  const [pastLogo, setPastLogo] = useState(!home);
  // A menü ahhoz az oldalhoz tartozik, ahol kinyitották: oldalváltáskor magától bezárul.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === path;
  const setOpen = (v: boolean | ((o: boolean) => boolean)) =>
    setOpenOn((typeof v === "function" ? v(open) : v) ? path : null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 24);
      setPastLogo(!home || y > window.innerHeight * 0.42);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [home]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenOn(null);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const isCurrent = (href: string) => path === href || path.startsWith(`${href}/`);

  return (
    <>
      <header className="nav" data-solid={solid && !open} data-hide-brand={!pastLogo && !open} data-open={open}>
        <div className="nav-in">
          <Link href="/" className="nav-brand" aria-label={`${site.brand}, kezdőlap`}>
            <Logo tone="dark" />
          </Link>
          <nav className="nav-links" aria-label="Fő menü">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} aria-current={isCurrent(n.href) ? "page" : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="nav-end">
            <a href={telHref} className="nav-tel">
              <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" fill="currentColor" />
              </svg>
              {site.phoneDisplay}
            </a>
            <Link href="/kapcsolat" className="btn btn-lime btn-sm nav-cta">Ajánlatot kérek</Link>
            <button
              type="button"
              className="nav-burger"
              aria-expanded={open}
              aria-controls="menu-sheet"
              aria-label={open ? "Menü bezárása" : "Menü megnyitása"}
              onClick={() => setOpen((o) => !o)}
            >
              <span /><span />
            </button>
          </div>
        </div>
      </header>

      <div id="menu-sheet" className="sheet" data-open={open} aria-hidden={!open} inert={!open}>
        <nav className="sheet-links" aria-label="Menü">
          {[{ href: "/", label: "Kezdőlap" }, ...nav, { href: "/kapcsolat", label: "Kapcsolat" }].map((n, i) => (
            <Link key={n.href} href={n.href} style={{ ["--i" as string]: i }} aria-current={path === n.href ? "page" : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="sheet-foot">
          <a href={telHref}>{site.phoneDisplay}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <Link href="/kapcsolat" className="btn btn-lime">Ajánlatot kérek</Link>
        </div>
      </div>
    </>
  );
}
