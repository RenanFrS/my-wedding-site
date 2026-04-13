'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Timeline from '@/components/Timeline';
import Skiper30 from '@/components/Skiper30';
import Quote from '@/components/Quote';
import Hands from '@/components/Hands';
import Stay from '@/components/Stay';
import Confirmacao from '@/components/Confirmacao';
import MensagemNoivos from '@/components/MensagemNoivos';
import Registry from '@/components/Registry';
import PartingMessage from '@/components/PartingMessage';
import Footer from '@/components/Footer';
import { useRevealOnScroll } from '@/components/hooks/useRevealOnScroll';
import type { PayloadMedia } from '@/types';

interface HomePageClientProps {
  coupleName: string;
  groomFullName: string;
  brideFullName: string;
  weddingDate: string;
  weddingDateText: string;
  countdownEnabled: boolean;
  heroMedia: PayloadMedia | null;
  middleMedia: PayloadMedia | null;
  ceremonyMedia: PayloadMedia | null;
  registryMedia: PayloadMedia | null;
  carouselMedia: PayloadMedia[];
}

export default function HomePageClient({
  coupleName,
  groomFullName,
  brideFullName,
  weddingDate,
  weddingDateText,
  countdownEnabled,
  heroMedia,
  middleMedia,
  ceremonyMedia,
  registryMedia,
  carouselMedia,
}: HomePageClientProps): React.JSX.Element {
  useRevealOnScroll();

  return (
    <div className="text-[var(--color-text-primary)] font-serif overflow-x-hidden">
      <Navbar coupleName={coupleName} weddingDateText={weddingDateText} />

      <section id="inicio" className="h-screen">
        <Hero
          coupleName={coupleName}
          weddingDateText={weddingDateText}
          media={heroMedia}
        />
      </section>

      <Timeline targetDate={weddingDate} enabled={countdownEnabled} />

      <div className="relative w-screen">
        <div className="w-screen">
          <Skiper30 mediaItems={carouselMedia} />
          <Quote />
          <Hands media={middleMedia} />
          <Stay media={ceremonyMedia} />
          <Confirmacao />
          <MensagemNoivos />
          <section id="presentes">
            <Registry media={registryMedia} />
          </section>
          <PartingMessage />
          <Footer
            coupleName={coupleName}
            groomFullName={groomFullName}
            brideFullName={brideFullName}
          />
        </div>
      </div>
    </div>
  );
}
