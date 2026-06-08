import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

interface IncomingMember {
  id: string;
  status: 'pending' | 'confirmed' | 'declined';
}

// Atualização pública (sem token) do status de presença de um grupo.
// O convidado pesquisou o nome, encontrou o grupo e escolheu comparecer/recusar.
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { groupId, members } = body as {
      groupId?: number | string;
      members?: IncomingMember[];
    };

    if (groupId == null || !Array.isArray(members) || members.length === 0) {
      return NextResponse.json(
        { error: 'Dados incompletos para confirmação.' },
        { status: 400 },
      );
    }

    const validStatus = new Set(['pending', 'confirmed', 'declined']);
    const incomingById = new Map(
      members
        .filter((m) => m && m.id != null && validStatus.has(m.status))
        .map((m) => [String(m.id), m.status]),
    );

    if (incomingById.size === 0) {
      return NextResponse.json(
        { error: 'Nenhum status válido informado.' },
        { status: 400 },
      );
    }

    const payload = await getPayload({ config });

    const group = await payload.findByID({
      collection: 'rsvps',
      id: groupId,
      depth: 0,
    });

    if (!group) {
      return NextResponse.json(
        { error: 'Grupo não encontrado.' },
        { status: 404 },
      );
    }

    const updatedMembers = (group.members || []).map((m: any) => {
      const newStatus = incomingById.get(String(m.id));
      return newStatus ? { ...m, status: newStatus } : m;
    });

    await payload.update({
      collection: 'rsvps',
      id: groupId,
      data: { members: updatedMembers },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('RSVP update-status error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
