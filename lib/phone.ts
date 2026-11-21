/** Telefonszám: csak számjegy, szóköz, +, -, /, zárójel írható be; a + csak az elején. */
export function sanitizePhone(raw: string) {
  const kept = raw.replace(/[^\d\s+()/-]/g, "");
  return kept.replace(/(?!^)\+/g, "");
}

/**
 * Szabályos-e a szám. Magyar formák: +36 / 0036 / 06 előtaggal vagy anélkül,
 * mobil (20, 30, 31, 50, 70 + 7 jegy), Budapest (1 + 7 jegy), vidéki (körzet + 6 jegy).
 * Külföldi szám: + és országkód, összesen 8–15 jegy.
 */
export function isValidPhone(raw: string) {
  const n = raw.replace(/[\s()/-]/g, "");
  const hu = /^(?:\+36|0036|06)?(?:(?:20|30|31|50|70)\d{7}|1\d{7}|(?!20|30|31|50|70)[2-9]\d{7})$/;
  if (hu.test(n)) return true;
  return /^\+(?!36)[1-9]\d{7,14}$/.test(n);
}
