import { Box, Flex } from "@chakra-ui/react";
import Counter from "./Counter";

interface FormattedCounterProps {
  prefixColor?: string;
  suffixColor?: string;
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
  prefixColor = "#a5a8b6",
  suffixColor = "#a5a8b6",
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
  const totalDigits = integerPlaces.length;
  for (let i = 0; i < integerPlaces.length; i++) {
    // Calculate position from the right (0 = ones place, 1 = tens, 2 = hundreds, etc.)
    const positionFromRight = totalDigits - 1 - i;
    groupedIntegerPlaces.push({
      place: integerPlaces[i],
      // Show comma before this digit if the previous position was at a thousands boundary
      // We want commas after positions 3, 6, 9... which means before positions 2, 5, 8...
      showCommaBefore:
        positionFromRight % 3 === 2 && positionFromRight < totalDigits - 1,
    });
  }

  return (
    <Flex
      alignItems="center"
      gap="0.5"
      display="inline-flex"
      className={className}
      color={textColor}
      lineHeight={"normal"}
    >
      {prefix && (
        <Box fontSize={`${fontSize}px`} color={prefixColor}>
          {prefix}
        </Box>
      )}
      {numericValue < 0 && (
        <Box fontSize={`${fontSize}px`} color={textColor}>
          -
        </Box>
      )}
      <Flex alignItems="center" display="inline-flex" gap="0">
        {groupedIntegerPlaces.map((group) => (
          <Flex key={group.place} alignItems="center" display="inline-flex">
            {group.showCommaBefore && (
              <Box fontSize={`${fontSize}px`} color={textColor} mx="0.5">
                ,
              </Box>
            )}
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
        <Box fontSize={`${fontSize}px`} color={suffixColor}>
          {suffix}
        </Box>
      )}
    </Flex>
  );
}
