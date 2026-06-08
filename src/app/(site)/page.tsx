import React from 'react';
import HomePageClient from '@/components/HomePageClient';
import {
  getBackgroundMedia,
  getCarouselMedia,
  getDressCode,
  getSiteSettings,
} from '@/lib/api';
import type { BackgroundMedia, PayloadMedia } from '@/types';

const PANEL_FALLBACK = 'Inserir no seu painel';

function formatWeddingDate(dateInput: string): string {
  const parsed = new Date(dateInput);
  if (Number.isNaN(parsed.getTime())) return PANEL_FALLBACK;

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsed);
}

function formatCeremonyTime(dateInput: string): string {
  const parsed = new Date(dateInput);
  if (Number.isNaN(parsed.getTime())) return '';

  // Usa a mesma timezone (UTC) do formatWeddingDate para refletir a hora
  // exata definida no painel, sem deslocamento por fuso do servidor.
  const hours = parsed.getUTCHours();
  const minutes = parsed.getUTCMinutes();

  return minutes === 0 ? `${hours}h` : `${hours}h${String(minutes).padStart(2, '0')}`;
}

function toMedia(value: unknown): PayloadMedia | null {
  if (!value || typeof value !== 'object') return null;

  const candidate = value as Partial<PayloadMedia>;
  if (!candidate.url && !candidate.cloudinary?.secure_url) return null;

  return value as PayloadMedia;
}

export default async function Page(): Promise<React.JSX.Element> {
  const [settings, carouselEntries, backgrounds, dressCode] = await Promise.all([
    getSiteSettings(),
    getCarouselMedia(),
    getBackgroundMedia(),
    getDressCode(),
  ]);

  const coupleName = settings.couple?.coupleName?.trim() || PANEL_FALLBACK;
  const groomFullName = settings.couple?.groomFullName?.trim() || PANEL_FALLBACK;
  const brideFullName = settings.couple?.brideFullName?.trim() || PANEL_FALLBACK;

  const weddingDate = settings.weddingDate || '';
  const weddingDateText = formatWeddingDate(weddingDate);
  const ceremonyTime = formatCeremonyTime(weddingDate);

  const getMediaByLocation = (location: BackgroundMedia['location']): PayloadMedia | null => {
    const item = backgrounds.find((background) => background.location === location);
    return toMedia(item?.media);
  };

  const carouselMedia = carouselEntries
    .map((item) => toMedia(item.media))
    .filter((media): media is PayloadMedia => media !== null);

  return (
    <HomePageClient
      coupleName={coupleName}
      groomFullName={groomFullName}
      brideFullName={brideFullName}
      weddingDate={weddingDate}
      weddingDateText={weddingDateText}
      countdownEnabled={settings.countdownEnabled}
      ceremonyTime={ceremonyTime}
      heroMedia={getMediaByLocation('hero')}
      ceremonyMedia={getMediaByLocation('section1')}
      registryMedia={getMediaByLocation('section2')}
      carouselMedia={carouselMedia}
      dressCode={dressCode}
    />
  );
}