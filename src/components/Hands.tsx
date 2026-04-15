'use client';

import React from 'react';
import PayloadMediaRenderer from '@/components/PayloadMediaRenderer';
import type { PayloadMedia } from '@/types';

interface HandsProps {
  media?: PayloadMedia | null;
}

export default function Hands({ media = null }: HandsProps): React.JSX.Element {
  return (
    <section className="hands relative w-full">
      <div className="relative h-[94vh] md:h-[130vh] w-full">
        <div className="sticky top-0 h-[68vh] md:h-screen w-full overflow-hidden">
          <PayloadMediaRenderer
            media={media}
            className="h-full w-full object-cover"
            emptyMessage="Inserir no seu painel: Background Media > Meio do Site"
          />
        </div>
      </div>
    </section>
  );
}
