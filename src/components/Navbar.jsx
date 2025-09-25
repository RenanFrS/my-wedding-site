"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "./ui/sheet";
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
              src="/logo/monograma.png"
              alt="Monograma Renan e Heloisa"
              width={50}
              height={50}
              className="w-50 h-50 md:w-50 md:h-50 object-contain"
              sizes="(min-width: 768px) 56px, 48px"
              priority
            />
          </a>
          <div className="leading-tight">
            <div className="font-display text-2xl md:text-3xl font-normal tracking-tight leading-none">
              Renan & Heloisa
            </div>
            <div className="text-[10px] md:text-xs font-sans uppercase tracking-[0.15em] md:tracking-[0.25em]">
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

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              className="text-2xl px-3 py-2"
              aria-label="Abrir menu"
            >
              ☰
            </SheetTrigger>
            <SheetContent side="right" className="bg-white/90 backdrop-blur">
              <ul className="text font-sans uppercase text-center font-bold mt-10 space-y-4">
                {[
                  { id: "inicio", label: "Início" },
                  { id: "o-casal", label: "O Casal" },
                  { id: "cerimonia", label: "Cerimônia" },
                  { id: "confirmacao", label: "Confirmação" },
                  { id: "presentes", label: "Presentes" },
                ].map((link) => (
                  <li key={link.id}>
                    <SheetClose asChild>
                      <a href={`#${link.id}`} className="block px-3 py-2">
                        {link.label}
                      </a>
                    </SheetClose>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
