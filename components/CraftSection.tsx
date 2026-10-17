"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import SectionLabel from "@/components/ui/SectionLabel";
import dynamic from "next/dynamic";

const ThreeArchitecturalFragment = dynamic(
  () => import("@/components/ThreeArchitecturalFragment"),
  { ssr: false }
);

const CRAFT_SEQUENCE = [
  {
    label: "Material Intelligence",
    text: "Every surface is a conversation between light and matter — stone quarried at dawn, glass tempered under starlight, bronze aged by sea winds.",
  },
  {
    label: "Structural Poetry",
    text: "Our structures defy expectation through precision. Each beam, each cantilever, each impossible overhang is an act of quiet defiance.",
  },
  {
    label: "Atmospheric Design",
    text: "We design not just spaces but atmospheres — the temperature of light, the weight of silence, the texture of time passing through a room.",
  },
];

export default function CraftSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const textBlocksRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const pinContainer = pinContainerRef.current;
    if (!section || !pinContainer) return;

    const ctx = gsap.context(() => {
      // 1. GSAP ScrollTrigger Pinning: Keeps 3D house model & text container fixed in viewport
      ScrollTrigger.create({
        trigger: section,
        pin: pinContainer,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        pinSpacing: false,
        anticipatePin: 1,
      });

      // 2. Sequential Text Transitions while pinned
      const totalItems = CRAFT_SEQUENCE.length;
      textBlocksRef.current.forEach((block, i) => {
        if (!block) return;

        const stepPercent = 100 / totalItems;
        const fadeInStart = i * stepPercent;
        const fadeInEnd = fadeInStart + 12;
        const fadeOutStart = (i + 1) * stepPercent - 8;
        const fadeOutEnd = (i + 1) * stepPercent;

        // Reveal text
        gsap.fromTo(
          block,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: `${fadeInStart}% top`,
              end: `${fadeInEnd}% top`,
              scrub: 1,
            },
          }
        );

        // Hide text before next item enters (except last item)
        if (i < totalItems - 1) {
          gsap.to(block, {
            opacity: 0,
            y: -40,
            scale: 1.02,
            ease: "power2.in",
            scrollTrigger: {
              trigger: section,
              start: `${fadeOutStart}% top`,
              end: `${fadeOutEnd}% top`,
              scrub: 1,
            },
          });
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="craft"
      className="relative bg-[#06080E] w-full"
      style={{ height: "320vh" }}
      aria-label="Craft"
    >
      <div
        ref={pinContainerRef}
        className="w-full h-screen overflow-hidden flex flex-col md:flex-row relative bg-[#06080E]"
      >
        {/* 3D Model Container with Royal Ambient Lighting */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-full relative flex-shrink-0">
          <ThreeArchitecturalFragment />
          {/* Edge gradient overlays */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#06080E] to-transparent md:hidden z-10 pointer-events-none" />
          <div className="hidden md:block absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#06080E] to-transparent z-10 pointer-events-none" />
        </div>

        {/* Typography Sequence */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-full flex flex-col justify-center px-6 md:px-12 lg:px-20 relative z-20">
          <SectionLabel number="03" className="mb-6 md:mb-10">
            Royal Craftsmanship
          </SectionLabel>

          {CRAFT_SEQUENCE.map((item, i) => (
            <div
              key={i}
              ref={(el) => { textBlocksRef.current[i] = el; }}
              className="absolute top-1/2 -translate-y-1/2 left-6 md:left-12 lg:left-20 right-6 md:right-12 opacity-0 pointer-events-none"
            >
              <span className="text-[11px] tracking-[0.25em] uppercase text-gold-shine font-cinzel font-semibold mb-3 block">
                {item.label}
              </span>
              <p className="text-xl md:text-3xl lg:text-4xl font-cinzel font-light text-white/95 leading-[1.35] tracking-tight drop-shadow-lg">
                {item.text}
              </p>
            </div>
          ))}

          {/* Ambient decoration */}
          <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 lg:left-20 flex items-center gap-4 pointer-events-none">
            <div className="w-10 h-[1px] bg-[var(--gold-imperial)]/40" />
            <span className="font-editorial italic text-xs text-[var(--gold-imperial)]">
              Precision made emotional
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}