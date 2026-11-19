import { cities } from "./cities";
import { services, type Service } from "./services";
import { isSet, site, siteUrl } from "./site";

const id = `${siteUrl}/#ceg`;

/** LocalBusiness (ProfessionalService), szolgáltatási terület alapon. Helykitöltő mező nem kerül bele. */
export function businessSchema() {
  const s: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": id,
    name: isSet(site.brand) ? site.brand : "3D lézerszkennelés és épületfelmérés",
    description:
      "Kézi SLAM lézerszkenneres épületfelmérés jogosult földmérőtől: As-Built alaprajz, 3D virtuális bejárás, térfogatszámítás, közmű-állapotrögzítés és tetőfelmérés, EOV-ba illesztve.",
    url: siteUrl,
    image: `${siteUrl}/og.jpg`,
    areaServed: [
      { "@type": "AdministrativeArea", name: "Borsod-Abaúj-Zemplén vármegye" },
      ...cities.map((c) => ({ "@type": "City", name: c.name })),
    ],
    knowsAbout: ["lézerszkennelés", "pontfelhő", "As-Built felmérés", "EOV", "Gaussian Splatting", "térfogatszámítás"],
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
  if (isSet(site.logo)) s.logo = site.logo;
  if (isSet(site.owner)) s.founder = { "@type": "Person", name: site.owner, jobTitle: "Földmérő" };
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

export function serviceSchema(sv: Service, areaName?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: sv.name,
    serviceType: sv.name,
    description: sv.seoDescription,
    provider: { "@id": id },
    areaServed: areaName
      ? { "@type": "City", name: areaName }
      : cities.map((c) => ({ "@type": "City", name: c.name })),
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
