'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Timeline from '@/components/Timeline';
import Skiper30 from '@/components/Skiper30';
import Quote from '@/components/Quote';
import Hands from '@/components/Hands';
import Stay from '@/components/Stay';
import DressCodeSection from '@/components/DressCodeSection';
import Confirmacao from '@/components/Confirmacao';
import MensagemNoivos from '@/components/MensagemNoivos';
import Registry from '@/components/Registry';
import PartingMessage from '@/components/PartingMessage';
import Footer from '@/components/Footer';
import { useRevealOnScroll } from '@/components/hooks/useRevealOnScroll';
import type { DressCodeContent, PayloadMedia } from '@/types';

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
  dressCode: DressCodeContent | null;
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
  dressCode,
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
          <div className="relative z-20 -mt-16 md:-mt-24 rounded-t-[2rem] md:rounded-t-[3.5rem] bg-[var(--color-background)] pt-6 md:pt-10">
            <Stay media={ceremonyMedia} />
          </div>
          <DressCodeSection content={dressCode} />
          <Confirmacao />
          <MensagemNoivos />
          <section id="presentes">
            <Registry media={registryMedia} />
          </section>
          <div className="relative overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, transparent 0%, var(--color-secondary) 100%)',
                opacity: 0.18,
              }}
            />
            <div className="relative z-10">
              <PartingMessage />
              <Footer
                coupleName={coupleName}
                groomFullName={groomFullName}
                brideFullName={brideFullName}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
