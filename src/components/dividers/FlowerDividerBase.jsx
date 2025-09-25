"use client";
import Image from "next/image";
import React from "react";

/*
  FlowerDividerBase
  Generic decorative floral divider / watermark.
  Props:
    src: string (required) path inside /public/flowers
    alt: string (will be aria-hidden anyway, decorative)
    width: intrinsic width (default 640)
    className: wrapper extra classes
    styleVariant: 'soft' | 'softer' | 'strong' (controls opacity & filters)
    size: 'sm' | 'md' | 'lg' (controls responsive width scale)
    align: 'center' | 'left' | 'right'
*/

const variantStyles = {
  soft: { opacity: "0.65", filter: "brightness(0.94) saturate(0.88)" },
  softer: { opacity: "0.5", filter: "brightness(0.92) saturate(0.8)" },
  strong: { opacity: "0.8", filter: "brightness(0.98) saturate(0.95)" },
};

const sizeClasses = {
  sm: "w-[200px] md:w-[300px] lg:w-[380px]",
  md: "w-[260px] md:w-[420px] lg:w-[560px]",
  lg: "w-[320px] md:w-[520px] lg:w-[680px]",
};

const alignment = {
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
}) {
  const styleConf = variantStyles[styleVariant] || variantStyles.soft;
  const sizeCls = sizeClasses[size] || sizeClasses.md;
  const alignmentCls = alignment[align] || alignment.center;

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
