"use client";
import React, { useEffect, useMemo, useState } from "react";
import Counter from "./Counter";
import { Card, CardContent } from "./ui/card";

export default function Timeline() {
  // Data do casamento
  const target = useMemo(() => new Date("September 06, 2026 00:00:00"), []);

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target.getTime() - now);
  const second = 1000;
  const minute = 60 * second;
  const hour = 60 * minute;
  const day = 24 * hour;

  const days = Math.floor(diff / day);
  const hours = Math.floor((diff % day) / hour);
  const minutes = Math.floor((diff % hour) / minute);
  const seconds = Math.floor((diff % minute) / second);

  return (
    <section
      id="timeline"
      className="relative w-full px-4 py-10 md:py-[8vh] hz-margin"
    >
      {/* Header (fora do Card) */}
      <div className="mx-auto max-w-2xl text-center">
        <div className="uppercase tracking-[0.25em] text-sm md:text-base font-normal text-[#6d4635]">
          Faltam
        </div>
        <div className="mt-2 flex items-center justify-center gap-3">
          <div className="text-6xl md:text-7xl font-medium tabular-nums leading-none text-[#6d4635]">
            {days}
          </div>
          <div className="uppercase tracking-[0.35em] text-xs md:text-sm text-[#6d4635]">
            Dias
          </div>
        </div>
      </div>
      {/* Cards individuais */}
      <div className="mt-6 mx-auto max-w-2xl grid grid-cols-3 gap-3 md:gap-6">
        {/* Horas */}
        <Card className="bg-white shadow-md rounded-xl border border-white/60 backdrop-blur-sm aspect-square flex items-center justify-center text-[#6d4635]">
          <CardContent className="p-2 md:p-4 flex flex-col items-center justify-center">
            <Counter
              value={hours}
              places={[10, 1]}
              fontSize={56}
              padding={4}
              horizontalPadding={10}
              textColor="#6d4635"
            />
            <span className="mt-1 md:mt-2 uppercase text-[10px] md:text-xs tracking-[0.25em] text-[#6d4635]">
              Horas
            </span>
          </CardContent>
        </Card>

        {/* Minutos */}
        <Card className="bg-white shadow-md rounded-xl border border-white/60 backdrop-blur-sm aspect-square flex items-center justify-center text-[#6d4635]">
          <CardContent className="p-2 md:p-4 flex flex-col items-center justify-center">
            <Counter
              value={minutes}
              places={[10, 1]}
              fontSize={56}
              padding={4}
              horizontalPadding={10}
              textColor="#6d4635"
            />
            <span className="mt-1 md:mt-2 uppercase text-[10px] md:text-xs tracking-[0.25em] text-[#6d4635]">
              Min
            </span>
          </CardContent>
        </Card>

        {/* Segundos */}
        <Card className="bg-white shadow-md rounded-xl border border-white/60 backdrop-blur-sm aspect-square flex items-center justify-center text-[#6d4635]">
          <CardContent className="p-2 md:p-4 flex flex-col items-center justify-center">
            <Counter
              value={seconds}
              places={[10, 1]}
              fontSize={56}
              padding={4}
              horizontalPadding={10}
              textColor="#6d4635"
            />
            <span className="mt-1 md:mt-2 uppercase text-[10px] md:text-xs tracking-[0.25em] text-[#6d4635]">
              Seg
            </span>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
