import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShow(false);
    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md" dir="rtl">
      <div className="rounded-2xl border border-border bg-card shadow-2xl p-4 flex items-center gap-3 backdrop-blur-xl">
        <div className="w-12 h-12 rounded-xl bg-primary/20 grid place-items-center shrink-0 text-2xl">🕌</div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-foreground text-sm">ثبّت تطبيق أذان</p>
          <p className="text-xs text-muted-foreground">مواقيت الصلاة بدون إنترنت</p>
        </div>
        <button
          onClick={handleInstall}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition shrink-0"
        >
          تثبيت
        </button>
        <button
          onClick={() => setShow(false)}
          className="w-8 h-8 rounded-lg grid place-items-center text-muted-foreground hover:bg-secondary transition shrink-0"
          aria-label="إغلاق"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
