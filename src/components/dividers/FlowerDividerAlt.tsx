"use client";
import FlowerDividerBase from "./FlowerDividerBase";
import type { FlowerDividerBaseProps } from "./FlowerDividerBase";

export default function FlowerDividerAlt(
  props: Partial<FlowerDividerBaseProps>
): React.JSX.Element {
  return (
    <FlowerDividerBase
      src="/flowers/flores-campo.png"
      styleVariant="softer"
      size="sm"
      {...props}
    />
  );
}
