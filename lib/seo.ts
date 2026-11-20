import type { Metadata } from "next";
import { site } from "./site";

const defaultImage = { url: "/og.jpg", width: 1200, height: 630, alt: `${site.brand}: 3D lézerszkennelés és épületfelmérés földmérőtől` };

/**
 * Teljes metaadat egy oldalhoz. A Next a szegmensek metaadatát csak sekélyen fésüli össze, ezért az openGraph-ot
 * és a twittert minden oldal itt kapja meg egészben; különben az aloldalak a kezdőlap og:url/og:title értékét örökölnék.
 */
export function pageMeta({
  title,
  description,
  path,
  image,
  ogTitle,
  noindex,
  absoluteTitle,
}: {
  title: string;
  description: string;
  path: string;
  image?: { url: string; alt: string; width?: number; height?: number };
  /** Ha a közösségi megosztásban más cím kell, mint a <title>. */
  ogTitle?: string;
  noindex?: boolean;
  /** A sablon (`| Geoscan3D`) nélküli cím. */
  absoluteTitle?: boolean;
}): Metadata {
  const images = [image ?? defaultImage];
  const shareTitle = ogTitle ?? (absoluteTitle ? title : `${title} | ${site.brand}`);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "hu_HU",
      siteName: site.brand,
      url: path,
      title: shareTitle,
      description,
      images,
    },
    twitter: { card: "summary_large_image", title: shareTitle, description, images: images.map((i) => i.url) },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
