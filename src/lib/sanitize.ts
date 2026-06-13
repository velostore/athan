// =============================================================================
// Input sanitization utilities
// =============================================================================

const PRAYER_KEYS = new Set(["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]);

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const COORD_PATTERN = /^-?\d{1,2}\.\d+,-?\d{1,3}\.\d+$/;
const CITY_NAME_PATTERN = /^[\u0600-\u06FF\s\-'a-zA-Z]+$/;
const COUNTRY_CODE_PATTERN = /^[A-Z]{2,4}$/;

export function isValidPrayerKey(k: string): k is "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha" {
  return PRAYER_KEYS.has(k);
}

export function isValidTime(t: string): boolean {
  return TIME_PATTERN.test(t);
}

export function isValidCoordString(s: string): boolean {
  return COORD_PATTERN.test(s);
}

export function isSafeCityName(name: string, maxLen = 50): boolean {
  if (typeof name !== "string") return false;
  if (name.length === 0 || name.length > maxLen) return false;
  return CITY_NAME_PATTERN.test(name);
}

export function isSafeCountryCode(code: string): boolean {
  if (typeof code !== "string") return false;
  if (code.length < 2 || code.length > 4) return false;
  return COUNTRY_CODE_PATTERN.test(code);
}

export function sanitizeSearchTerm(term: string, maxLen = 50): string {
  if (typeof term !== "string") return "";
  return term.slice(0, maxLen).replace(/[<>&"'`]/g, "").trim();
}

export function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export function validateTimingsRecord(
  raw: Record<string, unknown>
): Record<string, string> | null {
  const result: Record<string, string> = {};
  for (const key of PRAYER_KEYS) {
    const val = raw[key];
    if (typeof val !== "string" || !isValidTime(val)) return null;
    result[key] = val;
  }
  return result;
}

export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}
