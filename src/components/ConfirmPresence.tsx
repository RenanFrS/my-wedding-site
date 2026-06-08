"use client";
import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

type MemberStatus = "pending" | "confirmed" | "declined";

interface Member {
  id: string;
  name: string;
  status: MemberStatus;
}

interface Group {
  groupId: number | string;
  groupName: string;
  members: Member[];
}

export default function ConfirmPresence(): React.JSX.Element {
  const [name, setName] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchError, setSearchError] = useState<string>("");

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [done, setDone] = useState<boolean>(false);

  // Guarda o grupo confirmado para escolher a mensagem de agradecimento final.
  const [confirmedGroup, setConfirmedGroup] = useState<Group | null>(null);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSearchError("");
    setSubmitError("");
    setDone(false);
    setConfirmedGroup(null);

    if (name.trim().length < 3) {
      setSearchError("Digite seu nome completo para encontrarmos seu convite.");
      return;
    }

    setSearching(true);
    setSearched(false);

    try {
      const res = await fetch("/api/rsvp-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Não foi possível realizar a busca.");
      }

      setGroups(Array.isArray(data?.groups) ? data.groups : []);
      setSearched(true);
    } catch (error) {
      setSearchError(
        error instanceof Error ? error.message : "Falha ao buscar seu nome.",
      );
    } finally {
      setSearching(false);
    }
  };

  const setMemberStatus = (
    groupIndex: number,
    memberIndex: number,
    status: MemberStatus,
  ): void => {
    setGroups((prev) => {
      const next = prev.map((g) => ({ ...g, members: g.members.map((m) => ({ ...m })) }));
      next[groupIndex].members[memberIndex].status = status;
      return next;
    });
  };

  const handleConfirm = async (group: Group): Promise<void> => {
    setSubmitError("");

    const hasPending = group.members.some((m) => m.status === "pending");
    if (hasPending) {
      setSubmitError("Por favor, escolha uma opção para cada convidado.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/rsvp-update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: group.groupId,
          members: group.members.map((m) => ({ id: m.id, status: m.status })),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Não foi possível salvar sua resposta.");
      }

      setConfirmedGroup(group);
      setDone(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Falha ao salvar sua resposta.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Mensagem de agradecimento adaptada à resposta (sempre carinhosa).
  const thankYou = useMemo(() => {
    if (!confirmedGroup) return { title: "", text: "" };
    const anyConfirmed = confirmedGroup.members.some((m) => m.status === "confirmed");
    if (anyConfirmed) {
      return {
        title: "Que alegria ter você com a gente!",
        text: "Sua presença foi confirmada. Mal podemos esperar para celebrar esse dia ao seu lado.",
      };
    }
    return {
      title: "Obrigado por nos avisar!",
      text: "Vamos sentir sua falta, mas ficamos muito gratos pelo carinho de responder.",
    };
  }, [confirmedGroup]);

  return (
    <section id="confirmacao" className="hz-margin py-24 md:py-32 relative">
      <div className="absolute inset-0 pointer-events-none select-none opacity-[0.035] bg-[radial-gradient(circle_at_center,#ac5b30_0%,transparent_80%)]" />
      <div className="relative max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-5xl tracking-tight mb-3 text-[var(--color-title)]">
            CONFIRME SUA PRESENÇA
          </h2>
          <p className="font-sans text-sm md:text-base text-[#6d4635] max-w-2xl mx-auto leading-relaxed italic">
            Procure seu nome completo para confirmar ou recusar a presença.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur rounded-xl shadow-sm border border-black/5 p-5 md:p-8">
          {done ? (
            <div className="text-center py-6 font-sans">
              <h3 className="font-display text-2xl md:text-3xl text-[#ac5b30] mb-3">
                {thankYou.title}
              </h3>
              <p className="text-sm md:text-base text-[#6d4635]/85 max-w-md mx-auto leading-relaxed">
                {thankYou.text}
              </p>
            </div>
          ) : (
            <>
              <form onSubmit={handleSearch} className="font-sans">
                <label className="block text-[11px] uppercase tracking-wider text-[#ac5b30] font-semibold mb-1">
                  Seu nome completo
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="text"
                    placeholder="Ex: Jose Italo da Silva"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    className="w-full rounded-md border border-[#ac5b30]/30 bg-white/60 focus:bg-white focus:border-[#ac5b30] focus:ring-2 focus:ring-[#ac5b30]/20 px-3 py-2 text-sm outline-none placeholder:text-[#6d4635]/40"
                    maxLength={80}
                  />
                  <button
                    type="submit"
                    disabled={searching || name.trim().length < 3}
                    className="shrink-0 px-6 py-2 rounded-full bg-[#ac5b30] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs tracking-wide hover:brightness-110 transition"
                  >
                    {searching ? "Buscando..." : "Buscar meu nome"}
                  </button>
                </div>
                {searchError && (
                  <p className="mt-3 text-sm text-red-700">{searchError}</p>
                )}
              </form>

              {searched && groups.length === 0 && !searchError && (
                <div className="mt-6 bg-white/60 border border-black/5 rounded-lg px-5 py-4 text-sm text-[#6d4635]/80">
                  Não encontramos esse nome na lista. Verifique se digitou o nome
                  completo, igual ao do convite. Se o problema continuar, fale com os
                  noivos.
                </div>
              )}

              {groups.map((group, groupIndex) => (
                <div
                  key={group.groupId}
                  className="mt-8 border-t border-[#ac5b30]/15 pt-6"
                >
                  <p className="font-display text-lg text-[#ac5b30] mb-1">
                    {group.groupName}
                  </p>
                  <p className="text-xs text-[#6d4635]/70 mb-4 font-sans">
                    Marque a presença de cada convidado abaixo.
                  </p>

                  <div className="space-y-3 font-sans">
                    {group.members.map((member, memberIndex) => (
                      <div
                        key={member.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white/60 border border-black/5 rounded-lg px-4 py-3"
                      >
                        <span className="text-sm font-semibold text-[#6d4635]">
                          {member.name}
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setMemberStatus(groupIndex, memberIndex, "confirmed")}
                            className={`px-4 py-1.5 rounded-full text-xs tracking-wide border transition ${
                              member.status === "confirmed"
                                ? "bg-[#5e8c6a] border-[#5e8c6a] text-white"
                                : "bg-white/70 border-[#5e8c6a]/40 text-[#5e8c6a] hover:bg-[#5e8c6a]/10"
                            }`}
                          >
                            Comparecerá
                          </button>
                          <button
                            type="button"
                            onClick={() => setMemberStatus(groupIndex, memberIndex, "declined")}
                            className={`px-4 py-1.5 rounded-full text-xs tracking-wide border transition ${
                              member.status === "declined"
                                ? "bg-[#b9543a] border-[#b9543a] text-white"
                                : "bg-white/70 border-[#b9543a]/40 text-[#b9543a] hover:bg-[#b9543a]/10"
                            }`}
                          >
                            Não comparecerá
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {submitError && (
                    <p className="mt-4 text-sm text-red-700 font-sans">{submitError}</p>
                  )}

                  <div className="text-right mt-5">
                    <button
                      type="button"
                      onClick={() => handleConfirm(group)}
                      disabled={submitting}
                      className="px-6 py-2 rounded-full bg-[#ac5b30] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs tracking-wide hover:brightness-110 transition"
                    >
                      {submitting ? "Enviando..." : "Enviar resposta"}
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
