"use client";
import { useEffect, useState } from "react";

export function useScrollSpy(sectionIds = [], options = {}) {
  const [activeId, setActiveId] = useState(sectionIds[0] || null);

  useEffect(() => {
    if (!sectionIds.length) return;
    const elements = sectionIds
      .map((id) =>
        typeof id === "string" ? document.getElementById(id) : null
      )
      .filter(Boolean);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most visible entry
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const id = visible[0].target.id;
          if (id) setActiveId(id);
        } else {
          // Fallback: top-most section by bounding rect
          const topMost = entries
            .slice()
            .sort(
              (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
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

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [JSON.stringify(sectionIds), options.threshold, options.rootMargin]);

  return activeId;
}
