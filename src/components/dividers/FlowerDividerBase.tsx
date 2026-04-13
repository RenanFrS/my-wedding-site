"use client";
import Image from "next/image";
import React from "react";

/*
  FlowerDividerBase
  Generic decorative floral divider / watermark.
*/

type StyleVariant = "soft" | "softer" | "strong";
type SizeVariant = "sm" | "md" | "lg";
type AlignVariant = "center" | "left" | "right";

export interface FlowerDividerBaseProps {
  src: string;
  alt?: string;
  width?: number;
  className?: string;
  styleVariant?: StyleVariant;
  size?: SizeVariant;
  align?: AlignVariant;
}

const variantStyles: Record<StyleVariant, { opacity: string; filter: string }> = {
  soft: { opacity: "0.65", filter: "brightness(0.94) saturate(0.88)" },
  softer: { opacity: "0.5", filter: "brightness(0.92) saturate(0.8)" },
  strong: { opacity: "0.8", filter: "brightness(0.98) saturate(0.95)" },
};

const sizeClasses: Record<SizeVariant, string> = {
  sm: "w-[200px] md:w-[300px] lg:w-[380px]",
  md: "w-[260px] md:w-[420px] lg:w-[560px]",
  lg: "w-[320px] md:w-[520px] lg:w-[680px]",
};

const alignment: Record<AlignVariant, string> = {
  center: "justify-center",
  left: "justify-start",
  right: "justify-end",
};

export default function FlowerDividerBase({
  src,
  alt = "Divisor floral decorativo",
  width = 640,
  className = "",
  styleVariant = "soft",
  size = "md",
  align = "center",
}: FlowerDividerBaseProps): React.JSX.Element {
  const styleConf = variantStyles[styleVariant] ?? variantStyles.soft;
  const sizeCls = sizeClasses[size] ?? sizeClasses.md;
  const alignmentCls = alignment[align] ?? alignment.center;

  return (
    <div
      className={`relative w-full flex ${alignmentCls} overflow-visible ${className}`}
      aria-hidden="true"
    >
      <div
        className="relative pointer-events-none select-none transition-opacity duration-500 will-change-transform"
        style={styleConf}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={Math.round(width / 3)}
          className={`${sizeCls} h-auto object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.04)]`}
          loading="lazy"
        />
      </div>
    </div>
  );
}
