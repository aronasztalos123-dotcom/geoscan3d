/**
 * Az ajánlatkérő űrlapból érkező levél (ajanlat@ postafiókba).
 * E-mail-kliensekhez írt HTML: táblázatos elrendezés, inline stílusok, kép nélkül
 * (a Gmail és az Outlook sok CSS-t és az SVG-t eldobja). Mellette sima szöveges változat is megy.
 */

export type QuoteData = {
  nev: string;
  telefon: string;
  email: string;
  szolgaltatas: string;
  helyszin: string;
  meret: string;
  szoftver: string;
  uzenet: string;
};

const C = {
  forest: "#0c3c01",
  forest2: "#17490b",
  lime: "#c9f24d",
  paper: "#f1f2ed",
  paper2: "#e5e8dc",
  line: "#e3e6da",
  ink: "#2e2d1d",
  muted: "#5b6150",
  onDark: "#c8d3b8",
};
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** tel: link: szóközök nélkül, a 06 / 0036 előtagból +36 lesz. */
function telLink(raw: string) {
  let n = raw.replace(/[^\d+]/g, "");
  if (n.startsWith("0036")) n = "+36" + n.slice(4);
  else if (n.startsWith("06")) n = "+36" + n.slice(2);
  else if (!n.startsWith("+")) n = "+36" + n;
  return `tel:${n}`;
}

function receivedAt(date: Date) {
  return new Intl.DateTimeFormat("hu-HU", {
    timeZone: "Europe/Budapest",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function buildQuoteEmail(d: QuoteData, now = new Date()) {
  const subject = `Ajánlatkérés: ${d.szolgaltatas}, ${d.helyszin} (${d.nev})`;
  const when = receivedAt(now);

  const text = [
    `Új ajánlatkérés érkezett (${when})`,
    "",
    `Név: ${d.nev}`,
    `Telefon: ${d.telefon || "-"}`,
    `E-mail: ${d.email || "-"}`,
    `Szolgáltatás: ${d.szolgaltatas}`,
    `Helyszín: ${d.helyszin}`,
    `Becsült méret: ${d.meret || "-"}`,
    `Szoftver: ${d.szoftver || "-"}`,
    "",
    "Üzenet:",
    d.uzenet || "(nincs üzenet)",
  ].join("\n");

  const link = (href: string, label: string) =>
    `<a href="${esc(href)}" style="color:${C.forest};font-weight:700;text-decoration:none;border-bottom:1.5px solid ${C.lime};">${esc(label)}</a>`;

  const rows: [string, string][] = [
    ["Név", esc(d.nev)],
    ["Telefon", d.telefon ? link(telLink(d.telefon), d.telefon) : "–"],
    ["E-mail", d.email ? link(`mailto:${d.email}`, d.email) : `<span style="color:${C.muted};">nem adta meg</span>`],
    ["Szolgáltatás", esc(d.szolgaltatas)],
    ["Helyszín", esc(d.helyszin)],
    ...(d.meret ? ([["Becsült méret", esc(d.meret)]] as [string, string][]) : []),
    ["Szoftver", d.szoftver ? esc(d.szoftver) : `<span style="color:${C.muted};">nem számít / nem tudja</span>`],
  ];

  const rowsHtml = rows
    .map(
      ([k, v], i) => `
              <tr>
                <td style="padding:14px 0;${i ? `border-top:1px solid ${C.line};` : ""}width:112px;vertical-align:top;font-size:13px;line-height:20px;font-weight:600;color:${C.muted};">${k}</td>
                <td style="padding:14px 0;${i ? `border-top:1px solid ${C.line};` : ""}vertical-align:top;font-size:16px;line-height:22px;color:${C.ink};">${v}</td>
              </tr>`,
    )
    .join("");

  const message = d.uzenet.trim()
    ? esc(d.uzenet.trim()).replace(/\r?\n/g, "<br>")
    : `<span style="color:${C.muted};">Nem írt üzenetet.</span>`;

  // Inline-block gombok: széles képernyőn egymás mellett, telefonon egymás alá törnek, a felirat nem tördelődik.
  const button = (href: string, label: string, primary: boolean) =>
    `<a href="${esc(href)}" style="display:inline-block;margin:0 8px 10px 0;padding:13px 22px;border-radius:999px;font-family:${FONT};font-size:15px;font-weight:700;line-height:18px;white-space:nowrap;text-decoration:none;${
      primary
        ? `background:${C.lime};color:${C.forest};border:1.5px solid ${C.lime};`
        : `background:transparent;color:#ffffff;border:1.5px solid rgba(241,242,237,0.45);`
    }">${esc(label)}</a>`;

  const replySubject = encodeURIComponent(`Re: ajánlatkérés, ${d.szolgaltatas}, ${d.helyszin}`);
  const buttons = [
    d.telefon ? button(telLink(d.telefon), `Hívás: ${d.telefon}`, true) : "",
    d.email ? button(`mailto:${d.email}?subject=${replySubject}`, "Válasz e-mailben", !d.telefon) : "",
  ].join("");

  const preheader = `${d.nev} · ${d.szolgaltatas} · ${d.helyszin}${d.telefon ? ` · ${d.telefon}` : ""}`;

  const html = `<!doctype html>
<html lang="hu">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${C.paper};-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.paper};">
    <tr>
      <td align="center" style="padding:28px 14px 36px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;font-family:${FONT};">

          <!-- fejléc -->
          <tr>
            <td style="background:${C.forest};border-radius:20px 20px 0 0;padding:26px 30px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size:20px;line-height:24px;font-weight:800;letter-spacing:-0.4px;color:#ffffff;">Geoscan<span style="color:${C.lime};">3D</span></td>
                  <td align="right" style="font-size:12px;line-height:16px;color:${C.onDark};">${esc(when)}</td>
                </tr>
              </table>
              <div style="margin-top:28px;">
                <span style="display:inline-block;padding:5px 11px;border-radius:999px;background:${C.lime};color:${C.forest};font-size:11px;line-height:14px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;">Új ajánlatkérés</span>
              </div>
              <div style="margin-top:14px;font-size:30px;line-height:34px;font-weight:800;letter-spacing:-0.8px;color:#ffffff;">${esc(d.nev)}</div>
              <div style="margin-top:8px;font-size:16px;line-height:22px;color:${C.onDark};">${esc(d.szolgaltatas)} &nbsp;·&nbsp; ${esc(d.helyszin)}</div>
              ${
                buttons
                  ? `<div style="margin-top:22px;font-size:0;line-height:0;">${buttons}</div>`
                  : ""
              }
            </td>
          </tr>

          <!-- adatok -->
          <tr>
            <td style="background:#ffffff;padding:10px 30px 6px;">
              <div style="padding-top:18px;font-size:12px;line-height:16px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:${C.forest2};">Adatok</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:6px;">${rowsHtml}
              </table>
            </td>
          </tr>

          <!-- üzenet -->
          <tr>
            <td style="background:#ffffff;border-radius:0 0 20px 20px;padding:12px 30px 30px;">
              <div style="font-size:12px;line-height:16px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:${C.forest2};">Üzenet</div>
              <div style="margin-top:10px;padding:18px 20px;border-radius:14px;background:${C.paper};border-left:4px solid ${C.lime};font-size:16px;line-height:25px;color:${C.ink};">${message}</div>
            </td>
          </tr>

          <!-- lábléc -->
          <tr>
            <td style="padding:20px 30px 0;font-size:12.5px;line-height:19px;color:${C.muted};text-align:center;">
              A geoscan3d.hu ajánlatkérő űrlapjáról érkezett.${d.email ? " Erre a levélre válaszolva közvetlenül az érdeklődőnek ír." : ""}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}
