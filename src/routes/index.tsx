import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  PRAYERS,
  THEMES,
  computeCountdown,
  fetchByCoords,
  fetchTimings,
  formatCountdown,
  formatTime12,
  type City,
  type DayData,
  type PrayerKey,
} from "@/lib/prayer";
import MosqueScene from "@/components/MosqueScene";
import LocationPicker from "@/components/LocationPicker";
import InstallPrompt from "@/components/InstallPrompt";
import { safeJsonParse, isSafeCityName, isSafeCountryCode, sanitizeHtml } from "@/lib/sanitize";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "أذان — مواقيت الصلاة" },
      { name: "description", content: "مواقيت الصلاة لدول الخليج مع أجواء تفاعلية" },
    ],
  }),
  component: Index,
});

type SavedLoc = { mode: "auto" | "manual"; city: City };

function Index() {
  const [loc, setLoc] = useState<SavedLoc | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [day, setDay] = useState<DayData | null>(null);
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(new Date());
  const [error, setError] = useState<string | null>(null);

  // Load saved (with validation)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("athan.loc");
      if (!raw) { setShowPicker(true); return; }
      const parsed = safeJsonParse<SavedLoc>(raw, null as unknown as SavedLoc);
      if (!parsed || typeof parsed.mode !== "string" || !parsed.city) {
        setShowPicker(true);
        return;
      }
      if (parsed.mode === "manual" && (!isSafeCityName(parsed.city.name) || !isSafeCountryCode(parsed.city.countryCode))) {
        setShowPicker(true);
        return;
      }
      setLoc(parsed);
    } catch {
      setShowPicker(true);
    }
  }, []);

  // Tick
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Fetch
  useEffect(() => {
    if (!loc) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    const run = async () => {
      try {
        let d: DayData;
        if (loc.mode === "auto") {
          const [lat, lon] = loc.city.name.split(",").map(Number);
          d = await fetchByCoords(lat, lon);
        } else {
          d = await fetchTimings(loc.city);
        }
        if (!cancelled) setDay(d);
      } catch {
        if (!cancelled) setError("تعذر جلب أوقات الصلاة. تحقق من الاتصال.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    // refresh at midnight
    const next = new Date();
    next.setHours(24, 0, 30, 0);
    const t = setTimeout(run, next.getTime() - Date.now());
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [loc]);

  const countdown = useMemo(() => (day ? computeCountdown(day.timings, now) : null), [day, now]);
  const themeKey: PrayerKey = countdown?.current ?? "Dhuhr";
  const theme = THEMES[themeKey];

  const handleSelect = (mode: "auto" | "manual", city?: City) => {
    if (!city) return;
    const saved: SavedLoc = { mode, city };
    localStorage.setItem("athan.loc", JSON.stringify(saved));
    setLoc(saved);
    setShowPicker(false);
    setShowSettings(false);
  };

  return (
    <div dir="rtl" className="min-h-screen w-full p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSettings(true)}
            className="w-11 h-11 rounded-2xl bg-card border border-border grid place-items-center hover:bg-secondary transition shadow-lg"
            aria-label="الإعدادات"
            title="الإعدادات"
          >
            <span className="text-xl">⚙️</span>
          </button>
          <button
            onClick={() => setShowPicker(true)}
            className="w-11 h-11 rounded-2xl bg-card border border-border grid place-items-center hover:bg-secondary transition shadow-lg"
            aria-label="الموقع"
            title="تغيير الموقع"
          >
            <span className="text-xl">📍</span>
          </button>
          <Link
            to="/immersive"
            className="w-11 h-11 rounded-2xl bg-card border border-border grid place-items-center hover:bg-secondary transition shadow-lg"
            aria-label="وضع غامر"
            title="وضع غامر"
          >
            <span className="text-xl">🕌</span>
          </Link>
          <Link
            to="/app"
            className="w-11 h-11 rounded-2xl bg-primary border border-primary grid place-items-center hover:opacity-90 transition shadow-lg"
            aria-label="تحميل التطبيق"
            title="تحميل التطبيق"
          >
            <span className="text-lg">📲</span>
          </Link>
        </div>


        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold gold-shimmer font-display">أذان</h1>
          <p className="text-xs text-muted-foreground mt-0.5">مواقيت الصلاة</p>
        </div>

        <div className="flex flex-col items-end gap-1 text-right">
          <div className="px-3 py-1.5 rounded-lg bg-card border border-border text-sm">
            <span className="text-muted-foreground text-xs">ميلادي</span>{" "}
            <span className="font-semibold text-foreground">{day?.gregorian ?? "—"}</span>
          </div>
        </div>
      </header>

      <div className="flex justify-between items-center mb-4 px-1">
        <div className="px-3 py-1.5 rounded-lg bg-card border border-border text-sm">
          <span className="text-muted-foreground text-xs">هجري</span>{" "}
          <span className="font-semibold text-foreground">{day?.hijri ?? "—"}</span>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">اليوم</p>
          <p className="text-lg font-bold text-foreground">{day?.weekdayAr ?? "—"}</p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-card border border-border text-sm">
          <span className="text-muted-foreground text-xs">📍</span>{" "}
          <span className="font-semibold text-foreground">
            {loc?.mode === "auto" ? "موقعي" : sanitizeHtml(loc?.city.name ?? "—")}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Scene + countdown */}
        <section className="lg:col-span-3 space-y-4">
          <div className="aspect-[16/10] w-full rounded-3xl overflow-hidden border-2 shadow-2xl relative" style={{ borderColor: theme.accent + "55" }}>
            <MosqueScene theme={themeKey} transitionKey={themeKey + (countdown?.state ?? "")} />
            {/* Overlay countdown card */}
            {countdown && (
              <div key={countdown.prayer + countdown.state} className="absolute inset-x-4 bottom-4 slide-up">
                <div
                  className="rounded-2xl backdrop-blur-xl border p-4 sm:p-5 flex items-center justify-between"
                  style={{
                    background: "rgba(0,0,0,0.45)",
                    borderColor: theme.accent + "66",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-14 h-14 rounded-2xl grid place-items-center text-3xl ${countdown.state === "athan" ? "pulse-ring" : ""}`}
                      style={{ background: theme.accent + "30", border: `1.5px solid ${theme.accent}` }}
                    >
                      {PRAYERS.find(p => p.key === countdown.prayer)?.icon}
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">{countdown.label}</p>
                      <p className="text-2xl sm:text-3xl font-bold text-white tracking-wider tabular-nums">
                        {formatCountdown(countdown.totalMinutesLeft)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-xs">الوقت الآن</p>
                    <p className="text-xl font-bold text-white tabular-nums">
                      {now.toLocaleTimeString("ar-SA-u-nu-latn", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-destructive/15 border border-destructive/40 text-sm text-destructive-foreground">
              {error}
            </div>
          )}
          {loading && !day && (
            <div className="p-4 rounded-2xl bg-card border border-border text-sm text-muted-foreground animate-pulse">
              جاري جلب المواقيت...
            </div>
          )}
        </section>

        {/* Prayer table */}
        <section className="lg:col-span-2">
          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-2xl">
            <div className="px-5 py-4 bg-gradient-to-l from-primary/15 to-transparent border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">جدول الصلوات</h2>
              <span className="text-2xl">🕌</span>
            </div>
            <ul className="divide-y divide-border">
              {PRAYERS.map((p, i) => {
                const time = day?.timings[p.key];
                const isNext = countdown?.prayer === p.key && countdown.state === "before";
                const isCurrent = countdown?.prayer === p.key && countdown.state === "athan";
                const th = THEMES[p.key];
                return (
                  <li
                    key={p.key}
                    className={`flex items-center justify-between px-5 py-4 transition slide-up ${isNext ? "bg-primary/10" : isCurrent ? "bg-primary/20" : ""}`}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {/* Right: name */}
                    <div className="flex items-center gap-2 min-w-[90px]">
                      <span className="font-bold text-lg text-foreground font-display">{p.ar}</span>
                      {isNext && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground">التالي</span>}
                      {isCurrent && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground animate-pulse">قائم</span>}
                    </div>
                    {/* Middle: icon */}
                    <div
                      className="w-12 h-12 rounded-2xl grid place-items-center text-2xl shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${th.skyMid}, ${th.skyBot})`,
                        boxShadow: `0 4px 16px ${th.glow}55`,
                      }}
                    >
                      {p.icon}
                    </div>
                    {/* Left: time */}
                    <div className="text-left min-w-[90px]">
                      <p className="text-xs text-muted-foreground">يؤذن</p>
                      <p className="font-bold text-lg tabular-nums text-foreground">{time ? formatTime12(time) : "—"}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="px-5 py-3 bg-secondary/40 text-xs text-muted-foreground text-center">
              {loc?.city.country ? `${loc.city.country}` : "—"} • طريقة الحساب: {loc?.city.countryCode === "SA" ? "أم القرى" : "هيئة الخليج"}
            </div>
          </div>
        </section>
      </div>

      <LocationPicker open={showPicker} onSelect={handleSelect} />
      <InstallPrompt />

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-xl" onClick={() => setShowSettings(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-3xl border border-border bg-card shadow-2xl p-6 space-y-4" dir="rtl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 grid place-items-center text-2xl">⚙️</div>
              <h2 className="text-2xl font-bold text-foreground">الإعدادات</h2>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">الموقع الحالي</p>
              <div className="p-3 rounded-xl bg-secondary text-foreground">
                {loc?.mode === "auto"
                  ? `موقعي تلقائياً (${sanitizeHtml(loc.city.name)})`
                  : `${sanitizeHtml(loc?.city.name ?? "")} — ${sanitizeHtml(loc?.city.country ?? "")}`}
              </div>
            </div>
            <button
              onClick={() => { setShowSettings(false); setShowPicker(true); }}
              className="w-full p-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
            >
              تغيير الموقع
            </button>
            <button
              onClick={() => setShowSettings(false)}
              className="w-full p-3 rounded-xl bg-secondary text-foreground hover:bg-secondary/80 transition"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
