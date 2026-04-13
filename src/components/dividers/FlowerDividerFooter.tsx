"use client";
import FlowerDividerBase from "./FlowerDividerBase";
import type { FlowerDividerBaseProps } from "./FlowerDividerBase";

export default function FlowerDividerFooter(
  props: Partial<FlowerDividerBaseProps>
): React.JSX.Element {
  return (
    <FlowerDividerBase
      src="/flowers/flores-footer.png"
      styleVariant="soft"
      size="lg"
      align="center"
      {...props}
    />
  );
}
