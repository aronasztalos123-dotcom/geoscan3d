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
  email: "asztalos69@gmail.com",
  domain: "[DOMAIN]", // pl. geoscan3d.hu, https:// nélkül
  logo: "/brand/geoscan3d-logo.svg",
  demoUrl: "[3D DEMÓ LINK]",
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
