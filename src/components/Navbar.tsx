'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import StaggeredMenu from '@/components/ui/StaggeredMenu';
import { useScrollSpy } from '@/components/hooks/useScrollSpy';

interface NavLink {
  id: string;
  label: string;
}

interface NavbarProps {
  coupleName: string;
  weddingDateText: string;
}

const sections: string[] = ['inicio', 'o-casal', 'cerimonia', 'confirmacao', 'presentes'];

export default function Navbar({ coupleName, weddingDateText }: NavbarProps): React.JSX.Element {
  const active: string | null = useScrollSpy(sections);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(true); // Começa visível

  useEffect(() => {
    const onScroll = (): void => {
      const scrollY: number = window.scrollY;
      setScrolled(scrollY > 8);

      // Mostrar navbar no topo (Hero) e depois do Timeline
      const timeline: HTMLElement | null = document.getElementById('timeline');

      if (timeline) {
        const rect: DOMRect = timeline.getBoundingClientRect();
        const heroHeight: number = window.innerHeight; // Altura aproximada do Hero

        // Visível no Hero (primeiros pixels) OU quando chegar no Timeline
        if (scrollY < 50) {
          // Início da página - navbar visível
          setVisible(true);
        } else if (scrollY < heroHeight - 100) {
          // Durante o Hero - navbar some gradualmente
          setVisible(false);
        } else if (rect.top <= 100) {
          // Quando chega no Timeline - navbar aparece
          setVisible(true);
        } else {
          // Entre Hero e Timeline - navbar escondido
          setVisible(false);
        }
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks: NavLink[] = [
    { id: 'inicio', label: 'Início' },
    { id: 'o-casal', label: 'O Casal' },
    { id: 'cerimonia', label: 'Cerimônia' },
    { id: 'confirmacao', label: 'Confirmação' },
    { id: 'presentes', label: 'Presentes' },
  ];

  return (
    <nav
      className={`fixed left-0 right-0 z-50 transition-all duration-700 ease-out ${
        visible ? 'top-0 opacity-100' : '-top-24 opacity-0'
      } ${
        scrolled
          ? 'bg-white/80 backdrop-blur border-b border-black/5'
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-6 h-16 md:h-20">
        {/* Left: Logo + Names + Date */}
        <div className="flex items-center gap-3 md:gap-4">
          <a href="#inicio" aria-label="Ir para o topo" className="block">
            <Image
              src="/logo/monograma.svg"
              alt={`Monograma ${coupleName}`}
              width={80}
              height={80}
              className="object-contain"
              sizes="(min-width: 768px) 56px, 48px"
              priority
            />
          </a>
          <div className="leading-tight flex flex-col items-end">
            <div className="font-amoresa text-lg md:text-2xl font-normal tracking-wide leading-none">
              {coupleName}
            </div>
            <div className="text-[10px] md:text-xs font-migra uppercase tracking-[0.2em] md:tracking-[0.25em]">
              {weddingDateText}
            </div>
          </div>
        </div>

        {/* Desktop links with moving underline */}
        <ul className="hidden md:flex items-end gap-8 font-sans uppercase text-sm">
          {navLinks.map((link: NavLink) => (
            <li key={link.id} className="relative pb-1">
              <a
                href={`#${link.id}`}
                className="hover:text-olive-dark transition-colors tracking-wide"
              >
                {link.label}
              </a>
              <span
                className={`absolute left-0 -bottom-0.5 h-[2px] bg-[#ac5b30] transition-all duration-300 ${
                  active === link.id ? 'w-full' : 'w-0'
                }`}
              />
            </li>
          ))}
        </ul>

        {/* Mobile menu: StaggeredMenu (Sheet-backed) */}
        <div className="md:hidden flex items-center justify-end flex-shrink-0">
          <StaggeredMenu
            className="inline-flex"
            position="right"
            items={[
              { label: 'Início', link: '#inicio', ariaLabel: 'Ir para Início' },
              { label: 'O Casal', link: '#o-casal', ariaLabel: 'Ir para O Casal' },
              { label: 'Cerimônia', link: '#cerimonia', ariaLabel: 'Ir para Cerimônia' },
              { label: 'Confirmação', link: '#confirmacao', ariaLabel: 'Ir para Confirmação' },
              { label: 'Presentes', link: '#presentes', ariaLabel: 'Ir para Presentes' },
            ]}
            menuButtonColor={scrolled ? '#6d4635' : '#ffffff'}
            openMenuButtonColor="#6d4635"
            changeMenuColorOnOpen
          />
        </div>
      </div>
    </nav>
  );
}
