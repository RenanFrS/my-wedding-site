"use client";

import type { RefObject } from "react";
import { useEffect } from "react";

interface UseParallaxOptions {
  axis?: "x" | "y";
  factor?: number;
  offset?: number;
  startAt?: number;
  enabled?: boolean;
}

export function useParallax(
  ref: RefObject<HTMLElement | null>,
  {
    axis = "x",
    factor = -0.3,
    offset = -100,
    startAt = 0,
    enabled = true,
  }: UseParallaxOptions = {}
): void {
  useEffect(() => {
    if (!enabled) return;
    const el: HTMLElement | null = ref.current;
    if (!el) return;

    const onScroll = (): void => {
      let y: number = window.pageYOffset;
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
