/**
 * Health Factor Calculation Helpers
 * Based on Aave V3 GenericLogic.sol
 *
 * Health Factor Formula:
 * HF = (totalCollateralInBaseCurrency * avgLiquidationThreshold) / totalDebtInBaseCurrency / 10000
 *
 * Where avgLiquidationThreshold is the weighted average liquidation threshold
 * of all collateral assets (in basis points, e.g., 8000 = 80%)
 */

interface HealthFactorParams {
  totalCollateralUsd: number;
  totalDebtUsd: number;
  avgLiquidationThreshold: number; // in basis points (e.g., 8000 = 80%)
}

/**
 * Calculate health factor based on collateral, debt, and liquidation threshold
 * Returns "∞" if debt is 0, otherwise returns the calculated health factor
 */
export function calculateHealthFactor(params: HealthFactorParams): string {
  const { totalCollateralUsd, totalDebtUsd, avgLiquidationThreshold } = params;

  // If no debt, health factor is infinite
  if (totalDebtUsd === 0 || totalDebtUsd < 0.01) {
    return "∞";
  }

  // HF = (collateral * liquidationThreshold / 10000) / debt
  const healthFactor =
    (totalCollateralUsd * avgLiquidationThreshold) / 10000 / totalDebtUsd;

  // Return infinity symbol for very high health factors
  return healthFactor > 1000 ? "∞" : healthFactor.toFixed(2);
}

/**
 * Calculate new health factor after supplying collateral
 */
export function calculateHealthFactorAfterSupply(
  currentCollateralUsd: number,
  currentDebtUsd: number,
  avgLiquidationThreshold: number,
  supplyAmountUsd: number,
  assetLiquidationThreshold: number // in basis points
): string {
  // New weighted average liquidation threshold
  const newTotalCollateral = currentCollateralUsd + supplyAmountUsd;

  // Calculate new weighted average liquidation threshold
  const newAvgLiquidationThreshold =
    newTotalCollateral > 0
      ? (currentCollateralUsd * avgLiquidationThreshold +
          supplyAmountUsd * assetLiquidationThreshold) /
        newTotalCollateral
      : avgLiquidationThreshold;

  return calculateHealthFactor({
    totalCollateralUsd: newTotalCollateral,
    totalDebtUsd: currentDebtUsd,
    avgLiquidationThreshold: newAvgLiquidationThreshold,
  });
}

/**
 * Calculate new health factor after withdrawing collateral
 */
export function calculateHealthFactorAfterWithdraw(
  currentCollateralUsd: number,
  currentDebtUsd: number,
  avgLiquidationThreshold: number,
  withdrawAmountUsd: number,
  assetLiquidationThreshold: number // in basis points
): string {
  const newTotalCollateral = Math.max(
    0,
    currentCollateralUsd - withdrawAmountUsd
  );

  // If withdrawing all collateral but still have debt, HF = 0
  if (newTotalCollateral === 0 && currentDebtUsd > 0) {
    return "0.00";
  }

  // Calculate new weighted average liquidation threshold
  // When withdrawing, we need to recalculate based on remaining collateral
  const remainingCollateralValue =
    currentCollateralUsd * avgLiquidationThreshold -
    withdrawAmountUsd * assetLiquidationThreshold;

  const newAvgLiquidationThreshold =
    newTotalCollateral > 0
      ? remainingCollateralValue / newTotalCollateral
      : avgLiquidationThreshold;

  return calculateHealthFactor({
    totalCollateralUsd: newTotalCollateral,
    totalDebtUsd: currentDebtUsd,
    avgLiquidationThreshold: newAvgLiquidationThreshold,
  });
}

/**
 * Calculate new health factor after borrowing
 */
export function calculateHealthFactorAfterBorrow(
  currentCollateralUsd: number,
  currentDebtUsd: number,
  avgLiquidationThreshold: number,
  borrowAmountUsd: number
): string {
  const newTotalDebt = currentDebtUsd + borrowAmountUsd;

  return calculateHealthFactor({
    totalCollateralUsd: currentCollateralUsd,
    totalDebtUsd: newTotalDebt,
    avgLiquidationThreshold,
  });
}

/**
 * Calculate new health factor after repaying debt
 */
export function calculateHealthFactorAfterRepay(
  currentCollateralUsd: number,
  currentDebtUsd: number,
  avgLiquidationThreshold: number,
  repayAmountUsd: number
): string {
  const newTotalDebt = Math.max(0, currentDebtUsd - repayAmountUsd);

  return calculateHealthFactor({
    totalCollateralUsd: currentCollateralUsd,
    totalDebtUsd: newTotalDebt,
    avgLiquidationThreshold,
  });
}

/**
 * Get liquidation threshold for a specific asset from reserve configuration
 * The configuration is a bitmap where liquidation threshold is at bits 16-31
 */
export function getLiquidationThresholdFromConfig(configData: bigint): number {
  // Extract liquidation threshold (bits 16-31)
  const liquidationThreshold = Number((configData >> 16n) & 0xffffn);
  return liquidationThreshold; // Already in basis points
}

/**
 * Check if health factor is safe (above liquidation threshold of 1.0)
 */
export function isHealthFactorSafe(healthFactor: string): boolean {
  if (healthFactor === "∞") return true;
  const hf = parseFloat(healthFactor);
  return hf >= 1.0;
}

/**
 * Get health factor status and color
 */
export function getHealthFactorStatus(healthFactor: string): {
  status: "safe" | "warning" | "danger";
  color: string;
} {
  if (healthFactor === "∞") {
    return { status: "safe", color: "green.600" };
  }

  const hf = parseFloat(healthFactor);

  if (hf >= 1.5) {
    return { status: "safe", color: "green.600" };
  } else if (hf >= 1.0) {
    return { status: "warning", color: "orange.500" };
  } else {
    return { status: "danger", color: "red.500" };
  }
}
