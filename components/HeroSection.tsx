"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const COPY_SEQUENCE = [
  { text: "AUREON", subtitle: "IMPERIAL ARCHITECTURAL ESTATE", type: "title" as const },
  { text: "Some structures are built. Others are summoned.", type: "line" as const },
  { text: "Private worlds.", type: "accent" as const },
  { text: "Suspended beyond expectation.", type: "line" as const },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const finalTextRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false); // Audio Active by Default
  const [activeCopyIndex, setActiveCopyIndex] = useState(0);

  // Guarantee 0ms instant video autoplay with audio on page mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Instant play attempt
    const startCinemaVideo = async () => {
      try {
        video.muted = false;
        await video.play();
        setIsPlaying(true);
        setIsMuted(false);
      } catch (err) {
        // Fallback for strict browser policies: start video playing muted instantly, then unmute on first cursor/hover presence
        video.muted = true;
        try {
          await video.play();
          setIsPlaying(true);
        } catch {
          setIsPlaying(false);
        }
        setIsMuted(true);
      }
    };

    startCinemaVideo();

    // Aggressive zero-delay audio unmute handler: unmutes sound on first millisecond of cursor/hover movement
    const unmuteAudioNow = () => {
      if (video) {
        video.muted = false;
        setIsMuted(false);
      }
      removeAudioListeners();
    };

    const removeAudioListeners = () => {
      window.removeEventListener("mousemove", unmuteAudioNow);
      window.removeEventListener("pointermove", unmuteAudioNow);
      window.removeEventListener("mouseenter", unmuteAudioNow);
      window.removeEventListener("scroll", unmuteAudioNow);
      window.removeEventListener("click", unmuteAudioNow);
      window.removeEventListener("touchstart", unmuteAudioNow);
      window.removeEventListener("keydown", unmuteAudioNow);
      window.removeEventListener("focus", unmuteAudioNow);
    };

    window.addEventListener("mousemove", unmuteAudioNow, { once: true });
    window.addEventListener("pointermove", unmuteAudioNow, { once: true });
    window.addEventListener("mouseenter", unmuteAudioNow, { once: true });
    window.addEventListener("scroll", unmuteAudioNow, { once: true });
    window.addEventListener("click", unmuteAudioNow, { once: true });
    window.addEventListener("touchstart", unmuteAudioNow, { once: true });
    window.addEventListener("keydown", unmuteAudioNow, { once: true });
    window.addEventListener("focus", unmuteAudioNow, { once: true });

    return () => {
      removeAudioListeners();
    };
  }, []);

  /* —— Timed Copy Animation Cycle —— */
  useEffect(() => {
    const copyInterval = setInterval(() => {
      setActiveCopyIndex((prev) => (prev + 1) % COPY_SEQUENCE.length);
    }, 4500);

    return () => clearInterval(copyInterval);
  }, []);

  /* —— GSAP Text Transition on Active Copy Index —— */
  useEffect(() => {
    copyRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === activeCopyIndex) {
        gsap.fromTo(
          el,
          { opacity: 0, y: 35, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" }
        );
      } else {
        gsap.to(el, { opacity: 0, y: -25, scale: 1.02, duration: 0.8, ease: "power2.in" });
      }
    });
  }, [activeCopyIndex]);

  /* —— Load Entrance for Final Text —— */
  useEffect(() => {
    if (finalTextRef.current) {
      gsap.fromTo(
        finalTextRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.5, delay: 0.8, ease: "power3.out" }
      );
    }
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full max-w-full min-h-[90vh] md:min-h-screen h-[90vh] md:h-screen overflow-hidden flex flex-col justify-between bg-[#06080E]"
      aria-label="Hero — Architectural Atmosphere"
    >
      {/* 60 FPS Instant Autoplay Hardware GPU Video Player */}
      <video
        ref={videoRef}
        autoPlay
        loop
        playsInline
        preload="auto"
        onCanPlay={() => {
          if (videoRef.current) videoRef.current.play().catch(() => {});
        }}
        onLoadedData={() => {
          if (videoRef.current) videoRef.current.play().catch(() => {});
        }}
        className="absolute inset-0 w-full h-full object-cover z-[1] filter contrast-[1.08] brightness-[0.92]"
      >
        <source src="/hero-cinema.mp4" type="video/mp4" />
        Your browser does not support HTML5 video playback.
      </video>

      {/* Royal Vignette Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: `
            linear-gradient(180deg, rgba(6,8,14,0.75) 0%, rgba(6,8,14,0.2) 45%, rgba(6,8,14,0.9) 100%),
            linear-gradient(90deg, rgba(6,8,14,0.5) 0%, transparent 25%, transparent 75%, rgba(6,8,14,0.5) 100%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Imperial Golden Radial Bloom */}
      <div
        ref={bloomRef}
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{
          background: "radial-gradient(ellipse 75% 55% at 50% 35%, rgba(212,175,55,0.25) 0%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      {/* Royal Ambient Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-[4] overflow-hidden opacity-50">
        <div className="absolute top-1/4 left-1/5 w-1.5 h-1.5 bg-[var(--gold-imperial)] rounded-full animate-ping duration-1000 shadow-[0_0_10px_#D4AF37]" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-[var(--gold-light)] rounded-full animate-pulse duration-700 shadow-[0_0_12px_#FFF3D1]" />
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-[var(--champagne)] rounded-full animate-pulse duration-1000 shadow-[0_0_10px_#E5C483]" />
      </div>

      {/* Audio Indicator */}
      {isMuted && (
        <div
          onClick={toggleMute}
          className="relative z-[10] top-4 left-1/2 -translate-x-1/2 max-w-md px-5 py-2 rounded-full border border-[var(--gold-imperial)]/40 bg-[#0E131F]/90 backdrop-blur-md text-center text-[10px] font-cinzel font-bold tracking-[0.2em] text-gold-shine cursor-pointer shadow-[0_4px_25px_rgba(212,175,55,0.3)] animate-pulse"
        >
          🔊 AUDIO READY — MOVE CURSOR OR TOUCH TO UNMUTE
        </div>
      )}

      {/* Main Hero Copy Container */}
      <div className="relative z-[6] flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 text-center w-full max-w-7xl mx-auto my-auto pointer-events-none">
        {COPY_SEQUENCE.map((item, i) => (
          <div
            key={i}
            ref={(el) => { copyRefs.current[i] = el; }}
            className={`absolute px-4 w-full max-w-5xl transition-all ${
              i === activeCopyIndex ? "pointer-events-auto z-10" : "pointer-events-none opacity-0 z-0"
            }`}
          >
            {item.type === "title" && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
                  <span className="text-[11px] sm:text-xs font-cinzel tracking-[0.35em] text-gold-shine font-semibold uppercase">
                    {item.subtitle}
                  </span>
                  <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
                </div>
                <h1 className="text-[clamp(3.5rem,9.5vw,8.5rem)] font-cinzel font-black tracking-[0.06em] text-gold-shine drop-shadow-[0_10px_60px_rgba(212,175,55,0.5)] leading-none uppercase">
                  {item.text}
                </h1>
              </div>
            )}
            {item.type === "line" && (
              <p className="text-[clamp(1.3rem,3.4vw,2.5rem)] font-cinzel font-light text-white/95 tracking-wide leading-relaxed max-w-3xl mx-auto drop-shadow-md">
                {item.text}
              </p>
            )}
            {item.type === "accent" && (
              <p className="font-editorial italic text-[clamp(2.2rem,5vw,4rem)] text-[var(--champagne)] tracking-wide drop-shadow-lg">
                {item.text}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Bar: Royal Caption + Video Controls */}
      <div className="relative z-[7] w-full px-6 md:px-12 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Imperial Crest Caption */}
        <div ref={finalTextRef} className="text-center sm:text-left flex items-center gap-4">
          <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full border border-[var(--gold-imperial)]/40 bg-[#0E131F]/80 text-[var(--gold-imperial)] text-xs font-cinzel font-bold shadow-[0_0_15px_rgba(212,175,55,0.25)]">
            ◆
          </div>
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold-shine font-cinzel font-semibold mb-1">
              Architectural Alchemy
            </p>
            <p className="font-editorial italic text-xs sm:text-sm md:text-base text-white/85 max-w-md">
              Where vision dissolves into atmosphere, and stone learns to breathe.
            </p>
          </div>
        </div>

        {/* Video Control Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlayback}
            className="royal-shimmer-btn flex items-center gap-3 px-5 py-2.5 rounded-full border border-[var(--gold-imperial)]/40 bg-[#0E131F]/80 backdrop-blur-md text-white hover:text-[var(--gold-imperial)] hover:border-[var(--gold-imperial)] transition-all text-xs font-cinzel tracking-[0.2em] uppercase pointer-events-auto shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
            aria-label={isPlaying ? "Pause Cinema Video" : "Play Cinema Video"}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? "bg-emerald-400" : "bg-amber-400"} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isPlaying ? "bg-emerald-500" : "bg-amber-500"}`} />
            </span>
            <span>{isPlaying ? "Pause Cinema" : "Play Cinema"}</span>
          </button>

          <button
            onClick={toggleMute}
            className="px-4 py-2.5 rounded-full border border-[var(--gold-imperial)]/40 bg-[#0E131F]/80 backdrop-blur-md text-white/80 hover:text-[var(--gold-imperial)] hover:border-[var(--gold-imperial)] transition-all text-xs font-cinzel tracking-widest uppercase pointer-events-auto shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
            aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? "🔇 Muted" : "🔊 Audio On"}
          </button>
        </div>
      </div>
    </section>
  );
}