"use client";
import React, { useState, useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { Input } from "../components/ui/input";
import { Textarea } from "./ui/textarea";

// Mock existing messages (would later come from backend / API)
const INITIAL_MESSAGES = [
  {
    id: 1,
    nome: "Ana Clara",
    trecho: "Que dia especial!",
    email: "ana@example.com",
    at: Date.now() - 1000000,
  },
  {
    id: 2,
    nome: "Bruno",
    trecho: "Felizes por vocês!",
    email: "bru@example.com",
    at: Date.now() - 900000,
  },
  {
    id: 3,
    nome: "Carlos",
    trecho: "Mal posso esperar ♥",
    email: "carlos@example.com",
    at: Date.now() - 800000,
  },
  {
    id: 4,
    nome: "Daniela",
    trecho: "Será lindo!",
    email: "dani@example.com",
    at: Date.now() - 700000,
  },
  {
    id: 5,
    nome: "Eduarda",
    trecho: "Com amor e alegria!",
    email: "duda@example.com",
    at: Date.now() - 600000,
  },
  {
    id: 6,
    nome: "Felipe",
    trecho: "Contando os dias ✨",
    email: "felipe@example.com",
    at: Date.now() - 500000,
  },
];

export default function MensagemNoivos() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [recado, setRecado] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const maxChars = 70;
  const perPage = 5;

  const remaining = maxChars - recado.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || !recado.trim()) return;
    if (recado.length > maxChars) return;
    setSubmitting(true);
    // Simulate async
    setTimeout(() => {
      const newMsg = {
        id: messages.length + 1,
        nome: nome.trim(),
        email: email.trim(),
        trecho: recado.trim(),
        at: Date.now(),
      };
      setMessages([newMsg, ...messages]);
      setNome("");
      setEmail("");
      setRecado("");
      setSubmitting(false);
    }, 500);
  };

  const totalPages = Math.max(1, Math.ceil(messages.length / perPage));
  const visible = useMemo(() => {
    const start = (page - 1) * perPage;
    return messages.slice(start, start + perPage);
  }, [messages, page]);

  const go = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  return (
    <section id="mensagem" className="hz-margin py-24 md:py-32 relative">
      <div className="absolute inset-0 pointer-events-none select-none opacity-[0.035] bg-[radial-gradient(circle_at_center,#ac5b30_0%,transparent_80%)]" />
      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-5xl tracking-tight mb-3 text-[#ac5b30]">
            MENSAGEM PARA OS NOIVOS
          </h2>
          <p className="font-sans text-sm md:text-base text-[#6d4635] max-w-2xl mx-auto leading-relaxed italic">
            Palavras carinhosas tornam esse momento ainda mais especial.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/70 backdrop-blur rounded-xl shadow-sm border border-black/5 p-5 md:p-8 mb-14">
          <form onSubmit={handleSubmit} className="space-y-6 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#ac5b30] font-semibold mb-1">
                  Seu nome
                </label>
                <Input
                  type="text"
                  placeholder="Como você quer aparecer"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full rounded-md border border-[#ac5b30]/30 bg-white/60 focus:bg-white focus:border-[#ac5b30] focus:ring-2 focus:ring-[#ac5b30]/20 px-3 py-2 text-sm outline-none placeholder:text-[#6d4635]/40"
                  maxLength={60}
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#ac5b30] font-semibold mb-1">
                  Seu email
                </label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-[#ac5b30]/30 bg-white/60 focus:bg-white focus:border-[#ac5b30] focus:ring-2 focus:ring-[#ac5b30]/20 px-3 py-2 text-sm outline-none placeholder:text-[#6d4635]/40"
                  maxLength={100}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#ac5b30] font-semibold mb-1">
                Recado
              </label>
              <Textarea
                rows={3}
                placeholder={`Escreva aqui sua mensagem carinhosa... (máximo ${maxChars} caracteres)`}
                value={recado}
                onChange={(e) => setRecado(e.target.value.slice(0, maxChars))}
                className="w-full rounded-md border border-[#ac5b30]/30 bg-white/60 focus:bg-white focus:border-[#ac5b30] focus:ring-2 focus:ring-[#ac5b30]/20 px-3 py-2 text-sm placeholder:text-[#6d4635]/40"
                required
              />
              <div className="flex justify-between mt-1 text-[11px] text-[#6d4635]/60">
                <span>{remaining} restantes</span>
                {recado.length > maxChars && (
                  <span className="text-red-600">Excedeu o limite</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <button
                type="submit"
                disabled={submitting || !nome || !email || !recado}
                className="px-6 py-2 rounded-full bg-[#ac5b30] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs tracking-wide hover:brightness-110 transition"
              >
                {submitting ? "Enviando..." : "Enviar mensagem"}
              </button>
            </div>
          </form>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {visible.map((m) => (
            <div
              key={m.id}
              className="bg-white/60 backdrop-blur-sm border border-black/5 rounded-lg px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <div className="font-semibold text-sm text-[#ac5b30]">
                  {m.nome}
                </div>
                <div className="text-xs text-[#6d4635]/70 mt-0.5">
                  {m.trecho}
                </div>
              </div>
              <div className="text-[10px] text-[#6d4635]/50 font-mono">
                {new Date(m.at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#mensagem"
                    onClick={(e) => {
                      e.preventDefault();
                      go(page - 1);
                    }}
                    aria-disabled={page === 1}
                    className={
                      page === 1 ? "pointer-events-none opacity-40" : ""
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  return (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href="#mensagem"
                        isActive={p === page}
                        onClick={(e) => {
                          e.preventDefault();
                          go(p);
                        }}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#mensagem"
                    onClick={(e) => {
                      e.preventDefault();
                      go(page + 1);
                    }}
                    aria-disabled={page === totalPages}
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-40"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </section>
  );
}
