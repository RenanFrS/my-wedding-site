"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import StaggeredMenu from "./ui/StaggeredMenu";
import { useScrollSpy } from "./hooks/useScrollSpy";

// Updated sections for scroll spy
const sections = ["inicio", "o-casal", "cerimonia", "confirmacao", "presentes"];

export default function Navbar() {
  const active = useScrollSpy(sections);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors ${
        scrolled
          ? "bg-white/80 backdrop-blur border-b border-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-6 h-16 md:h-20">
        {/* Left: Logo + Names + Date */}
        <div className="flex items-center gap-3 md:gap-4">
          <a href="#inicio" aria-label="Ir para o topo" className="block">
            <Image
              src="/logo/monograma.svg"
              alt="Monograma Renan e Heloisa"
              width={80}
              height={80}
              className="object-contain"
              sizes="(min-width: 768px) 56px, 48px"
              priority
            />
          </a>
          <div className="leading-tight flex flex-col items-end">
            <div className="font-amoresa text-lg md:text-2xl font-normal tracking-wide leading-none">
              Renan & Heloisa
            </div>
            <div className="text-[10px] md:text-xs font-sans uppercase tracking-[0.2em] md:tracking-[0.25em]">
              06 de Setembro de 2026
            </div>
          </div>
        </div>

        {/* Desktop links with moving underline */}
        <ul className="hidden md:flex items-end gap-8 font-sans uppercase text-sm">
          {[
            { id: "inicio", label: "Início" },
            { id: "o-casal", label: "O Casal" },
            { id: "cerimonia", label: "Cerimônia" },
            { id: "confirmacao", label: "Confirmação" },
            { id: "presentes", label: "Presentes" },
          ].map((link) => (
            <li key={link.id} className="relative pb-1">
              <a
                href={`#${link.id}`}
                className="hover:text-olive-dark transition-colors tracking-wide"
              >
                {link.label}
              </a>
              <span
                className={`absolute left-0 -bottom-0.5 h-[2px] bg-[#ac5b30] transition-all duration-300 ${
                  active === link.id ? "w-full" : "w-0"
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
              { label: "Início", link: "#inicio", ariaLabel: "Ir para Início" },
              { label: "O Casal", link: "#o-casal", ariaLabel: "Ir para O Casal" },
              { label: "Cerimônia", link: "#cerimonia", ariaLabel: "Ir para Cerimônia" },
              { label: "Confirmação", link: "#confirmacao", ariaLabel: "Ir para Confirmação" },
              { label: "Presentes", link: "#presentes", ariaLabel: "Ir para Presentes" },
            ]}
            menuButtonColor={scrolled ? "#6d4635" : "#ffffff"}
            openMenuButtonColor="#6d4635"
            changeMenuColorOnOpen
          />
        </div>
      </div>
    </nav>
  );
}
