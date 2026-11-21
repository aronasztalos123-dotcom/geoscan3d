import type { MetadataRoute } from "next";
import { services } from "@/lib/services";
import { siteUrl } from "@/lib/site";

/**
 * Tartalom utolsó érdemi módosítása. Ha egy oldal szövege változik, ezt frissítse; a build ideje nem jó jel,
 * mert minden deploynál "megváltozottnak" mutatná az összes oldalt, és a Google megtanulja figyelmen kívül hagyni.
 */
const updated = new Date("2026-11-21");

export default function sitemap(): MetadataRoute.Sitemap {
  const abs = (p: string) => `${siteUrl}${p}`;
  const page = (path: string, priority: number, images: string[] = []) => ({
    url: abs(path),
    lastModified: updated,
    changeFrequency: "monthly" as const,
    priority,
    ...(images.length ? { images: images.map(abs) } : {}),
  });
  return [
    page("/", 1, ["/og.jpg", "/video/hero-poster.webp"]),
    page("/szolgaltatasok", 0.9, ["/img/scan/pontfelho-apszis.webp"]),
    ...services.map((s) => page(`/szolgaltatasok/${s.slug}`, 0.9, [s.image.src])),
    page("/modszer", 0.8, ["/img/scan/pontfelho-fak.webp"]),
    page("/mit-kap", 0.8, ["/img/scan/pontfelho-felulrol.webp"]),
    page("/arkalkulator", 0.8),
    page("/kapcsolat", 0.8),
    page("/rolam", 0.7),
    page("/gyik", 0.7, ["/img/illesztopont.webp"]),
  ];
}
