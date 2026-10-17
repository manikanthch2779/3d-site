"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import SectionLabel from "@/components/ui/SectionLabel";

const MANIFESTO_TEXT =
  "We do not build homes. We architect emotional territories — private worlds where light, stone, and silence conspire to make the impossible feel inevitable.";

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const wordsContainer = wordsRef.current;
    if (!section || !wordsContainer) return;

    const words = wordsContainer.querySelectorAll(".manifesto-word");

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: wordsContainer,
        pinSpacing: false,
      });

      words.forEach((word, i) => {
        gsap.fromTo(
          word,
          { opacity: 0.12, scale: 0.96, y: 10 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: `${(i / words.length) * 80}% top`,
              end: `${((i + 1) / words.length) * 80 + 5}% top`,
              scrub: 1,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const words = MANIFESTO_TEXT.split(" ");

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative bg-[#06080E] text-white"
      style={{ height: "300vh" }}
      aria-label="Manifesto"
    >
      <div
        ref={wordsRef}
        className="h-screen flex flex-col items-center justify-center px-6 md:px-16 lg:px-24"
      >
        <SectionLabel number="01" className="mb-12">
          Royal Manifesto
        </SectionLabel>

        <div className="font-cinzel text-[clamp(2.2rem,5vw,4.5rem)] text-center max-w-5xl leading-[1.25] font-normal tracking-tight">
          {words.map((word, i) => (
            <span
              key={i}
              className="manifesto-word inline-block mr-[0.3em] opacity-[0.12] will-change-transform text-gold-shine drop-shadow-[0_4px_25px_rgba(212,175,55,0.2)]"
            >
              {word}
            </span>
          ))}
        </div>

        <div className="mt-16 flex items-center gap-4">
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[var(--gold-imperial)] to-transparent" />
          <span className="font-editorial italic text-base text-[var(--gold-imperial)] tracking-widest">
            Architecture as emotion
          </span>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[var(--gold-imperial)] to-transparent" />
        </div>
      </div>
    </section>
  );
}