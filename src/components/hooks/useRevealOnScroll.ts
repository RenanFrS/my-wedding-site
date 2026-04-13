"use client";

import { useEffect } from "react";

export function useRevealOnScroll(): void {
  useEffect(() => {
    const reveal = (): void => {
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el: HTMLElement) => {
        const windowHeight: number = window.innerHeight;
        const elementTop: number = el.getBoundingClientRect().top;
        const elementVisible: number = 150;

        if (elementTop < windowHeight - elementVisible) {
          el.classList.add("active");
        } else {
          el.classList.remove("active");
        }
      });
    };

    window.addEventListener("scroll", reveal);
    reveal();
    return () => window.removeEventListener("scroll", reveal);
  }, []);
}
