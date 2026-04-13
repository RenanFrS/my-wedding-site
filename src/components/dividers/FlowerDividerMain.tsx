"use client";
import FlowerDividerBase from "./FlowerDividerBase";
import type { FlowerDividerBaseProps } from "./FlowerDividerBase";

export default function FlowerDividerMain(
  props: Partial<FlowerDividerBaseProps>
): React.JSX.Element {
  return (
    <FlowerDividerBase
      src="/flowers/flores-centro.png"
      styleVariant="soft"
      size="md"
      {...props}
    />
  );
}
