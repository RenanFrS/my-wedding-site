"use client";
import { useEffect } from "react";

export function useParallax(
  ref,
  { axis = "x", factor = -0.3, offset = -100, startAt = 0, enabled = true } = {}
) {
  useEffect(() => {
    if (!enabled) return; // Skip on mobile or when disabled
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      let y = window.pageYOffset;
      y += startAt;
      if (axis === "x") {
        el.style.backgroundPositionX = `${y * factor + offset}px`;
      }
      if (axis === "y") {
        el.style.backgroundPositionY = `${y * factor + offset}px`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref, axis, factor, offset, startAt, enabled]);
}
