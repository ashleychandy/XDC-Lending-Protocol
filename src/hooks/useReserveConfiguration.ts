import { CREDITIFY_PROTOCOL_DATA_PROVIDER_ABI } from "@/config/abis";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useReadContract } from "wagmi";

/**
 * Reserve configuration data structure
 */
export interface ReserveConfiguration {
  // Raw values (in basis points where applicable)
  decimals: number;
  ltv: number; // Basis points (8050 = 80.50%)
  liquidationThreshold: number; // Basis points (8300 = 83.00%)
  liquidationBonus: number; // Basis points (10500 = 105.00%, meaning 5% bonus)
  reserveFactor: number; // Basis points (1500 = 15.00%)
  usageAsCollateralEnabled: boolean;
  borrowingEnabled: boolean;
  stableBorrowRateEnabled: boolean; // Always false
  isActive: boolean;
  isFrozen: boolean;

  // Formatted percentages for display
  ltvPercent: string; // "80.50"
  liquidationThresholdPercent: string; // "83.00"
  liquidationBonusPercent: string; // "5.00" (actual bonus, not the multiplier)
  reserveFactorPercent: string; // "15.00"

  isLoading: boolean;
  error: Error | null;
}

/**
 * Fetches reserve configuration data from Protocol Data Provider
 *
 * This hook calls getReserveConfigurationData() from the Protocol Data Provider
 * contract, which returns configuration parameters for a reserve.
 *
 * Protocol Data Provider method:
 * - getReserveConfigurationData(asset): Returns object with 10 named fields
 *
 * Response structure:
 * {
 *   decimals: number,                    // Token decimals (e.g., 18 for WXDC, 6 for USDC)
 *   ltv: number,                         // Loan-to-Value in basis points (8050 = 80.50%)
 *   liquidationThreshold: number,        // Liquidation threshold in basis points (8300 = 83.00%)
 *   liquidationBonus: number,            // Liquidation bonus in basis points (10500 = 105%, meaning 5% bonus)
 *   reserveFactor: number,               // Reserve factor in basis points (1500 = 15.00%)
 *   usageAsCollateralEnabled: boolean,   // Whether reserve can be used as collateral
 *   borrowingEnabled: boolean,           // Whether borrowing is enabled
 *   stableBorrowRateEnabled: boolean,    // Always false (stable rate disabled)
 *   isActive: boolean,                   // Whether reserve is active
 *   isFrozen: boolean                    // Whether reserve is frozen
 * }
 *
 * Basis Points Conversion:
 * - Divide by 100 to get percentage (8050 / 100 = 80.50%)
 * - Liquidation bonus is special: subtract 10000 then divide by 100 (10500 - 10000 = 500 / 100 = 5%)
 *
 * @param assetAddress - The address of the reserve asset
 * @returns {ReserveConfiguration} Object containing all configuration data
 *
 * @example
 * const config = useReserveConfiguration('0xC2EA...');
 * if (!config.isLoading && !config.error) {
 *   console.log('LTV:', config.ltvPercent + '%');
 *   console.log('Liquidation Threshold:', config.liquidationThresholdPercent + '%');
 *   console.log('Can use as collateral:', config.usageAsCollateralEnabled);
 * }
 */
export function useReserveConfiguration(
  assetAddress: string
): ReserveConfiguration {
  const { contracts, network } = useChainConfig();

  const { data, isLoading, error } = useReadContract({
    address: contracts.protocolDataProvider,
    abi: CREDITIFY_PROTOCOL_DATA_PROVIDER_ABI,
    functionName: "getReserveConfigurationData",
    args: [assetAddress as `0x${string}`],
    chainId: network.chainId,
  });

  if (error) {
    console.error(`useReserveConfiguration error for ${assetAddress}:`, error);
  }

  // Return default values if data is not available
  if (!data) {
    return {
      decimals: 18,
      ltv: 0,
      liquidationThreshold: 0,
      liquidationBonus: 0,
      reserveFactor: 0,
      usageAsCollateralEnabled: false,
      borrowingEnabled: false,
      stableBorrowRateEnabled: false,
      isActive: false,
      isFrozen: false,
      ltvPercent: "0.00",
      liquidationThresholdPercent: "0.00",
      liquidationBonusPercent: "0.00",
      reserveFactorPercent: "0.00",
      isLoading,
      error: error as Error | null,
    };
  }

  // Parse the response object with 10 named fields
  const configData = data as any;

  const decimals = Number(configData.decimals || configData[0] || 18);
  const ltv = Number(configData.ltv || configData[1] || 0);
  const liquidationThreshold = Number(
    configData.liquidationThreshold || configData[2] || 0
  );
  const liquidationBonus = Number(
    configData.liquidationBonus || configData[3] || 0
  );
  const reserveFactor = Number(configData.reserveFactor || configData[4] || 0);
  const usageAsCollateralEnabled =
    configData.usageAsCollateralEnabled ?? configData[5] ?? false;
  const borrowingEnabled =
    configData.borrowingEnabled ?? configData[6] ?? false;
  const stableBorrowRateEnabled =
    configData.stableBorrowRateEnabled ?? configData[7] ?? false;
  const isActive = configData.isActive ?? configData[8] ?? false;
  const isFrozen = configData.isFrozen ?? configData[9] ?? false;

  // Convert basis points to percentages
  // Basis points: divide by 100 to get percentage (8050 -> 80.50)
  const basisPointsToPercent = (basisPoints: number): string => {
    return (basisPoints / 100).toFixed(2);
  };

  // Liquidation bonus is special: it's expressed as a multiplier in basis points
  // 10500 means 105%, which is a 5% bonus
  // So we subtract 10000 and then convert: (10500 - 10000) / 100 = 5.00%
  const liquidationBonusToPercent = (bonus: number): string => {
    if (bonus <= 10000) return "0.00";
    return ((bonus - 10000) / 100).toFixed(2);
  };

  return {
    decimals,
    ltv,
    liquidationThreshold,
    liquidationBonus,
    reserveFactor,
    usageAsCollateralEnabled,
    borrowingEnabled,
    stableBorrowRateEnabled,
    isActive,
    isFrozen,
    ltvPercent: basisPointsToPercent(ltv),
    liquidationThresholdPercent: basisPointsToPercent(liquidationThreshold),
    liquidationBonusPercent: liquidationBonusToPercent(liquidationBonus),
    reserveFactorPercent: basisPointsToPercent(reserveFactor),
    isLoading,
    error: error as Error | null,
  };
}
