import { useProtocolUserReserveData } from "@/hooks/useProtocolUserReserveData";

/**
 * Fetches user reserve data for a specific asset
 *
 * This hook has been updated to use Protocol Data Provider internally,
 * which reduces the number of RPC calls from 3-4 to just 1.
 *
 * Previously:
 * - Called aToken.balanceOf() for supplied amount
 * - Called Pool.getReserveData() to get debt token address
 * - Called debtToken.balanceOf() for borrowed amount
 * - Called ProtocolDataProvider.getUserReserveData() for collateral status
 *
 * Now:
 * - Calls ProtocolDataProvider.getUserReserveData() once for all data
 *
 * @param assetAddress - The address of the reserve asset
 * @param aTokenAddress - The aToken address (kept for backward compatibility, not used)
 * @returns Object with suppliedAmount, borrowedAmount, and isUsingAsCollateral
 *
 * @example
 * const { suppliedAmount, borrowedAmount, isUsingAsCollateral } = useUserReserveData(
 *   tokens.wrappedNative.address,
 *   tokens.wrappedNative.aTokenAddress
 * );
 */
export const useUserReserveData = (
  assetAddress: string,
  aTokenAddress: string // Kept for backward compatibility but not used
) => {
  // Use Protocol Data Provider to get all user reserve data in a single call
  const protocolData = useProtocolUserReserveData(assetAddress);

  // Return the same interface as before for backward compatibility
  return {
    suppliedAmount: protocolData.suppliedAmount,
    borrowedAmount: protocolData.borrowedAmount,
    isUsingAsCollateral: protocolData.isUsingAsCollateral,
  };
};
