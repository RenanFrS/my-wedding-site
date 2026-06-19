import React from 'react';

// Ícone do admin (nav lateral) — versão reduzida da marca. Registrado em
// admin.components.graphics.Icon.
export default function Icon(): React.JSX.Element {
  return (
    <img
      src="/logo/favicon.jpg"
      alt="Renan & Heloísa"
      style={{ height: 28, width: 28, objectFit: 'cover', borderRadius: 6 }}
    />
  );
}
