"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface SplitTextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
  trigger?: boolean;
}

export default function SplitTextReveal({
  children,
  className,
  delay = 0,
  stagger = 0.03,
  trigger = true,
}: SplitTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trigger || !containerRef.current) return;

    const chars = containerRef.current.querySelectorAll(".split-char");

    gsap.fromTo(
      chars,
      { opacity: 0, y: 40, rotateX: -90 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        stagger,
        delay,
        ease: "power3.out",
      }
    );
  }, [trigger, delay, stagger]);

  const words = children.split(" ");

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden", className)}
      style={{ perspective: "600px" }}
    >
      {words.map((word, wi) => (
        <span key={wi} className="inline-block mr-[0.25em]">
          {word.split("").map((char, ci) => (
            <span
              key={ci}
              className="split-char inline-block opacity-0"
              style={{ transformOrigin: "bottom center" }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}