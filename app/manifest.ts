import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.brand}: 3D lézerszkennelés és épületfelmérés`,
    short_name: site.brand,
    description: "Épületfelmérés kézi lézerszkennerrel, földmérőtől. DWG alaprajz, 3D bejárás, térfogatszámítás, EOV-ban.",
    lang: "hu",
    start_url: "/",
    display: "browser",
    background_color: "#f1f2ed",
    theme_color: "#0c3c01",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
