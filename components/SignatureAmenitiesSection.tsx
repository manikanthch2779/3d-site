"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import SectionLabel from "@/components/ui/SectionLabel";

const AMENITIES = [
  {
    title: "The Private Spa",
    subtitle: "Basalt & Geothermal Stillness",
    description:
      "Carved from volcanic basalt and warmed by geothermal waters. A sanctuary where the body remembers what the mind forgets.",
    image: "/images/amenities/spa.png",
  },
  {
    title: "The Art Vault",
    subtitle: "Climate-Controlled Devotion",
    description:
      "Underground galleries with museum-grade climate control. Your collection deserves architecture as considered as the art itself.",
    image: "/images/amenities/vault.png",
  },
  {
    title: "The Infinite Pool",
    subtitle: "Horizon Dissolution",
    description:
      "Zero-edge infinity pools engineered to dissolve the boundary between water and sky. Swimming into the horizon.",
    image: "/images/amenities/pool.png",
  },
];

export default function SignatureAmenitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item) => {
        if (!item) return;

        const img = item.querySelector(".amenity-img");
        const content = item.querySelector(".amenity-content");
        const curtain = item.querySelector(".amenity-curtain");

        if (img) {
          gsap.fromTo(
            img,
            { yPercent: 15, scale: 1.12 },
            {
              yPercent: -15,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: item,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            }
          );
        }

        if (curtain) {
          gsap.fromTo(
            curtain,
            { scaleY: 1 },
            {
              scaleY: 0,
              transformOrigin: "top",
              ease: "power3.inOut",
              scrollTrigger: {
                trigger: item,
                start: "top 80%",
                end: "top 30%",
                scrub: 1,
              },
            }
          );
        }

        if (content) {
          gsap.fromTo(
            content,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 60%",
                end: "top 30%",
                scrub: 1,
              },
            }
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="amenities"
      className="relative py-32 md:py-48 bg-[#0E131F] text-white"
      aria-label="Signature Amenities"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionLabel number="04" className="mb-8">
          Signature Amenities
        </SectionLabel>
        <h2 className="font-cinzel text-4xl sm:text-6xl font-bold text-white mb-24 leading-[1.1]">
          Beyond <span className="text-gold-shine">Luxury</span>
        </h2>

        <div className="space-y-32 md:space-y-48">
          {AMENITIES.map((amenity, i) => (
            <div
              key={i}
              ref={(el) => { itemsRef.current[i] = el; }}
              className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 md:gap-16 items-center`}
            >
              {/* Image with curtain reveal */}
              <div className="w-full md:w-1/2 relative overflow-hidden rounded-2xl aspect-[4/5] border border-[var(--gold-imperial)]/30 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
                <img
                  src={amenity.image}
                  alt={amenity.title}
                  className="amenity-img absolute inset-0 w-full h-full object-cover"
                />
                {/* Curtain overlay */}
                <div className="amenity-curtain absolute inset-0 bg-[#0E131F] origin-top z-10" />
              </div>

              {/* Content */}
              <div className="amenity-content w-full md:w-1/2 opacity-0">
                <span className="text-[11px] tracking-[0.25em] uppercase text-gold-shine font-cinzel font-semibold mb-3 block">
                  {amenity.subtitle}
                </span>
                <h3 className="text-3xl md:text-5xl font-cinzel font-bold text-white tracking-tight mb-6">
                  {amenity.title}
                </h3>
                <p className="text-base text-white/70 max-w-md leading-relaxed font-light">
                  {amenity.description}
                </p>
                <div className="mt-8 w-20 h-[1px] bg-gradient-to-r from-[var(--gold-imperial)] to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}