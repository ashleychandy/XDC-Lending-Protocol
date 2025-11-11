/**
 * Format a number as currency with proper thousands separators and decimals
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @param prefix - Currency prefix (default: '$')
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number,
  decimals: number = 2,
  prefix: string = "$"
): string {
  return `${prefix}${value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

/**
 * Format a number with proper thousands separators
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format a number as a compact currency (K, M, B)
 * @param value - The number to format
 * @param prefix - Currency prefix (default: '$')
 * @returns Formatted compact currency string
 */
export function formatCompactCurrency(
  value: number,
  prefix: string = "$"
): string {
  if (value >= 1_000_000_000) {
    return `${prefix}${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `${prefix}${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `${prefix}${(value / 1_000).toFixed(2)}K`;
  }
  return formatCurrency(value, 2, prefix);
}

/**
 * Format a percentage value
 * @param value - The percentage value (e.g., 5.25 for 5.25%)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}
