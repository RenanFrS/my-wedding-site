"use client";
import React from "react";
import { MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import PayloadMediaRenderer from "@/components/PayloadMediaRenderer";
import type { PayloadMedia } from "@/types";

interface StayProps {
  media?: PayloadMedia | null;
  ceremonyTime?: string;
}

export default function Stay({ media = null, ceremonyTime = '' }: StayProps): React.JSX.Element {
  const ceremonyTimeText = ceremonyTime
    ? `Cerimônia às ${ceremonyTime}`
    : 'Inserir no painel: Site Settings > Casal e Data > Data do Casamento';

  return (
    <section
      id="cerimonia"
      className="relative w-full py-16 md:py-24 hz-margin"
    >
      {/* Header */}
      <div className="text-center mb-12 md:mb-16">
        <h2 className="reveal text-[2rem] md:text-[2.5rem] font-amoresa font-normal tracking-wide text-[var(--color-title)] mb-4">
          Cerimônia
        </h2>
        <p className="reveal text-base md:text-lg text-[#6d4635] max-w-2xl mx-auto">
          Será uma honra compartilhar esse momento especial com você
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start max-w-6xl mx-auto">
        {/* Left: Venue Image/Logo */}
        <div className="flex flex-col items-center space-y-8">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-lg h-[400px]">
            <PayloadMediaRenderer
              media={media}
              alt="Local da cerimônia"
              className="w-full h-full object-cover"
              emptyMessage="Inserir no painel: Fotos de Fundo > Fundo da seção da cerimônia"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Venue Details */}
          <div className="w-full px-4">
            {/* Mobile: Stack vertically */}
            <div className="flex flex-col md:hidden space-y-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <MapPin className="w-6 h-6 text-[#ac5b30] flex-shrink-0" />
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-[#6d4635] mb-2">
                    Chácara Fagundes 3
                  </h3>
                  <p className="text-sm md:text-base text-[#6d4635]/80">
                    R. Silvio Nunes, 84 - Tanque Caio
                    <br />
                    Ribeirão Pires - SP, 09436-330
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <Clock className="w-6 h-6 text-[#ac5b30] flex-shrink-0" />
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-[#6d4635] mb-2">
                    Horário
                  </h3>
                  <p className="text-sm md:text-base text-[#6d4635]/80">
                    {ceremonyTimeText}
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop: Side by side with justify-between */}
            <div className="hidden md:flex justify-between items-start gap-8">
              <div className="flex flex-col items-center gap-4 flex-1">
                <MapPin className="w-6 h-6 text-[#ac5b30] flex-shrink-0" />
                <div className="text-center">
                  <h3 className="text-lg md:text-xl font-semibold text-[#6d4635] mb-2">
                    Chácara Fagundes 3
                  </h3>
                  <p className="text-sm md:text-base text-[#6d4635]/80">
                    R. Silvio Nunes, 84 - Tanque Caio
                    <br />
                    Ribeirão Pires - SP, 09436-330
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 flex-1">
                <Clock className="w-6 h-6 text-[#ac5b30] flex-shrink-0" />
                <div className="text-center">
                  <h3 className="text-lg md:text-xl font-semibold text-[#6d4635] mb-2">
                    Horário
                  </h3>
                  <p className="text-sm md:text-base text-[#6d4635]/80">
                    {ceremonyTimeText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Google Maps */}
        <div className="flex flex-col space-y-6">
          <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-[#f5e9e2]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3654.979421416505!2d-46.39851835021419!3d-23.64090799826779!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce6ea02ade56ff%3A0x8a2b7b8d82910a7d!2sCh%C3%A1cara%20Fagundes%203!5e0!3m2!1spt-BR!2sbr!4v1762107757278!5m2!1spt-BR!2sbr"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização da Cerimônia"
              className="w-full"
            />
          </div>

          <div className="text-center space-y-4 px-4">
            <p className="text-sm md:text-base text-[#6d4635]/80">
              Clique no botão para calcular sua rota!
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#ac5b30] hover:bg-[#8d4a26] text-white rounded-full shadow-md hover:shadow-lg"
            >
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Ch%C3%A1cara+Fagundes+3,R.+Silvio+Nunes,+84+-+Tanque+Caio,+Ribeir%C3%A3o+Pires+-+SP,+09436-330"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="w-5 h-5" />
                Definir Rota
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
