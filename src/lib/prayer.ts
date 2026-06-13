export type PrayerKey = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

export const PRAYERS: { key: PrayerKey; ar: string; icon: string }[] = [
  { key: "Fajr", ar: "الفجر", icon: "🌙" },
  { key: "Dhuhr", ar: "الظهر", icon: "☀️" },
  { key: "Asr", ar: "العصر", icon: "🌤️" },
  { key: "Maghrib", ar: "المغرب", icon: "🌅" },
  { key: "Isha", ar: "العشاء", icon: "✨" },
];

export type ThemeKey = PrayerKey;

export const THEMES: Record<ThemeKey, {
  skyTop: string; skyMid: string; skyBot: string;
  ground: string; mosque: string; accent: string;
  hasSun: boolean; hasMoon: boolean; hasStars: boolean;
  glow: string;
}> = {
  Fajr: { skyTop: "#0A0520", skyMid: "#3A2080", skyBot: "#FF9FBB", ground: "#1A0840", mosque: "#0D0628", accent: "#C89BFF", hasSun: false, hasMoon: true, hasStars: true, glow: "#7A4AFF" },
  Dhuhr: { skyTop: "#0055CC", skyMid: "#0088FF", skyBot: "#87CEEB", ground: "#2D5F1F", mosque: "#1A3D14", accent: "#FFD740", hasSun: true, hasMoon: false, hasStars: false, glow: "#FFD740" },
  Asr: { skyTop: "#1E5AA8", skyMid: "#4A90C8", skyBot: "#F0C878", ground: "#5A4020", mosque: "#3A2810", accent: "#FFA64D", hasSun: true, hasMoon: false, hasStars: false, glow: "#FFA64D" },
  Maghrib: { skyTop: "#2A1040", skyMid: "#C8447A", skyBot: "#FF7548", ground: "#2A0A30", mosque: "#150518", accent: "#FFB070", hasSun: true, hasMoon: false, hasStars: false, glow: "#FF7548" },
  Isha: { skyTop: "#02030E", skyMid: "#0A1844", skyBot: "#1A2A6A", ground: "#020414", mosque: "#01020A", accent: "#7AB8FF", hasSun: false, hasMoon: true, hasStars: true, glow: "#4A78D0" },
};

export type City = { name: string; country: string; countryCode: string };

export const GULF_CITIES: City[] = [
  // KSA
  { name: "مكة المكرمة", country: "Saudi Arabia", countryCode: "SA" },
  { name: "المدينة المنورة", country: "Saudi Arabia", countryCode: "SA" },
  { name: "الرياض", country: "Saudi Arabia", countryCode: "SA" },
  { name: "جدة", country: "Saudi Arabia", countryCode: "SA" },
  { name: "الدمام", country: "Saudi Arabia", countryCode: "SA" },
  { name: "الخبر", country: "Saudi Arabia", countryCode: "SA" },
  { name: "الطائف", country: "Saudi Arabia", countryCode: "SA" },
  { name: "تبوك", country: "Saudi Arabia", countryCode: "SA" },
  { name: "أبها", country: "Saudi Arabia", countryCode: "SA" },
  { name: "حائل", country: "Saudi Arabia", countryCode: "SA" },
  { name: "بريدة", country: "Saudi Arabia", countryCode: "SA" },
  { name: "الأحساء", country: "Saudi Arabia", countryCode: "SA" },
  // UAE
  { name: "أبوظبي", country: "United Arab Emirates", countryCode: "AE" },
  { name: "دبي", country: "United Arab Emirates", countryCode: "AE" },
  { name: "الشارقة", country: "United Arab Emirates", countryCode: "AE" },
  { name: "العين", country: "United Arab Emirates", countryCode: "AE" },
  { name: "عجمان", country: "United Arab Emirates", countryCode: "AE" },
  { name: "رأس الخيمة", country: "United Arab Emirates", countryCode: "AE" },
  { name: "الفجيرة", country: "United Arab Emirates", countryCode: "AE" },
  // Kuwait
  { name: "مدينة الكويت", country: "Kuwait", countryCode: "KW" },
  { name: "حولي", country: "Kuwait", countryCode: "KW" },
  { name: "الأحمدي", country: "Kuwait", countryCode: "KW" },
  { name: "الجهراء", country: "Kuwait", countryCode: "KW" },
  // Qatar
  { name: "الدوحة", country: "Qatar", countryCode: "QA" },
  { name: "الريان", country: "Qatar", countryCode: "QA" },
  { name: "الوكرة", country: "Qatar", countryCode: "QA" },
  // Bahrain
  { name: "المنامة", country: "Bahrain", countryCode: "BH" },
  { name: "المحرق", country: "Bahrain", countryCode: "BH" },
  { name: "الرفاع", country: "Bahrain", countryCode: "BH" },
  // Oman
  { name: "مسقط", country: "Oman", countryCode: "OM" },
  { name: "صلالة", country: "Oman", countryCode: "OM" },
  { name: "صحار", country: "Oman", countryCode: "OM" },
  { name: "نزوى", country: "Oman", countryCode: "OM" },
];

export type Timings = Record<PrayerKey, string>;
export type DayData = {
  timings: Timings;
  hijri: string;
  gregorian: string;
  weekdayAr: string;
};

const WEEKDAYS_AR = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

import { isSafeCityName, isSafeCountryCode, isValidTime, validateTimingsRecord, sanitizeHtml } from "./sanitize";

function validateApiResponse(raw: unknown): DayData | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  if (!d.data || typeof d.data !== "object") return null;
  const data = d.data as Record<string, unknown>;
  if (!data.timings || typeof data.timings !== "object") return null;
  const timings = validateTimingsRecord(data.timings as Record<string, unknown>);
  if (!timings) return null;
  const hijri = data.date && typeof data.date === "object"
    ? (data.date as Record<string, unknown>).hijri as Record<string, unknown>
    : null;
  const greg = data.date && typeof data.date === "object"
    ? (data.date as Record<string, unknown>).gregorian as Record<string, unknown>
    : null;
  if (!hijri || !greg) return null;
  const hijriDay = typeof hijri.day === "string" ? hijri.day : "";
  const hijriMonth = hijri.month && typeof hijri.month === "object"
    ? (hijri.month as Record<string, unknown>).ar ?? ""
    : "";
  const hijriYear = typeof hijri.year === "string" ? hijri.year : "";
  const gregDay = typeof greg.day === "string" ? greg.day : "";
  const gregMonth = typeof greg.month === "object"
    ? ((greg.month as Record<string, unknown>).number ?? "")
    : "";
  const gregYear = typeof greg.year === "string" ? greg.year : "";
  return {
    timings,
    hijri: `${hijriDay} ${hijriMonth} ${hijriYear}هـ`,
    gregorian: `${gregDay}/${gregMonth}/${gregYear}`,
    weekdayAr: WEEKDAYS_AR[Math.min(6, Math.max(0, (date ?? new Date()).getDay()))],
  };
}

export async function fetchTimings(city: City, date = new Date()): Promise<DayData> {
  if (!isSafeCityName(city.name)) throw new Error("Invalid city name");
  if (!isSafeCountryCode(city.countryCode)) throw new Error("Invalid country code");
  const d = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
  const method = city.countryCode === "SA" ? 4 : 8;
  const url = `https://api.aladhan.com/v1/timingsByCity/${d}?city=${encodeURIComponent(city.name)}&country=${encodeURIComponent(city.country)}&method=${method}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("fetch failed");
  const data = await res.json();
  const validated = validateApiResponse(data);
  if (!validated) throw new Error("Invalid API response");
  return validated;
}

export async function fetchByCoords(lat: number, lon: number, date = new Date()): Promise<DayData> {
  if (!Number.isFinite(lat) || Math.abs(lat) > 90) throw new Error("Invalid latitude");
  if (!Number.isFinite(lon) || Math.abs(lon) > 180) throw new Error("Invalid longitude");
  const d = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
  const url = `https://api.aladhan.com/v1/timings/${d}?latitude=${lat}&longitude=${lon}&method=4`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("fetch failed");
  const data = await res.json();
  const validated = validateApiResponse(data);
  if (!validated) throw new Error("Invalid API response");
  return validated;
}

export function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function nowMinutes(d = new Date()): number {
  return d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60;
}

export type Countdown = {
  state: "before" | "athan"; // before: counting down to next prayer; athan: within 30min after prayer time
  prayer: PrayerKey;
  prayerAr: string;
  totalMinutesLeft: number; // can be fractional
  label: string;
  current: PrayerKey; // theme prayer
};

export function computeCountdown(timings: Timings, now = new Date()): Countdown {
  const m = nowMinutes(now);
  const order: PrayerKey[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  // Find current "active" prayer (last one whose time has passed, within 30min => athan state)
  for (let i = order.length - 1; i >= 0; i--) {
    const k = order[i];
    const t = timeToMinutes(timings[k]);
    if (m >= t && m < t + 30) {
      const elapsed = m - t;
      const left = 30 - elapsed;
      return {
        state: "athan",
        prayer: k,
        prayerAr: PRAYERS.find(p => p.key === k)!.ar,
        totalMinutesLeft: left,
        label: `الأذان قائم — ${PRAYERS.find(p => p.key === k)!.ar}`,
        current: k,
      };
    }
  }

  // Otherwise find next prayer
  for (const k of order) {
    const t = timeToMinutes(timings[k]);
    if (t > m) {
      // determine "current" theme as previous prayer
      const idx = order.indexOf(k);
      const currentTheme = idx === 0 ? "Isha" : order[idx - 1];
      return {
        state: "before",
        prayer: k,
        prayerAr: PRAYERS.find(p => p.key === k)!.ar,
        totalMinutesLeft: t - m,
        label: `باقي على ${PRAYERS.find(p => p.key === k)!.ar}`,
        current: currentTheme,
      };
    }
  }
  // after Isha -> next is Fajr tomorrow
  const t = timeToMinutes(timings.Fajr) + 24 * 60;
  return {
    state: "before",
    prayer: "Fajr",
    prayerAr: "الفجر",
    totalMinutesLeft: t - m,
    label: "باقي على الفجر",
    current: "Isha",
  };
}

export function formatCountdown(mins: number): string {
  const total = Math.max(0, Math.floor(mins * 60));
  const h = Math.floor(total / 3600);
  const mm = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  if (h > 0) return `${pad(h)}:${pad(mm)}:${pad(s)}`;
  return `${pad(mm)}:${pad(s)}`;
}

export function formatTime12(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "م" : "ص";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}
