"use client";
// Core Masonry component (GSAP + layout logic)
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import NextImage from "next/image";
import { gsap } from "gsap";

interface MasonryItem {
  id: string;
  img: string;
  url: string;
  height: number;
  alt?: string;
  blur?: string;
  priority?: boolean;
}

interface GridItem extends MasonryItem {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface MasonryBaseProps {
  items: MasonryItem[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: "top" | "bottom" | "left" | "right" | "center" | "random";
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  overlayColor?: string;
}

interface Size {
  width: number;
  height: number;
}

function useMedia<T>(queries: string[], values: T[], defaultValue: T): T {
  const get = (): T =>
    values[queries.findIndex((q) => matchMedia(q).matches)] ?? defaultValue;
  const [value, setValue] = useState<T>(get);
  useEffect(() => {
    const handler = (): void => setValue(get);
    queries.forEach((q) => matchMedia(q).addEventListener("change", handler));
    return () =>
      queries.forEach((q) =>
        matchMedia(q).removeEventListener("change", handler)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries]);
  return value;
}

function useMeasure(): [React.RefObject<HTMLDivElement | null>, Size] {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]: ResizeObserverEntry[]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, size];
}

const preloadImages = async (urls: string[]): Promise<void> => {
  if (typeof window === "undefined") return;
  const NativeImage = window.Image;
  if (!NativeImage) return;
  await Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          try {
            const img = new NativeImage();
            img.src = src;
            img.onload = img.onerror = () => resolve();
          } catch {
            resolve();
          }
        })
    )
  );
};

const MasonryBase: React.FC<MasonryBaseProps> = ({
  items,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  overlayColor = "#d4c4d0",
}) => {
  const columns = useMedia<number>(
    [
      "(min-width:1500px)",
      "(min-width:1000px)",
      "(min-width:600px)",
      "(min-width:400px)",
    ],
    [5, 4, 3, 2],
    1
  );

  const [containerRef, { width }] = useMeasure();
  const [imagesReady, setImagesReady] = useState<boolean>(false);

  const getInitialPosition = (item: GridItem): { x: number; y: number } => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction: string = animateFrom;
    if (animateFrom === "random") {
      const dirs: string[] = ["top", "bottom", "left", "right"];
      direction = dirs[Math.floor(Math.random() * dirs.length)];
    }

    switch (direction) {
      case "top":
        return { x: item.x, y: -200 };
      case "bottom":
        return { x: item.x, y: window.innerHeight + 200 };
      case "left":
        return { x: -200, y: item.y };
      case "right":
        return { x: window.innerWidth + 200, y: item.y };
      case "center":
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  useEffect(() => {
    preloadImages(items.map((i) => i.img)).then(() => setImagesReady(true));
  }, [items]);

  const grid = useMemo<GridItem[]>(() => {
    if (!width) return [];
    const colHeights = new Array<number>(columns).fill(0);
    const gap = 16;
    const totalGaps: number = (columns - 1) * gap;
    const columnWidth: number = (width - totalGaps) / columns;

    return items.map((child) => {
      const col: number = colHeights.indexOf(Math.min(...colHeights));
      const x: number = col * (columnWidth + gap);
      const height: number = child.height / 2;
      const y: number = colHeights[col];

      colHeights[col] += height + gap;
      return { ...child, x, y, w: columnWidth, h: height };
    });
  }, [columns, items, width]);

  const hasMounted = useRef<boolean>(false);

  useLayoutEffect(() => {
    if (!imagesReady) return;

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };

      if (!hasMounted.current) {
        const start = getInitialPosition(item);
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            x: start.x,
            y: start.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: "blur(10px)" }),
          },
          {
            opacity: 1,
            ...animProps,
            ...(blurToFocus && { filter: "blur(0px)" }),
            duration: 0.8,
            ease: "power3.out",
            delay: index * stagger,
          }
        );
      } else {
        gsap.to(selector, {
          ...animProps,
          duration,
          ease,
          overwrite: "auto",
        });
      }
    });

    hasMounted.current = true;
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease]);

  const handleMouseEnter = (id: string, element: HTMLDivElement): void => {
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: hoverScale,
        duration: 0.3,
        ease: "power2.out",
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector<HTMLDivElement>(".color-overlay");
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
    }
  };

  const handleMouseLeave = (id: string, element: HTMLDivElement): void => {
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector<HTMLDivElement>(".color-overlay");
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {grid.map((item) => (
        <div
          key={item.id}
          data-key={item.id}
          className="absolute box-content"
          style={{ willChange: "transform, width, height, opacity" }}
          onClick={() => window.open(item.url, "_blank", "noopener")}
          onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) =>
            handleMouseEnter(item.id, e.currentTarget)
          }
          onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) =>
            handleMouseLeave(item.id, e.currentTarget)
          }
        >
          <div className="relative w-full h-full rounded-[10px] overflow-hidden shadow-[0px_10px_40px_-12px_rgba(0,0,0,0.25)]">
            <NextImage
              src={item.img}
              alt={item.alt || "Foto"}
              fill
              sizes="(min-width: 1500px) 20vw, (min-width: 1000px) 25vw, (min-width: 600px) 33vw, 50vw"
              className="object-cover select-none will-change-transform"
              draggable={false}
              placeholder={item.blur ? "blur" : undefined}
              blurDataURL={item.blur}
              priority={item.priority || false}
            />
            {colorShiftOnHover && (
              <div
                className="color-overlay absolute inset-0 opacity-0 pointer-events-none"
                style={{ backgroundColor: overlayColor }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MasonryBase;
