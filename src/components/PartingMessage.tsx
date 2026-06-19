"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { scrollToHash } from "@/lib/scrollToHash";

export default function PartingMessage(): React.JSX.Element {
  const handleConfirmClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    scrollToHash("#confirmacao", -80);
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
