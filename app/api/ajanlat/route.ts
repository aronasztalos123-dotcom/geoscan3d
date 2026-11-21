import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { isValidPhone } from "@/lib/phone";

/**
 * Ajánlatkérés fogadása. Környezeti változók (Vercel: Project Settings → Environment Variables):
 *   QUOTE_TO_EMAIL      ide érkeznek az ajánlatkérések, pl. info@geoscan3d.hu
 *   QUOTE_FROM_EMAIL    feladó, pl. "Ajánlatkérés <ajanlat@geoscan3d.hu>" (egyezzen az SMTP_USER fiókkal)
 * Elsődleges: SMTP (Forpsi): SMTP_HOST=smtp.forpsi.com, SMTP_PORT=587, SMTP_USER, SMTP_PASS.
 * Tartalék, ha nincs SMTP: RESEND_API_KEY.
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

  if (!d.nev || !d.telefon || !d.szolgaltatas || !d.helyszin) {
    return NextResponse.json({ ok: false, message: "Hiányzó adat: név, telefonszám, szolgáltatás és helyszín kell." }, { status: 422 });
  }
  if (!isValidPhone(d.telefon)) {
    return NextResponse.json({ ok: false, message: "A telefonszám formátuma nem jó." }, { status: 422 });
  }
  if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) {
    return NextResponse.json({ ok: false, message: "Az e-mail-cím formátuma nem jó." }, { status: 422 });
  }

  const to = process.env.QUOTE_TO_EMAIL;
  const from = process.env.QUOTE_FROM_EMAIL;
  const smtp = { host: process.env.SMTP_HOST, user: process.env.SMTP_USER, pass: process.env.SMTP_PASS };
  const key = process.env.RESEND_API_KEY;
  if (!to || !from || (!(smtp.host && smtp.user && smtp.pass) && !key)) {
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503 });
  }

  const subject = `Ajánlatkérés: ${d.szolgaltatas}, ${d.helyszin}`;
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

  const failed = () =>
    NextResponse.json({ ok: false, message: "A küldés nem sikerült. Kérem, hívjon telefonon." }, { status: 502 });

  if (smtp.host && smtp.user && smtp.pass) {
    const port = Number(process.env.SMTP_PORT || 587);
    const transport = nodemailer.createTransport({
      host: smtp.host,
      port,
      secure: port === 465,
      requireTLS: port !== 465,
      auth: { user: smtp.user, pass: smtp.pass },
    });
    try {
      await transport.sendMail({ from, to, replyTo: d.email || undefined, subject, text });
    } catch (err) {
      console.error("[ajanlat] SMTP küldés sikertelen:", err instanceof Error ? err.message : err);
      return failed();
    }
    return NextResponse.json({ ok: true });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], reply_to: d.email || undefined, subject, text }),
  });
  if (!res.ok) return failed();
  return NextResponse.json({ ok: true });
}
