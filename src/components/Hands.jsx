"use client";
import React, { useRef } from "react";
import { useParallax } from "./hooks/useParallax";

export default function Hands() {
  const par1 = useRef(null);
  useParallax(par1, { axis: "y", factor: 0.1, offset: 0, startAt: -3100 });
  return (
    <div
      ref={par1}
      className="hands h-[70vh] md:h-[120vh] w-full bg-cover bg-no-repeat"
      style={{
        backgroundImage: "url(/imagens/6.jpg)",
        backgroundPositionY: "center",
      }}
    />
  );
}
