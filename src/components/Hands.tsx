'use client';

import React, { useRef } from 'react';
import { useParallax } from '@/components/hooks/useParallax';
import PayloadMediaRenderer from '@/components/PayloadMediaRenderer';
import type { PayloadMedia } from '@/types';

interface HandsProps {
  media?: PayloadMedia | null;
}

export default function Hands({ media = null }: HandsProps): React.JSX.Element {
  const par1 = useRef<HTMLDivElement>(null);
  useParallax(par1, { axis: 'y', factor: 0.1, offset: 0, startAt: -3100 });

  return (
    <div
      ref={par1}
      className="hands relative h-[70vh] md:h-[120vh] w-full overflow-hidden"
    >
      <PayloadMediaRenderer
        media={media}
        className="h-full w-full object-cover"
        emptyMessage="Inserir no seu painel: Background Media > Meio do Site"
      />
    </div>
  );
}
