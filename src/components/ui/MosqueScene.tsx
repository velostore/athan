import { useEffect, useRef, useState } from "react";
import { THEMES, type ThemeKey } from "@/lib/prayer";

type Props = { theme: ThemeKey; transitionKey: string };

export default function MosqueScene({ theme, transitionKey }: Props) {
  const t = THEMES[theme];
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    setFlash(true);
    const id = setTimeout(() => setFlash(false), 1200);
    return () => clearTimeout(id);
  }, [transitionKey]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setMouse({
        x: (e.clientX - r.left) / r.width,
        y: (e.clientY - r.top) / r.height,
      });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  const px = (mouse.x - 0.5) * 2; // -1..1
  const py = (mouse.y - 0.5) * 2;

  return (
    <div
      ref={ref}
      className="relative w-full h-full overflow-hidden rounded-3xl"
      style={{ background: `linear-gradient(to bottom, ${t.skyTop} 0%, ${t.skyMid} 55%, ${t.skyBot} 100%)` }}
    >
      {/* Stars */}
      {t.hasStars && (
        <div className="absolute inset-0">
          {Array.from({ length: 60 }).map((_, i) => {
            const seed = (i * 9301 + 49297) % 233280;
            const x = (seed % 100) + (i * 7) % 100;
            const y = (i * 13) % 60;
            const size = (i % 3) + 1;
            const delay = (i % 5) * 0.4;
            return (
              <div
                key={i}
                className="absolute rounded-full bg-white animate-pulse"
                style={{
                  left: `${x % 100}%`,
                  top: `${y}%`,
                  width: size,
                  height: size,
                  opacity: 0.6 + ((i % 4) * 0.1),
                  animationDelay: `${delay}s`,
                  transform: `translate(${px * 6}px, ${py * 6}px)`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Sun/Moon */}
      {(t.hasSun || t.hasMoon) && (
        <div
          className="absolute transition-transform duration-300 ease-out"
          style={{
            left: `${20 + mouse.x * 8}%`,
            top: `${12 + mouse.y * 6}%`,
            transform: `translate(${px * -10}px, ${py * -10}px)`,
          }}
        >
          <div
            className="rounded-full"
            style={{
              width: 90,
              height: 90,
              background: t.hasSun
                ? `radial-gradient(circle, #FFF6C0 0%, ${t.accent} 60%, transparent 75%)`
                : `radial-gradient(circle, #FFFCEB 0%, #E8DFC4 55%, transparent 70%)`,
              boxShadow: `0 0 80px 20px ${t.glow}66`,
            }}
          />
        </div>
      )}

      {/* Distant hills */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 300" preserveAspectRatio="none" style={{ height: "55%" }}>
        <defs>
          <linearGradient id="hillg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={t.mosque} stopOpacity="0.6" />
            <stop offset="100%" stopColor={t.ground} />
          </linearGradient>
        </defs>
        <path
          d="M0 180 Q 200 90 400 150 T 800 130 T 1200 160 L 1200 300 L 0 300 Z"
          fill="url(#hillg)"
          transform={`translate(${px * -8}, 0)`}
        />
        <path
          d="M0 220 Q 250 160 500 200 T 1000 190 T 1200 210 L 1200 300 L 0 300 Z"
          fill={t.ground}
          opacity="0.9"
        />
      </svg>

      {/* Mosque */}
      <div
        className="absolute left-1/2 bottom-[8%] -translate-x-1/2 transition-transform duration-300 ease-out"
        style={{ transform: `translateX(calc(-50% + ${px * -14}px))` }}
      >
        <Mosque color={t.mosque} accent={t.accent} glow={t.glow} />
      </div>




      {/* Transition flash overlay */}
      {flash && (
        <div
          className="absolute inset-0 pointer-events-none animate-[fadeflash_1.2s_ease-out]"
          style={{ background: `radial-gradient(circle at center, ${t.accent}99 0%, transparent 70%)` }}
        />
      )}

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at center, transparent 60%, #00000055 100%)" }} />

      <style>{`
        @keyframes fadeflash {
          0% { opacity: 0; transform: scale(0.6); }
          30% { opacity: 1; }
          100% { opacity: 0; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}

function Mosque({ color, accent, glow }: { color: string; accent: string; glow: string }) {
  return (
    <svg width="380" height="260" viewBox="0 0 380 260" className="drop-shadow-2xl">
      <defs>
        <linearGradient id="domeg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Minarets */}
      <g>
        <rect x="20" y="80" width="22" height="160" fill={color} />
        <path d="M20 80 L42 80 L31 50 Z" fill={accent} />
        <circle cx="31" cy="48" r="5" fill={accent} />
        <line x1="31" y1="43" x2="31" y2="30" stroke={accent} strokeWidth="2" />
        <path d="M31 30 q 4 -3 0 -8 q -4 5 0 8" fill={accent} />
        <rect x="20" y="130" width="22" height="6" fill={accent} opacity="0.5" />

        <rect x="338" y="80" width="22" height="160" fill={color} />
        <path d="M338 80 L360 80 L349 50 Z" fill={accent} />
        <circle cx="349" cy="48" r="5" fill={accent} />
        <line x1="349" y1="43" x2="349" y2="30" stroke={accent} strokeWidth="2" />
        <path d="M349 30 q 4 -3 0 -8 q -4 5 0 8" fill={accent} />
        <rect x="338" y="130" width="22" height="6" fill={accent} opacity="0.5" />
      </g>

      {/* Main body */}
      <rect x="60" y="130" width="260" height="110" fill={color} />

      {/* Big dome */}
      <path d="M120 130 Q 190 30 260 130 Z" fill="url(#domeg)" filter="url(#glow)" />
      <circle cx="190" cy="38" r="6" fill={accent} />
      <line x1="190" y1="32" x2="190" y2="15" stroke={accent} strokeWidth="2.5" />
      <path d="M190 15 q 5 -4 0 -10 q -5 6 0 10" fill={accent} />

      {/* Side small domes */}
      <path d="M70 130 Q 90 95 110 130 Z" fill={color} stroke={accent} strokeWidth="1" opacity="0.95" />
      <path d="M270 130 Q 290 95 310 130 Z" fill={color} stroke={accent} strokeWidth="1" opacity="0.95" />

      {/* Arched windows */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <path
            d={`M${110 + i * 60} 220 L${110 + i * 60} 180 Q ${130 + i * 60} 155 ${150 + i * 60} 180 L${150 + i * 60} 220 Z`}
            fill={accent}
            opacity="0.85"
            style={{ filter: `drop-shadow(0 0 12px ${glow})` }}
          />
        </g>
      ))}

      {/* Door */}
      <path d="M175 240 L175 210 Q 190 188 205 210 L205 240 Z" fill={accent} opacity="0.6" />
    </svg>
  );
}

function People({ color, accent, mouseX }: { color: string; accent: string; mouseX: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[0, 1, 2, 3].map((i) => {
        const baseLeft = 15 + i * 22;
        const delay = i * 1.5;
        const duration = 14 + i * 2;
        const size = 28 + (i % 2) * 6;
        return (
          <div
            key={i}
            className="absolute"
            style={{
              bottom: `${8 + (i % 2) * 2}%`,
              left: `${baseLeft}%`,
              animation: `walk${i} ${duration}s linear infinite`,
              animationDelay: `${delay}s`,
              transform: `translateX(${mouseX * (8 + i * 2)}px)`,
              transition: "transform 0.3s ease-out",
            }}
          >
            <Person size={size} color={color} accent={accent} flip={i % 2 === 0} />
          </div>
        );
      })}
      <style>{`
        @keyframes walk0 { 0% { transform: translateX(-50px); } 100% { transform: translateX(120vw); } }
        @keyframes walk1 { 0% { transform: translateX(110vw); } 100% { transform: translateX(-60px); } }
        @keyframes walk2 { 0% { transform: translateX(-80px); } 100% { transform: translateX(120vw); } }
        @keyframes walk3 { 0% { transform: translateX(115vw); } 100% { transform: translateX(-70px); } }
      `}</style>
    </div>
  );
}

function Person({ size, color, accent, flip }: { size: number; color: string; accent: string; flip: boolean }) {
  return (
    <svg width={size} height={size * 1.8} viewBox="0 0 30 60" style={{ transform: flip ? "scaleX(-1)" : undefined }}>
      {/* Thobe / cloak */}
      <path d="M15 18 L8 58 L22 58 Z" fill={color} stroke={accent} strokeWidth="0.6" />
      {/* Head */}
      <circle cx="15" cy="12" r="6" fill={accent} opacity="0.85" />
      {/* Ghutra */}
      <path d="M9 12 Q 15 4 21 12 L21 18 Q 15 20 9 18 Z" fill={accent} opacity="0.95" />
      {/* legs walking animation via clip - simple sway */}
      <g className="origin-top">
        <rect x="13" y="55" width="1.5" height="5" fill={color}>
          <animateTransform attributeName="transform" type="rotate" values="-10 14 55;10 14 55;-10 14 55" dur="0.8s" repeatCount="indefinite" />
        </rect>
      </g>
    </svg>
  );
}
