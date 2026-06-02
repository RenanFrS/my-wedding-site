"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PayloadMediaRenderer from "@/components/PayloadMediaRenderer";
import type { PayloadMedia } from "@/types";

// Registrar ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Dimension {
  width: number;
  height: number;
}

interface ColumnProps {
  mediaItems: PayloadMedia[];
  columnIndex: number;
  isMobile: boolean;
}

interface Skiper30Props {
  mediaItems: PayloadMedia[];
}

const Skiper30: React.FC<Skiper30Props> = ({ mediaItems }) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState<Dimension>({ width: 0, height: 0 });
  const columnsRef = useRef<(HTMLDivElement | null)[]>([]);

  const normalizedMedia = useMemo<PayloadMedia[]>(
    () => mediaItems.filter((media) => Boolean(media?.url || media?.cloudinary?.secure_url)),
    [mediaItems]
  );

  useEffect(() => {
    const resize = (): void => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    if (!galleryRef.current || dimension.height === 0 || normalizedMedia.length === 0) return;

    const { height } = dimension;
    const isMobile: boolean = dimension.width < 768;
    const createdTriggers: ScrollTrigger[] = [];

    // Animações de parallax para cada coluna
    columnsRef.current.forEach((column, index) => {
      if (!column) return;

      let yValue = 0;

      if (isMobile) {
        // Mobile: velocidades mais suaves para 3 colunas
        switch (index) {
          case 0:
            yValue = height * 1.5;
            break;
          case 1:
            yValue = height * 2.2;
            break;
          case 2:
            yValue = height * 1.5;
            break;
          default:
            yValue = height * 1.5;
        }
      } else {
        // Desktop: velocidades alternadas para 4 colunas
        switch (index) {
          case 0:
            yValue = height * 1.8;
            break;
          case 1:
            yValue = height * 2.5;
            break;
          case 2:
            yValue = height * 1.8;
            break;
          case 3:
            yValue = height * 2.5;
            break;
          default:
            yValue = height * 1.8;
        }
      }

      const tween = gsap.fromTo(
        column,
        { y: 0 },
        {
          y: yValue,
          ease: "none",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      if (tween.scrollTrigger) {
        createdTriggers.push(tween.scrollTrigger);
      }
    });

    return () => {
      createdTriggers.forEach((trigger) => trigger.kill());
    };
  }, [dimension, normalizedMedia.length]);

  // Mobile: 3 colunas, Desktop: 4 colunas
  const isMobile: boolean = dimension.width < 768;
  const columns: number = isMobile ? 3 : 4;

  // Distribuir mídias nas colunas (repetir para preencher todas)
  const getColumnItems = (columnIndex: number): PayloadMedia[] => {
    const columnItems: PayloadMedia[] = [];
    const imagesPerColumn = 4; // 4 imagens por coluna

    for (let i = 0; i < imagesPerColumn; i++) {
      const imageIndex = (columnIndex + i * columns) % normalizedMedia.length;
      columnItems.push(normalizedMedia[imageIndex]);
    }

    return columnItems;
  };

  if (normalizedMedia.length === 0) {
    return (
      <section id="galeria" className="w-full bg-white px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-xl border border-[#ac5b30]/30 bg-[#fefaf6] px-6 py-10 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[#6d4635]">
            Inserir no painel: Carrossel de Fotos (Vertical Carousel Media)
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="galeria" className="w-full bg-white">
      {/* <div className="hz-margin py-24 md:py-40">
        <h2 className="text-center font-display text-4xl md:text-5xl mb-10 text-[#ac5b30]">
          Nossa Galeria
        </h2>
      </div> */}

      {/* Gallery */}
      <div
        ref={galleryRef}
        className="relative box-border flex h-[175vh] gap-[2vw] overflow-hidden bg-white px-[2vw]"
      >
        {Array.from({ length: columns }).map((_, index) => (
          <Column
            key={index}
            mediaItems={getColumnItems(index)}
            columnIndex={index}
            isMobile={isMobile}
            ref={(el: HTMLDivElement | null) => {
              columnsRef.current[index] = el;
            }}
          />
        ))}
      </div>
    </section>
  );
};

const Column = React.forwardRef<HTMLDivElement, ColumnProps>(
  ({ mediaItems, columnIndex, isMobile }, ref) => {
    // Diferentes posições iniciais para cada coluna
    const getTopPosition = (): string => {
      if (isMobile) {
        // Mobile: 3 colunas com posições mais balanceadas
        switch (columnIndex) {
          case 0:
            return "-top-[25%]";
          case 1:
            return "-top-[50%]";
          case 2:
            return "-top-[25%]";
          default:
            return "-top-[25%]";
        }
      } else {
        // Desktop: 4 colunas
        switch (columnIndex) {
          case 0:
            return "-top-[25%]";
          case 1:
            return "-top-[50%]";
          case 2:
            return "-top-[25%]";
          case 3:
            return "-top-[50%]";
          default:
            return "-top-[25%]";
        }
      }
    };

    return (
      <div
        ref={ref}
        className={`relative ${getTopPosition()} flex h-full ${isMobile ? "w-1/3" : "w-1/4"} min-w-[150px] md:min-w-[250px] flex-col gap-[2vw]`}
      >
        {mediaItems.map((media, i) => (
          <div
            key={`${media.id || 'media'}-${columnIndex}-${i}`}
            className="relative h-full w-full overflow-hidden rounded-lg"
          >
            <PayloadMediaRenderer
              media={media}
              alt={`Galeria ${columnIndex}-${i}`}
              className="pointer-events-none h-full w-full object-cover"
              emptyMessage="Inserir no seu painel"
            />
          </div>
        ))}
      </div>
    );
  }
);

Column.displayName = "Column";

export default Skiper30;
