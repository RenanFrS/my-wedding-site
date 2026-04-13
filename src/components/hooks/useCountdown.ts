"use client";

import { useEffect, useState } from "react";

export function useCountdown(targetDate: string, triggerDate: string): string {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    const eventoData: number = new Date(targetDate).getTime();
    const dataAcionamento: number = new Date(triggerDate).getTime();

    const intervalo: ReturnType<typeof setInterval> = setInterval(() => {
      const agora: number = new Date().getTime();
      const diferenca: number = eventoData - agora;
      const diferencaAcionamento: number = dataAcionamento - agora;

      const dias: number = Math.floor(diferenca / (1000 * 60 * 60 * 24));
      const horas: number = Math.floor(
        (diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutos: number = Math.floor(
        (diferenca % (1000 * 60 * 60)) / (1000 * 60)
      );
      const segundos: number = Math.floor((diferenca % (1000 * 60)) / 1000);

      if (diferencaAcionamento < 0) {
        clearInterval(intervalo);
        setText("Nosso Grande Dia Chegou!");
      } else {
        setText(`${dias}d ${horas}h ${minutos}m ${segundos}s`);
      }
    }, 1000);

    return () => clearInterval(intervalo);
  }, [targetDate, triggerDate]);

  return text;
}
