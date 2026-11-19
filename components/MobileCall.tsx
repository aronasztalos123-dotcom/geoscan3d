"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { telHref } from "@/lib/site";

/** Telefonon alul lebegő sáv: hívás és ajánlatkérés. Az első képernyő után jelenik meg, a lábléc és az űrlap közelében eltűnik. */
export function MobileCall() {
  const path = usePathname();
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const foot = document.querySelector(".foot");
      const closing = document.querySelector(".closing");
      const vh = window.innerHeight;
      const near = (el: Element | null) => (el ? el.getBoundingClientRect().top < vh : false);
      setShown(window.scrollY > vh * 0.7 && !near(foot) && !near(closing));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [path]);
  const visible = shown && path !== "/kapcsolat";
  return (
    <div className="mcall" data-shown={visible} aria-hidden={!visible} inert={!visible}>
      <a href={telHref} className="btn btn-ghost">Hívás</a>
      <Link href="/kapcsolat" className="btn btn-lime">Ajánlatot kérek</Link>
    </div>
  );
}
