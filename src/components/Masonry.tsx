"use client";
import React from "react";

export default function GalleryMasonry(): React.JSX.Element {
  return (
    <section id="galeria" className="hz-margin py-24 md:py-40 reveal">
      <h2 className="text-center font-display text-4xl md:text-5xl mb-10 text-[#ac5b30]">
        Nossa Galeria
      </h2>
      <div className="relative w-full min-h-[40vh] rounded-xl border border-[#ac5b30]/30 bg-[#fefaf6] flex items-center justify-center px-6">
        <p className="text-center text-sm uppercase tracking-[0.2em] text-[#6d4635]">
          Inserir no seu painel: Vertical Carousel Media
        </p>
      </div>
    </section>
  );
}
