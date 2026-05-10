'use client';

import React from 'react';
import type { PayloadMedia } from '@/types';

interface PayloadMediaRendererProps {
  media?: PayloadMedia | null;
  alt?: string;
  className?: string;
  emptyMessage?: string;
  autoPlayVideo?: boolean;
  mutedVideo?: boolean;
  loopVideo?: boolean;
  videoLoading?: 'eager' | 'lazy';
  /**
   * Quando true, força <video> nativo com object-cover ao invés do iframe Cloudinary Player.
   * Use em backgrounds (Hero etc.) onde o vídeo precisa preencher 100% sem letterboxing.
   */
  coverMode?: boolean;
}

function resolveMediaURL(media?: PayloadMedia | null): string {
  return media?.url || media?.cloudinary?.secure_url || '';
}

function isVideo(media?: PayloadMedia | null): boolean {
  const mime = media?.mimeType?.toLowerCase() || '';
  const resourceType = media?.cloudinary?.resource_type?.toLowerCase() || '';
  return mime.startsWith('video/') || resourceType === 'video';
}

function extractCloudinaryCloudName(media?: PayloadMedia | null): string {
  const secureURL = media?.cloudinary?.secure_url || media?.url;
  if (!secureURL) return '';

  try {
    const parsed = new URL(secureURL);
    if (!parsed.hostname.endsWith('cloudinary.com')) return '';
    return parsed.pathname.split('/').filter(Boolean)[0] || '';
  } catch {
    return '';
  }
}

function extractURLFromInput(value: string): string {
  const trimmed = value.trim();
  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  return (srcMatch?.[1] || trimmed).trim();
}

function withCloudinaryPlayerDefaults(rawURL: string): string {
  try {
    const parsed = new URL(rawURL);
    if (parsed.hostname !== 'player.cloudinary.com') {
      return rawURL;
    }

    parsed.searchParams.set('player[autoplay]', 'true');
    parsed.searchParams.set('player[muted]', 'true');
    parsed.searchParams.set('player[loop]', 'true');
    parsed.searchParams.set('player[controls]', 'false');
    parsed.searchParams.set('source[transformation][quality]', 'auto');
    parsed.searchParams.set('source[transformation][fetch_format]', 'auto');

    return parsed.toString();
  } catch {
    return rawURL;
  }
}

function buildCloudinaryPlayerURL(media?: PayloadMedia | null): string | null {
  if (!isVideo(media)) return null;

  const configuredURL = media?.cloudinaryPlayerURL;
  if (configuredURL) {
    return withCloudinaryPlayerDefaults(extractURLFromInput(configuredURL));
  }

  const publicId = media?.cloudinary?.public_id;
  const cloudName = extractCloudinaryCloudName(media);

  if (!publicId || !cloudName) return null;

  const parsed = new URL('https://player.cloudinary.com/embed/');
  parsed.searchParams.set('cloud_name', cloudName);
  parsed.searchParams.set('public_id', publicId);
  parsed.searchParams.set('player[autoplay]', 'true');
  parsed.searchParams.set('player[muted]', 'true');
  parsed.searchParams.set('player[loop]', 'true');
  parsed.searchParams.set('player[controls]', 'false');
  parsed.searchParams.set('source[transformation][quality]', 'auto');
  parsed.searchParams.set('source[transformation][fetch_format]', 'auto');

  return parsed.toString();
}

export default function PayloadMediaRenderer({
  media,
  alt,
  className,
  emptyMessage = 'Inserir no seu painel',
  autoPlayVideo = true,
  mutedVideo = true,
  loopVideo = true,
  videoLoading = 'lazy',
  coverMode = false,
}: PayloadMediaRendererProps): React.JSX.Element {
  const src = resolveMediaURL(media);
  const cloudinaryPlayerURL = coverMode ? null : buildCloudinaryPlayerURL(media);

  if (!src) {
    return (
      <div className={className}>
        <div className="h-full w-full bg-[var(--color-background)] flex items-center justify-center px-4 text-center">
          <span className="text-xs md:text-sm tracking-wide uppercase text-[var(--color-text)]/70">
            {emptyMessage}
          </span>
        </div>
      </div>
    );
  }

  if (isVideo(media)) {
    if (cloudinaryPlayerURL) {
      return (
        <div className={`relative overflow-hidden ${className || 'h-full w-full'}`}>
          <iframe
            className="absolute inset-0 h-full w-full scale-[1.08] transform-gpu"
            src={cloudinaryPlayerURL}
            title={alt || media?.alt || 'Video'}
            loading={videoLoading}
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
            frameBorder={0}
          />
        </div>
      );
    }

    return (
      <video
        className={className}
        src={src}
        playsInline
        muted={mutedVideo}
        loop={loopVideo}
        autoPlay={autoPlayVideo}
        controls={false}
        preload={videoLoading === 'eager' ? 'auto' : 'metadata'}
      />
    );
  }

  return <img className={className} src={src} alt={alt || media?.alt || 'Mídia'} />;
}
