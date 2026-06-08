"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CoupleMessage {
  id: number | string;
  senderName: string;
  senderEmail: string;
  message: string;
  createdAt?: string;
}

interface PayloadListResponse<T> {
  docs: T[];
}

export default function MensagemNoivos(): React.JSX.Element {
  const [messages, setMessages] = useState<CoupleMessage[]>([]);
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [recado, setRecado] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const maxChars: number = 70;
  const perPage: number = 5;

  const remaining: number = maxChars - recado.length;

  const fetchMessages = useCallback(async (): Promise<void> => {
    const res = await fetch(
      "/api/couple-messages?limit=100&depth=1&sort=-createdAt&where[published][equals]=true",
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Não foi possível carregar as mensagens.");
    }

    const data = (await res.json()) as PayloadListResponse<CoupleMessage>;
    setMessages(data.docs || []);
    setPage(1);
  }, []);

  useEffect(() => {
    let active = true;

    const loadInitialData = async (): Promise<void> => {
      setLoadingData(true);
      setLoadError("");

      try {
        await fetchMessages();
      } catch (error) {
        if (!active) return;
        setLoadError(
          error instanceof Error
            ? error.message
            : "Falha ao carregar os dados."
        );
      } finally {
        if (active) setLoadingData(false);
      }
    };

    void loadInitialData();

    return () => {
      active = false;
    };
  }, [fetchMessages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSubmitError("");
    setSuccessMessage("");

    if (!nome.trim() || !email.trim() || !recado.trim()) return;
    if (recado.length > maxChars) return;

    setSubmitting(true);

    try {
      const response = await fetch("/api/couple-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderName: nome.trim(),
          senderEmail: email.trim(),
          message: recado.trim(),
          published: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const payloadMessage =
          errorData?.errors?.[0]?.message ||
          errorData?.message ||
          errorData?.error ||
          "Não foi possível enviar a mensagem.";
        throw new Error(payloadMessage);
      }

      await fetchMessages();

      setNome("");
      setEmail("");
      setRecado("");
      setSuccessMessage("Mensagem enviada com sucesso para os noivos.");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Falha ao enviar a mensagem."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const totalPages: number = Math.max(1, Math.ceil(messages.length / perPage));
  const visible = useMemo<CoupleMessage[]>(() => {
    const start: number = (page - 1) * perPage;
    return messages.slice(start, start + perPage);
  }, [messages, page]);

  const go = (p: number): void => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  return (
    <section id="mensagem" className="hz-margin py-24 md:py-32 relative">
      <div className="absolute inset-0 pointer-events-none select-none opacity-[0.035] bg-[radial-gradient(circle_at_center,#ac5b30_0%,transparent_80%)]" />
      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-5xl tracking-tight mb-3 text-[var(--color-title)]">
            MENSAGEM PARA OS NOIVOS
          </h2>
          <p className="font-sans text-sm md:text-base text-[#6d4635] max-w-2xl mx-auto leading-relaxed italic">
            Palavras carinhosas tornam esse momento ainda mais especial.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/70 backdrop-blur rounded-xl shadow-sm border border-black/5 p-5 md:p-8 mb-14">
          {loadingData && (
            <p className="mb-4 text-sm text-[#6d4635]/75 font-sans">Carregando mensagens...</p>
          )}

          {loadError && (
            <p className="mb-4 text-sm text-red-700 font-sans">{loadError}</p>
          )}

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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value)}
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setRecado(e.target.value.slice(0, maxChars))
                }
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

            {submitError && (
              <p className="text-sm text-red-700">{submitError}</p>
            )}

            {successMessage && (
              <p className="text-sm text-emerald-700">{successMessage}</p>
            )}

            <div className="text-right">
              <button
                type="submit"
                disabled={
                  submitting ||
                  !nome ||
                  !email ||
                  !recado
                }
                className="px-6 py-2 rounded-full bg-[#ac5b30] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs tracking-wide hover:brightness-110 transition"
              >
                {submitting ? "Enviando..." : "Enviar mensagem"}
              </button>
            </div>
          </form>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {!loadingData && visible.length === 0 && (
            <div className="bg-white/60 backdrop-blur-sm border border-black/5 rounded-lg px-5 py-4 text-sm text-[#6d4635]/75">
              Ainda nao ha mensagens publicadas.
            </div>
          )}

          {visible.map((m) => (
            <div
              key={m.id}
              className="bg-white/60 backdrop-blur-sm border border-black/5 rounded-lg px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <div className="font-semibold text-sm text-[#ac5b30]">
                  {m.senderName}
                </div>
                <div className="text-xs text-[#6d4635]/70 mt-1.5">
                  {m.message}
                </div>
              </div>
              <div className="text-[10px] text-[#6d4635]/50 font-mono">
                {new Date(m.createdAt || Date.now()).toLocaleDateString("pt-BR", {
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
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
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
                  const p: number = i + 1;
                  return (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href="#mensagem"
                        isActive={p === page}
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
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
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
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
