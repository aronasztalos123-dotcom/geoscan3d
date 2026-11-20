/** Kezdőlapi tartalom. Csak a briefben szereplő tényekre épít, kitalált statisztika nincs. */
import { roomArea, rooms, walls } from "./scan/house";

export type FormatId = "dwg" | "dxf" | "pdf" | "orto" | "web" | "las" | "laz" | "e57" | "obj" | "ply";

export const formats: { id: FormatId; name: string; text: string }[] = [
  { id: "dwg", name: "DWG alaprajz", text: "Alaprajz, homlokzat, metszet rétegekre bontva, AutoCAD-ben és ArchiCAD-ben nyitható." },
  { id: "dxf", name: "DXF", text: "Ugyanaz a rajz semleges formátumban, QGIS-be és bármely CAD-be." },
  { id: "pdf", name: "PDF alaprajz", text: "Méretezett, nyomtatható rajz annak, aki nem dolgozik CAD-ben." },
  { id: "orto", name: "Ortofotó-metszet", text: "Torzításmentes, méretarányos kép a homlokzatról vagy a metszetről." },
  { id: "web", name: "Webes 3D link", text: "Böngészőben bejárható, mérhető modell, telefonon is megnyílik." },
  { id: "e57", name: "E57 pontfelhő", text: "ArchiCAD közvetlenül, Revit és AutoCAD az Autodesk ReCap-en át olvassa." },
  { id: "las", name: "LAS", text: "Nyers pontfelhő EOV koordinátákkal, GIS-be és feldolgozó szoftverbe." },
  { id: "laz", name: "LAZ", text: "A LAS tömörített változata, ugyanazzal az adattal, kisebb fájlban." },
  { id: "obj", name: "OBJ háló", text: "Textúrázott 3D háló látványtervhez, SketchUp-hoz, Blenderhez." },
  { id: "ply", name: "PLY", text: "Színes pontfelhő vagy háló, a legtöbb 3D programmal nyitható." },
];

export type SoftwareId = "autocad" | "archicad" | "revit" | "qgis" | "3d" | "none";

export const software: { id: SoftwareId; name: string; get: FormatId[]; note: string }[] = [
  {
    id: "autocad",
    name: "AutoCAD",
    get: ["dwg", "pdf", "e57"],
    note: "Rétegezett DWG rajzot kap, a pontfelhőt E57-ben, amit ReCap-pel csatolhat a rajzhoz.",
  },
  {
    id: "archicad",
    name: "ArchiCAD",
    get: ["dwg", "pdf", "e57"],
    note: "DWG alaprajzot és E57 pontfelhőt kap. Az ArchiCAD az E57-et közvetlenül be tudja olvasni.",
  },
  {
    id: "revit",
    name: "Revit",
    get: ["dwg", "e57", "pdf"],
    note: "DWG-t és E57-et kap. Az E57-ből Autodesk ReCap készít Revitbe csatolható pontfelhőt.",
  },
  {
    id: "qgis",
    name: "QGIS",
    get: ["dxf", "las", "laz", "orto"],
    note: "EOV-ban kapja a DXF-et és a LAS/LAZ pontfelhőt, így pontosan a helyére kerül a térképen.",
  },
  {
    id: "3d",
    name: "SketchUp, Blender",
    get: ["obj", "ply", "web"],
    note: "Textúrázott OBJ hálót vagy PLY-t kap látványtervhez, és webes linket a bemutatáshoz.",
  },
  {
    id: "none",
    name: "Nem dolgozom CAD-del",
    get: ["pdf", "web"],
    note: "Méretezett PDF alaprajzot és webes 3D linket kap. Semmit nem kell telepítenie.",
  },
];

export const figures = [
  { value: "20–30 perc", label: "Egy régi családi ház bejárása. Mérőszalaggal ugyanez 1–2 nap." },
  { value: "akár 1 cm", label: "Pontosság. Építészeti tervhez, látványhoz és térfogathoz elég." },
  { value: "50–100 m", label: "Hatótáv. A csarnok túlsó fala is egy bejárásba fér." },
];

/** Hagyományos felmérés és szkennelés, csak a briefben megadott tényekkel. */
export const comparison: { row: string; manual: string; scan: string }[] = [
  {
    row: "Helyszíni idő egy bonyolult régi háznál",
    manual: "1–2 nap",
    scan: "20–30 perc bejárás",
  },
  {
    row: "Mit rögzít",
    manual: "Azokat a méreteket, amelyeket a helyszínen lemértek",
    scan: "A bejárt terek minden látható felületét, 50–100 m-es hatótávon belül",
  },
  {
    row: "Ha utólag hiányzik egy méret",
    manual: "Újabb kiszállás",
    scan: "Visszakeresem a pontfelhőből, a helyszín nélkül",
  },
  {
    row: "Ferde fal, boltív, eltérő padlószint",
    manual: "Közelítés néhány mért pontból",
    scan: "A valós alakjában rajzolható",
  },
  {
    row: "Egy-egy távolság pontossága",
    manual: "Milliméteres, a mért pontokon",
    scan: "akár 1 cm, mindenhol",
  },
  {
    row: "Koordináta-rendszer",
    manual: "Helyi, a helyiségekhez kötve",
    scan: "EOV, illesztőpontokkal",
  },
];

export const accuracy = {
  yes: ["Építészeti terv", "Belsőépítészet, látványterv", "Térfogatszámítás", "Koncepcióterv"],
  no: ["Acélszerkezeti gyártmányterv", "Gépészeti illesztés"],
};

export const steps = [
  {
    name: "Ön elmondja, mire kell",
    text: "Pár mondat, a cím, és hogy milyen programban nyitja meg a rajzot.",
  },
  {
    name: "Helyszíni szkennelés",
    text: "Egy régi háznál 20–30 perc. Nagy területen illesztőpontokkal, zárt körökben.",
  },
  {
    name: "Feldolgozás",
    text: "Összeillesztem, EOV-ba teszem, és megrajzolom, amit kért.",
  },
  {
    name: "Átadás",
    text: "Az Ön formátumában. Ha később kell egy méret, kiszállás nélkül visszakeresem.",
  },
];

export const faq: { q: string; a: string }[] = [
  {
    q: "Milyen formátumban kapom meg az eredményt?",
    a: "Abban, amiben dolgozik: DWG/DXF rajz, PDF alaprajz, ortofotó-metszet, webes 3D link, vagy nyers pontfelhő LAS, LAZ, E57 formátumban. Látványtervhez OBJ és PLY is kérhető. A formátumot az ajánlat előtt egyeztetjük.",
  },
  {
    q: "Mennyire pontos a felmérés?",
    a: "Akár 1 cm geodéziai illesztőpontokkal, alapból ±2 cm. Ez építészeti tervhez, belsőépítészethez, látványtervhez, térfogatszámításhoz és koncepciótervhez elég. Acélszerkezeti gyártmánytervhez vagy gépészeti illesztéshez, ahol milliméter kell, nem ezt a módszert javaslom.",
  },
  {
    q: "Mennyi idő, amíg megkapom a rajzot?",
    a: "A helyszíni bejárás egy bonyolult régi háznál 20–30 perc. A feldolgozás ideje a felmért területtől és a kért rajzoktól függ, ezért az ajánlatban konkrét átadási időt írok.",
  },
  {
    q: "Mit kell előkészítenem a helyszínen?",
    a: "Hozzáférést minden helyiséghez, és ha lehet, nyitott belső ajtókat. Pakolni nem kell, de ami a fal előtt áll, az takarja a falat. A lézer sötétben is mér, a színes felvételhez viszont világítás kell.",
  },
  {
    q: "Hogyan áll össze az ár?",
    a: "A felmért terület méretéből, a kért rajzokból és formátumokból, valamint a kiszállásból. Az árkalkulátorral nagyjából kiszámolhatja előre; a végleges árat egyedi ajánlatban, a munka megkezdése előtt, írásban adom meg.",
  },
  {
    q: "Mi az az EOV, és miért számít?",
    a: "Az Egységes Országos Vetületi rendszer, a hazai földmérés koordináta-rendszere. Ha a pontfelhő EOV-ban van, a rajz ugyanott ül, ahol a telek, a közmű és a földhivatali térkép, és nem kell kézzel illeszteni.",
  },
  {
    q: "Mi történik a nagy, hosszú felméréseknél?",
    a: "A kézi szkenner menet közben számolja a saját helyét (SLAM), és hosszú bejárásnál ez lassan elcsúszhat. Ezért zárt körökben járok, és illesztőpontokkal ellenőrzöm, hogy a mérés vége ott legyen, ahol az eleje.",
  },
  {
    q: "Miben más, mint egy drónos felmérés?",
    a: "A drón felülről lát: tetőt, nyílt területet, szabadon álló depóniát. Épületen belülre, fedett csarnokba és fák alá a kézi szkenner jut be. Sok munkához a kettő kiegészíti egymást.",
  },
];

/* ------------------------------------------------------------------ v3: cédulák és menetrend */


const openings = walls.flatMap((w) => w.openings ?? []);
const netArea = rooms.reduce((a, r) => a + roomArea(r), 0);
const hu = (n: number) => n.toFixed(2).replace(".", ",");

/** A „Mit kap kézhez” cédulái: minden sor a mintaház valós adataiból vagy a briefből. */
export const slips: { id: string; formats: FormatId[]; file: string; lines: string[] }[] = [
  {
    id: "dwg",
    formats: ["dwg", "dxf"],
    file: "alaprajz.dwg",
    lines: [
      "FAL_TARTO  55 / 40 cm",
      "FAL_VALASZ  15 / 30 cm",
      `NYILASZARO  ${openings.length} db`,
      `HELYISEG  ${rooms.length} db`,
      "MERETEZES",
      "EOV_PONTOK  3 db",
    ],
  },
  {
    id: "pdf",
    formats: ["pdf", "orto"],
    file: "alaprajz_M50.pdf",
    lines: ["M 1:50, A3", "Méretezve", `Nettó alapterület ${hu(netArea)} m²`, "Helyiséglista", "Ortofotó-metszet is"],
  },
  {
    id: "e57",
    formats: ["e57"],
    file: "pontfelho.e57",
    lines: ["ArchiCAD: közvetlenül", "Revit: ReCap-pel", "AutoCAD: ReCap-pel", "EOV koordinátákkal", "akár 1 cm"],
  },
  {
    id: "las",
    formats: ["las", "laz"],
    file: "pontfelho.laz",
    lines: ["Nyers pontfelhő", "EOV Y, X", "QGIS, GIS", "LAZ: tömörítve", "LAS: ugyanaz, kibontva"],
  },
  {
    id: "obj",
    formats: ["obj", "ply"],
    file: "haz_textura.obj",
    lines: ["Textúrázott háló", "SketchUp, Blender", "Látványtervhez", "PLY: színes pontfelhő"],
  },
  {
    id: "web",
    formats: ["web"],
    file: "3D link",
    lines: ["Böngészőben bejárható", "Mérhető modell", "Telefonon is", "Telepítés nélkül"],
  },
];

/** A munka menete cédulán: csoportcím, sorok (mi történik, mennyi / mi). */
export const itinerary: [string, string][] = [
  ["Hívás vagy üzenet", "pár mondat"],
  ["Bejárás egy régi háznál", "20–30 perc"],
  ["Feldolgozás", "EOV-ban"],
  ["Átadás", "az Ön formátumában"],
];
