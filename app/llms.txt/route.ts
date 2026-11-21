import { faq } from "@/lib/content";
import { services } from "@/lib/services";
import { site, siteUrl } from "@/lib/site";
import { areaFee, areas } from "@/lib/areas";
import { fmtFt } from "@/lib/pricing";

export const dynamic = "force-static";

/** llms.txt (llmstxt.org): tömör, gépi olvasásra szánt összefoglaló AI-keresőknek (ChatGPT, Perplexity, Google AI). */
export function GET() {
  const lines = [
    `# ${site.brand}`,
    "",
    `> ${site.owner} földmérő kézi lézerszkennerrel mér fel épületeket ${site.area}. A pontfelhőből kész DWG/DXF alaprajz, metszet, homlokzat, 3D virtuális bejárás és térfogatszámítás készül, illesztőpontokkal EOV-ba illesztve, akár 1 cm-es pontossággal.`,
    "",
    `- Telefon: ${site.phoneDisplay}`,
    `- E-mail: ${site.email}`,
    `- Székhely: Miskolc. Szolgáltatási terület: Borsod-Abaúj-Zemplén, Heves és Pest vármegye, az M3 mentén Budapestig`,
    "- Ár: egyedi, írásos ajánlat a munka előtt; irányár az árkalkulátorban",
    "",
    "## Hol dolgozik (földmérő Miskolcon és környékén)",
    "",
    ...areas.map((a) => `- ${a.title}: ${a.cities.join(", ")}. Kiszállás: ${areaFee(a) ? `nettó ${fmtFt(areaFee(a))}` : "díjtalan"}. ${a.text}`),
    `- Részletek: ${siteUrl}/rolam#terulet`,
    "",
    "## Szolgáltatások",
    "",
    ...services.map((s) => `- [${s.name}](${siteUrl}/szolgaltatasok/${s.slug}): ${s.seoDescription}`),
    "",
    "## Oldalak",
    "",
    `- [A módszer](${siteUrl}/modszer): kézi SLAM lézerszkennelés, pontfelhő, pontosság és határai, EOV`,
    `- [Mit kap](${siteUrl}/mit-kap): DWG, DXF, PDF, E57, LAS/LAZ, webes 3D; AutoCAD, ArchiCAD, Revit, QGIS`,
    `- [Árkalkulátor](${siteUrl}/arkalkulator): nettó irányár kiszállással`,
    `- [Rólam](${siteUrl}/rolam): ${site.owner}, földmérő`,
    `- [Kapcsolat](${siteUrl}/kapcsolat): írásos ajánlatkérés`,
    "",
    "## Gyakori kérdések",
    "",
    ...faq.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
