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
}

function resolveMediaURL(media?: PayloadMedia | null): string {
  return media?.url || media?.cloudinary?.secure_url || '';
}

function isVideo(media?: PayloadMedia | null): boolean {
  const mime = media?.mimeType?.toLowerCase() || '';
  const resourceType = media?.cloudinary?.resource_type?.toLowerCase() || '';
  return mime.startsWith('video/') || resourceType === 'video';
}

export default function PayloadMediaRenderer({
  media,
  alt,
  className,
  emptyMessage = 'Inserir no seu painel',
  autoPlayVideo = true,
  mutedVideo = true,
  loopVideo = true,
}: PayloadMediaRendererProps): React.JSX.Element {
  const src = resolveMediaURL(media);

  if (!src) {
    return (
      <div className={className}>
        <div className="h-full w-full bg-[var(--color-accent)] flex items-center justify-center px-4 text-center">
          <span className="text-xs md:text-sm tracking-wide uppercase text-[var(--color-text-primary)]/70">
            {emptyMessage}
          </span>
        </div>
      </div>
    );
  }

  if (isVideo(media)) {
    return (
      <video
        className={className}
        src={src}
        playsInline
        muted={mutedVideo}
        loop={loopVideo}
        autoPlay={autoPlayVideo}
        controls={false}
        preload="metadata"
      />
    );
  }

  return <img className={className} src={src} alt={alt || media?.alt || 'Mídia'} />;
}
