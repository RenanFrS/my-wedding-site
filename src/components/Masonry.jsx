"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
// Dynamically import the client-only Masonry core
const MasonryBase = dynamic(() => import("./masonry/MasonryBase"), {
  ssr: false,
});

// Heights picked to create a varied pleasant masonry layout.
// Local wedding images plus a few placeholder picsum items kept.
const localImageHeights = [520, 360, 440, 400, 480, 380, 500];

export default function GalleryMasonry() {
  const [ready, setReady] = useState(false);
  const [activated, setActivated] = useState(false);
  const sectionRef = useRef(null);
  useEffect(() => {
    // Delay render until client to avoid matchMedia SSR crash
    setReady(true);
  }, []);

  const items = useMemo(
    () =>
      [1, 2, 3, 4, 5, 6, 7].map((n, idx) => ({
        id: `local-${n}`,
        img: `/imagens/${n}.jpg`,
        url: `/imagens/${n}.jpg`,
        height: localImageHeights[idx % localImageHeights.length],
      })),
    []
  );

  // Activate when section enters viewport (mount Masonry only then so animations start on scroll)
  useEffect(() => {
    if (!ready || activated) return;
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActivated(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ready, activated]);

  if (!ready) {
    return (
      <section
        id="galeria"
        ref={sectionRef}
        className="hz-margin py-24 md:py-40 reveal"
      >
        <h2 className="text-center font-display text-4xl md:text-5xl mb-10 text-[#ac5b30]">
          Nossa Galeria
        </h2>
        <div className="text-center text-sm opacity-60">Carregando...</div>
      </section>
    );
  }

  return (
    <section
      id="galeria"
      ref={sectionRef}
      className="hz-margin py-24 md:py-40 reveal"
    >
      <h2 className="text-center font-display text-4xl md:text-5xl mb-10 text-[#ac5b30]">
        Nossa Galeria
      </h2>
      <div className="relative w-full min-h-[60vh]">
        {activated ? (
          <MasonryBase
            items={items}
            ease="power3.out"
            duration={0.6}
            stagger={0.05}
            animateFrom="bottom"
            scaleOnHover={true}
            hoverScale={0.96}
            blurToFocus={true}
            colorShiftOnHover={true}
            overlayColor="#a1c6da"
          />
        ) : (
          <div className="w-full h-[40vh] flex items-center justify-center text-xs tracking-wider text-[#ac5b30]/60">
            (Role para visualizar a galeria)
          </div>
        )}
      </div>
    </section>
  );
}
