"use client";
import React from "react";
import { Button } from "@/components/ui/button";

interface LenisLike {
  scrollTo: (
    target: string | HTMLElement,
    options?: { offset?: number; duration?: number },
  ) => void;
}

export default function PartingMessage(): React.JSX.Element {
  const handleConfirmClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();

    const lenis = (window as Window & { lenis?: LenisLike }).lenis;
    // Offset negativo compensa a altura do navbar fixo (h-20 ≈ 80px).
    if (lenis) {
      lenis.scrollTo("#confirmacao", { offset: -80, duration: 1.2 });
      return;
    }

    // Fallback (mobile / prefers-reduced-motion): scroll suave nativo.
    document
      .getElementById("confirmacao")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="parting-message reveal text-center">
      {/* <h1 className="mt-[10vh] text-[7rem] leading-[7rem] font-medium">
        Esperamos você
      </h1> */}
      <Button
        asChild
        className="mx-auto w-[325px] h-11 rounded-full px-6 text-[0.75rem] uppercase tracking-[0.12em] text-white shadow-md transition hover:brightness-95"
        style={{ backgroundColor: "var(--color-button)" }}
      >
        <a href="#confirmacao" onClick={handleConfirmClick}>
          Confirme Presença
        </a>
      </Button>
    </div>
  );
}
