'use client';

import React from 'react';

interface FooterProps {
  coupleName: string;
  groomFullName: string;
  brideFullName: string;
}

export default function Footer({
  coupleName,
  groomFullName,
  brideFullName,
}: FooterProps): React.JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 md:mt-[14vh] w-full border-t border-[var(--color-secondary)]/20 bg-[var(--color-background)]">
      <div className="hz-margin py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
          <div className="space-y-3">
            <h2 className="text-[1.9rem] md:text-[2.2rem] leading-none font-medium text-[var(--color-text-primary)]">
              {coupleName}
            </h2>
            <p className="text-[1.35rem] italic font-amoresa text-[var(--color-secondary)]">
              Com amor e Carinho
            </p>
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-text-primary)]/65">
              © {currentYear}: {coupleName}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-[1.1rem] italic text-[var(--color-secondary)]">Noivo</h3>
            <p className="text-sm uppercase tracking-[0.08em] text-[var(--color-text-primary)]/85">
              {groomFullName}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-[1.1rem] italic text-[var(--color-secondary)]">Noiva</h3>
            <p className="text-sm uppercase tracking-[0.08em] text-[var(--color-text-primary)]/85">
              {brideFullName}
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--color-secondary)]/20 pt-5 flex flex-col gap-2 text-xs md:flex-row md:items-center md:justify-between text-[var(--color-text-primary)]/75">
          <p>Todos os direitos reservados.</p>
          <p>
            Desenvolvido por:{' '}
            <a
              href="http://instagram.com/renanrocha.01/"
              className="font-semibold text-[var(--color-secondary)] hover:underline transition-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              Renan Rocha
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
