"use client";

import { useEffect, useRef } from "react";
import SectionLabel from "@/components/ui/SectionLabel";

export default function PrivateAccessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    const spotlight = spotlightRef.current;
    if (!section || !spotlight) return;

    let isRunning = false;

    const tick = () => {
      const dx = mouseRef.current.x - currentRef.current.x;
      const dy = mouseRef.current.y - currentRef.current.y;

      currentRef.current.x += dx * 0.1;
      currentRef.current.y += dy * 0.1;

      spotlight.style.background = `radial-gradient(
        650px circle at ${Math.round(currentRef.current.x)}px ${Math.round(currentRef.current.y)}px,
        rgba(212, 175, 55, 0.18) 0%,
        rgba(212, 175, 55, 0.05) 35%,
        transparent 70%
      )`;

      if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) {
        isRunning = false;
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;

      if (!isRunning) {
        isRunning = true;
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    section.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      section.removeEventListener("mousemove", onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="private-access"
      className="relative min-h-screen bg-[#06080E] text-white overflow-hidden flex items-center"
      aria-label="Private Access"
    >
      {/* Golden Spotlight follow layer */}
      <div ref={spotlightRef} className="absolute inset-0 pointer-events-none z-[1]" />

      {/* Ambient noise texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none z-[2]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-32 w-full">
        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
          {/* Left content */}
          <div className="w-full md:w-1/2">
            <SectionLabel number="06" className="mb-10">
              Private Access
            </SectionLabel>

            <h2 className="font-cinzel text-5xl sm:text-7xl font-extrabold text-white mb-8 leading-[1.05]">
              By <br />
              <span className="text-gold-shine">Royal</span> <br />
              Invitation
            </h2>

            <p className="text-base text-white/70 max-w-md leading-relaxed font-light mb-10">
              AUREON worlds are not listed. They are not marketed. They are
              revealed — privately, personally, and only to those whose vision
              matches our own.
            </p>

            <div className="flex items-center gap-4">
              <div className="w-12 h-[1px] bg-[var(--gold-imperial)]/60" />
              <span className="font-editorial italic text-sm text-gold-shine">
                Explore with golden light
              </span>
            </div>
          </div>

          {/* Right — dark mansion reveal with Royal Crest Seal */}
          <div className="w-full md:w-1/2 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[var(--gold-imperial)]/30 bg-[#0E131F] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              <img
                src="/images/private-mansion.png"
                alt="Private architectural world"
                className="w-full h-full object-cover opacity-75 transition-all duration-700 hover:scale-105 hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06080E] via-transparent to-[#06080E]/60" />

              {/* Royal Seal Badge */}
              <div className="absolute top-6 left-6 z-10">
                <div className="w-12 h-12 rounded-full border border-[var(--gold-imperial)] bg-[#0E131F]/90 flex items-center justify-center text-[var(--gold-imperial)] shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                  <span className="font-cinzel text-xs font-bold text-gold-shine">◆ VIP</span>
                </div>
              </div>

              {/* Floating Imperial Label */}
              <div className="absolute bottom-8 left-8 right-8 z-10">
                <div className="glass-royal px-6 py-5 rounded-2xl border-[var(--gold-imperial)]/30">
                  <span className="text-[10px] font-cinzel font-semibold tracking-[0.25em] uppercase text-gold-shine block mb-1">
                    CURRENT COMMISSIONS
                  </span>
                  <span className="text-sm font-cinzel font-bold text-white">
                    3 New Private Estates Accepted for 2025
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}