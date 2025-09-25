"use client";
import { useEffect, useState } from "react";

export function useCountdown(targetDate, triggerDate) {
  const [text, setText] = useState("");
  useEffect(() => {
    const eventoData = new Date(targetDate).getTime();
    const dataAcionamento = new Date(triggerDate).getTime();
    const intervalo = setInterval(() => {
      const agora = new Date().getTime();
      const diferenca = eventoData - agora;
      const diferencaAcionamento = dataAcionamento - agora;
      const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
      const horas = Math.floor(
        (diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);
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
