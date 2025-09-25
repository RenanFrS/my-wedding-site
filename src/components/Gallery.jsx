"use client";
import React from "react";

export default function Gallery() {
  return (
    <div className="gallery hz-margin reveal flex justify-center items-center py-16 md:py-[20vh] md:flex-row flex-col p-0">
      <div
        className="w-full md:w-[30vw] h-[60vw] md:h-[30vw] m-2 bg-cover bg-right"
        style={{ backgroundImage: "url(/imagens/3.jpg)" }}
      />
      <div
        className="w-full md:w-[30vw] h-[60vw] md:h-[30vw] m-2 bg-cover bg-top"
        style={{ backgroundImage: "url(/imagens/5.jpg)" }}
      />
      <div
        className="w-full md:w-[30vw] h-[60vw] md:h-[30vw] m-2 bg-cover bg-center"
        style={{ backgroundImage: "url(/imagens/4.jpg)" }}
      />
    </div>
  );
}
