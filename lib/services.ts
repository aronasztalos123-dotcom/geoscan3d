export type Service = {
  slug: string;
  /** Rövid név: fülön, menüben, űrlapon. */
  name: string;
  /** Szolgáltatás-oldal h1 és a kezdőlapi mappa címe. */
  title: string;
  seoTitle: string;
  seoDescription: string;
  /** Egy mondat: mi ez. */
  lead: string;
  forWhom: string;
  deliverables: string[];
  /** A kezdőlapi mappa bekezdése. */
  body: string;
  image: { src: string; alt: string; caption: string };
  /** Mappa színe (token neve). */
  field: "sky" | "sand" | "yellow" | "steel" | "paper";
  page: {
    intro: string[];
    situations: { title: string; text: string }[];
    steps: string[];
    limits: string;
    faq: { q: string; a: string }[];
  };
};

export const services: Service[] = [
  {
    slug: "as-built-felmeres",
    name: "As-Built felmérés",
    title: "Alaprajz, homlokzat, metszet meglévő épületről",
    seoTitle: "As-Built épületfelmérés, alaprajz készítés lézerszkennerrel",
    seoDescription:
      "Meglévő épület felmérése kézi lézerszkennerrel, jogosult földmérőtől: DWG/DXF alaprajz, homlokzat és metszet pontfelhőből, EOV-ba illesztve. Kérjen egyedi ajánlatot.",
    lead: "Régi házról, csarnokról, műemlékről vagy társasházi lakásról, ahol nincs használható terv.",
    forWhom:
      "Építészeknek, belsőépítészeknek és generálkivitelezőknek, akik régi házat, csarnokot, műemléket vagy olyan társasházi lakást újítanak fel, amelyhez nincs használható terv.",
    deliverables: ["DWG/DXF alaprajz", "Homlokzat és metszet", "PDF rajz", "Kérésre a pontfelhő is"],
    body:
      "Egy régi házban ritkán derékszögű bármi. A falvastagság szobánként más, a boltívet szalaggal nem lehet rendesen lemérni. A pontfelhőből úgy rajzolom meg az épületet, ahogy valójában áll, és ha később kell egy méret, a helyszín nélkül is visszakeresem.",
    image: {
      src: "/img/as-built.webp",
      alt: "Felújítás alatt álló régi parasztház szobája gerendás mennyezettel, félig leverett vakolattal",
      caption: "Illusztráció: felújítás előtti régi ház",
    },
    field: "sand",
    page: {
      intro: [
        "Az As-Built felmérés a meglévő állapot rajza: ami ténylegesen ott áll, nem az, ami egy régi tervlapon szerepel. Kézi lézerszkennerrel bejárom az épületet, a pontfelhőből pedig DWG/DXF alaprajzot, homlokzatot és metszetet rajzolok.",
        "Egy bonyolult, régi családi ház bejárása 20–30 perc. Ugyanez mérőszalaggal és lézeres távmérővel jellemzően 1–2 nap, és a végén is marad kérdés, amiért vissza kell menni.",
      ],
      situations: [
        {
          title: "Régi ház felújítása előtt",
          text: "Vastag, nem párhuzamos falak, eltérő padlószintek, boltozott helyiségek. A rajz ezeket a valós helyükön mutatja.",
        },
        {
          title: "Csarnok, üzem, raktár",
          text: "Nagy fesztáv, oszlopok, darupálya, gépalapok. A szkenner 50–100 m-re lát, így a csarnok túlsó fala is egy bejárásba fér.",
        },
        {
          title: "Műemlék és védett épület",
          text: "Íves falak, tagozatok, boltívek. A pontfelhő a felújítás előtti állapot dokumentációja is.",
        },
        {
          title: "Társasházi lakás terv nélkül",
          text: "Átépített válaszfalak, áthelyezett ajtók. A belsőépítész a valós alaprajzból dolgozik, nem egy 1960-as tervlapból.",
        },
      ],
      steps: [
        "Megbeszéljük, milyen rajzot kér (alaprajz, homlokzat, metszet), milyen szoftverben és milyen rétegrenddel dolgozik.",
        "Helyszíni bejárás a szkennerrel. Nagyobb épületnél illesztőpontokat mérek be és zárt körökben járok.",
        "A pontfelhőből megrajzolom a kért nézeteket, kérésre EOV koordinátákkal.",
        "Átadás DWG/DXF és PDF formátumban, kérésre a pontfelhővel (E57, LAS/LAZ) együtt.",
      ],
      limits:
        "A pontosság ±2 cm. Építészeti tervhez, belsőépítészethez és koncepciótervhez ez elég. Acélszerkezeti gyártmánytervhez vagy gépészeti illesztéshez, ahol milliméter kell, nem ezt a módszert javaslom, és ezt az ajánlatban előre megmondom.",
      faq: [
        {
          q: "Milyen részletességű lesz az alaprajz?",
          a: "Falak, nyílások, nyílászárók helye, belmagasságok, padlószintek, kérésre berendezés és gépészeti végpontok. A részletességet az ajánlat előtt egyeztetjük, mert ez határozza meg a feldolgozás idejét.",
        },
        {
          q: "Lakott, bútorozott lakásban is tud mérni?",
          a: "Igen. Pakolni nem kell, de ami a fal előtt áll, az takarja a falat. Egy szekrény mögötti falszakasz a pontfelhőben sem fog látszani.",
        },
        {
          q: "Megkapom a pontfelhőt is?",
          a: "Igen, ha kéri: E57, LAS vagy LAZ formátumban. Az E57-et ArchiCAD közvetlenül, Revit és AutoCAD az Autodesk ReCap-en keresztül tudja használni.",
        },
      ],
    },
  },
  {
    slug: "3d-virtualis-bejaras",
    name: "3D virtuális bejárás",
    title: "Böngészőben bejárható, mérhető 3D tér",
    seoTitle: "3D virtuális bejárás (virtuális séta) Gaussian Splattinggel",
    seoDescription:
      "Fotórealisztikus, mérhető, böngészőben bejárható 3D modell ingatlanról, panzióról, rendezvényhelyszínről, méretarányos alaprajzzal egy csomagban. Kérjen egyedi ajánlatot.",
    lead: "Fotórealisztikus, mérhető webes 3D modell és méretarányos alaprajz, egy csomagban.",
    forWhom:
      "Prémium ingatlanirodáknak, ipari és üzleti ingatlanok tulajdonosainak, panzióknak és rendezvényhelyszíneknek.",
    deliverables: ["Webes 3D link (Gaussian Splatting)", "Méretarányos alaprajz", "Telefonon is megnyílik", "Weboldalba beágyazható"],
    body:
      "A 3D modellt a lézeres pontfelhőből és a 360°-os kamera képeiből építem fel Gaussian Splatting eljárással. Telepíteni semmit nem kell: Ön egy linket kap, amit a hirdetésbe vagy a saját weboldalába tehet, és a látogató telefonon is körbenézhet a térben.",
    image: {
      src: "/img/virtualis-bejaras.webp",
      alt: "Felújított kőfalú présház belső tere hosszú tölgyfa asztallal és pinceboltozattal",
      caption: "Illusztráció: rendezvénytérré alakított présház",
    },
    field: "sky",
    page: {
      intro: [
        "A virtuális bejárás egy böngészőben megnyíló, fotórealisztikus 3D modell. A látogató szabadon mozog benne, és mérni is tud: milyen széles a terem, milyen magas a belmagasság.",
        "A modellt Gaussian Splatting eljárással készítem a lézeres pontfelhőből és a szkennerre szerelt 360°-os kamera képeiből. Mellé méretarányos alaprajz jár, így a csomag egyszerre látvány és műszaki adat.",
      ],
      situations: [
        {
          title: "Prémium ingatlan eladása",
          text: "A vevő a bejárás után már tudja, hogy elfér-e a bútora. Kevesebb a felesleges megtekintés.",
        },
        {
          title: "Ipari, üzleti ingatlan bérbeadása",
          text: "A bérlő műszaki csapata a modellben méri le a kapuk szélességét és a belmagasságot.",
        },
        {
          title: "Panzió, vendégház",
          text: "A vendég a foglalás előtt körbenéz a szobában. A link a foglalási oldalba is beágyazható.",
        },
        {
          title: "Rendezvényhelyszín",
          text: "A szervező a modellben tervezi meg az asztalrendet, a méretarányos alaprajz pedig a dekoratőrnek kell.",
        },
      ],
      steps: [
        "Egyeztetjük, mely tereket mutassa a bejárás, és hová kerül a link.",
        "Helyszíni felvétel a szkennerrel és a 360°-os kamerával. Jó világítás kell, mert a színeket a kamera adja.",
        "Feldolgozás: pontfelhő, Gaussian Splat modell és méretarányos alaprajz.",
        "Átadás: webes link, beágyazó kód és PDF/DWG alaprajz.",
      ],
      limits:
        "A Gaussian Splat modell látványra készül. Műszaki tervezéshez a mellé adott alaprajzot vagy a pontfelhőt használja, ezek ±2 cm pontosak.",
      faq: [
        {
          q: "Miben más, mint egy 360°-os fotós séta?",
          a: "A 360°-os fotós séta fix pontokból néz körbe. A Gaussian Splat modellben a látogató szabadon mozog, és a tér méretei is lemérhetők.",
        },
        {
          q: "Hol fut a modell?",
          a: "Böngészőben, telepítés nélkül, telefonon is. A tárhelyet és a megosztás módját az ajánlatban rögzítjük.",
        },
        {
          q: "Kell valamit előkészíteni?",
          a: "Rendezett, kivilágított tereket. Ami a felvételen látszik, az a modellben is látszani fog.",
        },
      ],
    },
  },
  {
    slug: "terfogatszamitas",
    name: "Térfogatszámítás",
    title: "Depónia, halom, raktárkészlet köbméterben",
    seoTitle: "Depónia térfogatszámítás és készletfelmérés lézerszkennerrel",
    seoDescription:
      "Kavics-, homok- és földdepónia, fedett csarnokban tárolt gabona térfogata m³-ben, havi vagy negyedéves jelentéssel. Ott is mér, ahol a drón nem. Kérjen egyedi ajánlatot.",
    lead: "Havi vagy negyedéves m³-jelentés depóniáról, bányáról, raktárkészletről.",
    forWhom:
      "Kavics- és homokbányáknak, építőanyag-telepeknek, mezőgazdasági raktáraknak és földdepóniát kezelő cégeknek.",
    deliverables: ["m³-jelentés PDF-ben", "Havi vagy negyedéves ismétlés", "Időszakok közti különbség", "Kérésre a pontfelhő"],
    body:
      "Ahol a drón nem tud pontosan mérni, ott is mérek: fedett csarnokban tárolt gabonát, fák alatt fekvő földdepóniát. A halmot a szkennerrel körbejárom, és a térfogatot a mért felületből számolom. Ismétlődő mérésnél ugyanazokra az illesztőpontokra dolgozom, így a hónapok összevethetők.",
    image: {
      src: "/img/terfogat.webp",
      alt: "Fedett mezőgazdasági raktárcsarnokban felhalmozott nagy gabonahalom",
      caption: "Illusztráció: gabona fedett csarnokban",
    },
    field: "yellow",
    page: {
      intro: [
        "A térfogatszámítás a halom felületének felmérése és a térfogat kiszámítása egy alapfelülethez képest. A kézi szkennerrel körbejárom a depóniát, a pontfelhőből pedig köbméterre kiszámolom, mennyi anyag van ott.",
        "A drón felülről lát. Fedett csarnokba, fák alá és szűk telepekre a kézi szkenner jut be, ezért ott is mérni tud, ahol a légi felmérés pontatlan vagy nem kivitelezhető.",
      ],
      situations: [
        {
          title: "Kavics- és homokbánya",
          text: "Havi készletjelentés a könyveléshez és a kitermelés követéséhez.",
        },
        {
          title: "Gabona fedett csarnokban",
          text: "A tető alatt a drón nem repül. A kézi szkenner a csarnokban körbejárja a halmot.",
        },
        {
          title: "Földdepónia fák alatt",
          text: "A lombkorona eltakarja a halmot felülről. A földről a szkenner alá lát.",
        },
        {
          title: "Építőanyag-telep",
          text: "Több kisebb halom egy bejárásban, halmonként külön sorral a jelentésben.",
        },
      ],
      steps: [
        "Egyeztetjük a halmokat, az alapfelületet és az ismétlés gyakoriságát.",
        "Első alkalommal illesztőpontokat mérek be, hogy a későbbi mérések ugyanabban a rendszerben legyenek.",
        "Bejárás, feldolgozás, térfogatszámítás.",
        "Átadás PDF jelentésben, halmonként és összesen, ismétlésnél az előző időszakhoz képest.",
      ],
      limits:
        "A felület ±2 cm pontos. A térfogat pontossága ettől és a halom méretétől függ; nagy, lapos halomnál a felületi hiba több köbmétert is jelenthet, ezt a jelentés feltünteti.",
      faq: [
        {
          q: "Milyen gyakran érdemes mérni?",
          a: "A készletmozgástól függ. Bányáknál a havi, mezőgazdasági raktárnál a negyedéves vagy betárolás utáni mérés a jellemző.",
        },
        {
          q: "Mihez képest számolja a térfogatot?",
          a: "Egy alapfelülethez: lehet a betonpadló, egy korábbi felmérés vagy egy tervezett sík. Ezt az első mérés előtt rögzítjük.",
        },
        {
          q: "Mi van a jelentésben?",
          a: "Halmonként és összesen a térfogat m³-ben, a mérés dátuma, az alapfelület leírása, és ismétlésnél a változás az előző méréshez képest.",
        },
      ],
    },
  },
  {
    slug: "kozmu-allapotrogzites",
    name: "Közmű- és útépítési állapotrögzítés",
    title: "Állapotrögzítés építés és visszatemetés előtt",
    seoTitle: "Közmű- és útépítési állapotrögzítés 3D-ben, EOV-ban",
    seoDescription:
      "Építés előtti állapotrögzítés kárigények ellen, nyitott árok és lefektetett vezeték 3D dokumentálása visszatemetés előtt, EOV-ba illesztve. Kérjen egyedi ajánlatot.",
    lead: "Bizonyíték az előtte lévő állapotról, és a vezeték helye a betemetés után is.",
    forWhom: "Mélyépítő cégeknek, önkormányzatoknak és tervezőknek.",
    deliverables: ["EOV-ba illesztett pontfelhő", "Ortofotó-metszet", "Dátummal ellátott dokumentáció", "Árok és vezeték 3D-ben"],
    body:
      "Egy kárigényt ott a legkönnyebb kivédeni, ahol bizonyíték van az építés előtti állapotról. A nyitott árokban fekvő csövet visszatemetés előtt rögzítem, EOV koordinátákkal, így évek múlva is tudni fogja, pontosan hol és milyen mélyen fut.",
    image: {
      src: "/img/illesztopont.webp",
      alt: "Fekete-fehér illesztőpont-jel egy régi vakolt falon",
      caption: "Illusztráció: illesztőpont, amihez a felmérés EOV-ban kötődik",
    },
    field: "paper",
    page: {
      intro: [
        "Az állapotrögzítés a munkaterület és a környező épületek, járdák, útburkolat dokumentálása az építés előtt. Ha egy szomszéd később repedést jelez, a pontfelhő és az ortofotó-metszet megmutatja, mi volt ott előtte.",
        "A közművezeték építésénél a nyitott árkot és a lefektetett csövet visszatemetés előtt rögzítem. A pontfelhő EOV-ba illesztett, tehát közvetlenül a tervező vagy az üzemeltető GIS-rendszerébe kerül.",
      ],
      situations: [
        {
          title: "Építés előtti állapot",
          text: "Homlokzatok, kerítések, járdák az utca mindkét oldalán, dátummal.",
        },
        {
          title: "Árok visszatemetés előtt",
          text: "A cső, a védőcső, a keresztező vezetékek helye és mélysége 3D-ben.",
        },
        {
          title: "Útépítés szakaszai",
          text: "Rétegrend és szegélyek rögzítése az egyes fázisok végén.",
        },
        {
          title: "Önkormányzati nyilvántartás",
          text: "EOV-ban átadott adat, ami a meglévő közműtérképre illeszthető.",
        },
      ],
      steps: [
        "Egyeztetjük a szakaszt, az ütemezést és azt, hogy ki és milyen rendszerben használja az adatot.",
        "Illesztőpontok bemérése, hogy a felmérés EOV-ban legyen.",
        "Bejárás a munkaterületen; árok esetén a visszatemetés előtti napon vagy órában.",
        "Átadás: pontfelhő (LAS/LAZ/E57), ortofotó-metszet és PDF dokumentáció dátummal.",
      ],
      limits:
        "Ez dokumentáció, nem közműnyilvántartási bemérés helyett való. Ha hivatalos közműbemérésre van szükség, azt külön kell egyeztetni.",
      faq: [
        {
          q: "Miért EOV-ban?",
          a: "Mert így az adat ugyanott ül, ahol a terv, a közműtérkép és a földhivatali térkép. Nem kell kézzel illeszteni.",
        },
        {
          q: "Mennyi ideig tart egy árokszakasz rögzítése?",
          a: "A szakasz hosszától függ. Az ütemezést úgy tervezzük, hogy a visszatemetést ne tartsa fel.",
        },
        {
          q: "Mit kapok a kárigényhez?",
          a: "Dátummal ellátott pontfelhőt és ortofotó-metszeteket a homlokzatokról és burkolatokról, amelyekre később hivatkozni lehet.",
        },
      ],
    },
  },
  {
    slug: "tetofelmeres",
    name: "Tetőfelmérés",
    title: "Tetősíkok, kémények, árnyékoló fák",
    seoTitle: "Tetőfelmérés napelemhez és tetőfedéshez, létra nélkül",
    seoDescription:
      "Tetősíkok mérete és hajlásszöge, kémények és tetőablakok helye, a környező fák magassága az árnyékolás-számításhoz. A földről mérve, létra nélkül. Kérjen egyedi ajánlatot.",
    lead: "Napelemes kiosztáshoz és tetőfedéshez, a földről mérve.",
    forWhom: "Napelemtelepítőknek és tetőfedőknek.",
    deliverables: ["Tetősíkok mérete és hajlása", "Kémények, tetőablakok helye", "Környező fák magassága", "PDF és DWG"],
    body:
      "Mindent a földről mérek, létra és tetőre mászás nélkül. A tetősíkok mérete és hajlásszöge mellett a kémények, tetőablakok helyét és a környező fák magasságát is megkapja, ami az árnyékolás-számításhoz kell.",
    image: {
      src: "/img/scan/pontfelho-felulrol.webp",
      alt: "Egy kis kápolna pontfelhője felülről, jól kivehető tetősíkokkal és a környező fákkal",
      caption: "Pontfelhő: tetősíkok és fák felülről",
    },
    field: "steel",
    page: {
      intro: [
        "A napelemes ajánlathoz és a tetőfedéshez pontos tetőméret kell. A kézi szkennerrel a ház körül járok, és a 50–100 m-es hatótávnak köszönhetően a tetősíkokat a földről mérem.",
        "Az eredmény a tetősíkok mérete, hajlásszöge, a kémények és tetőablakok helye, valamint a környező fák és épületek magassága az árnyékolás-számításhoz.",
      ],
      situations: [
        {
          title: "Napelemes kiosztás",
          text: "A panelek a valós tetősíkra kerülnek, a kémények és tetőablakok körül.",
        },
        {
          title: "Árnyékolás-számítás",
          text: "A szomszéd fa és épület magassága mért adat, nem becslés.",
        },
        {
          title: "Tetőfedés anyagszükséglete",
          text: "Tetősíkonként mért felület, élek, vápák, gerincek hossza.",
        },
        {
          title: "Nehezen járható tető",
          text: "Meredek, csúszós vagy gyenge tetőre senkinek nem kell felmennie.",
        },
      ],
      steps: [
        "Cím és a kért adatok egyeztetése.",
        "Bejárás a ház körül, szükség esetén a szomszéd telek felől is (engedéllyel).",
        "Tetősíkok, hajlásszögek, áttörések és árnyékoló objektumok kiértékelése.",
        "Átadás PDF-ben és DWG-ben.",
      ],
      limits:
        "Amit a földről semmilyen irányból nem lehet látni (például egy belső, minden oldalról takart tetőrész), azt a szkenner sem látja. Ezt a bejárás után jelzem.",
      faq: [
        {
          q: "Tényleg nem kell felmenni a tetőre?",
          a: "Nem. A szkenner a földről méri a tetősíkokat. Ha egy rész minden irányból takart, azt előre jelzem.",
        },
        {
          q: "Milyen formában kapom az adatot?",
          a: "PDF-ben a méretekkel és hajlásszögekkel, és DWG-ben, ha a kiosztást CAD-ben készíti.",
        },
        {
          q: "A fák magassága is benne van?",
          a: "Igen, a ház körüli fák és épületek magassága is, ami az árnyékolás-számításhoz kell.",
        },
      ],
    },
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
