import { motion, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";

function Number({ mv, number, height }) {
  let y = useTransform(mv, (latest) => {
    let placeValue = latest % 10;
    let offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) memo -= 10 * height; // caminho mais curto
    return Math.round(memo); // evita sub-pixel jitter em mobile
  });

  const style = {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    willChange: "transform",
    WebkitFontSmoothing: "antialiased",
    transform: "translateZ(0)",
  };

  return <motion.span style={{ ...style, y }}>{number}</motion.span>;
}

function Digit({ place, value, height, digitStyle, mounted }) {
  let valueRoundedToPlace = Math.floor(value / place);
  // Spring com amortecimento forte para parar rápido (reduz "tremido")
  let animatedValue = useSpring(valueRoundedToPlace, {
    stiffness: 260,
    damping: 40,
    mass: 0.6,
    restDelta: 0.01,
    restSpeed: 0.01,
  });

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);

  const defaultStyle = {
    height,
    position: "relative",
    width: "1ch",
    fontVariantNumeric: "tabular-nums",
    lineHeight: 1,
  };

  // Avoid rendering the dynamic animated stack until after client mount
  if (!mounted) {
    const currentDigit = valueRoundedToPlace % 10;
    return (
      <div style={{ ...defaultStyle, ...digitStyle }}>
        <span
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {currentDigit}
        </span>
      </div>
    );
  }

  return (
    <div style={{ ...defaultStyle, ...digitStyle }}>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </div>
  );
}

export default function Counter({
  value,
  fontSize = 100,
  padding = 0,
  places = [100, 10, 1],
  gap = 8,
  borderRadius = 4,
  horizontalPadding = 8,
  textColor = "white",
  fontWeight = "bold",
  containerStyle,
  counterStyle,
  digitStyle,
}) {
  const height = fontSize + padding;

  const defaultContainerStyle = {
    position: "relative",
    display: "inline-block",
  };

  const defaultCounterStyle = {
    fontSize,
    display: "flex",
    gap: gap,
    overflow: "hidden",
    borderRadius: borderRadius,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    lineHeight: 1,
    color: textColor,
    fontWeight: fontWeight,
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div style={{ ...defaultContainerStyle, ...containerStyle }}>
      <div style={{ ...defaultCounterStyle, ...counterStyle }}>
        {places.map((place) => (
          <Digit
            key={place}
            place={place}
            value={value}
            height={height}
            digitStyle={digitStyle}
            mounted={mounted}
          />
        ))}
      </div>
    </div>
  );
}
