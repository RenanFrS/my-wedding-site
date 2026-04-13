'use client';

import React, { useEffect, useState } from 'react';

interface GuestStats {
  total: number;
  confirmed: number;
  pending: number;
  totalDependents: number;
}

const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<GuestStats>({
    total: 0,
    confirmed: 0,
    pending: 0,
    totalDependents: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchStats(): Promise<void> {
      try {
        const res = await fetch('/api/guests?limit=0');
        const data = await res.json();
        const guests = data.docs || [];

        const total = guests.length;
        const confirmed = guests.filter(
          (g: { confirmed?: boolean }) => g.confirmed
        ).length;
        const pending = total - confirmed;
        const totalDependents = guests.reduce(
          (sum: number, g: { dependents?: unknown[] }) =>
            sum + (g.dependents?.length || 0),
          0
        );

        setStats({ total, confirmed, pending, totalDependents });
      } catch (err) {
        console.error('Failed to fetch guest stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Carregando estatísticas...</p>
      </div>
    );
  }

  const confirmedPercent =
    stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0;
  const pendingPercent =
    stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        📊 Resumo dos Convidados
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total de Convidados" value={stats.total} color="#6d4635" />
        <StatCard
          label="Confirmados"
          value={stats.confirmed}
          color="#16a34a"
          suffix={` (${confirmedPercent}%)`}
        />
        <StatCard
          label="Pendentes"
          value={stats.pending}
          color="#d97706"
          suffix={` (${pendingPercent}%)`}
        />
        <StatCard
          label="Total Acompanhantes"
          value={stats.totalDependents}
          color="#7c3aed"
        />
      </div>

      {/* Simple Bar Chart */}
      {stats.total > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-600">
            Confirmados vs Pendentes
          </h3>
          <div className="flex h-8 rounded-full overflow-hidden bg-gray-100">
            <div
              className="bg-green-500 transition-all duration-500 flex items-center justify-center text-xs text-white font-medium"
              style={{ width: `${confirmedPercent}%` }}
            >
              {confirmedPercent > 10 && `${confirmedPercent}%`}
            </div>
            <div
              className="bg-amber-500 transition-all duration-500 flex items-center justify-center text-xs text-white font-medium"
              style={{ width: `${pendingPercent}%` }}
            >
              {pendingPercent > 10 && `${pendingPercent}%`}
            </div>
          </div>
          <div className="flex gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
              Confirmados
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              Pendentes
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  suffix?: string;
}

function StatCard({ label, value, color, suffix }: StatCardProps): React.JSX.Element {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
        {suffix && <span className="text-sm font-normal text-gray-400">{suffix}</span>}
      </p>
    </div>
  );
}

export default DashboardStats;
