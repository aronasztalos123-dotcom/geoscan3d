import { services, type Service } from "./services";
import { isSet, site, siteUrl } from "./site";

const id = `${siteUrl}/#ceg`;
const personId = `${siteUrl}/#foldmero`;
const websiteId = `${siteUrl}/#weboldal`;
const abs = (p: string) => (p.startsWith("http") ? p : `${siteUrl}${p}`);

/** A szolgáltatási terület városai (csak a strukturált adathoz). */
const areaCities = ["Miskolc", "Eger", "Gyöngyös", "Hatvan", "Gödöllő", "Budapest"];
const areaRegions = ["Borsod-Abaúj-Zemplén vármegye", "Heves vármegye", "Pest vármegye"];

/** LocalBusiness (ProfessionalService), szolgáltatási terület alapon. Helykitöltő mező nem kerül bele. */
export function businessSchema() {
  const s: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": id,
    name: isSet(site.brand) ? site.brand : "3D lézerszkennelés és épületfelmérés",
    alternateName: ["Geoscan 3D", site.domain.replace(/^www\./, ""), `${site.brand} földmérés`],
    // Entitás-leírás AI-asszisztenseknek: ki, mit, hol, egy mondatban.
    description:
      `A ${site.brand} ${site.owner} földmérő szolgáltatása: kézi SLAM lézerszkenneres épületfelmérés Borsod-Abaúj-Zemplénben és az M3 mentén Budapestig (Miskolc, Eger, Gyöngyös, Hatvan, Gödöllő). As-Built alaprajz, 3D virtuális bejárás, térfogatszámítás, közmű-állapotrögzítés és tetőfelmérés, EOV-ba illesztve.`,
    url: siteUrl,
    image: `${siteUrl}/og.jpg`,
    areaServed: [
      ...areaRegions.map((name) => ({ "@type": "AdministrativeArea", name })),
      ...areaCities.map((name) => ({ "@type": "City", name })),
    ],
    knowsLanguage: "hu",
    currenciesAccepted: "HUF",
    knowsAbout: [
      "lézerszkennelés", "3D szkennelés", "épületfelmérés", "alaprajz készítés", "pontfelhő", "As-Built felmérés",
      "EOV", "földmérés", "Gaussian Splatting", "térfogatszámítás", "tetőfelmérés",
    ],
    slogan: "Egy bejárás, és kész a rajz.",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Szolgáltatások",
      itemListElement: services.map((sv) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: sv.name, url: `${siteUrl}/szolgaltatasok/${sv.slug}` },
      })),
    },
  };
  if (isSet(site.phoneHref)) s.telephone = site.phoneHref;
  if (isSet(site.email)) s.email = site.email;
  if (isSet(site.logo)) s.logo = { "@type": "ImageObject", url: abs(site.logo) };
  if (isSet(site.phoneHref) || isSet(site.email)) {
    s.contactPoint = {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "hu",
      areaServed: "HU",
      ...(isSet(site.phoneHref) ? { telephone: site.phoneHref } : {}),
      ...(isSet(site.email) ? { email: site.email } : {}),
    };
  }
  if (isSet(site.owner)) s.founder = { "@id": personId };
  if (site.address) {
    s.address = {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.zip,
      addressLocality: site.address.city,
      addressCountry: "HU",
    };
  }
  return s;
}

/** A földmérő mint személy; a /rolam oldal és a cég founder mezője erre hivatkozik. */
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: site.owner,
    jobTitle: "Földmérő",
    hasOccupation: { "@type": "Occupation", name: "Földmérő", occupationLocation: { "@type": "Country", name: "Magyarország" } },
    worksFor: { "@id": id },
    url: `${siteUrl}/rolam`,
    knowsAbout: ["földmérés", "lézerszkennelés", "EOV", "épületfelmérés"],
    ...(isSet(site.license) ? { identifier: site.license } : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    url: siteUrl,
    name: site.brand,
    // A Google ebből választja a találatban megjelenő webhelynevet (a Noble Drinksnél bevált minta).
    alternateName: [`${site.brand} lézerszkennelés`, "Geoscan 3D", site.domain.replace(/^www\./, "")],
    inLanguage: "hu-HU",
    publisher: { "@id": id },
  };
}

export function serviceSchema(sv: Service, areaName?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/szolgaltatasok/${sv.slug}#szolgaltatas`,
    name: sv.name,
    serviceType: sv.name,
    alternateName: sv.seoTitle,
    description: sv.seoDescription,
    image: abs(sv.image.src),
    category: "Földmérés, épületfelmérés",
    audience: { "@type": "Audience", audienceType: sv.forWhom },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/kapcsolat?szolgaltatas=${sv.slug}`,
      priceCurrency: "HUF",
      availability: "https://schema.org/InStock",
      description: "Egyedi, írásos ajánlat a munka előtt.",
    },
    provider: { "@id": id },
    areaServed: areaName
      ? { "@type": "City", name: areaName }
      : areaCities.map((name) => ({ "@type": "City", name })),
    url: `${siteUrl}/szolgaltatasok/${sv.slug}`,
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${siteUrl}${it.path}` })),
  };
}

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
