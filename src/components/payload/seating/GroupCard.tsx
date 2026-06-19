'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import styles from './seating.module.css';

interface GroupCardProps {
  id: number | string;
  groupName: string;
  seatCount: number;
  seatedTableNumber?: number | null;
}

// Versão visual do card (sem DnD) — reutilizada no DragOverlay.
export function GroupCardView({
  groupName,
  seatCount,
  seatedTableNumber,
  dragging,
}: Omit<GroupCardProps, 'id'> & { dragging?: boolean }): React.JSX.Element {
  const isSeated = seatedTableNumber != null;
  return (
    <div
      className={`${styles.groupCard} ${isSeated ? styles.groupCardSeated : ''} ${
        dragging ? styles.groupCardDragging : ''
      }`}
    >
      <span className={styles.badge}>{seatCount}</span>
      <span className={styles.groupName}>{groupName}</span>
      {isSeated && <span className={styles.seatTag}>Mesa {seatedTableNumber}</span>}
    </div>
  );
}

export default function GroupCard({
  id,
  groupName,
  seatCount,
  seatedTableNumber,
}: GroupCardProps): React.JSX.Element {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `group-${id}`,
    data: { type: 'group', groupId: id },
  });

  // NÃO aplicamos transform aqui: o card original fica parado (e esmaecido) como
  // placeholder; quem segue o ponteiro é o clone no DragOverlay (portal no body),
  // evitando que o sidebar (overflow:auto) gere scroll lateral e clipe o card.
  const style: React.CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <GroupCardView
        groupName={groupName}
        seatCount={seatCount}
        seatedTableNumber={seatedTableNumber}
      />
    </div>
  );
}
