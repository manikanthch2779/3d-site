"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getLenis } from "@/lib/lenis";

const NAV_ITEMS = [
  { label: "AUREON", href: "#hero" },
  { label: "Manifesto", href: "#manifesto" },
  { label: "Worlds", href: "#anthology" },
  { label: "Craft", href: "#craft" },
  { label: "Consult", href: "#cta" },
];

export default function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ticking = false;
    const sections = ["hero", "manifesto", "anthology", "craft", "cta"];

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 80);

          const scrollPos = window.scrollY + window.innerHeight / 3;

          for (let i = sections.length - 1; i >= 0; i--) {
            const el = document.getElementById(sections[i]);
            if (el && el.offsetTop <= scrollPos) {
              setActiveSection(sections[i]);
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = useCallback((href: string) => {
    const target = document.querySelector(href);
    if (!target) return;

    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 2 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }

    setIsMobileMenuOpen(false);
  }, []);

  return (
    <motion.nav
      ref={navRef}
      id="floating-nav"
      role="navigation"
      aria-label="Main navigation"
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : -20,
      }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "fixed top-6 left-1/2 -translate-x-1/2 z-[var(--z-nav)]",
        "pointer-events-auto"
      )}
    >
      {/* Desktop Nav */}
      <div
        className={cn(
          "hidden md:flex items-center gap-1",
          "px-3 py-2 rounded-full",
          "glass-royal",
          "shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
        )}
      >
        {/* Royal Aureon Emblem Logo */}
        <button
          onClick={() => handleNavClick("#hero")}
          className="flex items-center justify-center w-8 h-8 mr-2 rounded-full border border-[var(--gold-imperial)]/30 bg-[#0E131F] text-[var(--gold-imperial)] hover:border-[var(--gold-imperial)] transition-all duration-300 shadow-[0_0_12px_rgba(212,175,55,0.2)]"
          aria-label="Scroll to top"
        >
          <span className="font-cinzel text-xs font-bold text-gold-shine">◆</span>
        </button>

        {NAV_ITEMS.map((item) => (
          <button
            key={item.href}
            id={`nav-${item.href.replace("#", "")}`}
            onClick={() => handleNavClick(item.href)}
            className={cn(
              "relative px-4 py-2 rounded-full",
              "text-[10px] font-cinzel font-semibold uppercase tracking-[0.2em]",
              "transition-all duration-500 ease-[var(--ease-aureon)]",
              activeSection === item.href.replace("#", "")
                ? "text-[var(--gold-imperial)]"
                : "text-white/60 hover:text-white"
            )}
          >
            {activeSection === item.href.replace("#", "") && (
              <motion.div
                layoutId="nav-active"
                className="absolute inset-0 rounded-full bg-[rgba(212,175,55,0.18)] border border-[rgba(212,175,55,0.4)] shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Mobile Nav Toggle */}
      <button
        className={cn(
          "md:hidden flex items-center justify-center",
          "w-12 h-12 rounded-full",
          "glass-royal",
          "shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
        )}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={isMobileMenuOpen}
      >
        <div className="flex flex-col gap-1.5 items-center">
          <motion.span
            className="w-5 h-[1.5px] bg-[var(--gold-imperial)] block"
            animate={{
              rotate: isMobileMenuOpen ? 45 : 0,
              y: isMobileMenuOpen ? 3.5 : 0,
            }}
          />
          <motion.span
            className="w-5 h-[1.5px] bg-[var(--gold-imperial)] block"
            animate={{
              rotate: isMobileMenuOpen ? -45 : 0,
              y: isMobileMenuOpen ? -3.5 : 0,
            }}
          />
        </div>
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "md:hidden absolute top-16 right-0",
              "w-52 py-3 px-2 rounded-2xl",
              "glass-royal",
              "shadow-[0_12px_48px_rgba(0,0,0,0.8)]"
            )}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl",
                  "text-[11px] font-cinzel font-semibold uppercase tracking-[0.18em]",
                  "transition-colors duration-300",
                  activeSection === item.href.replace("#", "")
                    ? "text-[var(--gold-imperial)] bg-[rgba(212,175,55,0.15)] border border-[rgba(212,175,55,0.25)]"
                    : "text-white/70 hover:text-white"
                )}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}