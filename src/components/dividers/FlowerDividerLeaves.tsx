"use client";
import FlowerDividerBase from "./FlowerDividerBase";
import type { FlowerDividerBaseProps } from "./FlowerDividerBase";

export default function FlowerDividerLeaves(
  props: Partial<FlowerDividerBaseProps>
): React.JSX.Element {
  return (
    <FlowerDividerBase
      src="/flowers/flores-centro-2.png"
      styleVariant="softer"
      size="md"
      {...props}
    />
  );
}
