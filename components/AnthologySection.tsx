"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import SectionLabel from "@/components/ui/SectionLabel";

const PROJECTS = [
  {
    title: "Villa Celestia",
    location: "Santorini, Greece",
    year: "2024",
    image: "/images/projects/villa-01.png",
    description: "A floating sanctuary where volcanic stone meets infinite blue.",
    tag: "Comm. #04",
  },
  {
    title: "Tower Nimbus",
    location: "Dubai, UAE",
    year: "2025",
    image: "/images/projects/tower-01.png",
    description: "Rising above the clouds — a vertical world of private atmospheres.",
    tag: "Comm. #07",
  },
  {
    title: "Estate Aethon",
    location: "Maldives",
    year: "2024",
    image: "/images/projects/estate-01.png",
    description: "Where architecture dissolves into ocean and sky become one.",
    tag: "Comm. #02",
  },
];

export default function AnthologySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const totalWidth = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${totalWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Parallax on each card image
      cardsRef.current.forEach((card) => {
        if (!card) return;
        const img = card.querySelector(".project-img");
        if (!img) return;

        gsap.fromTo(
          img,
          { xPercent: -15 },
          {
            xPercent: 15,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: gsap.getById?.("horizontalScroll") || undefined,
              start: "left right",
              end: "right left",
              scrub: 1,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="anthology"
      className="relative overflow-hidden bg-[#0B101D]"
      aria-label="Anthology of Worlds"
    >
      <div ref={trackRef} className="flex items-stretch h-screen">
        {/* Intro panel */}
        <div className="flex-shrink-0 w-screen h-full flex flex-col justify-center px-8 md:px-20 lg:px-32">
          <SectionLabel number="02" className="mb-8">
            Anthology
          </SectionLabel>
          <h2 className="font-cinzel text-4xl sm:text-6xl lg:text-7xl font-bold text-white max-w-xl mb-6 leading-[1.1]">
            Private <span className="text-gold-shine">Worlds</span>
          </h2>
          <p className="text-section-body text-white/70 max-w-md leading-relaxed font-light">
            Each project is an unrepeatable act of creation — a world built for one
            client, one vision, one impossible ambition.
          </p>
        </div>

        {/* Project cards */}
        {PROJECTS.map((project, i) => (
          <div
            key={i}
            ref={(el) => { cardsRef.current[i] = el; }}
            className="flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] h-full flex items-center px-6"
          >
            <div className="group relative w-full h-[75vh] rounded-3xl overflow-hidden cursor-pointer border border-[var(--gold-imperial)]/30 bg-[#0E131F] shadow-[0_15px_40px_rgba(0,0,0,0.7)] transition-all duration-500 hover:border-[var(--gold-imperial)] hover:shadow-[0_20px_60px_rgba(212,175,55,0.25)]">
              {/* Image */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-img absolute inset-0 w-[130%] h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#06080E] via-[#06080E]/40 to-transparent" />
              </div>

              {/* Top Commission Tag */}
              <div className="absolute top-6 left-6 z-10">
                <div className="px-4 py-1.5 rounded-full border border-[var(--gold-imperial)]/40 bg-[#0E131F]/80 backdrop-blur-md text-[10px] font-cinzel font-semibold tracking-widest text-gold-shine uppercase">
                  {project.tag}
                </div>
              </div>

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-cinzel font-semibold tracking-widest text-[var(--gold-imperial)] uppercase">
                    {project.location}
                  </span>
                  <span className="w-4 h-[1px] bg-[var(--gold-imperial)]/50" />
                  <span className="text-[10px] font-cinzel font-semibold tracking-widest text-white/60">
                    {project.year}
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-cinzel font-bold text-white tracking-tight mb-3">
                  {project.title}
                </h3>
                <p className="text-sm text-white/80 font-light max-w-sm leading-relaxed opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  {project.description}
                </p>
              </div>

              {/* Hover reveal icon */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
                <div className="w-12 h-12 rounded-full border border-[var(--gold-imperial)] bg-[#0E131F]/90 flex items-center justify-center text-[var(--gold-imperial)] shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* End spacer */}
        <div className="flex-shrink-0 w-[20vw]" />
      </div>
    </section>
  );
}