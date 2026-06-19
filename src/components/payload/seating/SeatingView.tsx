import React from 'react';
import type { AdminViewServerProps } from 'payload';
import { DefaultTemplate } from '@payloadcms/next/templates';
import { Gutter } from '@payloadcms/ui';
import SeatingPlanner from './SeatingPlanner';
import type { SeatGroup, SeatTable, MemberStatus, TableShape } from '@/lib/seating';

// View customizada do admin em /admin/mesas. Busca os dados no servidor (Local API,
// autenticada) e entrega ao planner interativo, mantendo a navegação do admin.
export default async function SeatingView({
  initPageResult,
  params,
  searchParams,
}: AdminViewServerProps): Promise<React.JSX.Element> {
  const { req, permissions, visibleEntities, locale } = initPageResult;
  const { payload } = req;

  const [tablesRes, groupsRes] = await Promise.all([
    payload.find({ collection: 'tables', limit: 1000, depth: 0, req }),
    payload.find({ collection: 'rsvps', limit: 1000, depth: 0, req }),
  ]);

  const initialTables: SeatTable[] = tablesRes.docs
    .map((t) => ({
      id: t.id,
      number: t.number,
      capacity: t.capacity,
      shape: t.shape as TableShape,
      posX: t.posX ?? 50,
      posY: t.posY ?? 50,
    }))
    .sort((a, b) => a.number - b.number);

  const initialGroups: SeatGroup[] = groupsRes.docs.map((g) => ({
    id: g.id,
    groupName: g.groupName,
    members: (g.members ?? []).map((m) => ({
      name: m.name,
      status: (m.status ?? 'pending') as MemberStatus,
    })),
    assignedTable:
      g.assignedTable && typeof g.assignedTable === 'object'
        ? g.assignedTable.id
        : ((g.assignedTable as number | null | undefined) ?? null),
  }));

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={payload}
      permissions={permissions}
      req={req}
      searchParams={searchParams}
      user={req.user ?? undefined}
      visibleEntities={visibleEntities}
    >
      <Gutter>
        <SeatingPlanner initialTables={initialTables} initialGroups={initialGroups} />
      </Gutter>
    </DefaultTemplate>
  );
}
