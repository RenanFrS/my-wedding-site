'use client';

import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import styles from './seating.module.css';
import type { TableShape as Shape } from '@/lib/seating';

const TERRA = '#ac5b30';
const BROWN = '#6d4635';
const CREAM = '#fefaf6';
const DANGER = '#c0392b';
const LINE = 'rgba(109,70,53,0.28)';

interface Geometry {
  w: number;
  h: number;
  /** retângulo/círculo do tampo */
  rect: { x: number; y: number; w: number; h: number };
  seatGap: number;
}

function geometryFor(shape: Shape): Geometry {
  if (shape === 'rectangle') {
    return { w: 168, h: 108, rect: { x: 20, y: 30, w: 128, h: 48 }, seatGap: 12 };
  }
  // round e square partilham a mesma caixa
  return { w: 124, h: 124, rect: { x: 24, y: 24, w: 76, h: 76 }, seatGap: 13 };
}

/** Pontos {x,y} (coords do SVG) onde sentam os lugares, ao redor do tampo. */
function seatPoints(shape: Shape, capacity: number, g: Geometry): Array<{ x: number; y: number }> {
  const cx = g.w / 2;
  const cy = g.h / 2;
  const pts: Array<{ x: number; y: number }> = [];

  if (shape === 'round') {
    const r = g.rect.w / 2 + g.seatGap;
    for (let i = 0; i < capacity; i++) {
      const ang = -Math.PI / 2 + (i * 2 * Math.PI) / capacity;
      pts.push({ x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) });
    }
    return pts;
  }

  // square / rectangle: caminha pelo perímetro do tampo, empurrando para fora.
  const { x, y, w, h } = g.rect;
  const gap = g.seatGap;
  const perim = 2 * (w + h);
  for (let i = 0; i < capacity; i++) {
    const d = ((i + 0.5) / capacity) * perim;
    if (d < w) {
      pts.push({ x: x + d, y: y - gap }); // topo
    } else if (d < w + h) {
      pts.push({ x: x + w + gap, y: y + (d - w) }); // direita
    } else if (d < 2 * w + h) {
      pts.push({ x: x + w - (d - w - h), y: y + h + gap }); // base
    } else {
      pts.push({ x: x - gap, y: y + h - (d - 2 * w - h) }); // esquerda
    }
  }
  return pts;
}

interface TableShapeProps {
  table: { id: number | string; number: number; capacity: number; shape: Shape; posX: number; posY: number };
  occupancy: number;
  locked?: boolean;
  onOpen: () => void;
}

export default function TableShape({
  table,
  occupancy,
  locked = false,
  onOpen,
}: TableShapeProps): React.JSX.Element {
  // Quando travada (grupo arrastado não cabe), o droppable é desabilitado para
  // não aceitar o drop.
  const drop = useDroppable({
    id: `table-${table.id}`,
    data: { type: 'table', tableId: table.id },
    disabled: locked,
  });
  const drag = useDraggable({ id: `tabledrag-${table.id}`, data: { type: 'table', tableId: table.id } });

  const setRef = (node: HTMLButtonElement | null): void => {
    drop.setNodeRef(node);
    drag.setNodeRef(node);
  };

  const g = geometryFor(table.shape);
  const pts = seatPoints(table.shape, table.capacity, g);
  const isOverflow = occupancy > table.capacity;
  const ringColor = isOverflow ? DANGER : TERRA;
  const headColor = isOverflow ? DANGER : TERRA;
  const filled = Math.min(occupancy, table.capacity);
  const cx = g.w / 2;
  const cy = g.h / 2;

  // Move via transform do dnd-kit por cima do translate de centragem.
  const dragTransform = CSS.Translate.toString(drag.transform);
  const style: React.CSSProperties = {
    left: `${table.posX}%`,
    top: `${table.posY}%`,
    transform: `translate(-50%, -50%)${dragTransform ? ` ${dragTransform}` : ''}`,
    zIndex: drag.isDragging ? 20 : undefined,
  };

  return (
    <button
      ref={setRef}
      type="button"
      className={`${styles.table} ${drop.isOver ? styles.tableOver : ''} ${
        locked ? styles.tableLocked : ''
      }`}
      style={style}
      onClick={onOpen}
      aria-label={`Mesa ${table.number}: ${occupancy} de ${table.capacity} lugares${
        locked ? ' (sem espaço para o grupo)' : ''
      }`}
      {...drag.listeners}
      {...drag.attributes}
    >
      {locked && (
        <span className={styles.lockBadge} aria-hidden="true">
          <svg width={14} height={14} viewBox="0 0 24 24">
            <rect x={5} y={11} width={14} height={9} rx={2} fill="currentColor" />
            <path
              d="M8 11V8a4 4 0 0 1 8 0v3"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            />
          </svg>
        </span>
      )}
      <svg width={g.w} height={g.h} viewBox={`0 0 ${g.w} ${g.h}`}>
        {/* tampo */}
        {table.shape === 'round' ? (
          <circle cx={cx} cy={cy} r={g.rect.w / 2} fill={CREAM} stroke={ringColor} strokeWidth={2.5} />
        ) : (
          <rect
            x={g.rect.x}
            y={g.rect.y}
            width={g.rect.w}
            height={g.rect.h}
            rx={10}
            fill={CREAM}
            stroke={ringColor}
            strokeWidth={2.5}
          />
        )}

        {/* cabecinhas (lugares) */}
        {pts.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={6.5}
            fill={i < filled ? headColor : 'transparent'}
            stroke={i < filled ? headColor : LINE}
            strokeWidth={1.5}
          />
        ))}

        {/* contagem central */}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fontSize={9}
          fill={BROWN}
          opacity={0.7}
          style={{ letterSpacing: '0.06em' }}
        >
          MESA {table.number}
        </text>
        <text
          x={cx}
          y={cy + 13}
          textAnchor="middle"
          fontSize={20}
          fill={isOverflow ? DANGER : BROWN}
          style={{ fontFamily: 'MigraSeating, serif' }}
        >
          {occupancy}/{table.capacity}
        </text>
      </svg>
    </button>
  );
}
