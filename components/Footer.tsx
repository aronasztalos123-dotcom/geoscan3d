import Link from "next/link";
import { Logo } from "./Logo";
import { ConsentLink } from "./Analytics";
import { services } from "@/lib/services";
import { mailHref, nav, site, telHref } from "@/lib/site";

/** Lábléc: három hasáb fent, a logó teljes szélességben lent. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-cols">
          <div>
            <h2>Elérhetőség</h2>
            <p className="strong">{site.owner}</p>
            <p>földmérő</p>
            <ul style={{ marginTop: 14 }}>
              <li><a href={telHref}>{site.phoneDisplay}</a></li>
              <li><a href={mailHref}>{site.email}</a></li>
            </ul>
          </div>
          <nav aria-labelledby="f-old">
            <h2 id="f-old">Oldalak</h2>
            <ul>
              {nav.map((n) => <li key={n.href}><Link href={n.href}>{n.label}</Link></li>)}
              <li><Link href="/kapcsolat">Kapcsolat, ajánlatkérés</Link></li>
            </ul>
          </nav>
          <nav aria-labelledby="f-szolg">
            <h2 id="f-szolg">Szolgáltatások</h2>
            <ul>
              {services.map((s) => <li key={s.slug}><Link href={`/szolgaltatasok/${s.slug}`}>{s.name}</Link></li>)}
            </ul>
          </nav>
        </div>

        <div className="foot-mark" aria-hidden="true">
          <Logo tone="dark" />
        </div>

        <div className="foot-legal">
          <p>© {year} {site.brand}. <Link href="/adatkezeles">Adatkezelés</Link> · <ConsentLink /></p>
          <p className="foot-credit">Weboldal: AronDigital</p>
        </div>
      </div>
    </footer>
  );
}
