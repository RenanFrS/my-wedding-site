"use client";
import React, { useState, useMemo } from "react";
import { useGuestList } from "@/components/hooks/useGuestList";
import { useDebounce } from "@/components/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import type { Guest } from "@/types";

/** Helper: number of dependents for a guest */
function guestDependentsCount(guest: Guest): number {
  return guest.dependents?.length ?? 0;
}

interface ConfirmationRecord {
  dependentsConfirmed: number;
  at: number;
  status: "confirmado" | "nao-vai";
}

interface ConfirmarFormProps {
  guest: Guest;
  onConfirm: (guest: Guest, dependentsConfirmed: number) => void;
  onDecline: (guest: Guest) => void;
}

type Step = "search" | "detail" | "done";

export default function Confirmacao(): React.JSX.Element {
  const [query, setQuery] = useState<string>("");
  const [selected, setSelected] = useState<Guest | null>(null);
  const [confirmed, setConfirmed] = useState<Record<string, ConfirmationRecord>>({});
  const [step, setStep] = useState<Step>("search");
  const { guests } = useGuestList();
  const debouncedQuery = useDebounce<string>(query, 250);
  const [searching, setSearching] = useState<boolean>(false);

  const filtered = useMemo<Guest[]>(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return [];
    return guests.filter((g) => g.name.toLowerCase().includes(q));
  }, [debouncedQuery, guests]);

  // simulate network delay indicator
  React.useEffect(() => {
    if (!query) {
      setSearching(false);
      return;
    }
    setSearching(true);
    const t: ReturnType<typeof setTimeout> = setTimeout(() => setSearching(false), 260); // just after debounce
    return () => clearTimeout(t);
  }, [debouncedQuery, query]);

  const handleSelect = (guest: Guest): void => {
    setSelected(guest);
    setStep("detail");
  };

  const handleConfirm = (guest: Guest, dependentsConfirmed: number): void => {
    setConfirmed((prev) => ({
      ...prev,
      [guest.id]: {
        dependentsConfirmed,
        at: Date.now(),
        status: "confirmado",
      },
    }));
    setStep("done");
  };

  const handleDecline = (guest: Guest): void => {
    setConfirmed((prev) => ({
      ...prev,
      [guest.id]: { dependentsConfirmed: 0, at: Date.now(), status: "nao-vai" },
    }));
    setStep("done");
  };

  const alreadyConfirmed: ConfirmationRecord | undefined =
    selected ? confirmed[selected.id] : undefined;

  return (
    <section id="confirmacao" className="hz-margin py-24 md:py-32 relative">
      <div className="absolute inset-0 pointer-events-none select-none opacity-[0.04] bg-[radial-gradient(circle_at_center,#ac5b30_0%,transparent_75%)]" />
      <div className="relative max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-5xl tracking-tight mb-3 text-[#ac5b30]">
            CONFIRMAÇÃO DE PRESENÇA
          </h2>
          <p className="font-sans text-sm md:text-base text-[#6d4635] max-w-2xl mx-auto leading-relaxed italic">
            Sua presença é muito importante para nós. Por favor, confirme até 10
            de Agosto de 2026.
          </p>
        </div>

        {/* Card container */}
        <div className="bg-white/70 backdrop-blur rounded-xl shadow-sm border border-black/5 p-5 md:p-8 mb-12">
          {step === "search" && (
            <div>
              <label
                htmlFor="busca"
                className="font-sans text-xs uppercase tracking-wider text-[#ac5b30] font-semibold block mb-2"
              >
                Buscar e Confirmar Presença
              </label>
              <div className="relative group">
                <Input
                  id="busca"
                  type="text"
                  placeholder="Digite o nome como está no convite"
                  className="w-full rounded-lg border border-[#ac5b30]/30 bg-white/60 focus:bg-white focus:border-[#ac5b30] focus:ring-2 focus:ring-[#ac5b30]/20 px-4 py-3 font-sans text-sm outline-none placeholder:text-[#6d4635]/50 transition"
                  value={query}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setQuery(e.target.value);
                    setSelected(null);
                  }}
                  autoComplete="off"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ac5b30]/50 pointer-events-none hidden group-focus-within:block">
                  🔍
                </span>
              </div>
              {/* Results */}
              {query && (
                <div className="mt-4 space-y-1">
                  {searching && (
                    <div className="text-xs text-[#6d4635]/50 animate-pulse">
                      Buscando...
                    </div>
                  )}
                  {filtered.length === 0 && (
                    <div className="text-xs text-[#6d4635]/70 italic">
                      Nenhum nome encontrado. Verifique a grafia.
                    </div>
                  )}
                  {filtered.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => handleSelect(g)}
                      className="w-full text-left px-4 py-2 rounded-md border border-transparent hover:border-[#ac5b30]/30 hover:bg-[#ac5b30]/5 transition text-sm font-sans"
                    >
                      {g.name}
                      {confirmed[g.id] && (
                        <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-[#ac5b30]/10 text-[#ac5b30]">
                          Confirmado
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === "detail" && selected && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => {
                    setStep("search");
                    setSelected(null);
                  }}
                  className="text-xs uppercase tracking-wider text-[#ac5b30] hover:underline"
                >
                  Voltar
                </button>
              </div>
              <h3 className="font-display text-2xl text-[#ac5b30] leading-tight">
                {selected.name}
              </h3>
              <p className="font-sans text-sm text-[#6d4635]/80">
                Convite válido para {1 + guestDependentsCount(selected)}{" "}
                {guestDependentsCount(selected) ? "pessoas" : "pessoa"}.
              </p>
              {!alreadyConfirmed && (
                <ConfirmarForm
                  guest={selected}
                  onConfirm={handleConfirm}
                  onDecline={handleDecline}
                />
              )}
              {alreadyConfirmed && (
                <div className="p-4 rounded-md border border-[#ac5b30]/30 bg-[#ac5b30]/5 text-sm text-[#6d4635]">
                  {confirmed[selected.id].status === "confirmado" && (
                    <>
                      Presença já confirmada. Obrigado! Se precisar alterar,
                      entre em contato.
                    </>
                  )}
                  {confirmed[selected.id].status === "nao-vai" && (
                    <>
                      Registro de ausência realizado. Sentiremos sua falta! Caso
                      mude de ideia, fale conosco.
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {step === "done" && selected && (
            <div className="text-center space-y-6">
              <div className="text-4xl">✅</div>
              <h3 className="font-display text-2xl text-[#ac5b30]">
                Tudo certo!
              </h3>
              {confirmed[selected.id]?.status === "confirmado" && (
                <p className="font-sans text-sm text-[#6d4635]/80 max-w-md mx-auto">
                  {selected.name}, sua confirmação foi registrada para{" "}
                  {1 + guestDependentsCount(selected)}{" "}
                  {guestDependentsCount(selected) ? "pessoas" : "pessoa"}. Caso precise
                  atualizar, fale conosco pelo e-mail:{" "}
                  <strong>convites@renan-e-heloisa.com</strong>.
                </p>
              )}
              {confirmed[selected.id]?.status === "nao-vai" && (
                <p className="font-sans text-sm text-[#6d4635]/80 max-w-md mx-auto">
                  {selected.name}, registramos que você não poderá comparecer.
                  Agradecemos por avisar e esperamos celebrar juntos em outra
                  ocasião!
                </p>
              )}
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setStep("search");
                    setSelected(null);
                    setQuery("");
                  }}
                  className="px-5 py-2 rounded-full border border-[#ac5b30] text-[#ac5b30] text-xs tracking-wide hover:bg-[#ac5b30]/10"
                >
                  Nova busca
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

function ConfirmarForm({ guest, onConfirm, onDecline }: ConfirmarFormProps): React.JSX.Element {
  const maxDependents = guestDependentsCount(guest);
  const [depCount, setDepCount] = useState<number>(maxDependents);
  const total: number = 1 + maxDependents;
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const qtd: number = Math.min(Math.max(0, depCount), maxDependents);
    onConfirm(guest, qtd);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans">
      {maxDependents > 0 && (
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[#ac5b30] font-semibold mb-1">
            Acompanhantes (até {maxDependents})
          </label>
          <Input
            type="number"
            min={0}
            max={maxDependents}
            value={depCount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDepCount(Number(e.target.value))
            }
            className="w-24 h-9 text-sm border border-[#ac5b30]/40 rounded-lg px-2 py-1 bg-white/70 focus:outline-none focus:border-[#ac5b30] focus:ring-2 focus:ring-[#ac5b30]/20"
          />
          <p className="text-[11px] mt-1 text-[#6d4635]/60">
            Total confirmados ficará em {1 + depCount} / {total}
          </p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          className="px-6 py-2 rounded-full bg-[#ac5b30] text-white text-xs tracking-wide hover:brightness-110 transition"
        >
          Confirmar presença
        </button>
        <button
          type="button"
          onClick={() => onDecline(guest)}
          className="px-6 py-2 rounded-full border border-[#ac5b30]/50 text-[#ac5b30] text-xs tracking-wide hover:bg-[#ac5b30]/10 transition"
        >
          Não vou comparecer
        </button>
      </div>
    </form>
  );
}
