import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const contentType = "image/png";

/** PNG faviconok az app/icon.svg mellé: a Google találati favicon (96) és az Android/manifest (192, 512). */
const SIZES = [96, 192, 512] as const;

export function generateImageMetadata() {
  return SIZES.map((s) => ({ id: String(s), size: { width: s, height: s }, contentType }));
}

export default async function Icon({ id }: { id: Promise<string> }) {
  const s = Number(await id);
  const svg = await readFile(join(process.cwd(), "app/icon.svg"), "utf8");
  const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  return new ImageResponse(
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} width={s} height={s} alt="" />,
    { width: s, height: s },
  );
}
