import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

// Busca pública (sem token) de grupos de convidados pelo nome de um membro.
// Retorna apenas o necessário para a confirmação — nunca expõe token/securityCode.
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = typeof body?.name === 'string' ? body.name.trim() : '';

    if (name.length < 3) {
      return NextResponse.json(
        { error: 'Digite seu nome completo (mínimo 3 caracteres).' },
        { status: 400 },
      );
    }

    const payload = await getPayload({ config });

    // `like` faz correspondência parcial e insensível a maiúsculas/acentos.
    const { docs } = await payload.find({
      collection: 'rsvps',
      where: { 'members.name': { like: name } },
      depth: 0,
      limit: 10,
    });

    // Mapeia explicitamente para não vazar token nem securityCode.
    // Mostra apenas membros ainda PENDENTES e grupos que ainda têm pendências:
    // quem já confirmou/recusou não volta a aparecer na busca.
    const groups = docs
      .map((group: any) => ({
        groupId: group.id,
        groupName: group.groupName,
        members: (group.members || [])
          .filter((m: any) => (m.status || 'pending') === 'pending')
          .map((m: any) => ({
            id: m.id,
            name: m.name,
            status: 'pending' as const,
          })),
      }))
      .filter((group) => group.members.length > 0);

    return NextResponse.json({ groups });
  } catch (error) {
    console.error('RSVP search error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
