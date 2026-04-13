import type { MotionValue } from 'motion/react';
import { motion, useSpring, useTransform } from 'motion/react';
import { useEffect, useState } from 'react';
import type { CounterProps } from '@/types';

interface NumberProps {
  mv: MotionValue<number>;
  number: number;
  height: number;
}

function Number({ mv, number, height }: NumberProps): React.JSX.Element {
  const y = useTransform(mv, (latest: number) => {
    const placeValue: number = latest % 10;
    const offset: number = (10 + number - placeValue) % 10;
    let memo: number = offset * height;
    if (offset > 5) memo -= 10 * height; // caminho mais curto
    return Math.round(memo); // evita sub-pixel jitter em mobile
  });

  const style: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    willChange: 'transform',
    WebkitFontSmoothing: 'antialiased',
    transform: 'translateZ(0)',
  };

  return <motion.span style={{ ...style, y }}>{number}</motion.span>;
}

interface DigitProps {
  place: number;
  value: number;
  height: number;
  digitStyle?: React.CSSProperties;
  mounted: boolean;
}

function Digit({ place, value, height, digitStyle, mounted }: DigitProps): React.JSX.Element {
  const valueRoundedToPlace: number = Math.floor(value / place);
  // Spring com amortecimento forte para parar rápido (reduz "tremido")
  const animatedValue: MotionValue<number> = useSpring(valueRoundedToPlace, {
    stiffness: 260,
    damping: 40,
    mass: 0.6,
    restDelta: 0.01,
    restSpeed: 0.01,
  });

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);

  const defaultStyle: React.CSSProperties = {
    height,
    position: 'relative',
    width: '1ch',
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1,
  };

  // Avoid rendering the dynamic animated stack until after client mount
  if (!mounted) {
    const currentDigit: number = valueRoundedToPlace % 10;
    return (
      <div style={{ ...defaultStyle, ...digitStyle }}>
        <span
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {currentDigit}
        </span>
      </div>
    );
  }

  return (
    <div style={{ ...defaultStyle, ...digitStyle }}>
      {Array.from({ length: 10 }, (_, i: number) => (
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
  textColor = 'white',
  fontWeight = 'bold',
  containerStyle,
  counterStyle,
  digitStyle,
}: CounterProps): React.JSX.Element {
  const height: number = fontSize + padding;

  const defaultContainerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
  };

  const defaultCounterStyle: React.CSSProperties = {
    fontSize,
    display: 'flex',
    gap: gap,
    overflow: 'hidden',
    borderRadius: borderRadius,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    lineHeight: 1,
    color: textColor,
    fontWeight: fontWeight,
  };

  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div style={{ ...defaultContainerStyle, ...containerStyle }}>
      <div style={{ ...defaultCounterStyle, ...counterStyle }}>
        {places.map((place: number) => (
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
