import Link from "next/link";
import { Logo } from "./Logo";
import { cities } from "@/lib/cities";
import { services } from "@/lib/services";
import { mailHref, nav, site, telHref } from "@/lib/site";

const credits = [
  { t: "Borsod vármegye térképe, 1881", by: "Zello", lic: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/w/index.php?curid=75878470" },
  { t: "Nádtetős ház, Mezőkövesd", by: "Globetrotter19", lic: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/w/index.php?curid=74524654" },
  { t: "Kisjankó Bori emlékház, Mezőkövesd", by: "Globetrotter19", lic: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/w/index.php?curid=74493994" },
];

/** Lábléc: négy hasáb fent, a logó teljes szélességben lent. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-cols">
          <div>
            <h2>Elérhetőség</h2>
            <p className="strong">{site.owner}</p>
            <p>jogosult földmérő</p>
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
          <nav aria-labelledby="f-hely">
            <h2 id="f-hely">Ahol dolgozom</h2>
            <ul>
              {cities.map((c) => <li key={c.slug}><Link href={`/lezerszkenneles/${c.slug}`}>Lézerszkennelés {c.name}</Link></li>)}
            </ul>
          </nav>
        </div>

        <div className="foot-mark" aria-hidden="true">
          <Logo tone="dark" />
        </div>

        <div className="foot-legal">
          <p>© {year} {site.brand}. <Link href="/adatkezeles">Adatkezelés</Link></p>
          <p>
            Fotók:{" "}
            {credits.map((c, i) => (
              <span key={c.url}>
                <a href={c.url} rel="noopener">{c.t}</a>, {c.by}, {c.lic}{i < credits.length - 1 ? "; " : ". "}
              </span>
            ))}
            A belső fotók illusztrációk. Weboldal: AronDigital
          </p>
        </div>
      </div>
    </footer>
  );
}
