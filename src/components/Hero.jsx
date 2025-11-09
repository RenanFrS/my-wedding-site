"use client";
import React, { useEffect, useRef, useState } from "react";
import { useCountdown } from "./hooks/useCountdown";
import { useParallax } from "./hooks/useParallax";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const ctaText = useCountdown(
    "September 06, 2026 00:00:00",
    "September 08, 2026 00:00:00"
  );
  const bgRef = useRef(null);
  const [parallaxEnabled, setParallaxEnabled] = useState(false);
  useEffect(() => {
    // Enable parallax only on wider screens (e.g., >= 768px)
    const check = () => setParallaxEnabled(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  useParallax(bgRef, {
    axis: "y",
    factor: -0.1,
    offset: 0,
    startAt: 0,
    enabled: parallaxEnabled,
  });

  const scrollToNext = () => {
    const next = document.getElementById("historia");
    next?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative h-screen w-full z-10 overflow-hidden">
      {/* Background image */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url(/imagens/1.jpg)" }}
      />
      {/* Softer white gradient at the bottom to gently blend with the photo */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 md:h-80 bg-gradient-to-t from-[#fefaf6] via-[#fefaf6]/80 to-transparent z-20" />

      {/* Bottom-centered content */}
      <div className="absolute inset-x-0 bottom-10 flex flex-col items-center text-center text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)] px-4 z-30">
        <h1 className="text-4xl md:text-7xl font-normal font-amoresa tracking-tight">
          Renan &<span className="block mt-5">Heloisa</span>
        </h1>
        <p className="mt-2 text-sm md:text-lg tracking-[0.15em] md:tracking-[0.25em] uppercase font-migra">
          06 de Setembro de 2026
        </p>
        <button
          onClick={scrollToNext}
          aria-label="Descer"
          className="mt-6 w-8 h-8 md:w-8 md:h-8 flex items-center justify-center rounded-full border border-white/50 bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 active:scale-95 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <ChevronDown className="w-6 h-6 md:w-7 md:h-7" />
          <span className="sr-only">Continuar</span>
        </button>
      </div>
    </section>
  );
}
