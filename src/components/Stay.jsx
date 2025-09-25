"use client";
import React from "react";

export default function Stay() {
  return (
    <div
      id="casamento"
      className="relative bg-olive w-full py-12 md:py-[10vh] hz-margin rounded-lg overflow-hidden"
    >
      {/* Watermark background */}
      <div
        className="absolute inset-0 pointer-events-none select-none fade-in-slow"
        style={{
          backgroundImage: "url(/local/chacara-aquarela.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.06,
        }}
        aria-hidden="true"
      />
      <h2 className="relative reveal text-[1.75rem] md:text-[2.1rem] font-bold tracking-wide">
        CERIMÔNIA
      </h2>
      <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 my-12 md:my-8">
        <div className="stay-item my-2 relative">
          <h3 className="text-[1.25rem] md:text-[1.5rem] font-semibold tracking-wide">
            01. <br />
            Quando
          </h3>
          <div className="text font-sans my-3 md:my-5">
            06 de Setembro <br />
            2026
          </div>
          <div className="text font-sans underline cursor-pointer">
            Guarde essa data
          </div>
        </div>
        <div className="stay-item my-2 relative">
          <h3 className="text-[1.25rem] md:text-[1.5rem] font-semibold tracking-wide">
            02. <br />
            Onde
          </h3>
          <div className="text font-sans my-3 md:my-5">
            R. Silvio Nunes, 84 - Tanque Caio, <br /> Ribeirão Pires - SP,
            09436-330
          </div>
          <a
            href="https://www.google.com/maps/place/R.+Silvio+Nunes,+84+-+Tanque+Caio,+Ribeir%C3%A3o+Pires+-+SP,+09436-330"
            target="_blank"
            rel="noopener noreferrer"
            className="text font-sans underline cursor-pointer inline-block hover:text-[#ac5b30] transition-colors"
          >
            Abrir no Mapa
          </a>
        </div>
        <div className="stay-item my-2 relative">
          <h3 className="text-[1.25rem] md:text-[1.5rem] font-semibold tracking-wide">
            03. <br />
            Traje
          </h3>
          <div className="text font-sans my-3 md:my-5">
            Alguns trajes <br /> para se inspirar
          </div>
          <div className="text font-sans underline cursor-pointer">
            Inspire-se
          </div>
        </div>
      </div>
    </div>
  );
}
