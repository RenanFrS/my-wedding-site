import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import {
  distributeGroups,
  type SeatGroup,
  type SeatTable,
  type TableShape,
} from '@/lib/seating';

// Distribui aleatoriamente (equilibrado) os grupos ainda sem mesa entre as mesas
// existentes, gravando `assignedTable`. Somente admin autenticado.
export async function POST(req: Request) {
  const payload = await getPayload({ config });

  const { user } = await payload.auth({ headers: req.headers });
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const [tablesRes, groupsRes] = await Promise.all([
    payload.find({ collection: 'tables', limit: 1000, depth: 0 }),
    payload.find({ collection: 'rsvps', limit: 1000, depth: 0 }),
  ]);

  if (tablesRes.docs.length === 0) {
    return NextResponse.json(
      { error: 'Não há mesas. Gere a planta primeiro.' },
      { status: 400 },
    );
  }

  const tables: SeatTable[] = tablesRes.docs.map((t) => ({
    id: t.id,
    number: t.number,
    capacity: t.capacity,
    shape: t.shape as TableShape,
    posX: t.posX ?? 50,
    posY: t.posY ?? 50,
  }));

  const groups: SeatGroup[] = groupsRes.docs.map((g) => ({
    id: g.id,
    groupName: g.groupName,
    members: (g.members ?? []).map((m: { name: string; status?: string | null }) => ({
      name: m.name,
      status: (m.status ?? 'pending') as SeatGroup['members'][number]['status'],
    })),
    // depth 0 → relationship vem como id (ou null)
    assignedTable: (g.assignedTable as number | null) ?? null,
  }));

  const assignments = distributeGroups(groups, tables);

  await Promise.all(
    assignments.map((a) =>
      payload.update({
        collection: 'rsvps',
        id: a.groupId,
        data: { assignedTable: a.tableId as number },
      }),
    ),
  );

  return NextResponse.json({ assigned: assignments.length });
}
