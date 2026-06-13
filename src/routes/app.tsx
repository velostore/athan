import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "تحميل تطبيق أذان — مواقيت الصلاة" },
      { name: "description", content: "حمّل تطبيق أذان لمواقيت الصلاة على جميع أجهزتك" },
    ],
  }),
  component: AppPage,
});

function AppPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <header className="flex items-center justify-between p-4 sm:p-6 max-w-4xl mx-auto">
        <Link to="/" className="w-11 h-11 rounded-2xl bg-card border border-border grid place-items-center hover:bg-secondary transition shadow-lg" aria-label="الرئيسية">
          <span className="text-xl">🏠</span>
        </Link>
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold gold-shimmer font-display">أذان</h1>
          <p className="text-xs text-muted-foreground">مواقيت الصلاة</p>
        </div>
        <div className="w-11" />
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-16 space-y-12">
        {/* Hero */}
        <section className="text-center space-y-6 pt-4">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary/30 to-background border border-border grid place-items-center shadow-2xl">
            <span className="text-5xl">🕌</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-display">تطبيق أذان</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              مواقيت الصلاة لدول الخليج مع مشاهد تفاعلية وعد تنازلي للصلاة القادمة
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: "🕌", title: "مواقيت دقيقة", desc: "مواقيت الصلاة لـ 35+ مدينة خليجية بطريقة أم القرى وهيئة الخليج" },
            { icon: "🌙", title: "مشاهد تفاعلية", desc: "سماء متغيرة حسب وقت الصلاة مع مسجد ثلاثي الأبعاد ونجوم متحركة" },
            { icon: "⏰", title: "عد تنازلي", desc: "مؤقت مباشر للصلاة القادمة مع إشعار بوقت الأذان" },
            { icon: "📍", title: "تحديد تلقائي", desc: "كشف الموقع تلقائياً أو اختيار المدينة يدوياً من القائمة" },
            { icon: "🌄", title: "ثيمات بصرية", desc: "5 ثيمات مختلفة لكل صلاة: الفجر، الظهر، العصر، المغرب، العشاء" },
            { icon: "📱", title: "بدون إنترنت", desc: "اشتغل بدون اتصال بعد تحميل المواقيت (PWA)" },
          ].map((f, i) => (
            <div key={i} className="p-5 rounded-2xl border border-border bg-card hover:shadow-lg transition">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Download */}
        <section className="text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-display">حمّل التطبيق الآن</h2>
          <p className="text-muted-foreground">اختر الطريقة المناسبة لجهازك</p>

          {/* Desktop app downloads */}
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/YOUR_USERNAME/athan/releases/latest/download/athan_1.0.0_x64.msi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow-lg"
            >
              <span className="text-2xl">🪟</span>
              <div className="text-right">
                <div>Windows</div>
                <div className="text-xs opacity-80">تنزيل .msi</div>
              </div>
            </a>
            <a
              href="https://github.com/YOUR_USERNAME/athan/releases/latest/download/athan_1.0.0_x64.dmg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-secondary text-foreground font-semibold hover:bg-primary hover:text-primary-foreground transition shadow-lg border border-border"
            >
              <span className="text-2xl">🍎</span>
              <div className="text-right">
                <div>macOS</div>
                <div className="text-xs opacity-80">تنزيل .dmg</div>
              </div>
            </a>
            <a
              href="https://github.com/YOUR_USERNAME/athan/releases/latest/download/athan_1.0.0_x86_64.AppImage"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-secondary text-foreground font-semibold hover:bg-primary hover:text-primary-foreground transition shadow-lg border border-border"
            >
              <span className="text-2xl">🐧</span>
              <div className="text-right">
                <div>Linux</div>
                <div className="text-xs opacity-80">تنزيل .AppImage</div>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-xs max-w-md mx-auto">
            <div className="flex-1 h-px bg-border" />
            <span>أو</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                if ("serviceWorker" in navigator) {
                  const installEvent = new Event("beforeinstallprompt");
                  window.dispatchEvent(installEvent);
                } else {
                  alert("لإضافة التطبيق إلى شاشتك الرئيسية:\n1. افتح قائمة المتصفح\n2. اختر 'إضافة إلى الشاشة الرئيسية'");
                }
              }}
              className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-card border border-border text-foreground font-semibold hover:bg-secondary transition shadow-lg"
            >
              <span className="text-2xl">📲</span>
              <div className="text-right">
                <div>نسخة PWA</div>
                <div className="text-xs opacity-80">يُثبّت من المتصفح</div>
              </div>
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-card border border-border text-foreground font-semibold hover:bg-secondary transition shadow-lg"
            >
              <span className="text-2xl">🌐</span>
              <div className="text-right">
                <div>النسخة الإلكترونية</div>
                <div className="text-xs opacity-80">استخدم الموقع مباشرة</div>
              </div>
            </Link>
          </div>
        </section>

        {/* How to install */}
        <section className="max-w-lg mx-auto space-y-4">
          <h3 className="text-xl font-bold text-foreground text-center">طريقة التثبيت</h3>
          <div className="space-y-3">
            {[
              { step: "١", title: "اختر نظامك", desc: "Windows • macOS • Linux — التحديث التلقائي مشغل تلقائياً" },
              { step: "٢", title: "حمّل وثبّت", desc: "ملف صغير (بحجم 5-10MB) ولا يحتاج صلاحيات خاصة" },
              { step: "٣", title: "استمتع بالتطبيق", desc: "التطبيق يشتغل بدون إنترنت ويجيب آخر المواقيت تلقائياً" },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                <div className="w-10 h-10 rounded-xl bg-primary/20 grid place-items-center text-primary font-bold shrink-0">
                  {s.step}
                </div>
                <div>
                  <div className="font-bold text-foreground">{s.title}</div>
                  <div className="text-sm text-muted-foreground">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground border-t border-border pt-8">
          <p>© 2024 — 2026 أذان. جميع الحقوق محفوظة.</p>
          <p className="mt-1">
            <Link to="/" className="hover:text-foreground transition">الرئيسية</Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
