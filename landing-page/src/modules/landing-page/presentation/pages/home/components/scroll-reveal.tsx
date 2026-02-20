"use client";

import { useEffect, useRef } from "react";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Respect user's motion preference — show immediately without animation
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      element.classList.add("is-visible");
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              timeoutId = setTimeout(() => {
                entry.target.classList.add("is-visible");
              }, delay);
            } else {
              entry.target.classList.add("is-visible");
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${className ?? ""}`.trim()}>
      {children}
    </div>
  );
}
