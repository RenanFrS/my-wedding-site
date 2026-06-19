import React from 'react';

// Logo do admin (tela de login) — substitui a logo padrão do Payload pelo
// favicon do casamento. Registrado em admin.components.graphics.Logo.
export default function Logo(): React.JSX.Element {
  return (
    <img
      src="/logo/favicon.jpg"
      alt="Renan & Heloísa"
      style={{ maxHeight: 80, width: 'auto', borderRadius: 8 }}
    />
  );
}
