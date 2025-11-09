"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registrar ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const images = [
  "/imagens/1.jpg",
  "/imagens/2.jpg",
  "/imagens/3.jpg",
  "/imagens/4.jpg",
  "/imagens/5.jpg",
  "/imagens/6.jpg",
  "/imagens/7.jpg",
  "/imagens/1.jpg",
  "/imagens/2.jpg",
  "/imagens/3.jpg",
  "/imagens/4.jpg",
  "/imagens/5.jpg",
];

const Skiper30 = () => {
  const galleryRef = useRef(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const columnsRef = useRef([]);

  useEffect(() => {
    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    if (!galleryRef.current || dimension.height === 0) return;

    const { height } = dimension;
    const isMobile = dimension.width < 768;

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

      gsap.fromTo(
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
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [dimension]);

  // Mobile: 3 colunas, Desktop: 4 colunas
  const isMobile = dimension.width < 768;
  const columns = isMobile ? 3 : 4;

  // Distribuir imagens nas colunas (repetir para preencher todas)
  const getColumnImages = (columnIndex) => {
    const columnImages = [];
    const imagesPerColumn = 4; // 4 imagens por coluna
    
    for (let i = 0; i < imagesPerColumn; i++) {
      const imageIndex = (columnIndex + (i * columns)) % images.length;
      columnImages.push(images[imageIndex]);
    }
    
    return columnImages;
  };

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
            images={getColumnImages(index)}
            columnIndex={index}
            isMobile={isMobile}
            ref={(el) => (columnsRef.current[index] = el)}
          />
        ))}
      </div>
    </section>
  );
};

const Column = ({ images, columnIndex, isMobile, ref: forwardedRef }) => {
  // Diferentes posições iniciais para cada coluna
  const getTopPosition = () => {
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
      ref={forwardedRef}
      className={`relative ${getTopPosition()} flex h-full w-1/4 min-w-[150px] md:min-w-[250px] flex-col gap-[2vw]`}
    >
      {images.map((src, i) => (
        <div key={`${columnIndex}-${i}`} className="relative h-full w-full overflow-hidden rounded-lg">
          <img
            src={src}
            alt={`Galeria ${columnIndex}-${i}`}
            className="pointer-events-none h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default Skiper30;
