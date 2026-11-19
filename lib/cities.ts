export type City = {
  slug: string;
  name: string;
  /** Helyhatározós alak: Miskolcon, Egerben... */
  loc: string;
  county: string;
  /** A fő kulcsszó a címben (OpenSEO, 2026-11: a "földmérő + város" a legkeresettebb helyi kifejezés). */
  seoTitle: string;
  seoDescription: string;
  intro: string[];
  /** Jellemző munkák: szolgáltatás slug + egy mondat a helyi épületállományról. */
  jobs: { service: string; text: string }[];
  /** Az M3 mentén Budapesttől számított sorrend, a szolgáltatási terület listához. */
  order: number;
  /** Illusztráció a fejlécbe (szolgáltatás slug, a képe kerül ki). */
  photo: string;
};

export const cities: City[] = [
  {
    slug: "miskolc",
    photo: "as-built-felmeres",
    name: "Miskolc",
    loc: "Miskolcon",
    county: "Borsod-Abaúj-Zemplén",
    order: 7,
    seoTitle: "3D lézerszkennelés és épületfelmérés Miskolcon, földmérőtől",
    seoDescription:
      "Épületfelmérés kézi lézerszkennerrel Miskolcon és Borsod megyében, jogosult földmérőtől: DWG alaprajz, 3D bejárás, térfogatszámítás, EOV-ba illesztve.",
    intro: [
      "Miskolcon a belvárosi polgárházaktól a diósgyőri és a volt ipari területek csarnokaiig sok épületnek nincs olyan terve, amiből egy felújítást biztonsággal tervezni lehet. A régi tervlapok, ha meg is vannak, ritkán egyeznek azzal, ami ma áll.",
      "Kézi lézerszkennerrel bejárom az épületet, és DWG alaprajzot, metszetet vagy homlokzatot adok át, kérésre EOV koordinátákkal. Borsod-Abaúj-Zemplén megye a szolgáltatási területem központja.",
    ],
    jobs: [
      { service: "as-built-felmeres", text: "Belvárosi polgárházak és társasházi lakások felújítás előtti alaprajza." },
      { service: "terfogatszamitas", text: "Építőanyag-telepek és depóniák időszakos térfogatszámítása a megyében." },
      { service: "kozmu-allapotrogzites", text: "Utca- és közműépítések előtti állapotrögzítés, árok visszatemetés előtt." },
    ],
  },
  {
    slug: "eger",
    photo: "3d-virtualis-bejaras",
    name: "Eger",
    loc: "Egerben",
    county: "Heves",
    order: 5,
    seoTitle: "Épületfelmérés és 3D lézerszkennelés Egerben, földmérőtől",
    seoDescription:
      "Műemléki belváros, pincék, présházak felmérése kézi lézerszkennerrel Egerben: DWG alaprajz, metszet, 3D virtuális bejárás. Jogosult földmérő, EOV-ban.",
    intro: [
      "Egerben a belváros nagy része műemléki környezet, a borvidéken pedig sok a pince és a présház. Ezek a terek íves falakkal, boltozatokkal és változó padlószintekkel épültek, amit mérőszalaggal csak közelítőleg lehet lerajzolni.",
      "A lézer sötétben is mér, így a pince is felmérhető; a színes felvételhez világítás kell. A pontfelhőből metszetet, alaprajzot és a borászatoknak, vendégházaknak 3D virtuális bejárást készítek.",
    ],
    jobs: [
      { service: "as-built-felmeres", text: "Műemléki és védett belvárosi épületek alaprajza, metszete, homlokzata." },
      { service: "3d-virtualis-bejaras", text: "Pincészetek, présházak, vendégházak böngészőben bejárható 3D modellje." },
      { service: "tetofelmeres", text: "Családi házak tetőfelmérése napelemes kiosztáshoz, a földről." },
    ],
  },
  {
    slug: "gyongyos",
    photo: "terfogatszamitas",
    name: "Gyöngyös",
    loc: "Gyöngyösön",
    county: "Heves",
    order: 4,
    seoTitle: "Lézerszkennelés és épületfelmérés Gyöngyösön, földmérőtől",
    seoDescription:
      "Épületfelmérés, térfogatszámítás és tetőfelmérés kézi lézerszkennerrel Gyöngyösön és a Mátraalján. DWG, PDF, webes 3D link, EOV-ba illesztve.",
    intro: [
      "Gyöngyös és a Mátraalja épületállománya vegyes: régi lakóházak és pincék a borvidéken, az M3 mentén pedig ipari és mezőgazdasági épületek, raktárak.",
      "A kézi szkennerrel egy bejárásban rögzítem a teret, és abban a formátumban adom át, amiben a tervező dolgozik: DWG, PDF, webes 3D link vagy nyers pontfelhő.",
    ],
    jobs: [
      { service: "as-built-felmeres", text: "Régi lakóházak és pincék felújítás előtti felmérése." },
      { service: "terfogatszamitas", text: "Fedett mezőgazdasági raktárak készletfelmérése, ahová drón nem jut be." },
      { service: "tetofelmeres", text: "Tetőfelmérés napelemtelepítőknek, árnyékoló fák magasságával." },
    ],
  },
  {
    slug: "hatvan",
    photo: "kozmu-allapotrogzites",
    name: "Hatvan",
    loc: "Hatvanban",
    county: "Heves",
    order: 3,
    seoTitle: "Csarnok- és épületfelmérés lézerszkennerrel Hatvanban, földmérőtől",
    seoDescription:
      "Üzemcsarnok, raktár és meglévő épület felmérése kézi lézerszkennerrel Hatvanban: DWG alaprajz, metszet, térfogatszámítás, EOV-ba illesztve.",
    intro: [
      "Hatvan az M3 és a 21-es főút csomópontja, sok raktár- és üzemcsarnokkal. Egy csarnok bővítéséhez vagy átalakításához a meglévő állapot pontos rajza kell: oszlopok, kapuk, darupálya, belmagasság.",
      "A szkenner 50–100 m-re lát, így egy csarnok egy bejárásban felmérhető. Az adatot EOV-ban adom át, hogy a telek és a közmű adataival együtt használható legyen.",
    ],
    jobs: [
      { service: "as-built-felmeres", text: "Üzem- és raktárcsarnokok alaprajza, metszete bővítés vagy átalakítás előtt." },
      { service: "terfogatszamitas", text: "Ömlesztett anyagok és depóniák térfogatszámítása." },
      { service: "kozmu-allapotrogzites", text: "Ipari területek közműépítésének állapotrögzítése." },
    ],
  },
  {
    slug: "godollo",
    photo: "tetofelmeres",
    name: "Gödöllő",
    loc: "Gödöllőn",
    county: "Pest",
    order: 2,
    seoTitle: "Épületfelmérés és lézerszkennelés Gödöllőn, földmérőtől",
    seoDescription:
      "Családi ház, társasházi lakás és üzlethelyiség felmérése kézi lézerszkennerrel Gödöllőn és környékén: DWG alaprajz, 3D bejárás, tetőfelmérés.",
    intro: [
      "Gödöllőn és az agglomerációban sok a bővítés és a felújítás: régi családi házak kapnak emeletet, társasházi lakások új alaprajzot. A tervezőnek ehhez a meglévő állapot kell, nem egy évtizedekkel korábbi terv.",
      "A bejárás egy családi háznál 20–30 perc, utána Ön DWG-ben vagy PDF-ben kapja a rajzot. Az ingatlanirodáknak ugyanebből a felvételből 3D virtuális bejárás is készülhet.",
    ],
    jobs: [
      { service: "as-built-felmeres", text: "Családi házak bővítés előtti felmérése, emeletráépítéshez metszettel." },
      { service: "3d-virtualis-bejaras", text: "Eladó ingatlanok böngészőben bejárható 3D modellje alaprajzzal." },
      { service: "tetofelmeres", text: "Tetőfelmérés napelemhez, létra és tetőre mászás nélkül." },
    ],
  },
  {
    slug: "budapest",
    photo: "as-built-felmeres",
    name: "Budapest",
    loc: "Budapesten",
    county: "Budapest",
    order: 1,
    seoTitle: "As-Built felmérés Budapesten, lézerszkennerrel, földmérőtől",
    seoDescription:
      "As-Built felmérés budapesti lakásról, bérházról, üzlethelyiségről kézi lézerszkennerrel: DWG/DXF alaprajz, metszet, 3D bejárás. Jogosult földmérő, EOV-ban.",
    intro: [
      "A budapesti bérházak lakásait sokszor átépítették az évtizedek alatt: válaszfalak kerültek máshová, ajtók tűntek el, padlószintek változtak. A társasház tervtárában lévő rajz ritkán mutatja a mai állapotot.",
      "Egy lakás bejárása a szkennerrel jellemzően rövidebb, mint egy családi házé, és a belsőépítész vagy az építész a valós alaprajzból dolgozik tovább, DWG-ben.",
    ],
    jobs: [
      { service: "as-built-felmeres", text: "Bérházi lakások és üzlethelyiségek alaprajza a belsőépítészeknek." },
      { service: "3d-virtualis-bejaras", text: "Prémium lakások és irodák 3D virtuális bejárása az ingatlanirodáknak." },
      { service: "kozmu-allapotrogzites", text: "Szomszédos épületek állapotrögzítése építkezés előtt, kárigények ellen." },
    ],
  },
];

export const cityBySlug = (slug: string) => cities.find((c) => c.slug === slug);

/** További települések a szolgáltatási területen (nincs külön oldaluk). */
export const moreTowns = {
  borsod: ["Kazincbarcika", "Tiszaújváros", "Mezőkövesd", "Ózd", "Sárospatak", "Sátoraljaújhely", "Szerencs", "Edelény", "Encs"],
  m3: ["Füzesabony", "Aszód", "Gödöllő környéke"],
};
