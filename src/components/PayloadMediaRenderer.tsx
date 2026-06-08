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

function isVideo(media?: PayloadMedia | null): boolean {
  const mime = media?.mimeType?.toLowerCase() || '';
  const resourceType = media?.cloudinary?.resource_type?.toLowerCase() || '';
  return mime.startsWith('video/') || resourceType === 'video';
}

/**
 * Injeta um segmento de transformação numa URL de entrega do Cloudinary
 * (logo após `/upload/`). Retorna a URL original se não for do Cloudinary.
 */
function injectCloudinaryTransform(url: string, transform: string): string {
  const marker = '/upload/';
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  const head = url.slice(0, idx + marker.length);
  const tail = url.slice(idx + marker.length);
  return `${head}${transform}/${tail}`;
}

// Poster (1º frame) do vídeo de fundo. Apenas um placeholder mostrado por uma
// fração de segundo até o vídeo começar — pode ser leve.
const COVER_VIDEO_POSTER_TRANSFORM = 'so_0,f_auto,q_auto';

// Transform do vídeo de fundo (`coverVideo`). O ARQUIVO ORIGINAL do trailer é 4K
// e ~23MB, o que fazia o PRIMEIRO carregamento (cache de borda frio) levar ~15s.
// Usamos `q_auto:best` (alta qualidade, sem granulado) limitado a 2560px de largura
// — nítido em qualquer tela num bg fullscreen com object-cover — gerando ~5.5MB
// (~4x menor), com cold start em ~2-3s. O custo do re-encode sob demanda do
// Cloudinary acontece UMA única vez por derivada; o hook `warmCloudinaryCoverVideo`
// (collections/Media.ts) pré-aquece a URL no upload para que nem o primeiro
// visitante real pague esse custo.
export const COVER_VIDEO_TRANSFORM = 'f_auto,q_auto:best,w_2560,c_limit';

/**
 * Resolve a melhor URL de entrega da mídia. Prioriza o `secure_url` do
 * Cloudinary (servido pela CDN, com range requests e cache de borda) em vez
 * da rota local `/api/media/file/...`, que transmite pelo próprio servidor.
 *
 * Vídeos de fundo (`coverVideo`) usam `COVER_VIDEO_TRANSFORM` (1920px + q_auto).
 * Imagens usam `f_auto,q_auto` (qualidade visualmente idêntica, menor).
 */
function resolveMediaURL(
  media?: PayloadMedia | null,
  coverVideo = false
): string {
  const secureURL = media?.cloudinary?.secure_url;
  if (secureURL) {
    if (coverVideo && isVideo(media)) {
      return injectCloudinaryTransform(secureURL, COVER_VIDEO_TRANSFORM);
    }
    return injectCloudinaryTransform(secureURL, 'f_auto,q_auto');
  }
  return media?.url || '';
}

/**
 * Gera um poster (1º frame) para vídeos do Cloudinary, trocando a extensão
 * por `.jpg` e usando `so_0` (start offset 0). Permite paint instantâneo
 * enquanto o vídeo carrega/autoplay inicia.
 */
function resolveVideoPosterURL(media?: PayloadMedia | null): string | undefined {
  const secureURL = media?.cloudinary?.secure_url;
  if (!secureURL || !isVideo(media)) return undefined;
  const withTransform = injectCloudinaryTransform(
    secureURL,
    COVER_VIDEO_POSTER_TRANSFORM
  );
  return withTransform.replace(/\.(mp4|mov|webm|m4v|ogv|avi|mkv)(\?.*)?$/i, '.jpg$2');
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
  const src = resolveMediaURL(media, coverMode);
  const cloudinaryPlayerURL = coverMode ? null : buildCloudinaryPlayerURL(media);
  const videoPosterURL = resolveVideoPosterURL(media);

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
        poster={videoPosterURL}
        playsInline
        muted={mutedVideo}
        loop={loopVideo}
        autoPlay={autoPlayVideo}
        controls={false}
        preload={videoLoading === 'eager' ? 'auto' : 'metadata'}
      />
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt || media?.alt || 'Mídia'}
      loading={videoLoading}
      decoding="async"
    />
  );
}
