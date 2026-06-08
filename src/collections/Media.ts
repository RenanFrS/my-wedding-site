import type { CollectionAfterChangeHook, CollectionConfig } from 'payload';

type MediaDoc = {
  id: number | string;
  mimeType?: string | null;
  url?: string | null;
  cloudinaryPlayerURL?: string | null;
  cloudinary?: {
    public_id?: string | null;
    resource_type?: string | null;
    secure_url?: string | null;
  } | null;
};

function extractCloudNameFromURL(url?: string | null): string {
  if (!url) return '';

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith('cloudinary.com')) {
      return '';
    }

    return parsed.pathname.split('/').filter(Boolean)[0] || '';
  } catch {
    return '';
  }
}

function isVideoMedia(doc: MediaDoc): boolean {
  const mime = doc.mimeType?.toLowerCase() || '';
  const resourceType = doc.cloudinary?.resource_type?.toLowerCase() || '';
  return mime.startsWith('video/') || resourceType === 'video';
}

function buildCloudinaryPlayerURL(doc: MediaDoc): string | null {
  if (!isVideoMedia(doc)) {
    return null;
  }

  const publicId = doc.cloudinary?.public_id || '';
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    extractCloudNameFromURL(doc.cloudinary?.secure_url || doc.url);

  if (!publicId || !cloudName) {
    return null;
  }

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

// Mantenha em sincronia com COVER_VIDEO_TRANSFORM em components/PayloadMediaRenderer.tsx.
const COVER_VIDEO_TRANSFORM = 'f_auto,q_auto:best,w_2560,c_limit';
const COVER_VIDEO_POSTER_TRANSFORM = 'so_0,f_auto,q_auto';

function injectCloudinaryTransform(url: string, transform: string): string {
  const marker = '/upload/';
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  const head = url.slice(0, idx + marker.length);
  const tail = url.slice(idx + marker.length);
  return `${head}${transform}/${tail}`;
}

/**
 * Pré-aquece (warm-up) a derivada otimizada do vídeo de fundo no Cloudinary logo
 * após o upload. O Cloudinary gera a derivada sob demanda na PRIMEIRA requisição
 * (re-encode que pode levar ~20-30s); ao requisitá-la aqui, o trabalho é feito
 * uma vez e a CDN passa a servir do cache de borda. Sem isso, o primeiro visitante
 * real pagaria essa espera. Fire-and-forget: nunca bloqueia o salvamento.
 */
const warmCloudinaryCoverVideo: CollectionAfterChangeHook = ({ doc, req }) => {
  const mediaDoc = doc as MediaDoc;
  const secureURL = mediaDoc.cloudinary?.secure_url;

  if (!isVideoMedia(mediaDoc) || !secureURL) {
    return doc;
  }

  const videoURL = injectCloudinaryTransform(secureURL, COVER_VIDEO_TRANSFORM);
  const posterURL = injectCloudinaryTransform(
    secureURL,
    COVER_VIDEO_POSTER_TRANSFORM
  ).replace(/\.(mp4|mov|webm|m4v|ogv|avi|mkv)(\?.*)?$/i, '.jpg$2');

  // Não aguardamos: o warm-up roda em background e o log só registra o resultado.
  void Promise.allSettled([fetch(videoURL), fetch(posterURL)])
    .then(() => {
      req.payload.logger.info(
        `Cloudinary cover video pré-aquecido: ${mediaDoc.cloudinary?.public_id}`
      );
    })
    .catch(() => {
      /* warm-up é best-effort; falha não impacta o site */
    });

  return doc;
};

const syncCloudinaryPlayerURL: CollectionAfterChangeHook = async ({
  context,
  data,
  doc,
  req,
}) => {
  if (context?.skipCloudinaryPlayerURLSync === true) {
    return doc;
  }

  const manualPlayerURLInput =
    typeof data === 'object' &&
    data !== null &&
    Object.prototype.hasOwnProperty.call(data, 'cloudinaryPlayerURL')
      ? (data as { cloudinaryPlayerURL?: unknown }).cloudinaryPlayerURL
      : undefined;

  const hasManualPlayerURLInInput =
    typeof manualPlayerURLInput === 'string' &&
    manualPlayerURLInput.trim().length > 0;

  if (hasManualPlayerURLInInput) {
    return doc;
  }

  const mediaDoc = doc as MediaDoc;
  const desiredPlayerURL = buildCloudinaryPlayerURL(mediaDoc);
  const currentPlayerURL = mediaDoc.cloudinaryPlayerURL?.trim() || '';

  if ((desiredPlayerURL || '') === currentPlayerURL) {
    return doc;
  }

  await req.payload.update({
    collection: 'media',
    id: mediaDoc.id,
    req,
    data: {
      cloudinaryPlayerURL: desiredPlayerURL || null,
    },
    context: {
      ...(context || {}),
      skipCloudinaryPlayerURLSync: true,
    },
  });

  return doc;
};

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    mimeTypes: ['image/*', 'video/*'],
  },
  admin: {
    group: 'Biblioteca',
    useAsTitle: 'alt',
    description: 'Repositório central de imagens e vídeos do site.',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [syncCloudinaryPlayerURL, warmCloudinaryCoverVideo],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texto Alternativo',
      required: true,
    },
    {
      name: 'cloudinaryPlayerURL',
      type: 'text',
      label: 'Cloudinary Player (iframe/link)',
      required: false,
      admin: {
        description:
          'Opcional para videos: cole o Link ou o src do iframe gerado no Video Player Studio do Cloudinary.',
      },
      validate: (value: unknown) => {
        if (!value) return true;

        const rawValue = String(value).trim();
        const srcMatch = rawValue.match(/src=["']([^"']+)["']/i);
        const urlValue = (srcMatch?.[1] || rawValue).trim();

        try {
          const parsed = new URL(urlValue);
          if (parsed.hostname !== 'player.cloudinary.com') {
            return 'Use uma URL do player.cloudinary.com';
          }
          return true;
        } catch {
          return 'Informe uma URL valida do Cloudinary Player';
        }
      },
    },
  ],
};
