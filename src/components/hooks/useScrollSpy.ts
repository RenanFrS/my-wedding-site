"use client";

import { useEffect, useState } from "react";

interface UseScrollSpyOptions {
  threshold?: number | number[];
  rootMargin?: string;
}

export function useScrollSpy(
  sectionIds: string[] = [],
  options: UseScrollSpyOptions = {}
): string | null {
  const [activeId, setActiveId] = useState<string | null>(
    sectionIds[0] ?? null
  );

  useEffect(() => {
    if (!sectionIds.length) return;

    const elements: HTMLElement[] = sectionIds
      .map((id: string) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (!elements.length) return;

    // Decidimos a seção ativa por geometria, não por intersectionRatio. O ratio
    // é relativo à área da própria seção, então uma seção mais alta que a faixa
    // de detecção (ex: o Hero de 100vh) nunca alcança thresholds altos e o
    // sublinhado não acompanha. Em vez disso, a seção ativa é a que cruza a linha
    // central da viewport — independente da altura. O observer serve só de
    // gatilho (dispara a cada cruzamento dessa linha).
    const pickActive = (): void => {
      const mid: number = window.innerHeight / 2;
      // Ordena pela posição real na página (a ordem de sectionIds pode diferir
      // da ordem do DOM, ex: confirmacao vem antes de vestimenta na home).
      const ordered: HTMLElement[] = [...elements].sort(
        (a: HTMLElement, b: HTMLElement) =>
          a.getBoundingClientRect().top - b.getBoundingClientRect().top
      );

      let current: string | null = null;
      for (const el of ordered) {
        const rect: DOMRect = el.getBoundingClientRect();
        if (rect.top <= mid && rect.bottom >= mid) {
          current = el.id;
          break;
        }
      }

      // Centro caiu numa seção não rastreada (Timeline, carrossel, etc.):
      // mantém a última seção rastreada que já passou pela linha central.
      if (!current) {
        for (const el of ordered) {
          if (el.getBoundingClientRect().top <= mid) current = el.id;
        }
      }

      if (current) setActiveId(current);
    };

    const observer = new IntersectionObserver(pickActive, {
      root: null,
      threshold: options.threshold ?? 0,
      rootMargin: options.rootMargin ?? "-50% 0px -50% 0px",
    });

    elements.forEach((el: HTMLElement) => observer.observe(el));
    pickActive(); // estado inicial correto no mount
    return () => observer.disconnect();
  }, [JSON.stringify(sectionIds), options.threshold, options.rootMargin]);

  return activeId;
}
