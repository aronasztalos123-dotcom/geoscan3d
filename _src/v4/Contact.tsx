import Image from "next/image";
import { isSet, mailHref, site, telHref } from "@/lib/site";
import { QuoteForm } from "./QuoteForm";

/** Ajánlatkérő lap egy régi borsodi ház fotóján. A lap tömör, a fotó fókusza szabadon marad. */
export function Contact({ defaultService, defaultPlace, title = "Kérjen ajánlatot" }: { defaultService?: string; defaultPlace?: string; title?: string }) {
  return (
    <section id="ajanlat" className="contact" aria-labelledby="ajanlat-h">
      <Image
        src="/img/found/mezokovesd-emlekhaz.webp"
        alt="Fehérre meszelt, nádtetős régi parasztház Mezőkövesden"
        fill
        sizes="100vw"
        className="contact-photo"
      />
      <div className="contact-card">
        <h2 id="ajanlat-h" className="t-head">{title}</h2>
        <p className="contact-lead">Pár mondat elég. Írásban válaszolok.</p>
        <p className="contact-direct">
          <a href={telHref}>{isSet(site.phoneDisplay) ? site.phoneDisplay : "[TELEFON]"}</a>
          <a href={mailHref}>{isSet(site.email) ? site.email : "[EMAIL]"}</a>
        </p>
        <QuoteForm defaultService={defaultService} defaultPlace={defaultPlace} />
      </div>
    </section>
  );
}
