'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps): React.JSX.Element {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // No mobile (ponteiro grosso/touch) o momentum nativo é mais fluido que o
    // smoothing do Lenis — sobrepor os dois causa o travamento no carrossel.
    // Também respeitamos quem prefere menos movimento. Nestes casos usamos o
    // scroll nativo; o ScrollTrigger (parallax) continua funcionando sozinho.
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (isTouch || prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    // Mantém o ScrollTrigger (carrossel Skiper30) sincronizado com o Lenis.
    lenis.on('scroll', ScrollTrigger.update);

    // Um único loop de animação (o ticker do GSAP) dirige o Lenis — evita dois
    // requestAnimationFrame concorrentes e mantém scrub e scroll no mesmo frame.
    const onTick = (time: number): void => {
      lenis.raf(time * 1000); // gsap.ticker entrega segundos; Lenis espera ms
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
