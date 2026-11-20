import type { Metadata } from "next";
import { isSet, site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Adatkezelési tájékoztató",
  description: "Hogyan kezeli a Geoscan3D az ajánlatkérő űrlapon megadott nevet, telefonszámot és e-mail-címet, és meddig őrzi.",
  path: "/adatkezeles",
  noindex: true,
});

// TODO(ügyfél): jogász által ellenőrzött, végleges tájékoztató. Ez a vázlat csak a tényleges adatkezelést írja le.
export default function Privacy() {
  const v = (x: string) => (isSet(x) ? x : x);
  return (
    <section className="sec" style={{ paddingTop: "calc(var(--nav-h) + 72px)" }}>
      <div className="wrap legal">
        <h1 className="t-xl">Adatkezelési tájékoztató</h1>
        <p className="legal-draft">Vázlat. Közzététel előtt a szolgáltató véglegesíti.</p>
        <h2>Ki kezeli az adatait</h2>
        <p>{v(site.brand)}, képviseli: {v(site.owner)}. Elérhetőség: {v(site.email)}, {v(site.phoneDisplay)}.</p>
        <h2>Milyen adatot kérünk és miért</h2>
        <p>
          Az ajánlatkérő űrlapon megadott nevet, telefonszámot, e-mail-címet, a felmérés helyszínét, becsült méretét és az
          üzenetet kizárólag az ajánlat elkészítéséhez és a kapcsolatfelvételhez használom.
        </p>
        <h2>Meddig őrzöm</h2>
        <p>[MEGŐRZÉSI IDŐ] Ha nem jön létre megbízás, az adatokat a megadott idő után törlöm.</p>
        <h2>Kinek adom át</h2>
        <p>
          Senkinek. Az űrlap üzenete e-mailben érkezik; a levélküldést a Resend (Resend, Inc.) szolgáltatás végzi, a
          weboldalt a Vercel (Vercel Inc.) üzemelteti.
        </p>
        <h2>Az Ön jogai</h2>
        <p>
          Kérheti az adatai megismerését, helyesbítését vagy törlését a fenti elérhetőségen. Panaszával a Nemzeti
          Adatvédelmi és Információszabadság Hatósághoz (NAIH) fordulhat.
        </p>
        <h2>Sütik és látogatottságmérés</h2>
        <p>
          Ha a sütisávon az „Elfogadom” gombot választja, az oldal a Google Analytics (Google Ireland Ltd.) segítségével
          méri, mely oldalakat nézik meg és honnan érkeznek a látogatók. Ehhez a Google sütiket (_ga, _ga_*) helyez el,
          legfeljebb 14 hónapig. Hirdetési célú süti nincs. Ha nem fogadja el, a Google Analytics be sem töltődik.
          A döntését a lábléc „Sütibeállítások” gombjával bármikor megváltoztathatja; a döntést a böngészője helyi
          tárolójában jegyzem meg.
        </p>
      </div>
    </section>
  );
}
