import { MotionValue, motion, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

import "./Counter.css";

interface NumberProps {
  mv: MotionValue<number>;
  number: number;
  height: number;
}

function Number({ mv, number, height }: NumberProps) {
  let y = useTransform(mv, (latest) => {
    let placeValue = latest % 10;
    let offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) {
      memo -= 10 * height;
    }
    return memo;
  });
  return (
    <motion.span className="counter-number" style={{ y }}>
      {number}
    </motion.span>
  );
}

interface DigitProps {
  place: number;
  value: number;
  height: number;
  digitStyle?: React.CSSProperties;
}

function Digit({ place, value, height, digitStyle }: DigitProps) {
  let valueRoundedToPlace = Math.floor(value / place);
  let animatedValue = useSpring(valueRoundedToPlace);
  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);
  return (
    <div className="counter-digit" style={{ height, ...digitStyle }}>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </div>
  );
}

interface CounterProps {
  value: number;
  fontSize?: number;
  padding?: number;
  places?: number[];
  gap?: number;
  borderRadius?: number;
  horizontalPadding?: number;
  textColor?: string;
  fontWeight?: React.CSSProperties["fontWeight"];
  containerStyle?: React.CSSProperties;
  counterStyle?: React.CSSProperties;
  digitStyle?: React.CSSProperties;
  gradientHeight?: number;
  gradientFrom?: string;
  gradientTo?: string;
  topGradientStyle?: React.CSSProperties;
  bottomGradientStyle?: React.CSSProperties;
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
  gradientHeight = 16,
  gradientFrom = "black",
  gradientTo = "transparent",
  topGradientStyle,
  bottomGradientStyle,
}: CounterProps) {
  const height = fontSize + padding;
  const defaultCounterStyle: React.CSSProperties = {
    fontSize,
    gap: gap,
    borderRadius: borderRadius,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    color: textColor,
    fontWeight: fontWeight,
  };
  const defaultTopGradientStyle: React.CSSProperties = {
    height: gradientHeight,
    background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`,
  };
  const defaultBottomGradientStyle: React.CSSProperties = {
    height: gradientHeight,
    background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
  };
  return (
    <div className="counter-container" style={containerStyle}>
      <div
        className="counter-counter"
        style={{ ...defaultCounterStyle, ...counterStyle }}
      >
        {places.map((place) => (
          <Digit
            key={place}
            place={place}
            value={value}
            height={height}
            digitStyle={digitStyle}
          />
        ))}
      </div>
      <div className="gradient-container">
        <div
          className="top-gradient"
          style={topGradientStyle ? topGradientStyle : defaultTopGradientStyle}
        ></div>
        <div
          className="bottom-gradient"
          style={
            bottomGradientStyle
              ? bottomGradientStyle
              : defaultBottomGradientStyle
          }
        ></div>
      </div>
    </div>
  );
}

/*
Props
Property	Type	Default	Description
value
number

N/A (required)
The numeric value to display in the counter.

fontSize
number

100
The base font size used for the counter digits.

padding
number

0
Additional padding added to the digit height.

places
number[]

[100, 10, 1]
An array of place values to determine which digits to display.

gap
number

8
The gap (in pixels) between each digit.

borderRadius
number

4
The border radius (in pixels) for the counter container.

horizontalPadding
number

8
The horizontal padding (in pixels) for the counter container.

textColor
string

'white'
The text color for the counter digits.

fontWeight
string | number

'bold'
The font weight of the counter digits.

containerStyle
React.CSSProperties

{}
Custom inline styles for the outer container.

counterStyle
React.CSSProperties

{}
Custom inline styles for the counter element.

digitStyle
React.CSSProperties

{}
Custom inline styles for each digit container.

gradientHeight
number

16
The height (in pixels) of the gradient overlays.

gradientFrom
string

'black'
The starting color for the gradient overlays.

gradientTo
string

'transparent'
The ending color for the gradient overlays.

topGradientStyle
React.CSSProperties

undefined
Custom inline styles for the top gradient overlay.

bottomGradientStyle
React.CSSProperties

undefined
Custom inline styles for the bottom gradient overlay.

*/