'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import styles from './seating.module.css';
import GroupCard, { GroupCardView } from './GroupCard';
import TableShape from './TableShape';
import TableDetailsDialog from './TableDetailsDialog';
import {
  countSeats,
  type SeatGroup,
  type SeatTable,
  type TableShape as Shape,
} from '@/lib/seating';

interface SeatingPlannerProps {
  initialTables: SeatTable[];
  initialGroups: SeatGroup[];
}

const SHAPE_OPTIONS: Array<{ value: Shape; label: string }> = [
  { value: 'round', label: 'Redonda' },
  { value: 'square', label: 'Quadrada' },
  { value: 'rectangle', label: 'Retangular' },
];

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

// Converte os docs do REST do Payload para os tipos do seating.
function mapTables(docs: any[]): SeatTable[] {
  return docs
    .map((t) => ({
      id: t.id,
      number: t.number,
      capacity: t.capacity,
      shape: t.shape as Shape,
      posX: t.posX ?? 50,
      posY: t.posY ?? 50,
    }))
    .sort((a, b) => a.number - b.number);
}

function mapGroups(docs: any[]): SeatGroup[] {
  return docs.map((g) => ({
    id: g.id,
    groupName: g.groupName,
    members: (g.members ?? []).map((m: any) => ({
      name: m.name,
      status: m.status ?? 'pending',
    })),
    assignedTable:
      g.assignedTable && typeof g.assignedTable === 'object'
        ? g.assignedTable.id
        : (g.assignedTable ?? null),
  }));
}

export default function SeatingPlanner({
  initialTables,
  initialGroups,
}: SeatingPlannerProps): React.JSX.Element {
  const [tables, setTables] = useState<SeatTable[]>(initialTables);
  const [groups, setGroups] = useState<SeatGroup[]>(initialGroups);
  const [openTableId, setOpenTableId] = useState<number | string | null>(null);
  const [showSetup, setShowSetup] = useState<boolean>(initialTables.length === 0);
  const [busy, setBusy] = useState<boolean>(false);
  // Grupo sendo arrastado — renderizado no DragOverlay (flutua acima de tudo).
  const [activeGroup, setActiveGroup] = useState<SeatGroup | null>(null);

  const [count, setCount] = useState<number>(10);
  const [seats, setSeats] = useState<number>(10);
  const [shape, setShape] = useState<Shape>('round');

  const canvasRef = useRef<HTMLDivElement | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  // Agrupa por mesa e calcula a ocupação (confirmados + pendentes).
  const { groupsByTable, occupancyByTable } = useMemo(() => {
    const byTable: Record<string, SeatGroup[]> = {};
    const occ: Record<string, number> = {};
    for (const t of tables) {
      byTable[String(t.id)] = [];
      occ[String(t.id)] = 0;
    }
    for (const g of groups) {
      if (g.assignedTable != null && byTable[String(g.assignedTable)]) {
        byTable[String(g.assignedTable)].push(g);
        occ[String(g.assignedTable)] += countSeats(g);
      }
    }
    return { groupsByTable: byTable, occupancyByTable: occ };
  }, [tables, groups]);

  const tableNumberById = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of tables) map[String(t.id)] = t.number;
    return map;
  }, [tables]);

  const sortedGroups = useMemo(
    () =>
      [...groups].sort((a, b) => {
        const aSeated = a.assignedTable != null ? 1 : 0;
        const bSeated = b.assignedTable != null ? 1 : 0;
        if (aSeated !== bSeated) return aSeated - bSeated; // sem mesa primeiro
        return a.groupName.localeCompare(b.groupName);
      }),
    [groups],
  );

  const unseatedCount = useMemo(
    () => groups.filter((g) => g.assignedTable == null).length,
    [groups],
  );

  // ---------- Persistência ----------
  const reload = useCallback(async () => {
    const [tRes, gRes] = await Promise.all([
      fetch('/api/tables?limit=1000&depth=0', { credentials: 'same-origin' }),
      fetch('/api/rsvps?limit=1000&depth=0', { credentials: 'same-origin' }),
    ]);
    const tJson = await tRes.json();
    const gJson = await gRes.json();
    setTables(mapTables(tJson.docs ?? []));
    setGroups(mapGroups(gJson.docs ?? []));
  }, []);

  const assignGroup = useCallback(
    async (groupId: number | string, tableId: number | string | null) => {
      const prev = groups;
      setGroups((gs) =>
        gs.map((g) => (g.id === groupId ? { ...g, assignedTable: tableId } : g)),
      );
      try {
        const res = await fetch(`/api/rsvps/${groupId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ assignedTable: tableId }),
        });
        if (!res.ok) throw new Error('patch falhou');
      } catch {
        setGroups(prev); // reverte
        window.alert('Não foi possível salvar a alocação. Tente novamente.');
      }
    },
    [groups],
  );

  const moveTable = useCallback(
    async (tableId: number | string, dxPx: number, dyPx: number) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const target = tables.find((t) => t.id === tableId);
      if (!target) return;
      const newX = clamp(target.posX + (dxPx / rect.width) * 100, 3, 97);
      const newY = clamp(target.posY + (dyPx / rect.height) * 100, 4, 96);

      const prev = tables;
      setTables((ts) =>
        ts.map((t) => (t.id === tableId ? { ...t, posX: newX, posY: newY } : t)),
      );
      try {
        const res = await fetch(`/api/tables/${tableId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ posX: newX, posY: newY }),
        });
        if (!res.ok) throw new Error('patch falhou');
      } catch {
        setTables(prev);
      }
    },
    [tables],
  );

  // ---------- DnD ----------
  const onDragStart = useCallback(
    (event: DragStartEvent) => {
      const data = event.active.data.current;
      if (data?.type === 'group') {
        setActiveGroup(groups.find((g) => g.id === data.groupId) ?? null);
      }
    },
    [groups],
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveGroup(null);
      const { active, over, delta } = event;
      const data = active.data.current;
      if (!data) return;
      if (data.type === 'group') {
        if (over && over.data.current?.type === 'table') {
          assignGroup(data.groupId, over.data.current.tableId);
        }
      } else if (data.type === 'table') {
        moveTable(data.tableId, delta.x, delta.y);
      }
    },
    [assignGroup, moveTable],
  );

  // ---------- Ações ----------
  const generate = useCallback(async () => {
    if (tables.length > 0) {
      const ok = window.confirm(
        'Isso vai recriar todas as mesas e desfazer as alocações atuais. Continuar?',
      );
      if (!ok) return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/seating/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ shape, count, seats }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Falha ao gerar a planta.');
      }
      await reload();
      setShowSetup(false);
    } catch (e) {
      window.alert((e as Error).message);
    } finally {
      setBusy(false);
    }
  }, [tables.length, shape, count, seats, reload]);

  const distribute = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/seating/distribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Falha ao distribuir.');
      }
      await reload();
    } catch (e) {
      window.alert((e as Error).message);
    } finally {
      setBusy(false);
    }
  }, [reload]);

  const openTable = openTableId != null ? tables.find((t) => t.id === openTableId) ?? null : null;

  // ---------- Render: setup ----------
  if (showSetup) {
    return (
      <div className={styles.wrap}>
        <div className={styles.setup}>
          <h1 className={styles.title}>Mesas</h1>
          <p className={styles.subtitle}>
            Defina a planta do salão. Depois é só arrastar os grupos para as mesas.
          </p>
          <div className={styles.setupRows}>
            <label className={styles.field}>
              Quantas mesas
              <input
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              />
            </label>
            <label className={styles.field}>
              Lugares por mesa
              <input
                type="number"
                min={1}
                max={30}
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
              />
            </label>
            <div className={styles.field}>
              Formato
              <div className={styles.shapePicker}>
                {SHAPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    title={opt.label}
                    aria-label={opt.label}
                    aria-pressed={shape === opt.value}
                    className={`${styles.shapeOption} ${
                      shape === opt.value ? styles.shapeOptionActive : ''
                    }`}
                    onClick={() => setShape(opt.value)}
                  >
                    <ShapeIcon shape={opt.value} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.actions} style={{ justifyContent: 'center' }}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={generate}
              disabled={busy}
            >
              {busy ? 'Gerando…' : 'Gerar planta'}
            </button>
            {tables.length > 0 && (
              <button
                type="button"
                className={styles.btn}
                onClick={() => setShowSetup(false)}
                disabled={busy}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------- Render: planta ----------
  return (
    <div className={styles.wrap}>
      <div className={styles.topbar}>
        <div>
          <h1 className={styles.title}>Mesas</h1>
          <p className={styles.subtitle}>
            {tables.length} mesas · {unseatedCount} grupo(s) sem mesa
          </p>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={distribute}
            disabled={busy}
          >
            {busy ? 'Distribuindo…' : 'Distribuir aleatório'}
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={() => setShowSetup(true)}
            disabled={busy}
          >
            Reconfigurar planta
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveGroup(null)}
      >
        <div className={styles.board}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>Grupos do RSVP</div>
            <div className={styles.groupList}>
              {sortedGroups.length === 0 && (
                <p className={styles.empty}>Nenhum grupo cadastrado.</p>
              )}
              {sortedGroups.map((g) => (
                <GroupCard
                  key={g.id}
                  id={g.id}
                  groupName={g.groupName}
                  seatCount={countSeats(g)}
                  seatedTableNumber={
                    g.assignedTable != null ? tableNumberById[String(g.assignedTable)] : null
                  }
                />
              ))}
            </div>
          </aside>

          <div className={styles.canvasWrap}>
            <div className={styles.canvas} ref={canvasRef}>
              {tables.map((t) => {
                const occ = occupancyByTable[String(t.id)] ?? 0;
                // Trava se um grupo está sendo arrastado e não cabe — exceto na
                // mesa onde ele já está (re-soltar é no-op permitido).
                const locked =
                  activeGroup != null &&
                  activeGroup.assignedTable !== t.id &&
                  occ + countSeats(activeGroup) > t.capacity;
                return (
                  <TableShape
                    key={t.id}
                    table={t}
                    occupancy={occ}
                    locked={locked}
                    onOpen={() => setOpenTableId(t.id)}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeGroup ? (
            <GroupCardView
              groupName={activeGroup.groupName}
              seatCount={countSeats(activeGroup)}
              dragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <TableDetailsDialog
        table={openTable}
        groups={openTable ? groupsByTable[String(openTable.id)] ?? [] : []}
        occupancy={openTable ? occupancyByTable[String(openTable.id)] ?? 0 : 0}
        onRemoveGroup={(groupId) => assignGroup(groupId, null)}
        onClose={() => setOpenTableId(null)}
      />
    </div>
  );
}

function ShapeIcon({ shape }: { shape: Shape }): React.JSX.Element {
  const stroke = '#ac5b30';
  if (shape === 'round') {
    return (
      <svg width={34} height={34} viewBox="0 0 34 34">
        <circle cx={17} cy={17} r={12} fill="none" stroke={stroke} strokeWidth={2} />
      </svg>
    );
  }
  if (shape === 'square') {
    return (
      <svg width={34} height={34} viewBox="0 0 34 34">
        <rect x={6} y={6} width={22} height={22} rx={3} fill="none" stroke={stroke} strokeWidth={2} />
      </svg>
    );
  }
  return (
    <svg width={34} height={34} viewBox="0 0 34 34">
      <rect x={4} y={11} width={26} height={12} rx={3} fill="none" stroke={stroke} strokeWidth={2} />
    </svg>
  );
}
