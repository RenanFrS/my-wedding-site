"use client";
import React, { useState, useMemo } from "react";
import { useGuestList } from "../../components/hooks/useGuestList";
import { Button } from "../../components/ui/button";

const INITIAL_MESSAGES = [
  {
    id: 1,
    nome: "Ana Clara",
    texto: "Que dia especial!",
    at: Date.now() - 100000,
  },
  { id: 2, nome: "Bruno", texto: "Felizes por vocês!", at: Date.now() - 90000 },
  {
    id: 3,
    nome: "Carlos",
    texto: "Mal posso esperar ♥",
    at: Date.now() - 80000,
  },
  { id: 4, nome: "Daniela", texto: "Será lindo!", at: Date.now() - 70000 },
];

export default function AdminPage() {
  const { guests } = useGuestList();
  const [tab, setTab] = useState("dashboard");
  const [messages] = useState(INITIAL_MESSAGES);
  const stats = useMemo(() => {
    const total = guests.length;
    const confirmados = Math.min(2, total);
    const naoVai = total > 3 ? 1 : 0;
    const pendentes = total - confirmados - naoVai;
    const taxa = total ? ((confirmados / total) * 100).toFixed(1) : "0.0";
    return { total, confirmados, naoVai, pendentes, taxa };
  }, [guests]);

  return (
    <div className="min-h-screen bg-[#fefaf6] text-[#6d4635] font-sans">
      <Header onChangeTab={setTab} active={tab} />
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        {tab === "dashboard" && <Dashboard stats={stats} messages={messages} />}
        {tab === "convidados" && <Convidados guests={guests} />}
        {tab === "mensagens" && <Mensagens messages={messages} />}
      </main>
    </div>
  );
}

function Header({ onChangeTab, active }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "convidados", label: "Convidados" },
    { id: "mensagens", label: "Mensagens" },
  ];
  return (
    <div className="border-b border-[#ac5b30]/15 bg-white/70 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
        <div className="font-display text-xl text-[#ac5b30] tracking-tight">
          Admin · Painel
        </div>
        <nav className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => onChangeTab(t.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition ${
                active === t.id
                  ? "bg-[#ac5b30] text-white"
                  : "bg-[#ac5b30]/10 text-[#ac5b30] hover:bg-[#ac5b30]/20"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <form action="/api/logout" method="post">
          <button
            type="submit"
            className="text-xs text-[#ac5b30] hover:underline"
          >
            Sair
          </button>
        </form>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="p-5 rounded-xl border border-black/5 bg-white/60 backdrop-blur min-w-[140px]">
      <div className="text-[11px] uppercase tracking-wider font-semibold text-[#ac5b30]/70 mb-1">
        {label}
      </div>
      <div
        className={`font-display text-2xl ${
          accent ? "text-[#ac5b30]" : "text-[#6d4635]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Dashboard({ stats, messages }) {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-display text-2xl text-[#ac5b30] mb-4">Resumo</h2>
        <div className="flex flex-wrap gap-4">
          <StatCard label="Total Convidados" value={stats.total} />
          <StatCard label="Confirmados" value={stats.confirmados} accent />
          <StatCard label="Não irão" value={stats.naoVai} />
          <StatCard label="Pendentes" value={stats.pendentes} />
          <StatCard label="Taxa (%)" value={`${stats.taxa}%`} />
        </div>
      </section>
      <section>
        <h2 className="font-display text-2xl text-[#ac5b30] mb-4">
          Últimas Mensagens
        </h2>
        <div className="space-y-3">
          {messages.slice(0, 5).map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-lg bg-white/70 border border-black/5 flex justify-between gap-4"
            >
              <div>
                <div className="font-semibold text-sm text-[#ac5b30]">
                  {m.nome}
                </div>
                <div className="text-xs text-[#6d4635]/70">{m.texto}</div>
              </div>
              <div className="text-[10px] text-[#6d4635]/50 font-mono">
                {new Date(m.at).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Convidados({ guests }) {
  return (
    <div>
      <h2 className="font-display text-2xl text-[#ac5b30] mb-6">
        Lista de Convidados
      </h2>
      <table className="w-full text-sm border-separate border-spacing-y-2">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wider text-[#ac5b30]/70">
            <th className="py-1">Nome</th>
            <th className="py-1">Acompanhantes</th>
            <th className="py-1">Status</th>
            <th className="py-1">Ações</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((g) => (
            <tr
              key={g.id}
              className="bg-white/60 backdrop-blur hover:bg-white/80 transition"
            >
              <td className="px-3 py-2 font-medium text-[#6d4635]">{g.nome}</td>
              <td className="px-3 py-2 text-[#6d4635]/70">{g.acompanhantes}</td>
              <td className="px-3 py-2 text-[#6d4635]/70">—</td>
              <td className="px-3 py-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Marcar Presença
                  </Button>
                  <Button variant="ghost" size="sm">
                    Não vai
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Mensagens({ messages }) {
  return (
    <div>
      <h2 className="font-display text-2xl text-[#ac5b30] mb-6">
        Mensagens Recebidas
      </h2>
      <div className="space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className="p-4 rounded-lg bg-white/70 border border-black/5"
          >
            <div className="flex justify-between">
              <div className="font-semibold text-sm text-[#ac5b30]">
                {m.nome}
              </div>
              <div className="text-[10px] text-[#6d4635]/50 font-mono">
                {new Date(m.at).toLocaleString("pt-BR")}
              </div>
            </div>
            <div className="text-xs text-[#6d4635]/70 mt-1">{m.texto}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
