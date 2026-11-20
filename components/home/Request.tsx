import Link from "next/link";
import { itinerary } from "@/lib/content";
import { mailHref, site, telHref } from "@/lib/site";

/** Kezdőlapi zárás: mi történik, ha ír, és a három út (e-mail, telefon, űrlap). */
export function Request() {
  const [user, domain] = site.email.split("@");
  return (
    <section className="req" aria-labelledby="req-h">
      <div className="wrap" data-reveal>
        <div className="req-head">
          <h2 id="req-h" className="t-xl" data-r>Kérjen írásos ajánlatot.</h2>
          <p className="t-lead" data-r>
            Írjon pár mondatot a munkáról, a címet és a programot. Az árat a munka előtt, írásban kapja meg.
          </p>
        </div>

        <ol className="req-steps" aria-label="Mi történik ezután">
          {itinerary.map(([what, how], i) => (
            <li key={what} data-r>
              <span className="req-n num">{String(i + 1).padStart(2, "0")}</span>
              <b>{what}</b>
              <span>{how}</span>
            </li>
          ))}
        </ol>

        <div className="req-contact" data-r>
          <a href={mailHref} className="req-mail">
            {user}<span className="at">@</span><span className="dom">{domain}</span>
          </a>
          <div className="req-foot">
            <span>Telefon: <a href={telHref}>{site.phoneDisplay}</a></span>
            <span>{site.owner}, földmérő</span>
            <Link href="/kapcsolat" className="btn btn-lime">
              Ajánlatkérő űrlap <span className="ar" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
