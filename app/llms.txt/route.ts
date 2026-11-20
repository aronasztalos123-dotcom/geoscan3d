import { faq } from "@/lib/content";
import { services } from "@/lib/services";
import { site, siteUrl } from "@/lib/site";

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
    "- Szolgáltatási terület: Miskolc, Eger, Gyöngyös, Hatvan, Gödöllő, Budapest, Borsod-Abaúj-Zemplén, Heves és Pest vármegye",
    "- Ár: egyedi, írásos ajánlat a munka előtt; irányár az árkalkulátorban",
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
