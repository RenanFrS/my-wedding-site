import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { gridPositions, type TableShape } from '@/lib/seating';

const SHAPES: TableShape[] = ['round', 'square', 'rectangle'];

// Recria a planta: apaga as mesas atuais, limpa a alocação de todos os grupos e
// cria `count` mesas novas em grade. Somente admin autenticado.
export async function POST(req: Request) {
  const payload = await getPayload({ config });

  const { user } = await payload.auth({ headers: req.headers });
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  let body: { shape?: string; count?: number; seats?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Corpo inválido.' }, { status: 400 });
  }

  const shape = (body.shape ?? 'round') as TableShape;
  const count = Math.floor(Number(body.count));
  const seats = Math.floor(Number(body.seats));

  if (!SHAPES.includes(shape)) {
    return NextResponse.json({ error: 'Formato inválido.' }, { status: 400 });
  }
  if (!Number.isFinite(count) || count < 1 || count > 100) {
    return NextResponse.json(
      { error: 'Quantidade de mesas deve ser entre 1 e 100.' },
      { status: 400 },
    );
  }
  if (!Number.isFinite(seats) || seats < 1 || seats > 30) {
    return NextResponse.json(
      { error: 'Lugares por mesa deve ser entre 1 e 30.' },
      { status: 400 },
    );
  }

  // Limpa a alocação dos grupos antes de remover as mesas (evita FK órfã).
  await payload.update({
    collection: 'rsvps',
    where: { assignedTable: { exists: true } },
    data: { assignedTable: null },
  });

  // Remove as mesas existentes.
  await payload.delete({
    collection: 'tables',
    where: { id: { exists: true } },
  });

  const positions = gridPositions(count);
  const created = [];
  for (let i = 0; i < count; i++) {
    const doc = await payload.create({
      collection: 'tables',
      data: {
        number: i + 1,
        shape,
        capacity: seats,
        posX: positions[i].x,
        posY: positions[i].y,
      },
    });
    created.push(doc);
  }

  return NextResponse.json({ tables: created });
}
