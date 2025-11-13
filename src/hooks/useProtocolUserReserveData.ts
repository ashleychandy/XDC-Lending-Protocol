import { CREDITIFY_PROTOCOL_DATA_PROVIDER_ABI } from "@/config/abis";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useAccount, useReadContract } from "wagmi";

/**
 * Protocol user reserve data structure
 */
export interface ProtocolUserReserveData {
  // Raw values from Protocol Data Provider
  currentATokenBalance: bigint;
  currentVariableDebt: bigint;
  currentStableDebt: bigint;
  principalStableDebt: bigint;
  scaledVariableDebt: bigint;
  stableBorrowRate: bigint;
  liquidityRate: bigint;
  stableRateLastUpdated: number;
  usageAsCollateralEnabled: boolean;

  // Formatted values for backward compatibility
  suppliedAmount: bigint;
  borrowedAmount: bigint;
  isUsingAsCollateral: boolean;

  isLoading: boolean;
  error: Error | null;
}

/**
 * Fetches user reserve data from Protocol Data Provider
 *
 * This hook calls getUserReserveData() from the Protocol Data Provider contract,
 * which returns comprehensive user position information for a specific reserve.
 *
 * Protocol Data Provider method:
 * - getUserReserveData(asset, user): Returns object with 9 named fields
 *
 * Response structure:
 * {
 *   currentATokenBalance: bigint,        // User's supplied amount (aToken balance)
 *   currentStableDebt: bigint,           // Always 0 (stable rate disabled)
 *   currentVariableDebt: bigint,         // User's borrowed amount
 *   principalStableDebt: bigint,         // Always 0
 *   scaledVariableDebt: bigint,          // Scaled debt amount
 *   stableBorrowRate: bigint,            // Always 0
 *   liquidityRate: bigint,               // Current supply rate
 *   stableRateLastUpdated: number,       // Always 0
 *   usageAsCollateralEnabled: boolean    // Whether user is using this as collateral
 * }
 *
 * @param assetAddress - The address of the reserve asset
 * @param userAddress - Optional user address (defaults to connected wallet)
 * @returns {ProtocolUserReserveData} Object containing all user reserve data
 *
 * @example
 * const userData = useProtocolUserReserveData('0xC2EA...');
 * if (!userData.isLoading && !userData.error) {
 *   console.log('Supplied:', userData.suppliedAmount);
 *   console.log('Borrowed:', userData.borrowedAmount);
 *   console.log('Using as collateral:', userData.isUsingAsCollateral);
 * }
 */
export function useProtocolUserReserveData(
  assetAddress: string,
  userAddress?: string
): ProtocolUserReserveData {
  const { contracts, network } = useChainConfig();
  const { address: connectedAddress } = useAccount();

  // Use provided userAddress or fall back to connected address
  const effectiveAddress = userAddress || connectedAddress;

  const { data, isLoading, error } = useReadContract({
    address: contracts.protocolDataProvider,
    abi: CREDITIFY_PROTOCOL_DATA_PROVIDER_ABI,
    functionName: "getUserReserveData",
    args:
      effectiveAddress && assetAddress
        ? [assetAddress as `0x${string}`, effectiveAddress as `0x${string}`]
        : undefined,
    chainId: network.chainId,
    query: {
      enabled: !!effectiveAddress && !!assetAddress,
    },
  });

  if (error) {
    console.error(
      `useProtocolUserReserveData error for ${assetAddress}:`,
      error
    );
  }

  // Return default values if user is not connected or data is not available
  if (!effectiveAddress || !data) {
    return {
      currentATokenBalance: BigInt(0),
      currentVariableDebt: BigInt(0),
      currentStableDebt: BigInt(0),
      principalStableDebt: BigInt(0),
      scaledVariableDebt: BigInt(0),
      stableBorrowRate: BigInt(0),
      liquidityRate: BigInt(0),
      stableRateLastUpdated: 0,
      usageAsCollateralEnabled: false,
      suppliedAmount: BigInt(0),
      borrowedAmount: BigInt(0),
      isUsingAsCollateral: false,
      isLoading,
      error: error as Error | null,
    };
  }

  // Parse the response object with 9 named fields
  // Protocol Data Provider returns an object (or tuple that can be destructured)
  const userReserveData = data as any;

  const currentATokenBalance =
    userReserveData.currentATokenBalance || userReserveData[0] || BigInt(0);
  const currentStableDebt =
    userReserveData.currentStableDebt || userReserveData[1] || BigInt(0);
  const currentVariableDebt =
    userReserveData.currentVariableDebt || userReserveData[2] || BigInt(0);
  const principalStableDebt =
    userReserveData.principalStableDebt || userReserveData[3] || BigInt(0);
  const scaledVariableDebt =
    userReserveData.scaledVariableDebt || userReserveData[4] || BigInt(0);
  const stableBorrowRate =
    userReserveData.stableBorrowRate || userReserveData[5] || BigInt(0);
  const liquidityRate =
    userReserveData.liquidityRate || userReserveData[6] || BigInt(0);
  const stableRateLastUpdated = Number(
    userReserveData.stableRateLastUpdated || userReserveData[7] || 0
  );
  const usageAsCollateralEnabled =
    userReserveData.usageAsCollateralEnabled ?? userReserveData[8] ?? false;

  return {
    currentATokenBalance,
    currentVariableDebt,
    currentStableDebt,
    principalStableDebt,
    scaledVariableDebt,
    stableBorrowRate,
    liquidityRate,
    stableRateLastUpdated,
    usageAsCollateralEnabled,
    // Backward compatible fields
    suppliedAmount: currentATokenBalance,
    borrowedAmount: currentVariableDebt,
    isUsingAsCollateral: usageAsCollateralEnabled,
    isLoading,
    error: error as Error | null,
  };
}
