"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { software } from "@/lib/content";
import { services } from "@/lib/services";
import { isSet, site, telHref } from "@/lib/site";
import { isValidPhone, sanitizePhone } from "@/lib/phone";
import { track } from "./Analytics";

const phoneError = (raw: string) => {
  const tel = raw.trim();
  if (!tel) return "Adja meg a telefonszámát, hogy vissza tudjam hívni.";
  if (!isValidPhone(tel)) return "Ez nem szabályos telefonszám. Például: +36 30 123 4567 vagy 06 1 234 5678.";
  return "";
};

type Status = { kind: "idle" | "sending" | "sent" } | { kind: "fallback"; mailto: string } | { kind: "error"; message: string };

const fieldsOrder = ["nev", "telefon", "email", "szolgaltatas", "helyszin", "szoftver", "uzenet"] as const;

export function QuoteForm({ defaultService = "", defaultPlace = "", defaultSoftware = "", defaultMessage = "" }: { defaultService?: string; defaultPlace?: string; defaultSoftware?: string; defaultMessage?: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [sw, setSw] = useState(defaultSoftware);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const on = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      const name = software.find((s) => s.id === id)?.name;
      if (name) setSw(name);
    };
    window.addEventListener("software-pick", on);
    return () => window.removeEventListener("software-pick", on);
  }, []);

  const validate = (fd: FormData) => {
    const e: Record<string, string> = {};
    if (!String(fd.get("nev") ?? "").trim()) e.nev = "Adja meg a nevét.";
    const telErr = phoneError(String(fd.get("telefon") ?? ""));
    if (telErr) e.telefon = telErr;
    const mail = String(fd.get("email") ?? "").trim();
    if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) e.email = "Ellenőrizze az e-mail-címet, például nev@example.hu.";
    if (!String(fd.get("szolgaltatas") ?? "")) e.szolgaltatas = "Válassza ki, mit kell felmérni.";
    if (!String(fd.get("helyszin") ?? "").trim()) e.helyszin = "Adja meg a települést.";
    return e;
  };

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const fd = new FormData(form);
    const e = validate(fd);
    setErrors(e);
    if (Object.keys(e).length) {
      const first = fieldsOrder.find((k) => e[k]);
      if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus({ kind: "sending" });
    const data = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/ajanlat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) {
        // GA4 ajánlott konverziós esemény; csak hozzájárulás esetén megy ki. Személyes adat nem kerül bele.
        track("generate_lead", { form: "ajanlatkeres", service: String(data.szolgaltatas ?? "") });
        setStatus({ kind: "sent" });
        form.reset();
        return;
      }
      if (res.status === 503) {
        setStatus({ kind: "fallback", mailto: buildMailto(data) });
        return;
      }
      const j = await res.json().catch(() => ({}));
      setStatus({ kind: "error", message: j.message ?? "A küldés nem sikerült. Próbálja újra, vagy hívjon." });
    } catch {
      setStatus({ kind: "fallback", mailto: buildMailto(data) });
    }
  };

  if (status.kind === "sent") {
    return (
      <div className="form-done" role="status">
        <h3>Megkaptam az ajánlatkérést.</h3>
        <p>A megadott elérhetőségen jelentkezem. Ha sürgős, hívjon: <a href={telHref}>{site.phoneDisplay}</a>.</p>
      </div>
    );
  }

  const err = (k: string) =>
    errors[k] ? (
      <span id={`${k}-err`} className="field-err">{errors[k]}</span>
    ) : null;
  const describedBy = (k: string, hint?: string) => [errors[k] ? `${k}-err` : "", hint ?? ""].filter(Boolean).join(" ") || undefined;
  const setFieldError = (k: string, msg: string) =>
    setErrors((prev) => {
      if ((prev[k] ?? "") === msg) return prev;
      const next = { ...prev };
      if (msg) next[k] = msg;
      else delete next[k];
      return next;
    });
  const req = <span className="req" aria-hidden="true">*</span>;

  return (
    <form ref={formRef} className="qform" noValidate onSubmit={onSubmit} aria-label="Ajánlatkérés">
      <div className="field">
        <label htmlFor="f-nev">Név {req}</label>
        <input id="f-nev" name="nev" autoComplete="name" required aria-invalid={!!errors.nev} aria-describedby={describedBy("nev")} />
        {err("nev")}
      </div>
      <div className="field">
        <label htmlFor="f-tel">Telefon {req}</label>
        <input
          id="f-tel"
          name="telefon"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          maxLength={24}
          placeholder="+36 30 123 4567"
          aria-invalid={!!errors.telefon}
          aria-describedby={describedBy("telefon")}
          onInput={(e) => {
            const el = e.currentTarget;
            const clean = sanitizePhone(el.value);
            if (clean !== el.value) el.value = clean;
            // Ha már hibát jeleztünk, gépelés közben frissítjük, hogy eltűnjön, amint jó.
            if (errors.telefon) setFieldError("telefon", phoneError(clean));
          }}
          onBlur={(e) => {
            if (e.currentTarget.value.trim()) setFieldError("telefon", phoneError(e.currentTarget.value));
          }}
        />
        {err("telefon")}
      </div>
      <div className="field">
        <label htmlFor="f-mail">E-mail</label>
        <input id="f-mail" name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={describedBy("email")} />
        {err("email")}
      </div>
      <div className="field">
        <label htmlFor="f-szolg">Mit kell felmérni? {req}</label>
        <select id="f-szolg" name="szolgaltatas" required defaultValue={defaultService} aria-invalid={!!errors.szolgaltatas} aria-describedby={describedBy("szolgaltatas")}>
          <option value="" disabled>Válasszon</option>
          {services.map((s) => (
            <option key={s.slug} value={s.name}>{s.name}</option>
          ))}
          <option value="Egyéb">Egyéb, leírom az üzenetben</option>
        </select>
        {err("szolgaltatas")}
      </div>
      <div className="field">
        <label htmlFor="f-hely">Helyszín (település) {req}</label>
        <input id="f-hely" name="helyszin" autoComplete="address-level2" required defaultValue={defaultPlace} aria-invalid={!!errors.helyszin} aria-describedby={describedBy("helyszin")} />
        {err("helyszin")}
      </div>
      <div className="field">
        <label htmlFor="f-sw">Miben dolgozik?</label>
        <select id="f-sw" name="szoftver" value={sw} onChange={(e) => setSw(e.target.value)}>
          <option value="">Nem tudom, vagy nem számít</option>
          {software.map((s) => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>
      <div className="field field-wide">
        <label htmlFor="f-uzenet">Üzenet</label>
        <textarea id="f-uzenet" name="uzenet" rows={4} defaultValue={defaultMessage} />
      </div>
      {/* Spam-csapda: ember nem látja, nem tölti ki. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="f-web">Weboldal</label>
        <input id="f-web" name="weboldal" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="field-wide qform-foot">
        <button type="submit" className="btn qform-submit" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Küldés…" : "Ajánlatot kérek"}
        </button>
        <p className="t-small">
          A <span className="req">*</span> jelölt mezők kitöltése kötelező. Az adatait csak az ajánlathoz használom. <Link href="/adatkezeles">Adatkezelési tájékoztató</Link>
        </p>
      </div>

      {status.kind === "fallback" ? (
        <div className="form-fallback field-wide" role="alert">
          <p>
            Az online küldés még nincs beállítva, ezért az üzenete nem ment el. Hívjon:{" "}
            <a href={telHref}>{site.phoneDisplay}</a>, vagy küldje el e-mailben, a kitöltött adatokkal együtt:
          </p>
          <a className="btn" href={status.mailto}>E-mail megnyitása</a>
        </div>
      ) : null}
      {status.kind === "error" ? (
        <p className="form-fallback field-wide" role="alert">{status.message}</p>
      ) : null}
    </form>
  );
}

function buildMailto(d: Record<string, FormDataEntryValue>) {
  const to = isSet(site.email) ? site.email : "";
  const lines = [
    `Név: ${d.nev ?? ""}`,
    `Telefon: ${d.telefon ?? ""}`,
    `E-mail: ${d.email ?? ""}`,
    `Szolgáltatás: ${d.szolgaltatas ?? ""}`,
    `Helyszín: ${d.helyszin ?? ""}`,
    `Szoftver: ${d.szoftver ?? ""}`,
    "",
    String(d.uzenet ?? ""),
  ];
  return `mailto:${to}?subject=${encodeURIComponent(`Ajánlatkérés: ${d.szolgaltatas ?? ""}, ${d.helyszin ?? ""}`)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

