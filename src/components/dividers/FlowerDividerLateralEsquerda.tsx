"use client";
import FlowerDividerBase from "./FlowerDividerBase";
import type { FlowerDividerBaseProps } from "./FlowerDividerBase";

export default function FlowerDividerLateralEsquerda(
  props: Partial<FlowerDividerBaseProps>
): React.JSX.Element {
  return (
    <FlowerDividerBase
      src="/flowers/flores-lateral-esquerda.png"
      styleVariant="softer"
      size="sm"
      align="left"
      {...props}
    />
  );
}
