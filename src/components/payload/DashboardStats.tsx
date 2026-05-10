'use client';

import React, { useEffect, useState } from 'react';

interface RSVPStats {
  totalGroups: number;
  totalMembers: number;
  confirmed: number;
  declined: number;
  pending: number;
}

interface RSVPMember {
  status?: 'pending' | 'confirmed' | 'declined';
}

interface RSVPDoc {
  members?: RSVPMember[];
}

const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<RSVPStats>({
    totalGroups: 0,
    totalMembers: 0,
    confirmed: 0,
    declined: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchStats(): Promise<void> {
      try {
        const res = await fetch('/api/rsvps?limit=500&depth=0');
        const data = await res.json();
        const groups: RSVPDoc[] = data.docs || [];

        let totalMembers = 0;
        let confirmed = 0;
        let declined = 0;
        let pending = 0;

        for (const group of groups) {
          for (const member of group.members || []) {
            totalMembers++;
            if (member.status === 'confirmed') confirmed++;
            else if (member.status === 'declined') declined++;
            else pending++;
          }
        }

        setStats({
          totalGroups: groups.length,
          totalMembers,
          confirmed,
          declined,
          pending,
        });
      } catch (err) {
        console.error('Failed to fetch RSVP stats:', err);
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
    stats.totalMembers > 0 ? Math.round((stats.confirmed / stats.totalMembers) * 100) : 0;
  const declinedPercent =
    stats.totalMembers > 0 ? Math.round((stats.declined / stats.totalMembers) * 100) : 0;
  const pendingPercent =
    stats.totalMembers > 0 ? Math.round((stats.pending / stats.totalMembers) * 100) : 0;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Resumo das Confirmações (RSVP)
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Grupos / Famílias" value={stats.totalGroups} color="#6d4635" />
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
          label="Não comparecerão"
          value={stats.declined}
          color="#dc2626"
          suffix={` (${declinedPercent}%)`}
        />
      </div>

      {stats.totalMembers > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-600">
            Distribuição por status ({stats.totalMembers} convidados)
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
            <div
              className="bg-red-500 transition-all duration-500 flex items-center justify-center text-xs text-white font-medium"
              style={{ width: `${declinedPercent}%` }}
            >
              {declinedPercent > 10 && `${declinedPercent}%`}
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
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
              Não comparecerão
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
