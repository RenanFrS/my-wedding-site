// Lógica de lugares compartilhada entre o cliente (preview da planta) e o servidor
// (rota de distribuição). Mantida pura/isomórfica — sem dependências de React/Payload.

export type TableShape = 'round' | 'square' | 'rectangle';

export type MemberStatus = 'pending' | 'confirmed' | 'declined';

export interface SeatMember {
  id?: string;
  name: string;
  role?: 'titular' | 'agregado';
  status?: MemberStatus | null;
}

export interface SeatGroup {
  id: number | string;
  groupName: string;
  members: SeatMember[];
  /** id da mesa em que o grupo está alocado, ou null. */
  assignedTable: number | string | null;
}

export interface SeatTable {
  id: number | string;
  number: number;
  capacity: number;
  shape: TableShape;
  posX: number;
  posY: number;
}

export interface Assignment {
  groupId: number | string;
  tableId: number | string;
}

/**
 * Quantas pessoas do grupo ocupam lugar: confirmados + pendentes (todos que não
 * recusaram). Membros sem status são tratados como pendentes.
 */
export function countSeats(group: Pick<SeatGroup, 'members'>): number {
  return (group.members ?? []).filter((m) => m.status !== 'declined').length;
}

/** Soma os lugares ocupados por uma lista de grupos. */
export function sumSeats(groups: Array<Pick<SeatGroup, 'members'>>): number {
  return groups.reduce((acc, g) => acc + countSeats(g), 0);
}

/**
 * Posições %{x,y} para o auto-layout inicial das mesas numa grade quase quadrada,
 * com margem para as mesas não encostarem nas bordas do canvas.
 */
export function gridPositions(count: number): Array<{ x: number; y: number }> {
  if (count <= 0) return [];
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  const margin = 12; // % de inset
  const span = 100 - margin * 2;
  const positions: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    // centro de cada célula, mapeado para [margin, 100 - margin]
    const x = cols === 1 ? 50 : margin + (col / (cols - 1)) * span;
    const y = rows === 1 ? 50 : margin + (row / (rows - 1)) * span;
    positions.push({ x: round1(x), y: round1(y) });
  }
  return positions;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Fisher-Yates — embaralha uma cópia do array. */
function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Distribui os grupos AINDA sem mesa entre as mesas, equilibrando a ocupação para
 * evitar mesas vazias ou lotadas. Embaralha os grupos e, para cada um, escolhe a
 * mesa menos ocupada que ainda comporta o grupo; se nenhuma comporta, a menos
 * ocupada no geral (overflow permitido). Os grupos já alocados são respeitados.
 *
 * Retorna apenas as novas alocações (grupos que estavam sem mesa).
 */
export function distributeGroups(
  groups: SeatGroup[],
  tables: SeatTable[],
): Assignment[] {
  if (tables.length === 0) return [];

  // Ocupação inicial = lugares já tomados por grupos alocados.
  const occupancy = new Map<number | string, number>();
  for (const t of tables) occupancy.set(t.id, 0);
  for (const g of groups) {
    if (g.assignedTable != null && occupancy.has(g.assignedTable)) {
      occupancy.set(
        g.assignedTable,
        (occupancy.get(g.assignedTable) ?? 0) + countSeats(g),
      );
    }
  }

  const unseated = shuffled(
    groups.filter((g) => g.assignedTable == null && countSeats(g) > 0),
  );

  const assignments: Assignment[] = [];
  for (const group of unseated) {
    const size = countSeats(group);

    // Mesas que ainda comportam o grupo, ordenadas pela menor ocupação.
    const fitting = tables
      .filter((t) => (occupancy.get(t.id) ?? 0) + size <= t.capacity)
      .sort((a, b) => (occupancy.get(a.id) ?? 0) - (occupancy.get(b.id) ?? 0));

    const target =
      fitting[0] ??
      // Nenhuma comporta: a menos ocupada no geral (overflow sinalizado na UI).
      [...tables].sort(
        (a, b) => (occupancy.get(a.id) ?? 0) - (occupancy.get(b.id) ?? 0),
      )[0];

    occupancy.set(target.id, (occupancy.get(target.id) ?? 0) + size);
    assignments.push({ groupId: group.id, tableId: target.id });
  }

  return assignments;
}
