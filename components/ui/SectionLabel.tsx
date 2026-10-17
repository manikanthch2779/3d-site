"use client";

import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  number?: string;
}

export default function SectionLabel({ children, className, number }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {number && (
        <span className="text-[11px] font-cinzel font-semibold tracking-widest text-[var(--gold-imperial)] flex items-center gap-1.5">
          <span className="text-[8px] text-gold-shine">◆</span>
          <span>{number}</span>
        </span>
      )}
      <div className="w-8 h-[1px] bg-gradient-to-r from-[var(--gold-imperial)] to-transparent" />
      <span className="text-[11px] font-cinzel font-semibold tracking-[0.25em] uppercase text-white/90">
        {children}
      </span>
    </div>
  );
}