"use client";
import React, { useState, useMemo } from "react";
import { useGuestList } from "./hooks/useGuestList";
import { useDebounce } from "./hooks/useDebounce";
import { Input } from "../components/ui/input";

export default function Confirmacao() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState({}); // {guestId: {acompanhantes, timestamp, status: 'confirmado' | 'nao-vai'}}
  const [step, setStep] = useState("search"); // search | detail | done
  const { guests } = useGuestList();
  const debouncedQuery = useDebounce(query, 250);
  const [searching, setSearching] = useState(false);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return [];
    return guests.filter((g) => g.nome.toLowerCase().includes(q));
  }, [debouncedQuery, guests]);

  // simulate network delay indicator
  React.useEffect(() => {
    if (!query) {
      setSearching(false);
      return;
    }
    setSearching(true);
    const t = setTimeout(() => setSearching(false), 260); // just after debounce
    return () => clearTimeout(t);
  }, [debouncedQuery, query]);

  const handleSelect = (guest) => {
    setSelected(guest);
    setStep("detail");
  };

  const handleConfirm = (guest, acompanhantesConfirmados) => {
    setConfirmed((prev) => ({
      ...prev,
      [guest.id]: {
        acompanhantes: acompanhantesConfirmados,
        at: Date.now(),
        status: "confirmado",
      },
    }));
    setStep("done");
  };

  const handleDecline = (guest) => {
    setConfirmed((prev) => ({
      ...prev,
      [guest.id]: { acompanhantes: 0, at: Date.now(), status: "nao-vai" },
    }));
    setStep("done");
  };

  const alreadyConfirmed = selected && confirmed[selected.id];

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
                  onChange={(e) => {
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
                      {g.nome}
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
                {selected.nome}
              </h3>
              <p className="font-sans text-sm text-[#6d4635]/80">
                Convite válido para {1 + selected.acompanhantes}{" "}
                {selected.acompanhantes ? "pessoas" : "pessoa"}.
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
                  {selected.nome}, sua confirmação foi registrada para{" "}
                  {1 + selected.acompanhantes}{" "}
                  {selected.acompanhantes ? "pessoas" : "pessoa"}. Caso precise
                  atualizar, fale conosco pelo e-mail:{" "}
                  <strong>convites@renan-e-heloisa.com</strong>.
                </p>
              )}
              {confirmed[selected.id]?.status === "nao-vai" && (
                <p className="font-sans text-sm text-[#6d4635]/80 max-w-md mx-auto">
                  {selected.nome}, registramos que você não poderá comparecer.
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

        {/* Info footer (contact / deadline) */}
        {/* <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 text-[#6d4635]">
          <InfoBadge title="Contato" text="convites@renan-e-heloisa.com" />
          <InfoBadge title="Prazo" text="10 de Agosto de 2026" />
          <InfoBadge title="Status" text="Formulário ativo" />
        </div> */}
      </div>
    </section>
  );
}

function InfoBadge({ title, text }) {
  return (
    <div className="text-center">
      <div className="uppercase tracking-wider text-[10px] font-semibold text-[#ac5b30]/80 mb-1">
        {title}
      </div>
      <div className="font-sans text-xs md:text-sm">{text}</div>
    </div>
  );
}

function ConfirmarForm({ guest, onConfirm, onDecline }) {
  const [acompanhantes, setAcompanhantes] = useState(guest.acompanhantes);
  const total = 1 + guest.acompanhantes;
  const handleSubmit = (e) => {
    e.preventDefault();
    const qtd = Math.min(Math.max(0, acompanhantes), guest.acompanhantes);
    onConfirm(guest, qtd);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans">
      {guest.acompanhantes > 0 && (
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[#ac5b30] font-semibold mb-1">
            Acompanhantes (até {guest.acompanhantes})
          </label>
          <Input
            type="number"
            min={0}
            max={guest.acompanhantes}
            value={acompanhantes}
            onChange={(e) => setAcompanhantes(Number(e.target.value))}
            className="w-24 h-9 text-sm border border-[#ac5b30]/40 rounded-lg px-2 py-1 bg-white/70 focus:outline-none focus:border-[#ac5b30] focus:ring-2 focus:ring-[#ac5b30]/20"
          />
          <p className="text-[11px] mt-1 text-[#6d4635]/60">
            Total confirmados ficará em {1 + acompanhantes} / {total}
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
