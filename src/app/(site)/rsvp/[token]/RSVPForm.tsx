'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface RSVPMember {
  id: string; // Payload gen
  name: string;
  status: 'pending' | 'confirmed' | 'declined';
}

export default function RSVPForm({
  token,
  rsvps,
}: {
  token: string;
  rsvps: RSVPMember[];
}) {
  const [securityCode, setSecurityCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState(rsvps);

  const confirmPresence = async () => {
    if (securityCode.trim() === '') {
      alert('Por favor, informe o código de segurança para confirmar.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/rsvp-confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          securityCode,
          members,
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }
      alert('Presença confirmada com sucesso!');
    } catch (e: any) {
      alert('Erro: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-[var(--color-background)] rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-[#ac5b30]">Lista de Convidados</h2>
      <p className="mb-6 opacity-80 text-sm">
        Selecione abaixo quais convidados comparecerão ou não ao evento.
      </p>

      {members.map((member, index) => (
        <div key={member.id} className="mb-6 p-4 border rounded-md">
          <p className="font-semibold text-lg">{member.name}</p>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name={`status-${member.id}`}
                checked={member.status === 'confirmed'}
                onChange={() => {
                  const newMembers = [...members];
                  newMembers[index].status = 'confirmed';
                  setMembers(newMembers);
                }}
              />
              Comparecerá
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name={`status-${member.id}`}
                checked={member.status === 'declined'}
                onChange={() => {
                  const newMembers = [...members];
                  newMembers[index].status = 'declined';
                  setMembers(newMembers);
                }}
              />
              Não comparecerá
            </label>
          </div>
        </div>
      ))}

      <div className="mt-8 p-4 bg-[#fcf8f4] border border-[#ac5b30]/30 rounded-lg">
        <h4 className="font-semibold text-[#ac5b30]">Verificação de Segurança</h4>
        <p className="text-xs mb-2 opacity-80">
          Digite o código de segurança enviado no WhatsApp (6 dígitos):
        </p>
        <Input
          placeholder="Código de Segurança"
          value={securityCode}
          onChange={(e) => setSecurityCode(e.target.value)}
          maxLength={6}
          className="w-full text-center tracking-widest text-lg"
        />
      </div>

      <Button
        className="w-full mt-6 bg-[#6d4635] hover:bg-[#ac5b30] text-white"
        onClick={confirmPresence}
        disabled={loading}
      >
        {loading ? 'Verificando...' : 'Confirmar Presença'}
      </Button>
    </div>
  );
}