import { Box, Flex } from "@chakra-ui/react";
import Counter from "./Counter";

interface FormattedCounterProps {
  value: string | number;
  fontSize?: number;
  textColor?: string;
  suffix?: string;
  prefix?: string;
  className?: string;
  decimalPlaces?: number;
}

/**
 * A component that takes a formatted number string (e.g., "1,234.56" or "1.23%")
 * or a number and displays it with animated Counter components
 */
export default function FormattedCounter({
  value,
  fontSize = 14,
  textColor = "#000",
  suffix = "",
  prefix = "",
  className = "",
  decimalPlaces = 2,
}: FormattedCounterProps) {
  // Convert to string if it's a number
  const stringValue = typeof value === "number" ? value.toString() : value;

  // Remove commas, dollar signs, percent signs and parse the numeric value
  const cleanValue = stringValue.replace(/[,$%]/g, "").trim();
  const numericValue = parseFloat(cleanValue);

  // Handle invalid numbers
  if (isNaN(numericValue)) {
    return (
      <Box fontSize={`${fontSize}px`} color={textColor} className={className}>
        {prefix}
        {value}
        {suffix}
      </Box>
    );
  }

  // Split into integer and decimal parts
  const absValue = Math.abs(numericValue);
  const integerPart = Math.floor(absValue);
  const decimalPart = Math.round((absValue % 1) * Math.pow(10, decimalPlaces));

  // Calculate places needed for integer part dynamically
  const integerPlaces = [];
  if (integerPart === 0) {
    integerPlaces.push(1);
  } else {
    const integerDigits = integerPart.toString().length;
    for (let i = integerDigits - 1; i >= 0; i--) {
      integerPlaces.push(Math.pow(10, i));
    }
  }

  // Calculate places for decimal part
  const decimalPlacesArray = [];
  for (let i = decimalPlaces - 1; i >= 0; i--) {
    decimalPlacesArray.push(Math.pow(10, i));
  }

  // Group integer places by thousands for comma formatting
  const groupedIntegerPlaces = [];
  for (let i = 0; i < integerPlaces.length; i++) {
    groupedIntegerPlaces.push({
      place: integerPlaces[i],
      showComma: i > 0 && (integerPlaces.length - i) % 3 === 0,
    });
  }

  return (
    <Flex
      alignItems="center"
      gap="0.5"
      display="inline-flex"
      className={className}
    >
      {prefix && (
        <Box fontSize={`${fontSize}px`} color={textColor}>
          {prefix}
        </Box>
      )}
      {numericValue < 0 && (
        <Box fontSize={`${fontSize}px`} color={textColor}>
          -
        </Box>
      )}
      <Flex alignItems="center" display="inline-flex" gap="0.5">
        {groupedIntegerPlaces.map((group, index) => (
          <Flex key={group.place} alignItems="center" display="inline-flex">
            <Counter
              value={integerPart}
              fontSize={fontSize}
              places={[group.place]}
              gap={1}
              textColor={textColor}
              gradientFrom="transparent"
              gradientTo="transparent"
              containerStyle={{ display: "inline-flex" }}
              horizontalPadding={0}
            />
            {group.showComma && (
              <Box fontSize={`${fontSize}px`} color={textColor} mx="0.25">
                ,
              </Box>
            )}
          </Flex>
        ))}
      </Flex>
      {decimalPlaces > 0 && (
        <>
          <Box fontSize={`${fontSize}px`} color={textColor}>
            .
          </Box>
          <Counter
            value={decimalPart}
            fontSize={fontSize}
            places={decimalPlacesArray}
            gap={1}
            textColor={textColor}
            gradientFrom="transparent"
            gradientTo="transparent"
            containerStyle={{ display: "inline-flex" }}
            horizontalPadding={0}
          />
        </>
      )}
      {suffix && (
        <Box fontSize={`${fontSize}px`} color={textColor}>
          {suffix}
        </Box>
      )}
    </Flex>
  );
}
