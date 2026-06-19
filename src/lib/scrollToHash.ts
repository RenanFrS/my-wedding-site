interface LenisLike {
  scrollTo: (
    target: string | HTMLElement,
    options?: { offset?: number; duration?: number },
  ) => void;
}

/**
 * Faz scroll suave até uma seção (#id). Usa o Lenis quando disponível (desktop);
 * cai no scroll nativo suave no fallback (mobile / prefers-reduced-motion, onde
 * o Lenis não é inicializado).
 *
 * O offset negativo compensa a altura do navbar fixo — o Lenis não respeita o
 * `scroll-margin-top` definido no CSS, então precisamos passá-lo explicitamente.
 */
export function scrollToHash(hash: string, offset = -96): void {
  const id = hash.replace(/^#/, "");
  const lenis = (window as Window & { lenis?: LenisLike }).lenis;
  if (lenis) {
    lenis.scrollTo(`#${id}`, { offset, duration: 1.2 });
    return;
  }
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}
