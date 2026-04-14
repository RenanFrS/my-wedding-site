'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Shirt, User } from 'lucide-react';
import PayloadMediaRenderer from '@/components/PayloadMediaRenderer';
import type { DressCodeContent } from '@/types';

interface DressCodeSectionProps {
  content: DressCodeContent | null;
}

const FALLBACK_CONTENT: Omit<DressCodeContent, 'id' | 'createdAt' | 'updatedAt'> = {
  style: 'Esporte Fino',
  description:
    'Para combinar com nosso estilo de casamento, escolha uma roupa elegante e confortavel para celebrar conosco.',
  forHer: 'Vestidos midi ou longos, macacoes elegantes e tecidos leves. Prefira tons suaves ou classicos.',
  forHim: 'Terno ou blazer com calca de alfaiataria/sarja. Gravata opcional e sapatos sociais ou casuais refinados.',
  media: null,
  active: true,
};

export default function DressCodeSection({ content }: DressCodeSectionProps): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 0.35, 1], [120, 0, -30]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.2, 0.45], [0.1, 0.7, 1]);
  const textY = useTransform(scrollYProgress, [0, 0.4], [40, 0]);

  const section = content || FALLBACK_CONTENT;

  return (
    <section
      id="vestimenta"
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--color-background)] py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          aria-hidden
          className="absolute left-0 top-0 h-[108%] w-[72%] bg-[var(--color-primary)] [clip-path:ellipse(92%_80%_at_0%_0%)] md:h-[116%] md:w-[62%] md:[clip-path:ellipse(90%_78%_at_0%_0%)] lg:w-[54%] lg:[clip-path:ellipse(88%_78%_at_0%_0%)]"
        />
      </div>

      <div className="relative hz-margin mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <motion.div
          style={{ y: imageY, opacity: imageOpacity }}
          className="relative mx-auto w-full max-w-[560px] lg:-ml-8 lg:mr-2"
        >
          <PayloadMediaRenderer
            media={section.media}
            alt="Referencias de vestimenta"
            className="h-[360px] w-full object-contain md:h-[560px]"
            emptyMessage="Inserir no painel: Dress Code > Imagem de referencia"
            videoLoading="eager"
          />
        </motion.div>

        <motion.div
          style={{ y: textY }}
          className="lg:pl-6"
        >
          <p className="text-xs font-migra uppercase tracking-[0.3em] text-[var(--color-text-secondary)]">
            O que vestir
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-wide text-[var(--color-primary)] md:text-6xl">
            DRESS CODE
          </h2>
          <p className="mt-5 text-2xl font-migra italic text-[var(--color-secondary)]">{section.style}</p>
          <p className="mt-4 max-w-xl text-base leading-7 text-[var(--color-text-primary)] md:text-[1.05rem]">
            {section.description}
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-[#e5d7ce] bg-white/55 p-4">
              <div className="mb-3 flex items-center gap-2 text-[var(--color-primary)]">
                <Shirt className="h-4 w-4" />
                <h3 className="text-sm font-bold uppercase tracking-wide">Para elas</h3>
              </div>
              <p className="text-sm leading-6 text-[var(--color-text-primary)] md:text-[0.95rem]">{section.forHer}</p>
            </article>

            <article className="rounded-2xl border border-[#e5d7ce] bg-white/55 p-4">
              <div className="mb-3 flex items-center gap-2 text-[var(--color-primary)]">
                <User className="h-4 w-4" />
                <h3 className="text-sm font-bold uppercase tracking-wide">Para eles</h3>
              </div>
              <p className="text-sm leading-6 text-[var(--color-text-primary)] md:text-[0.95rem]">{section.forHim}</p>
            </article>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
