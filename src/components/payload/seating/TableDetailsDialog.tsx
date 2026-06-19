'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styles from './seating.module.css';
import { countSeats, type SeatGroup, type SeatTable } from '@/lib/seating';

interface TableDetailsDialogProps {
  table: SeatTable | null;
  groups: SeatGroup[];
  occupancy: number;
  onRemoveGroup: (groupId: number | string) => void;
  onClose: () => void;
}

export default function TableDetailsDialog({
  table,
  groups,
  occupancy,
  onRemoveGroup,
  onClose,
}: TableDetailsDialogProps): React.JSX.Element {
  const open = table !== null;

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.dialog} aria-describedby={undefined}>
          <Dialog.Close className={styles.closeBtn} aria-label="Fechar">
            ✕
          </Dialog.Close>
          {table && (
            <>
              <Dialog.Title className={styles.dialogTitle}>Mesa {table.number}</Dialog.Title>
              <p className={styles.dialogMeta}>
                {occupancy} de {table.capacity} lugares
                {occupancy > table.capacity ? ' — acima da capacidade' : ''}
              </p>

              {groups.length === 0 && (
                <p className={styles.empty}>Nenhum grupo nesta mesa ainda.</p>
              )}

              {groups.map((group) => (
                <div key={group.id} className={styles.dialogGroup}>
                  <div className={styles.dialogGroupHead}>
                    <span className={styles.dialogGroupName}>{group.groupName}</span>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => onRemoveGroup(group.id)}
                    >
                      Remover da mesa
                    </button>
                  </div>
                  {group.members.map((m, i) => (
                    <div
                      key={i}
                      className={`${styles.memberRow} ${
                        m.status === 'declined' ? styles.memberDeclined : ''
                      }`}
                    >
                      <span>{m.name}</span>
                      <span>
                        {m.status === 'confirmed'
                          ? 'Confirmado'
                          : m.status === 'declined'
                            ? 'Recusou'
                            : 'Pendente'}
                      </span>
                    </div>
                  ))}
                  <div className={styles.memberRow} style={{ opacity: 0.6, marginTop: 4 }}>
                    <span>Ocupa lugar</span>
                    <span>{countSeats(group)}</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
