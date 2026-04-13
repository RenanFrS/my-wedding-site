import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, securityCode, members } = body;

    if (!token || !securityCode || !members) {
      return NextResponse.json(
        { error: 'Faltam campos obrigatórios' },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config });

    // Busca o RSVP pelo Token e Codigo de Segurança
    const { docs } = await payload.find({
      collection: 'rsvps',
      where: {
        token: { equals: token },
        securityCode: { equals: securityCode },
      },
    });

    if (docs.length === 0) {
      return NextResponse.json(
        { error: 'Código de segurança incorreto ou link inválido.' },
        { status: 400 }
      );
    }

    const rsvpGroup = docs[0];

    // Atualiza os status dos membros
    const updatedMembers = rsvpGroup.members?.map((m: any) => {
      const incomingMember = members.find((inc: any) => inc.id === m.id);
      if (incomingMember) {
        return {
          ...m,
          status: incomingMember.status,
        };
      }
      return m;
    });

    // Salva atualização no DB
    await payload.update({
      collection: 'rsvps',
      id: rsvpGroup.id,
      data: {
        members: updatedMembers,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('RSVP API Error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}