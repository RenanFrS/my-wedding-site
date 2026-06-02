import React from 'react';
import type { Metadata } from 'next';
import { getBackgroundMedia, getGiftList, getSiteSettings } from '@/lib/api';
import GiftGrid from '@/components/GiftGrid';
import PayloadMediaRenderer from '@/components/PayloadMediaRenderer';
import type { PayloadMedia } from '@/types';

function toMedia(value: unknown): PayloadMedia | null {
  if (!value || typeof value !== 'object') return null;

  const candidate = value as Partial<PayloadMedia>;
  if (!candidate.url && !candidate.cloudinary?.secure_url) return null;

  return value as PayloadMedia;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Lista de Presentes — ${settings.seo.siteTitle}`,
    description: 'Confira nossa lista de presentes e nos presenteie com muito carinho.',
    openGraph: {
      title: `Lista de Presentes — ${settings.seo.siteTitle}`,
      description: 'Confira nossa lista de presentes e nos presenteie com muito carinho.',
    },
  };
}

export default async function ListaDePresentes(): Promise<React.JSX.Element> {
  const [gifts, settings, backgroundEntries] = await Promise.all([
    getGiftList(),
    getSiteSettings(),
    getBackgroundMedia('section3'),
  ]);

  const defaultPaymentLink = settings.payment.defaultPaymentLink || '';
  const bannerMedia = toMedia(backgroundEntries[0]?.media);

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Banner */}
      <section className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <PayloadMediaRenderer
            media={bannerMedia}
            className="h-full w-full object-cover"
            emptyMessage="Inserir no painel: Fotos de Fundo > Fundo da página Lista de Presentes"
          />
        </div>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="font-amoresa text-4xl md:text-6xl tracking-tight mb-4">
            Lista de Presentes
          </h1>
          <p className="text-sm md:text-lg tracking-[0.15em] uppercase font-sans max-w-xl mx-auto">
            Sua generosidade torna este momento ainda mais especial
          </p>
        </div>
      </section>

      {/* Gift Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        {gifts.length > 0 ? (
          <GiftGrid gifts={gifts} defaultPaymentLink={defaultPaymentLink} />
        ) : (
          <div className="text-center py-20">
            <p className="text-[var(--color-text)] text-lg">
              A lista de presentes será disponibilizada em breve.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}