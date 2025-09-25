"use client";
import React, { useRef } from "react";
import { useParallax } from "./hooks/useParallax";
import { Button } from "./ui/button";

export default function Registry() {
  const par2 = useRef(null);
  useParallax(par2, { axis: "y", factor: -0.1, offset: 0, startAt: -4800 });
  return (
    <>
      <div
        id="presenca"
        className="flex md:flex-row flex-col justify-between hz-margin pt-16 md:pt-[20vh] gap-8"
      >
        <div className="registry-container w-full md:w-[30vw] reveal">
          <h2 className="text-[1.75rem] md:text-[2.1rem] font-bold">
            Lista de Presentes
          </h2>
          <div className="text font-sans text-justify my-5 text-base md:text-[1rem]">
            Para facilitar, decidimos criar uma lista de presentes 100% online.
            Se você deseja nos presentear, é só clicar no botão abaixo e
            conferir as sugestões que preparamos com muito carinho.
          </div>
          <Button className="w-full max-w-xs md:w-[325px]">
            Sugestões de Presentes
          </Button>
        </div>
        <div
          ref={par2}
          className="registry-img registry-img-lg hidden md:block h-[70vh] md:h-[100vh] md:w-[40vw] bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url(/imagens/7.jpg)",
            backgroundPositionY: "top",
          }}
        />
      </div>
      <div
        className="registry-img registry-img-sm block md:hidden w-full h-[40vh] mt-12 md:mt-[10vh] bg-cover"
        style={{ backgroundImage: "url(/imagens/7.jpg)" }}
      />
    </>
  );
}
