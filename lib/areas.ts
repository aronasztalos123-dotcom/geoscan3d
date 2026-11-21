import { travelZones } from "./pricing";

/**
 * Szolgáltatási terület, kiszállási zónánként. A Rólam oldal "Ahol dolgozom" része, az llms.txt és a schema is ebből él,
 * így a látható szöveg és a gépi adat ugyanazt mondja. A díjak a lib/pricing.ts kiszállási zónáiból jönnek.
 */
export type Area = {
  id: string;
  /** Látható alcím: a "földmérő + város" alak, ahogy keresnek rá. */
  title: string;
  zone: (typeof travelZones)[number]["id"];
  cities: string[];
  text: string;
};

export const areas: Area[] = [
  {
    id: "miskolc",
    title: "Földmérő Miskolcon",
    zone: "kozel",
    cities: ["Miskolc", "Felsőzsolca", "Alsózsolca", "Sajószentpéter", "Emőd", "Mályi"],
    text:
      "Miskolcról indulok, ezért a városban és 30 km-es körzetében nincs kiszállási díj. Családi házat, társasházat, irodát, üzemcsarnokot mérek fel, és pontfelhőből rajzolom meg az alaprajzot, metszetet, homlokzatot EOV-ban.",
  },
  {
    id: "borsod",
    title: "Borsod-Abaúj-Zemplén",
    zone: "borsod",
    cities: ["Ózd", "Kazincbarcika", "Mezőkövesd", "Tiszaújváros", "Szerencs", "Encs", "Tokaj", "Sátoraljaújhely"],
    text:
      "A megye bármely településére kimegyek. A kiszállási díj a megyén belül mindenhol ugyanannyi, akár Ózdon, akár Sátoraljaújhelyen van a munka.",
  },
  {
    id: "heves",
    title: "Földmérő Egerben, Gyöngyösön, Hatvanban",
    zone: "heves",
    cities: ["Eger", "Gyöngyös", "Hatvan"],
    text:
      "Heves vármegye kisebb településeire is kimegyek. Régi, műemlék és vegyes falazatú épületeknél a lézerszkenner a ferde falat és a boltozatot is olyannak méri, amilyen.",
  },
  {
    id: "budapest",
    title: "Gödöllő és Budapest",
    zone: "budapest",
    cities: ["Gödöllő", "Budapest"],
    text:
      "Az M3 mentén Budapestig vállalok munkát. Nagyobb felmérésnél, csarnoknál, irodaháznál vagy több lakásnál a kiszállás ára a teljes munkához képest kicsi.",
  },
];

export const areaFee = (a: Area) => travelZones.find((z) => z.id === a.zone)?.amount ?? 0;

/** Minden város egyszer, a schema areaServed-hez. */
export const allCities = [...new Set(areas.flatMap((a) => a.cities))];
