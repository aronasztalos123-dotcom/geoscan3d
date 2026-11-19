import { NextResponse } from "next/server";

/**
 * Ajánlatkérés fogadása. E-mailt a Resend API-n küld, ha a környezeti változók be vannak állítva
 * (Vercel: Project Settings → Environment Variables):
 *   RESEND_API_KEY      a Resend kulcs
 *   QUOTE_TO_EMAIL      ide érkeznek az ajánlatkérések
 *   QUOTE_FROM_EMAIL    ellenőrzött feladó, pl. "Ajánlatkérés <ajanlat@domain.hu>"
 * Beállítás nélkül 503-at ad, és az űrlap telefonos / e-mailes tartalékot mutat. Csendes "siker" nincs.
 */

const MAX = 4000;
const clean = (v: unknown, n = 300) => String(v ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, n);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Hibás kérés." }, { status: 400 });
  }

  // Spam-csapda kitöltve: úgy teszünk, mintha sikerült volna.
  if (clean(body.weboldal)) return NextResponse.json({ ok: true });

  const d = {
    nev: clean(body.nev, 120),
    telefon: clean(body.telefon, 40),
    email: clean(body.email, 160),
    szolgaltatas: clean(body.szolgaltatas, 80),
    helyszin: clean(body.helyszin, 120),
    meret: clean(body.meret, 80),
    szoftver: clean(body.szoftver, 60),
    uzenet: String(body.uzenet ?? "").slice(0, MAX),
  };

  if (!d.nev || (!d.telefon && !d.email) || !d.szolgaltatas || !d.helyszin) {
    return NextResponse.json({ ok: false, message: "Hiányzó adat: név, elérhetőség, szolgáltatás és helyszín kell." }, { status: 422 });
  }
  if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) {
    return NextResponse.json({ ok: false, message: "Az e-mail-cím formátuma nem jó." }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_TO_EMAIL;
  const from = process.env.QUOTE_FROM_EMAIL;
  if (!key || !to || !from) {
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503 });
  }

  const text = [
    `Név: ${d.nev}`,
    `Telefon: ${d.telefon || "-"}`,
    `E-mail: ${d.email || "-"}`,
    `Szolgáltatás: ${d.szolgaltatas}`,
    `Helyszín: ${d.helyszin}`,
    `Becsült méret: ${d.meret || "-"}`,
    `Szoftver: ${d.szoftver || "-"}`,
    "",
    d.uzenet || "(nincs üzenet)",
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: d.email || undefined,
      subject: `Ajánlatkérés: ${d.szolgaltatas}, ${d.helyszin}`,
      text,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ ok: false, message: "A küldés nem sikerült. Kérem, hívjon telefonon." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
