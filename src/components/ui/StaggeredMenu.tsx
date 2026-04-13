import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface MenuItem {
  label: string;
  link: string;
  ariaLabel?: string;
}

interface SocialItem {
  label: string;
  link: string;
}

export interface StaggeredMenuProps {
  position?: "left" | "right";
  items?: MenuItem[];
  socialItems?: SocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  logoUrl?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  changeMenuColorOnOpen?: boolean;
  colors?: string[];
  accentColor?: string;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  mobileOnly?: boolean;
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  position = "right",
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className = "",
  logoUrl = "/logo/monograma.svg",
  menuButtonColor = "#ffffff",
  openMenuButtonColor = "#6d4635",
  changeMenuColorOnOpen = true,
  colors = ["#ac5b30", "#f5e9e2", "#fefaf6"],
  accentColor = "#ac5b30",
  onMenuOpen,
  onMenuClose,
  mobileOnly = true,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const panelRef = useRef<HTMLElement | null>(null);
  const preLayersRef = useRef<HTMLDivElement | null>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);

  const plusHRef = useRef<HTMLSpanElement | null>(null);
  const plusVRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);

  const textInnerRef = useRef<HTMLSpanElement | null>(null);
  const [textLines, setTextLines] = useState<string[]>(["Menu", "Close"]);

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const spinTweenRef = useRef<gsap.core.Timeline | null>(null);
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);

  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const busyRef = useRef<boolean>(false);

  // Set initial positions when the content is mounted (open=true)
  useLayoutEffect(() => {
    if (!open) return;
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;
      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      let preLayers: HTMLElement[] = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll<HTMLElement>(".sm-prelayer"));
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === "left" ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen });
      gsap.set(plusH, { transformOrigin: "50% 50%", rotate: 0 });
      gsap.set(plusV, { transformOrigin: "50% 50%", rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });
      gsap.set(textInner, { yPercent: 0 });
      if (toggleBtnRef.current)
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [open, menuButtonColor, position]);

  const buildOpenTimeline = useCallback((): gsap.core.Timeline | null => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }

    const itemEls = Array.from(
      panel.querySelectorAll<HTMLElement>(".sm-panel-itemLabel")
    );
    const numberEls = Array.from(
      panel.querySelectorAll<HTMLElement>(
        ".sm-panel-list[data-numbering] .sm-panel-item"
      )
    );
    const socialTitle =
      panel.querySelector<HTMLElement>(".sm-socials-title");
    const socialLinks = Array.from(
      panel.querySelectorAll<HTMLElement>(".sm-socials-link")
    );

    const layerStates = layers.map((el) => ({
      el,
      start: Number(gsap.getProperty(el, "xPercent")),
    }));
    const panelStart = Number(gsap.getProperty(panel, "xPercent"));

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { ["--sm-num-opacity"]: 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(
        ls.el,
        { xPercent: ls.start },
        { xPercent: 0, duration: 0.5, ease: "power4.out" },
        i * 0.07
      );
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: "power4.out" },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;

      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: "power4.out",
          stagger: { each: 0.1, from: "start" },
        },
        itemsStart
      );

      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: "power2.out",
            ["--sm-num-opacity"]: 1,
            stagger: { each: 0.08, from: "start" },
          },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;

      if (socialTitle)
        tl.to(
          socialTitle,
          { opacity: 1, duration: 0.5, ease: "power2.out" },
          socialsStart
        );
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: { each: 0.08, from: "start" },
            onComplete: () => { gsap.set(socialLinks, { clearProps: "opacity" }); },
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, []);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback("onComplete", () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback((): Promise<void> => {
    openTlRef.current?.kill();
    openTlRef.current = null;

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return Promise.resolve();

    const all = [...layers, panel];
    closeTweenRef.current?.kill();

    const offscreen = position === "left" ? -100 : 100;

    return new Promise<void>((resolve) => {
      closeTweenRef.current = gsap.to(all, {
        xPercent: offscreen,
        duration: 0.32,
        ease: "power3.in",
        overwrite: "auto",
        onComplete: () => {
          busyRef.current = false;
          resolve();
        },
      });
    });
  }, [position]);

  const animateIcon = useCallback((opening: boolean): void => {
    const icon = iconRef.current;
    const h = plusHRef.current;
    const v = plusVRef.current;
    if (!icon || !h || !v) return;
    spinTweenRef.current?.kill();
    if (opening) {
      gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .to(h, { rotate: 45, duration: 0.5 }, 0)
        .to(v, { rotate: -45, duration: 0.5 }, 0);
    } else {
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: "power3.inOut" } })
        .to(h, { rotate: 0, duration: 0.35 }, 0)
        .to(v, { rotate: 90, duration: 0.35 }, 0)
        .to(icon, { rotate: 0, duration: 0.001 }, 0);
    }
  }, []);

  const animateColor = useCallback(
    (opening: boolean): void => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, {
          color: targetColor,
          delay: 0.18,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  const animateText = useCallback((opening: boolean): void => {
    const inner = textInnerRef.current;
    if (!inner) return;
    textCycleAnimRef.current?.kill();
    const currentLabel = opening ? "Menu" : "Close";
    const targetLabel = opening ? "Close" : "Menu";
    const cycles = 3;
    const seq = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === "Menu" ? "Close" : "Menu";
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);
    setTextLines(seq);
    gsap.set(inner, { yPercent: 0 });
    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;
    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: "power4.out",
    });
  }, []);

  // Open: trigger GSAP timeline once content is mounted
  useEffect(() => {
    if (open) {
      onMenuOpen?.();
      // Allow DOM to paint
      const id = requestAnimationFrame(() => playOpen());
      return () => cancelAnimationFrame(id);
    }
  }, [open, playOpen]);

  const onTriggerClick = useCallback(() => {
    animateIcon(true);
    animateColor(true);
    animateText(true);
  }, [animateColor, animateIcon, animateText]);

  const closeWithAnimation = useCallback(async () => {
    animateIcon(false);
    animateColor(false);
    animateText(false);
    await playClose();
    setOpen(false);
    onMenuClose?.();
  }, [animateColor, animateIcon, animateText, playClose]);

  return (
    <div
      className={
        (className ? className + " " : "") + (mobileOnly ? "md:hidden " : "") +
        "sm-scope relative"
      }
      style={{ ["--sm-accent" as string]: accentColor } as React.CSSProperties}
    >
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetPrimitive.Trigger asChild>
          <button
            ref={toggleBtnRef}
            className="relative inline-flex items-center gap-2 bg-transparent border-0 cursor-pointer font-medium leading-none p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={onTriggerClick}
            type="button"
          >
            <span className="relative inline-block h-[1em] overflow-hidden whitespace-nowrap">
              <span ref={textInnerRef} className="flex flex-col leading-none">
                {textLines.map((l, i) => (
                  <span className="block h-[1em] leading-none" key={i}>
                    {l}
                  </span>
                ))}
              </span>
            </span>
            <span
              ref={iconRef}
              className="relative w-[14px] h-[14px] shrink-0 inline-flex items-center justify-center"
              aria-hidden="true"
            >
              <span
                ref={plusHRef}
                className="absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2"
              />
              <span
                ref={plusVRef}
                className="absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2"
              />
            </span>
          </button>
        </SheetPrimitive.Trigger>

        <SheetContent
          side={position === "left" ? "left" : "right"}
          // Cancel default slide of SheetContent to avoid double animation; background transparent
          className="transform-none bg-transparent shadow-none p-0 w-full max-w-none"
          onInteractOutside={(e) => e.preventDefault()}
        >
          {/* Prelayers (animated color sheets) */}
          <div
            ref={preLayersRef}
            className={`fixed top-0 ${position === "left" ? "left-0" : "right-0"} bottom-0 w-full pointer-events-none z-[80]`}
            aria-hidden="true"
          >
            {(colors && colors.length ? colors.slice(0, 4) : ["#1e1e22", "#35353c"]).map((c, i) => (
              <div
                key={i}
                className={`sm-prelayer absolute top-0 ${position === "left" ? "left-0" : "right-0"} h-full w-full`}
                style={{ background: c }}
              />
            ))}
          </div>

          {/* Panel content */}
          <aside
            ref={panelRef}
            className={`fixed top-0 ${position === "left" ? "left-0" : "right-0"} h-screen w-full bg-[#fefaf6] text-[#6d4635] flex flex-col p-6 overflow-y-auto z-[90]`}
            style={{ WebkitBackdropFilter: "blur(12px)" }}
          >
            <header className="flex items-center justify-between">
              <div className="flex items-center select-none" aria-label="Logo">
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="block h-8 w-auto object-contain"
                  draggable={false}
                />
              </div>
              <button
                aria-label="Fechar menu"
                className="rounded-md p-2 text-[#6d4635]"
                onClick={closeWithAnimation}
              >
                ✕
              </button>
            </header>

            <nav className="mt-6 flex flex-col gap-4 text-lg font-sans uppercase tracking-wide">
              {(items && items.length ? items : []).map((it, idx) => (
                <a
                  key={String(it.label ?? idx)}
                  href={it.link}
                  aria-label={it.ariaLabel || it.label}
                  className="py-2 sm-panel-item relative pr-10"
                  onClick={closeWithAnimation}
                  data-index={idx + 1}
                >
                  <span className="sm-panel-itemLabel inline-block">
                    {it.label}
                  </span>
                </a>
              ))}
            </nav>

            {displaySocials && socialItems && socialItems.length > 0 && (
              <div className="mt-auto pt-8 flex flex-col gap-3" aria-label="Social links">
                <h3 className="m-0 text-base font-medium" style={{ color: "var(--sm-accent)" }}>
                  Socials
                </h3>
                <ul className="list-none m-0 p-0 flex flex-row items-center gap-4 flex-wrap" role="list">
                  {socialItems.map((s, i) => (
                    <li key={s.label + i}>
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[1.2rem] font-medium text-[#6d4635] no-underline relative inline-block py-[2px] transition-[color,opacity] duration-300 ease-linear"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </SheetContent>
      </Sheet>

      {/* Minimal styles to support numbering and accent color */}
      <style>{`
.sm-scope .sm-panel-item { position: relative; text-decoration: none; color: #6d4635; }
.sm-scope .sm-panel-itemLabel { display: inline-block; will-change: transform; transform-origin: 50% 100%; }
.sm-scope .sm-panel-item:hover { color: var(--sm-accent, ${accentColor}); }
.sm-scope .sm-panel-list[data-numbering] { counter-reset: smItem; }
.sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after { counter-increment: smItem; content: counter(smItem, decimal-leading-zero); position: absolute; top: 0.1em; right: 0.8em; font-size: 0.95rem; font-weight: 500; color: var(--sm-accent, ${accentColor}); letter-spacing: 0; pointer-events: none; user-select: none; opacity: var(--sm-num-opacity, 0); }
      `}</style>
    </div>
  );
};

export default StaggeredMenu;
