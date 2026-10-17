"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import SectionLabel from "@/components/ui/SectionLabel";

const SERVICES = [
  {
    title: "Rent",
    subtitle: "Experience Before Commitment",
    description:
      "Inhabit our architectural worlds before making them your own. Curated short-term residencies in our most extraordinary completed projects.",
    image: "/images/services/rent.png",
    features: ["Private villa residencies", "Curated experiences", "White-glove concierge"],
  },
  {
    title: "Sell",
    subtitle: "Discreet Transitions",
    description:
      "When a world no longer serves its creator, we orchestrate its transition with the same precision with which it was built. Private, discreet, extraordinary.",
    image: "/images/services/sell.png",
    features: ["Off-market placement", "Architectural valuation", "Confidential transactions"],
  },
  {
    title: "Buy",
    subtitle: "Acquire the Impossible",
    description:
      "Access architectural worlds that exist beyond the public market. Each property has been vetted against our uncompromising standards of design and craft.",
    image: "/images/services/buy.png",
    features: ["Exclusive portfolio", "Design authentication", "Bespoke acquisition strategy"],
  },
];

export default function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const handleHover = useCallback((index: number | null) => {
    setActiveIndex(index);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative min-h-screen bg-[#06080E] text-white"
      aria-label="Services"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-32">
        <SectionLabel number="05" className="mb-8">
          Royal Concierge Services
        </SectionLabel>
        <h2 className="font-cinzel text-4xl sm:text-6xl font-bold text-white mb-20 leading-[1.1]">
          Three <span className="text-gold-shine">Imperial Doorways</span>
        </h2>

        <div className="flex flex-col md:flex-row gap-0 border-t border-[var(--gold-imperial)]/30">
          {SERVICES.map((service, i) => (
            <div
              key={i}
              className={cn(
                "group relative flex-1 border-b md:border-b-0 md:border-r last:border-r-0 border-[var(--gold-imperial)]/30 bg-[#0E131F]/60",
                "transition-all duration-700 ease-[var(--ease-aureon)]",
                "cursor-pointer overflow-hidden",
                activeIndex === i ? "md:flex-[2] bg-[#0E131F]" : "md:flex-1"
              )}
              onMouseEnter={() => handleHover(i)}
              onMouseLeave={() => handleHover(null)}
            >
              {/* Background image reveal */}
              <AnimatePresence>
                {activeIndex === i && (
                  <motion.div
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 0.25, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 z-0"
                  >
                    <img
                      src={service.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-between min-h-[400px] md:min-h-[600px]">
                {/* Number */}
                <span className="text-[11px] font-cinzel font-semibold tracking-widest text-[var(--gold-imperial)]">
                  0{i + 1}
                </span>

                {/* Title */}
                <div className="my-auto">
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-cinzel font-bold text-white tracking-tight mb-3 transition-transform duration-500 group-hover:-translate-y-2">
                    {service.title}
                  </h3>
                  <span className="font-editorial italic text-base text-[var(--gold-imperial)] block mb-6">
                    {service.subtitle}
                  </span>

                  {/* Expandable content */}
                  <AnimatePresence>
                    {activeIndex === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-white/80 max-w-sm leading-relaxed mb-6 font-light">
                          {service.description}
                        </p>
                        <ul className="space-y-2.5">
                          {service.features.map((feature, fi) => (
                            <li
                              key={fi}
                              className="flex items-center gap-3 text-xs text-white/90 font-cinzel font-semibold tracking-wider"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold-imperial)] shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Arrow */}
                <div className="flex items-center gap-3 mt-8">
                  <div className={cn(
                    "w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500",
                    activeIndex === i
                      ? "border-[var(--gold-imperial)] bg-[var(--gold-imperial)]/20 text-[var(--gold-imperial)] shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                      : "border-white/20 text-white/60"
                  )}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-cinzel font-semibold tracking-[0.2em] uppercase text-white/70">
                    Explore
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}