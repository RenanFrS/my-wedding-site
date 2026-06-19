'use client';

import React from 'react';
import Link from 'next/link';

// Link "Mesas" adicionado ao final da navegação do admin (afterNavLinks),
// levando à view customizada /admin/mesas.
export default function SeatingNavLink(): React.JSX.Element {
  return (
    <Link
      href="/admin/mesas"
      className="nav__link"
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
    >
      <svg width={18} height={18} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="4.6" r="1.5" fill="currentColor" />
        <circle cx="19.4" cy="12" r="1.5" fill="currentColor" />
        <circle cx="12" cy="19.4" r="1.5" fill="currentColor" />
        <circle cx="4.6" cy="12" r="1.5" fill="currentColor" />
      </svg>
      Mesas
    </Link>
  );
}
