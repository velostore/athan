import { useMemo, useState } from "react";
import { GULF_CITIES, type City } from "@/lib/prayer";

type Props = {
  open: boolean;
  onSelect: (mode: "auto" | "manual", city?: City) => void;
};

export default function LocationPicker({ open, onSelect }: Props) {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState<string>("all");

  const countries = useMemo(() => {
    const set = new Map<string, string>();
    GULF_CITIES.forEach(c => set.set(c.countryCode, c.country));
    return [{ code: "all", name: "كل الدول" }, ...Array.from(set, ([code, name]) => ({ code, name }))];
  }, []);

  const filtered = GULF_CITIES.filter(
    c =>
      (country === "all" || c.countryCode === country) &&
      (search === "" || c.name.includes(search))
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-xl" dir="rtl">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-border bg-gradient-to-l from-primary/15 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 grid place-items-center text-2xl">🕌</div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">اختر موقعك</h2>
              <p className="text-sm text-muted-foreground">لحساب أوقات الصلاة بدقة</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <button
            onClick={() => {
              if (!navigator.geolocation) {
                alert("الموقع التلقائي غير مدعوم في متصفحك");
                return;
              }
              navigator.geolocation.getCurrentPosition(
                (pos) => onSelect("auto", { name: `${pos.coords.latitude.toFixed(3)},${pos.coords.longitude.toFixed(3)}`, country: "auto", countryCode: "AUTO" }),
                () => alert("تعذّر تحديد الموقع")
              );
            }}
            className="w-full flex items-center justify-between gap-3 p-4 rounded-2xl bg-primary text-primary-foreground hover:opacity-90 transition shadow-lg shadow-primary/30"
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl">📍</span>
              <span className="font-semibold">تحديد موقعي تلقائياً</span>
            </span>
            <span className="text-sm opacity-80">GPS</span>
          </button>

          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <div className="flex-1 h-px bg-border" />
            <span>أو اختر يدوياً</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 ابحث عن مدينة..."
              className="flex-1 px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="px-4 py-3 rounded-xl bg-secondary text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {countries.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1">
            {filtered.map((c) => (
              <button
                key={`${c.countryCode}-${c.name}`}
                onClick={() => onSelect("manual", c)}
                className="p-3 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground transition text-right group"
              >
                <div className="font-semibold text-foreground group-hover:text-primary-foreground">{c.name}</div>
                <div className="text-xs text-muted-foreground group-hover:text-primary-foreground/80">{c.country}</div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">لا توجد نتائج</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
