"use client";

import { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
  as?: "button" | "a";
  href?: string;
}

export default function MagneticButton({
  children,
  className,
  onClick,
  strength = 0.35,
  as = "button",
  href,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
    el.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
    setTimeout(() => {
      if (el) el.style.transition = "";
    }, 400);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) onClick();
  };

  const props = {
    ref: ref as React.RefObject<HTMLButtonElement>,
    className: cn("magnetic-area", className),
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
  };

  return (
    /* Wide Surrounding Click Wrapper Zone — Clicking in surroundings triggers button click */
    <div
      onClick={handleClick}
      className="inline-block p-6 sm:p-10 cursor-pointer relative group/surround transition-all"
      title="Click to Request Private Consultation"
    >
      {as === "a" && href ? (
        <a {...props} ref={ref as React.RefObject<HTMLAnchorElement>} href={href}>
          {children}
        </a>
      ) : (
        <button {...props}>{children}</button>
      )}
    </div>
  );
}