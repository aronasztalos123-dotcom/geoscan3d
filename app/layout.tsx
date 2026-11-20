import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileCall } from "@/components/MobileCall";
import { RevealRoot } from "@/components/RevealRoot";
import { JsonLd, businessSchema } from "@/lib/schema";
import { site, siteUrl } from "@/lib/site";

// Switzer (Fontshare, FFL), változó súly 100–900, latin-ext: ő, ű, ±, ², ³ lefedve.
const switzer = localFont({
  src: "./fonts/Switzer-Variable.woff2",
  variable: "--font-switzer",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.brand} | 3D lézerszkennelés és épületfelmérés földmérőtől`,
    template: `%s | ${site.brand}`,
  },
  description:
    "Épületfelmérés kézi lézerszkennerrel Borsodban és az M3 mentén Budapestig. DWG/DXF alaprajz, 3D virtuális bejárás, térfogatszámítás, EOV-ba illesztve.",
  applicationName: site.brand,
  openGraph: {
    type: "website",
    locale: "hu_HU",
    siteName: site.brand,
    url: siteUrl,
    title: `${site.brand}: 3D lézerszkennelés földmérőtől`,
    description: "Pontfelhőből kész DWG alaprajz, EOV-ba illesztve. Borsod és az M3 mentén Budapestig.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${site.brand}` }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0c3c01",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hu" className={switzer.variable} suppressHydrationWarning>
      <head>
        {/* A belépő mozgás rejtett kezdőállapota csak scripttel él; script nélkül minden látható. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#tartalom" className="skip">Ugrás a tartalomhoz</a>
        <Header />
        <main id="tartalom">{children}</main>
        <Footer />
        <MobileCall />
        <RevealRoot />
        <JsonLd data={businessSchema()} />
      </body>
    </html>
  );
}
