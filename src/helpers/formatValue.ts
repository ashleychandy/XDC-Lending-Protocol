export const formatValue = (value: number, maxDecimals = 7): string => {
  if (isNaN(value) || value === null || value === undefined) return "0";
  if (value === 0) return "0";

  // Small values (less than 0.001) — show up to maxDecimals
  if (value < 0.001) return value.toFixed(maxDecimals);

  // Medium-small values (less than 1) — show useful precision
  if (value < 1) return value.toPrecision(7);

  // Whole numbers — show 2 decimals with thousand separators
  if (Number.isInteger(value)) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // Normal decimals — show 2 decimals with thousand separators
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatUsdValue = (value: number) => {
  if (isNaN(value) || value === null || value === undefined) return "$0.00";
  if (value < 0.01) return "< $0.01";

  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
