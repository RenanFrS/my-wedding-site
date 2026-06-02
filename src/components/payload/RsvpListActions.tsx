'use client';
import React, { useState } from 'react';

const RsvpListActions: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const sendAll = async () => {
    if (
      !window.confirm(
        'Enviar o convite por WhatsApp para TODOS os grupos que ainda não receberam? (grupos já enviados serão ignorados)',
      )
    ) {
      return;
    }
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/rsvp-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Falha no envio em lote.');
      }
      const s = data.summary;
      setFeedback(
        `Envio concluído — ${s.sent} enviado(s), ${s.skipped} ignorado(s), ${s.failed} falha(s). Recarregue a página para atualizar os status.`,
      );
    } catch (e: any) {
      setFeedback(`❌ ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        margin: '0 0 20px',
        padding: '16px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        background: '#fcf8f4',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={sendAll}
          disabled={loading}
          style={{
            padding: '10px 16px',
            background: '#25D366',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Enviando...' : 'Enviar convites pendentes (lote)'}
        </button>
        {feedback && <span style={{ fontSize: '14px' }}>{feedback}</span>}
      </div>
    </div>
  );
};

export default RsvpListActions;
