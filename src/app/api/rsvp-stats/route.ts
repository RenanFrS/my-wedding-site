import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

// Retorna apenas dados agregados para o dashboard, sem expor token/securityCode.
// Acessível somente a administradores autenticados.
export async function GET(req: Request) {
  const payload = await getPayload({ config });

  const { user } = await payload.auth({ headers: req.headers });
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const { docs } = await payload.find({
    collection: 'rsvps',
    limit: 1000,
    depth: 0,
  });

  let totalMembers = 0;
  let confirmed = 0;
  let declined = 0;
  let pending = 0;
  let invitesSent = 0;
  let invitesNotSent = 0;

  for (const group of docs) {
    if (group.whatsapp?.status === 'sent') invitesSent++;
    else invitesNotSent++;

    for (const member of group.members || []) {
      totalMembers++;
      if (member.status === 'confirmed') confirmed++;
      else if (member.status === 'declined') declined++;
      else pending++;
    }
  }

  return NextResponse.json({
    totalGroups: docs.length,
    totalMembers,
    confirmed,
    declined,
    pending,
    invitesSent,
    invitesNotSent,
  });
}
