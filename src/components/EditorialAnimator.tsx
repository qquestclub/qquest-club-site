"use client";

import { useEffect } from "react";
import { animate, stagger } from "animejs";

export function EditorialAnimator() {
  useEffect(() => {
    // Respect user's motion preferences
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    try {
      // 1. Blue depth backdrop rectangles reveal
      animate(".depth-backdrop-rect, .hero-depth-rect", {
        opacity: [0, 1],
        scale: [0.96, 1],
        duration: 900,
        delay: stagger(100, { start: 100 }),
        ease: "outExpo",
      });

      // 2. Hero typography reveal
      animate(".poster-massive-title, .poster-tagline, .poster-statement, .poster-cta-row", {
        translateY: [24, 0],
        opacity: [0, 1],
        duration: 850,
        delay: stagger(100, { start: 50 }),
        ease: "outCubic",
      });

      // 3. Hero Specs card reveal
      animate(".hero-specs-card", {
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 850,
        delay: 200,
        ease: "outCubic",
      });

      // 4. Staggered reveal for big Didone numerals
      animate(".editorial-number", {
        translateY: [35, 0],
        opacity: [0, 1],
        duration: 750,
        delay: stagger(120, { start: 350 }),
        ease: "outCubic",
      });

      // 5. Hairline rule expansion on action links
      animate(".link-arrow-rule, .cta-line", {
        scaleX: [0, 1],
        duration: 700,
        delay: stagger(80, { start: 450 }),
        ease: "outExpo",
      });
    } catch {
      // Graceful fallback if DOM is not ready
    }
  }, []);

  return null;
}
