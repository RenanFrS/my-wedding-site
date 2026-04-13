'use client';

import React from 'react';
import PayloadMediaRenderer from '@/components/PayloadMediaRenderer';
import type { PayloadMedia } from '@/types';

interface GalleryProps {
  mediaItems?: PayloadMedia[];
}

export default function Gallery({ mediaItems = [] }: GalleryProps): React.JSX.Element {
  if (mediaItems.length === 0) {
    return (
      <div className="gallery hz-margin reveal flex justify-center items-center py-16 md:py-[20vh] md:flex-row flex-col p-0">
        <div className="w-full rounded-xl border border-[#ac5b30]/30 bg-[#fefaf6] px-6 py-10 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[#6d4635]">
            Inserir no seu painel: Vertical Carousel Media
          </p>
        </div>
      </div>
    );
  }

  const firstThree = mediaItems.slice(0, 3);

  return (
    <div className="gallery hz-margin reveal flex justify-center items-center py-16 md:py-[20vh] md:flex-row flex-col p-0">
      {firstThree.map((media) => (
        <div key={media.id} className="w-full md:w-[30vw] h-[60vw] md:h-[30vw] m-2 overflow-hidden rounded-lg">
          <PayloadMediaRenderer media={media} className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
  );
}
