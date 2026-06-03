"use client";

import { useEffect } from "react";

/**
 * Revela elementos `.reveal` quando entram na viewport, alternando a classe
 * `.active`. Usa IntersectionObserver (sem trabalho por evento de scroll, sem
 * reflow forçado) — ao contrário da versão antiga, que recalculava layout de
 * todos os `.reveal` a cada scroll e causava travamento.
 */
export function useRevealOnScroll(): void {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (els.length === 0) return;

    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("active"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("active", entry.isIntersecting);
        }
      },
      // bottom -150px reproduz o "windowHeight - 150" da lógica original.
      { rootMargin: "0px 0px -150px 0px", threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
