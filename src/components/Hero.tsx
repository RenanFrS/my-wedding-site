'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParallax } from '@/components/hooks/useParallax';
import { ChevronDown } from 'lucide-react';
import PayloadMediaRenderer from '@/components/PayloadMediaRenderer';
import type { PayloadMedia } from '@/types';

interface HeroProps {
  coupleName: string;
  weddingDateText: string;
  media?: PayloadMedia | null;
}

export default function Hero({
  coupleName,
  weddingDateText,
  media = null,
}: HeroProps): React.JSX.Element {
  const bgRef = useRef<HTMLDivElement>(null);
  const [parallaxEnabled, setParallaxEnabled] = useState<boolean>(false);

  useEffect(() => {
    // Enable parallax only on wider screens (e.g., >= 768px)
    const check = (): void => setParallaxEnabled(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useParallax(bgRef, {
    axis: 'y',
    factor: -0.1,
    offset: 0,
    startAt: 0,
    enabled: parallaxEnabled,
  });

  const scrollToNext = (): void => {
    const next = document.getElementById('historia');
    next?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative h-screen w-full z-10 overflow-hidden">
      <div ref={bgRef} className="absolute inset-0 z-0">
        <PayloadMediaRenderer
          media={media}
          className="h-full w-full object-cover"
          videoLoading="eager"
          emptyMessage="Inserir no seu painel: Background Media > Hero"
        />
      </div>
      {/* Softer white gradient at the bottom to gently blend with the photo */}
      <div className="" />

      {/* Bottom-centered content */}
      <div className="absolute inset-x-0 bottom-10 flex flex-col items-center text-center text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)] px-4 z-30">
        <h1 className="text-4xl md:text-7xl font-normal font-amoresa tracking-tight">
          {coupleName.includes('&') ? (
            <>
              {coupleName.split('&')[0]?.trim()} &
              <span className="block mt-5">{coupleName.split('&').slice(1).join(' & ').trim()}</span>
            </>
          ) : (
            coupleName
          )}
        </h1>
        <p className="mt-2 text-sm md:text-lg tracking-[0.15em] md:tracking-[0.25em] uppercase font-migra">
          {weddingDateText}
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
