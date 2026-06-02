'use client';

import React, { useEffect, useRef, useState } from 'react';

interface RSVPStats {
  totalGroups: number;
  totalMembers: number;
  confirmed: number;
  declined: number;
  pending: number;
  invitesSent: number;
  invitesNotSent: number;
}

const COLORS = {
  confirmed: '#5e8c6a',
  pending: '#d6a64e',
  declined: '#b9543a',
  brand: '#ac5b30',
  ink: '#5a3d2e',
  muted: '#947a64',
  track: 'rgba(172, 91, 48, 0.12)',
  border: 'rgba(172, 91, 48, 0.18)',
};

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Anima um número de seu valor anterior até o alvo (easeOutCubic, via rAF). */
function useAnimatedNumber(target: number, duration = 950): number {
  const [value, setValue] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      fromRef.current = target;
      setValue(target);
      return;
    }
    const from = fromRef.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number): void => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = from + (target - from) * eased;
      fromRef.current = next;
      setValue(next);
      if (p < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

interface Segment {
  label: string;
  value: number;
  color: string;
}

function Donut({ segments, size = 196, stroke = 3.6 }: { segments: Segment[]; size?: number; stroke?: number }) {
  const R = 15.915; // circunferência ≈ 100, então dasharray = porcentagem direta
  const total = segments.reduce((acc, s) => acc + s.value, 0) || 1;
  let cumulative = 0;

  return (
    <svg viewBox="0 0 36 36" width={size} height={size} role="img" aria-label="Distribuição das confirmações">
      <circle cx="18" cy="18" r={R} fill="none" stroke={COLORS.track} strokeWidth={stroke} />
      {segments.map((s) => {
        const pct = (s.value / total) * 100;
        const rotation = -90 + cumulative * 3.6;
        cumulative += pct;
        if (pct <= 0) return null;
        return (
          <circle
            key={s.label}
            cx="18"
            cy="18"
            r={R}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeDasharray={`${pct} ${100 - pct}`}
            transform={`rotate(${rotation} 18 18)`}
          />
        );
      })}
    </svg>
  );
}

function LegendRow({
  color,
  label,
  value,
  percent,
}: {
  color: string;
  label: string;
  value: number;
  percent: number;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: 4,
          background: color,
          flexShrink: 0,
          boxShadow: `0 0 0 3px ${color}22`,
        }}
      />
      <span style={{ flex: 1, fontSize: 14, color: COLORS.ink }}>{label}</span>
      <span style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 20, fontWeight: 600, color: COLORS.ink }}>
        {value}
      </span>
      <span style={{ width: 48, textAlign: 'right', fontSize: 13, color: COLORS.muted }}>{percent}%</span>
    </div>
  );
}

function Chip({ label, value }: { label: string; value: number | string }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 120,
        background: 'rgba(255,255,255,0.6)',
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: '12px 16px',
      }}
    >
      <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.muted }}>
        {label}
      </div>
      <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 24, fontWeight: 600, color: COLORS.brand }}>
        {value}
      </div>
    </div>
  );
}

function StatsView({ stats }: { stats: RSVPStats }) {
  const confirmed = useAnimatedNumber(stats.confirmed);
  const pending = useAnimatedNumber(stats.pending);
  const declined = useAnimatedNumber(stats.declined);
  const totalGroups = useAnimatedNumber(stats.totalGroups);
  const totalMembers = useAnimatedNumber(stats.totalMembers);

  const animatedTotal = confirmed + pending + declined || 1;
  const centerPercent = Math.round((confirmed / animatedTotal) * 100);

  const pct = (n: number): number =>
    stats.totalMembers > 0 ? Math.round((n / stats.totalMembers) * 100) : 0;

  const isEmpty = stats.totalMembers === 0;

  const segments: Segment[] = [
    { label: 'Comparecerão', value: confirmed, color: COLORS.confirmed },
    { label: 'Pendentes', value: pending, color: COLORS.pending },
    { label: 'Não comparecerão', value: declined, color: COLORS.declined },
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: 32,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      {/* Donut + centro */}
      <div style={{ position: 'relative', width: 196, height: 196, flexShrink: 0, margin: '0 auto' }}>
        {isEmpty ? (
          <div
            style={{
              width: 196,
              height: 196,
              borderRadius: '50%',
              border: `3.6px solid ${COLORS.track}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: 24,
              boxSizing: 'border-box',
            }}
          >
            <span style={{ fontSize: 13, color: COLORS.muted }}>Nenhum convidado cadastrado ainda</span>
          </div>
        ) : (
          <>
            <Donut segments={segments} />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 44,
                  lineHeight: 1,
                  fontWeight: 600,
                  color: COLORS.confirmed,
                }}
              >
                {centerPercent}%
              </span>
              <span style={{ fontSize: 12, color: COLORS.muted, marginTop: 6, letterSpacing: '0.04em' }}>
                confirmados
              </span>
              <span style={{ fontSize: 12, color: COLORS.ink, marginTop: 2 }}>
                {Math.round(confirmed)} de {Math.round(totalMembers)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Legenda */}
      <div style={{ flex: 1, minWidth: 240 }}>
        <LegendRow color={COLORS.confirmed} label="Comparecerão" value={Math.round(confirmed)} percent={pct(stats.confirmed)} />
        <div style={{ height: 1, background: COLORS.border }} />
        <LegendRow color={COLORS.pending} label="Pendentes" value={Math.round(pending)} percent={pct(stats.pending)} />
        <div style={{ height: 1, background: COLORS.border }} />
        <LegendRow color={COLORS.declined} label="Não comparecerão" value={Math.round(declined)} percent={pct(stats.declined)} />

        <div style={{ display: 'flex', gap: 12, marginTop: 18, flexWrap: 'wrap' }}>
          <Chip label="Grupos / Famílias" value={Math.round(totalGroups)} />
          <Chip label="Total de convidados" value={Math.round(totalMembers)} />
        </div>
      </div>
    </div>
  );
}

const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<RSVPStats>({
    totalGroups: 0,
    totalMembers: 0,
    confirmed: 0,
    declined: 0,
    pending: 0,
    invitesSent: 0,
    invitesNotSent: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);
  const [sendFeedback, setSendFeedback] = useState<string | null>(null);

  async function fetchStats(): Promise<void> {
    try {
      const res = await fetch('/api/rsvp-stats');
      if (!res.ok) throw new Error('Falha ao carregar estatísticas');
      const data = await res.json();
      setStats({
        totalGroups: data.totalGroups ?? 0,
        totalMembers: data.totalMembers ?? 0,
        confirmed: data.confirmed ?? 0,
        declined: data.declined ?? 0,
        pending: data.pending ?? 0,
        invitesSent: data.invitesSent ?? 0,
        invitesNotSent: data.invitesNotSent ?? 0,
      });
    } catch (err) {
      console.error('Failed to fetch RSVP stats:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  const sendAllInvites = async (): Promise<void> => {
    if (
      !window.confirm(
        'Enviar convites por WhatsApp para todos os grupos pendentes? (já enviados serão ignorados)',
      )
    ) {
      return;
    }
    setSending(true);
    setSendFeedback(null);
    try {
      const res = await fetch('/api/rsvp-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Falha no envio em lote.');
      const s = data.summary;
      setSendFeedback(`Envio concluído — ${s.sent} enviado(s), ${s.skipped} ignorado(s), ${s.failed} falha(s).`);
      await fetchStats();
    } catch (e: any) {
      setSendFeedback(`Erro: ${e.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ padding: '24px 0' }}>
      <div
        style={{
          background: 'linear-gradient(160deg, #fdfaf6 0%, #f6ede2 100%)',
          border: `1px solid ${COLORS.border}`,
          borderRadius: 18,
          padding: 28,
          boxShadow: '0 10px 30px -18px rgba(90, 61, 46, 0.45)',
          maxWidth: 920,
        }}
      >
        {/* Cabeçalho */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: COLORS.brand, marginBottom: 4 }}>
              Painel do Casamento
            </div>
            <h2 style={{ margin: 0, fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 26, color: COLORS.ink, fontWeight: 600 }}>
              Confirmações de Presença
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <button
              type="button"
              onClick={sendAllInvites}
              disabled={sending || loading}
              style={{
                padding: '10px 18px',
                background: sending || loading ? '#9bd6ad' : '#25D366',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: sending || loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 6px 16px -8px rgba(37, 211, 102, 0.8)',
              }}
            >
              {sending ? 'Enviando...' : 'Enviar convites pendentes'}
            </button>
            <span style={{ fontSize: 12, color: COLORS.muted }}>
              {stats.invitesSent} enviado(s) · {stats.invitesNotSent} pendente(s)
            </span>
          </div>
        </div>

        {sendFeedback && (
          <div
            style={{
              marginBottom: 20,
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.7)',
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              fontSize: 13,
              color: COLORS.ink,
            }}
          >
            {sendFeedback}
          </div>
        )}

        {loading ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: COLORS.muted, fontSize: 14 }}>
            Carregando estatísticas...
          </div>
        ) : (
          <StatsView stats={stats} />
        )}
      </div>
    </div>
  );
};

export default DashboardStats;
