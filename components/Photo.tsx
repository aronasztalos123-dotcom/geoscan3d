import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

/** Kép, ha a fájl megvan; különben feliratozott helykitöltő (nem stock fotó). Csak szerveren fut. */
export function Photo({
  src, alt, width, height, sizes, priority, className,
}: { src: string; alt: string; width: number; height: number; sizes: string; priority?: boolean; className?: string }) {
  const exists = fs.existsSync(path.join(process.cwd(), "public", src));
  if (!exists) {
    return (
      <div className={`photo-ph ${className ?? ""}`} style={{ aspectRatio: `${width} / ${height}` }} role="img" aria-label={`Kép helye: ${alt}`}>
        <span>Kép helye: {alt}</span>
      </div>
    );
  }
  return <Image src={src} alt={alt} width={width} height={height} sizes={sizes} priority={priority} className={className} />;
}
