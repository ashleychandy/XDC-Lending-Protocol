export const formatValue = (value: number, maxDecimals = 6): string => {
  if (isNaN(value) || value === null || value === undefined) return "0";
  if (value === 0) return "0";

  // Small values (less than 0.001) — show up to maxDecimals
  if (value < 0.001) return value.toFixed(maxDecimals);

  // Medium-small values (less than 1) — show useful precision
  if (value < 1) return value.toPrecision(4);

  // Whole numbers — show 2 decimals (like 10.00)
  if (Number.isInteger(value)) return value.toFixed(2);

  // Normal decimals — show 2 decimals (like 5.68)
  return value.toFixed(2);
};
