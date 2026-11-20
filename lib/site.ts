/**
 * Az ügyfél adatai. A szögletes zárójeles érték helykitöltő: amíg az, a schema.org-ba NEM kerül be (lásd isSet).
 */
export const site = {
  brand: "Geoscan3D",
  owner: "Asztalos István",
  // TODO(ügyfél): jogosultsági / kamarai nyilvántartási szám, ha meg szeretné jeleníteni.
  license: "[JOGOSULTSÁGI SZÁM]",
  phoneDisplay: "06 70 425 0860",
  phoneHref: "+36704250860",
  email: "info@geoscan3d.hu",
  domain: "www.geoscan3d.hu", // https:// nélkül; a geoscan3d.hu 308-cal ide irányít, a kanonikus a www
  logo: "/brand/geoscan3d-logo.svg",
  demoUrl: "[3D DEMÓ LINK]",
  // Google Analytics 4 mérési azonosító (nyilvános, a böngészőben is látszik). Helykitöltőként a GA ki van kapcsolva.
  gaId: "G-44DSM38ZG6",
  // TODO(ügyfél): székhely, ha nyilvános. Üresen hagyva a schema areaServed alapú marad.
  address: null as null | { street: string; zip: string; city: string },
  area: "Borsod-Abaúj-Zemplén és az M3 mentén Budapestig",
};

/** Igaz, ha az érték már nem [HELYKITÖLTŐ]. */
export function isSet(value: string | null | undefined): value is string {
  return !!value && !/^\[.*\]$/.test(value.trim());
}

const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
export const siteUrl = isSet(site.domain)
  ? `https://${site.domain}`
  : process.env.NEXT_PUBLIC_SITE_URL || (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3340");

export const telHref = `tel:${site.phoneHref}`;
export const mailHref = `mailto:${site.email}`;

export const nav = [
  { href: "/szolgaltatasok", label: "Szolgáltatások" },
  { href: "/modszer", label: "Módszer" },
  { href: "/mit-kap", label: "Mit kap" },
  { href: "/rolam", label: "Rólam" },
  { href: "/gyik", label: "GYIK" },
  { href: "/arkalkulator", label: "Árkalkulátor" },
];

/**
 * Csak az éles telepítés indexelhető. Vercel preview/development URL-ek noindexet kapnak,
 * hogy ne versenyezzenek a geoscan3d.hu-val a találatokban.
 */
export const isProduction = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : process.env.NODE_ENV === "production";
