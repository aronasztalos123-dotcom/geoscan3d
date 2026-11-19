import type { MetadataRoute } from "next";
import { cities } from "@/lib/cities";
import { services } from "@/lib/services";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number) => ({ url: `${siteUrl}${path}`, lastModified: now, changeFrequency: "monthly" as const, priority });
  return [
    page("/", 1),
    page("/szolgaltatasok", 0.9),
    ...services.map((s) => page(`/szolgaltatasok/${s.slug}`, 0.9)),
    page("/modszer", 0.8),
    page("/mit-kap", 0.8),
    page("/rolam", 0.7),
    page("/gyik", 0.7),
    page("/arkalkulator", 0.8),
    page("/kapcsolat", 0.8),
    ...cities.map((c) => page(`/lezerszkenneles/${c.slug}`, 0.7)),
  ];
}
