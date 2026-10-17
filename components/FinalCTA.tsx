"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";

const TARGET_EMAIL = "manikanthch2779@gmail.com";

export default function FinalCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    budget: "$10M - $25M",
    location: "",
    vision: "",
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{
    x: number; y: number; vx: number; vy: number;
    size: number; opacity: number; life: number; maxLife: number;
  }>>([]);
  const rafRef = useRef<number>(0);

  // Atmospheric particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const createParticle = () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.1,
      size: Math.random() * 2.5 + 0.5,
      opacity: 0,
      life: 0,
      maxLife: Math.random() * 300 + 200,
    });

    for (let i = 0; i < 60; i++) {
      particlesRef.current.push(createParticle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particlesRef.current.forEach((p, i) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.1) {
          p.opacity = lifeRatio * 10;
        } else if (lifeRatio > 0.8) {
          p.opacity = (1 - lifeRatio) * 5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity * 0.6})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#D4AF37";
        ctx.fill();

        if (p.life >= p.maxLife || p.y < -10) {
          particlesRef.current[i] = createParticle();
          particlesRef.current[i].y = canvas.offsetHeight + 10;
        }
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Send via local API route
      await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // 2. Direct Web3Forms submission to guarantee delivery to manikanthch2779@gmail.com
      try {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_key: "23b0a70f-56df-498c-9c3f-c5d0ef4dbf77",
            to: TARGET_EMAIL,
            subject: `🏛️ [AUREON ROYAL COMMISSION] Inquiry from ${formData.name}`,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            budget: formData.budget,
            location: formData.location,
            message: `Vision Notes: ${formData.vision}`,
          }),
        });
      } catch (err) {}

      // 3. Fallback Mailto launcher to open client email application pre-filled to manikanthch2779@gmail.com
      const mailtoSubject = encodeURIComponent(`🏛️ [AUREON ROYAL COMMISSION] Inquiry from ${formData.name}`);
      const mailtoBody = encodeURIComponent(
        `AUREON ROYAL ARCHITECTURAL COMMISSION INQUIRY\n` +
        `---------------------------------------------\n` +
        `Client Full Name: ${formData.name}\n` +
        `Client Email: ${formData.email}\n` +
        `Phone / WhatsApp: ${formData.phone}\n` +
        `Estate Budget: ${formData.budget}\n` +
        `Target Location: ${formData.location}\n\n` +
        `Architectural Vision:\n${formData.vision}\n` +
        `---------------------------------------------\n` +
        `Sent to Private Office: ${TARGET_EMAIL}`
      );

      const mailtoUrl = `mailto:${TARGET_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`;
      window.open(mailtoUrl, "_blank");

      setIsSubmitting(false);
      setSubmitted(true);

      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitted(false);
        setFormData({ name: "", email: "", phone: "", budget: "$10M - $25M", location: "", vision: "" });
      }, 5000);
    } catch {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  }, [formData]);

  return (
    <>
      <section
        id="cta"
        className="relative min-h-screen bg-[#06080E] text-white flex items-center justify-center overflow-hidden py-24"
        aria-label="Begin your world"
      >
        {/* Particle canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          aria-hidden="true"
        />

        {/* Imperial Radial glow */}
        <div className="absolute inset-0 gradient-radial-warm pointer-events-none z-[1]" />

        <div className="relative z-10 text-center px-6 max-w-4xl w-full mx-auto">
          <span className="text-[11px] font-cinzel font-semibold tracking-[0.35em] uppercase text-gold-shine mb-6 block">
            ◆ BECOME A ROYAL COMMISSIONER ◆
          </span>

          <h2 className="font-cinzel text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-[1.05]">
            Your World <br />
            <span className="text-gold-shine">Awaits</span>
          </h2>

          <p className="text-base sm:text-lg text-white/75 max-w-xl mx-auto mb-14 leading-relaxed font-light">
            Every AUREON world begins with a conversation — a meeting of vision
            and possibility. We accept only three new commissions per year.
          </p>

          {/* Ultra Wide "Request Private Consultation" Button with Surroundings Click Target */}
          <div className="w-full flex justify-center">
            <MagneticButton
              onClick={() => setIsModalOpen(true)}
              className={cn(
                "royal-shimmer-btn w-full max-w-xl md:max-w-2xl px-12 md:px-16 py-6 rounded-full",
                "bg-gradient-to-r from-[var(--gold-dark)] via-[#FFF5D0] to-[var(--gold-imperial)] text-[#06080E]",
                "text-xs md:text-sm font-cinzel font-black uppercase tracking-[0.3em]",
                "shadow-[0_10px_50px_rgba(212,175,55,0.45)] border-2 border-[var(--gold-light)]/40",
                "transition-all duration-500 hover:scale-105 hover:shadow-[0_15px_70px_rgba(212,175,55,0.65)]"
              )}
            >
              Request Private Consultation
            </MagneticButton>
          </div>

          {/* Royal Footer Mark */}
          <div className="mt-28 flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-[var(--gold-imperial)]/40 bg-[#0E131F] flex items-center justify-center text-[var(--gold-imperial)] text-sm font-cinzel font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              ◆
            </div>
            <span className="text-[12px] tracking-[0.35em] uppercase font-cinzel font-extrabold text-gold-shine">
              AUREON ARCHITECTURAL PALACE
            </span>
            <span className="text-[11px] text-white/50 tracking-wider font-light">
              Direct Inquiries: <span className="text-[var(--gold-imperial)] font-semibold">{TARGET_EMAIL}</span> | © 2025 AUREON
            </span>
          </div>
        </div>
      </section>

      {/* Consultation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            onClick={() => setIsModalOpen(false)}
          >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-[#06080E]/90 backdrop-blur-xl" />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-xl glass-royal border-2 border-[var(--gold-imperial)]/40 rounded-3xl p-6 sm:p-10 shadow-[0_32px_100px_rgba(0,0,0,0.95)] my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full border border-[var(--gold-imperial)]/40 text-[var(--gold-imperial)] flex items-center justify-center hover:bg-[var(--gold-imperial)]/20 transition-colors z-20"
                aria-label="Close modal"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-cinzel font-bold text-gold-shine tracking-widest uppercase">
                  ◆ ROYAL COMMISSION INQUIRY ◆
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-cinzel font-bold text-white tracking-tight mb-2">
                Begin the Conversation
              </h3>
              <p className="text-xs text-white/70 mb-6 font-light">
                Direct email payload dispatched to <span className="text-[var(--gold-imperial)] font-semibold">{TARGET_EMAIL}</span>.
              </p>

              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-2 border-[var(--gold-imperial)] bg-[var(--gold-imperial)]/20 flex items-center justify-center text-[var(--gold-imperial)] text-2xl font-bold shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                    ✓
                  </div>
                  <h4 className="font-cinzel text-2xl font-bold text-gold-shine">Royal Commission Email Dispatched</h4>
                  <p className="text-sm text-white/80 max-w-sm">
                    Your inquiry details have been transmitted directly to <span className="text-[var(--gold-imperial)] font-semibold">{TARGET_EMAIL}</span>. Our private office will respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cta-name" className="text-[10px] font-cinzel font-semibold tracking-[0.2em] uppercase text-[var(--gold-imperial)] mb-1.5 block">
                        Full Name *
                      </label>
                      <input
                        id="cta-name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl bg-[#0E131F] border border-[var(--gold-imperial)]/30 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--gold-imperial)] transition-colors"
                        placeholder="Lord / Lady / Full Name"
                      />
                    </div>
                    <div>
                      <label htmlFor="cta-email" className="text-[10px] font-cinzel font-semibold tracking-[0.2em] uppercase text-[var(--gold-imperial)] mb-1.5 block">
                        Email Address *
                      </label>
                      <input
                        id="cta-email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl bg-[#0E131F] border border-[var(--gold-imperial)]/30 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--gold-imperial)] transition-colors"
                        placeholder="vip@domain.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cta-phone" className="text-[10px] font-cinzel font-semibold tracking-[0.2em] uppercase text-[var(--gold-imperial)] mb-1.5 block">
                        Phone / WhatsApp *
                      </label>
                      <input
                        id="cta-phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl bg-[#0E131F] border border-[var(--gold-imperial)]/30 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--gold-imperial)] transition-colors"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <label htmlFor="cta-budget" className="text-[10px] font-cinzel font-semibold tracking-[0.2em] uppercase text-[var(--gold-imperial)] mb-1.5 block">
                        Commission Budget
                      </label>
                      <select
                        id="cta-budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl bg-[#0E131F] border border-[var(--gold-imperial)]/30 text-sm text-white focus:outline-none focus:border-[var(--gold-imperial)] transition-colors"
                      >
                        <option value="$10M - $25M">$10M – $25M USD</option>
                        <option value="$25M - $50M">$25M – $50M USD</option>
                        <option value="$50M+">$50M+ USD (Bespoke)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cta-location" className="text-[10px] font-cinzel font-semibold tracking-[0.2em] uppercase text-[var(--gold-imperial)] mb-1.5 block">
                      Target Location / Site
                    </label>
                    <input
                      id="cta-location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl bg-[#0E131F] border border-[var(--gold-imperial)]/30 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--gold-imperial)] transition-colors"
                      placeholder="e.g. Monaco, Beverly Hills, Swiss Alps, Private Island"
                    />
                  </div>

                  <div>
                    <label htmlFor="cta-vision" className="text-[10px] font-cinzel font-semibold tracking-[0.2em] uppercase text-[var(--gold-imperial)] mb-1.5 block">
                      Architectural Vision & Requirements
                    </label>
                    <textarea
                      id="cta-vision"
                      name="vision"
                      rows={3}
                      value={formData.vision}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl bg-[#0E131F] border border-[var(--gold-imperial)]/30 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--gold-imperial)] transition-colors resize-none"
                      placeholder="Describe the private world you imagine..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "royal-shimmer-btn w-full py-4.5 rounded-xl mt-2",
                      "bg-gradient-to-r from-[var(--gold-dark)] via-[#FFF5D0] to-[var(--gold-imperial)] text-[#06080E]",
                      "text-xs font-cinzel font-black uppercase tracking-[0.25em]",
                      "shadow-[0_8px_30px_rgba(212,175,55,0.35)]",
                      "transition-all duration-500 hover:scale-[1.02]",
                      isSubmitting ? "opacity-60 cursor-wait" : ""
                    )}
                  >
                    {isSubmitting ? "Transmitting to manikanthch2779@gmail.com..." : "Transmit Royal Inquiry to manikanthch2779@gmail.com"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}