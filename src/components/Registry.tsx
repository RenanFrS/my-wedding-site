"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import PayloadMediaRenderer from "@/components/PayloadMediaRenderer";
import type { PayloadMedia } from "@/types";

interface RegistryProps {
  media?: PayloadMedia | null;
}

export default function Registry({ media = null }: RegistryProps): React.JSX.Element {
  return (
    <section id="presenca" className="relative hz-margin py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 md:gap-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="registry-container reveal">

          <h2
            className="mt-5 text-[2.6rem] leading-[0.95] md:text-[4.1rem]"
            style={{ color: "var(--color-text-primary)" }}
          >
            Lista de
            <span
              className="block font-amoresa text-[3.1rem] md:mt-2 md:text-[4.5rem]"
              style={{ color: "var(--color-secondary)" }}
            >
              Presentes
            </span>
          </h2>

          <p
            className="mt-7 max-w-lg text-base md:text-[1.05rem] md:leading-8"
            style={{
              color: "var(--color-text-primary)",
              opacity: 0.88,
            }}
          >
            Para facilitar, decidimos criar uma lista de presentes 100% online.
            Se você deseja nos presentear, é só clicar no botão abaixo e conferir
            as sugestões que preparamos com muito carinho.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4 md:gap-5">
            <Button
              asChild
              className="h-11 rounded-none px-6 text-[0.75rem] uppercase tracking-[0.12em] text-white shadow-md transition hover:brightness-95"
              style={{ backgroundColor: "var(--color-secondary)" }}
            >
              <a href="/lista-de-presentes">Sugestões de Presentes</a>
            </Button>

            <span
              className="hidden h-px w-20 md:block"
              style={{
                backgroundColor: "var(--color-secondary)",
                opacity: 0.35,
              }}
            />
          </div>
        </div>

        <div className="registry-img reveal relative mx-auto w-full max-w-[430px] md:max-w-[540px]">
          <div
            className="pointer-events-none absolute -left-4 -top-4 hidden h-full w-full border md:block"
            style={{
              borderColor: "var(--color-secondary)",
              opacity: 0.22,
            }}
          />

          <div
            className="relative overflow-hidden border bg-white p-3 md:p-4 shadow-[0_30px_56px_-34px_rgba(0,0,0,0.65)]"
            style={{ borderColor: "var(--color-secondary)" }}
          >
            <div className="aspect-[4/5] overflow-hidden">
              <PayloadMediaRenderer
                media={media}
                className="h-full w-full object-cover"
                emptyMessage="Inserir no seu painel: Background Media > Seção 2"
              />
            </div>
          </div>

          <div
            className="absolute -bottom-8 left-0 max-w-[90%] -translate-x-2 border bg-white/95 p-4 shadow-xl backdrop-blur-sm md:max-w-[72%] md:-translate-x-6 md:p-5"
            style={{ borderColor: "var(--color-secondary)" }}
          >
            <p
              className="text-xl leading-none md:text-[1.7rem]"
              style={{ color: "var(--color-secondary)" }}
            >
              Com Amor,
            </p>
            <p
              className="mt-2 text-sm md:text-[0.95rem]"
              style={{
                color: "var(--color-text-primary)",
                opacity: 0.8,
              }}
            >
              Sua presença é nosso maior presente. Se quiser nos mimar,
              preparamos opções especiais para esse novo capítulo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
