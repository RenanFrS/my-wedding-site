'use client';
import React, { useState } from 'react';
import { useDocumentInfo } from '@payloadcms/ui';
import { useFormFields } from '@payloadcms/ui/forms/Form';

type WhatsAppStatus = 'not_sent' | 'sent' | 'failed';

const STATUS_LABEL: Record<WhatsAppStatus, string> = {
  not_sent: 'Não enviado',
  sent: 'Enviado',
  failed: 'Falhou',
};

const STATUS_COLOR: Record<WhatsAppStatus, string> = {
  not_sent: '#6b7280',
  sent: '#16a34a',
  failed: '#dc2626',
};

const SendInvite: React.FC = () => {
  const { id } = useDocumentInfo();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const { status, lastError } = useFormFields(([fields]) => ({
    status: (fields['whatsapp.status']?.value as WhatsAppStatus) || 'not_sent',
    lastError: fields['whatsapp.lastError']?.value as string | undefined,
  }));

  if (!id) {
    return (
      <div style={{ padding: '16px', background: '#f9f9f9', borderRadius: '8px' }}>
        <p>
          <strong>Aviso:</strong> Salve o registro pela primeira vez para gerar o
          link e o código, e habilitar o envio do convite.
        </p>
      </div>
    );
  }

  const alreadySent = status === 'sent';

  const send = async (force: boolean) => {
    if (force && !window.confirm('Reenviar o convite por WhatsApp para este grupo?')) {
      return;
    }
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/rsvp-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, force }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Falha ao enviar.');
      }
      const r = data.results?.[0];
      if (r?.status === 'sent') {
        setFeedback('✅ Convite enviado com sucesso! Recarregue a página para ver o status atualizado.');
      } else if (r?.status === 'skipped') {
        setFeedback('Convite já havia sido enviado (use "Reenviar" para forçar).');
      } else {
        setFeedback(`❌ Falha: ${r?.error || 'erro desconhecido'}`);
      }
    } catch (e: any) {
      setFeedback(`❌ ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h4 style={{ marginBottom: '10px' }}>Convite por WhatsApp</h4>
      <p style={{ marginBottom: '12px' }}>
        Status:{' '}
        <strong style={{ color: STATUS_COLOR[status] }}>{STATUS_LABEL[status]}</strong>
      </p>
      {status === 'failed' && lastError && (
        <p style={{ marginBottom: '12px', color: '#dc2626', fontSize: '13px' }}>
          Último erro: {lastError}
        </p>
      )}
      <div style={{ display: 'flex', gap: '10px' }}>
        {!alreadySent && (
          <button
            type="button"
            onClick={() => send(false)}
            disabled={loading}
            style={{
              padding: '10px 15px',
              background: '#25D366',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Enviando...' : 'Enviar convite'}
          </button>
        )}
        {alreadySent && (
          <button
            type="button"
            onClick={() => send(true)}
            disabled={loading}
            style={{
              padding: '10px 15px',
              background: '#6d4635',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Enviando...' : 'Reenviar convite'}
          </button>
        )}
      </div>
      {feedback && <p style={{ marginTop: '12px', fontSize: '14px' }}>{feedback}</p>}
    </div>
  );
};

export default SendInvite;
