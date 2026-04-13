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

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const visible: IntersectionObserverEntry[] = entries
          .filter((e: IntersectionObserverEntry) => e.isIntersecting)
          .sort(
            (a: IntersectionObserverEntry, b: IntersectionObserverEntry) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (visible[0]) {
          const id: string = visible[0].target.id;
          if (id) setActiveId(id);
        } else {
          const topMost: IntersectionObserverEntry | undefined = entries
            .slice()
            .sort(
              (a: IntersectionObserverEntry, b: IntersectionObserverEntry) =>
                a.boundingClientRect.top - b.boundingClientRect.top
            )[0];
          if (topMost?.target?.id) setActiveId(topMost.target.id);
        }
      },
      {
        root: null,
        threshold: options.threshold ?? [0.3, 0.6, 0.9],
        rootMargin: options.rootMargin ?? "-30% 0px -50% 0px",
      }
    );

    elements.forEach((el: HTMLElement) => observer.observe(el));
    return () => observer.disconnect();
  }, [JSON.stringify(sectionIds), options.threshold, options.rootMargin]);

  return activeId;
}
