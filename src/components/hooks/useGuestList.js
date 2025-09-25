"use client";
import { useState } from "react";

// For future backend integration.
const INITIAL_GUESTS = [
  { id: 1, nome: "Ana Clara Souza", acompanhantes: 1 },
  { id: 2, nome: "Bruno Martins", acompanhantes: 0 },
  { id: 3, nome: "Carlos Eduardo Lima", acompanhantes: 2 },
  { id: 4, nome: "Daniela Ferreira", acompanhantes: 1 },
  { id: 5, nome: "Eduarda Ramos", acompanhantes: 0 },
  { id: 6, nome: "Felipe Alves", acompanhantes: 1 },
];

export function useGuestList() {
  const [guests, setGuests] = useState(INITIAL_GUESTS);
  // in future: replace setGuests(fetch...) etc.
  return { guests, setGuests };
}
