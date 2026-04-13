"use client";
import FlowerDividerBase from "./FlowerDividerBase";
import type { FlowerDividerBaseProps } from "./FlowerDividerBase";

export default function FlowerDividerLateralDireita(
  props: Partial<FlowerDividerBaseProps>
): React.JSX.Element {
  return (
    <FlowerDividerBase
      src="/flowers/flores-lateral-direita.png"
      styleVariant="softer"
      size="sm"
      align="right"
      {...props}
    />
  );
}
