import { CREDITIFY_PROTOCOL_DATA_PROVIDER_ABI } from "@/config/abis";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useReadContract } from "wagmi";

/**
 * Protocol reserve data structure
 */
export interface ProtocolReserveData {
  // Rate data
  supplyApy: string;
  borrowApy: string;
  liquidityRate: bigint;
  variableBorrowRate: bigint;
  stableBorrowRate: bigint;

  // Supply/borrow data
  totalAToken: bigint;
  totalVariableDebt: bigint;
  totalStableDebt: bigint;
  unbacked: bigint;

  // Index data
  liquidityIndex: bigint;
  variableBorrowIndex: bigint;

  // Token addresses (from separate call if needed)
  aTokenAddress?: string;
  variableDebtTokenAddress?: string;
  stableDebtTokenAddress?: string;

  // Other
  accruedToTreasuryScaled: bigint;
  averageStableBorrowRate: bigint;
  lastUpdateTimestamp: number;

  isLoading: boolean;
  error: Error | null;
}

/**
 * Fetches reserve data from Protocol Data Provider
 *
 * This hook calls getReserveData() from the Protocol Data Provider contract,
 * which returns comprehensive reserve information in a single call.
 *
 * Protocol Data Provider method:
 * - getReserveData(asset): Returns array of 12 values
 *
 * Array structure (indices):
 * [0] unbacked (always 0)
 * [1] accruedToTreasuryScaled
 * [2] totalAToken (total supplied)
 * [3] totalStableDebt (always 0 - stable rate disabled)
 * [4] totalVariableDebt (total borrowed)
 * [5] liquidityRate (supply APY in ray units: 1e27)
 * [6] variableBorrowRate (borrow APY in ray units: 1e27)
 * [7] stableBorrowRate (always 0 - stable rate disabled)
 * [8] averageStableBorrowRate (always 0)
 * [9] liquidityIndex
 * [10] variableBorrowIndex
 * [11] lastUpdateTimestamp
 *
 * APY Calculation:
 * - Rates are in "ray" units (1e27)
 * - Convert to APY: ((1 + rate/RAY/SECONDS_PER_YEAR) ^ SECONDS_PER_YEAR - 1) * 100
 *
 * @param assetAddress - The address of the reserve asset
 * @returns {ProtocolReserveData} Object containing all reserve data with loading/error states
 *
 * @example
 * const reserveData = useProtocolReserveData('0xC2EA...');
 * if (!reserveData.isLoading && !reserveData.error) {
 *   console.log('Supply APY:', reserveData.supplyApy);
 *   console.log('Total Supplied:', reserveData.totalAToken);
 *   console.log('Total Borrowed:', reserveData.totalVariableDebt);
 * }
 */
export function useProtocolReserveData(
  assetAddress: string
): ProtocolReserveData {
  const { contracts, network } = useChainConfig();

  const { data, isLoading, error } = useReadContract({
    address: contracts.protocolDataProvider,
    abi: CREDITIFY_PROTOCOL_DATA_PROVIDER_ABI,
    functionName: "getReserveData",
    args: [assetAddress as `0x${string}`],
    chainId: network.chainId,
  });

  if (error) {
    console.error(`useProtocolReserveData error for ${assetAddress}:`, error);
  }

  // Return default values if data is not available
  if (!data) {
    return {
      supplyApy: "0.00",
      borrowApy: "0.00",
      liquidityRate: BigInt(0),
      variableBorrowRate: BigInt(0),
      stableBorrowRate: BigInt(0),
      totalAToken: BigInt(0),
      totalVariableDebt: BigInt(0),
      totalStableDebt: BigInt(0),
      unbacked: BigInt(0),
      liquidityIndex: BigInt(0),
      variableBorrowIndex: BigInt(0),
      accruedToTreasuryScaled: BigInt(0),
      averageStableBorrowRate: BigInt(0),
      lastUpdateTimestamp: 0,
      isLoading,
      error: error as Error | null,
    };
  }

  // Parse the 12-element array response
  // Protocol Data Provider returns array with 12 elements
  const reserveDataArray = data as any[];

  const [
    unbacked, // [0] unbacked (always 0)
    accruedToTreasuryScaled, // [1] accruedToTreasuryScaled
    totalAToken, // [2] totalAToken (total supplied)
    totalStableDebt, // [3] totalStableDebt (always 0)
    totalVariableDebt, // [4] totalVariableDebt (total borrowed)
    liquidityRate, // [5] liquidityRate (supply APY in ray units)
    variableBorrowRate, // [6] variableBorrowRate (borrow APY in ray units)
    stableBorrowRate, // [7] stableBorrowRate (always 0)
    averageStableBorrowRate, // [8] averageStableBorrowRate (always 0)
    liquidityIndex, // [9] liquidityIndex
    variableBorrowIndex, // [10] variableBorrowIndex
    lastUpdateTimestamp, // [11] lastUpdateTimestamp
  ] = reserveDataArray;

  // Convert ray units to APY percentage
  const RAY = BigInt(10 ** 27);
  const SECONDS_PER_YEAR = 31_536_000;

  const rateToApy = (rate: bigint): string => {
    if (rate === BigInt(0)) return "0.00";
    const baseRate = Number(rate) / Number(RAY);
    const apy =
      (Math.pow(1 + baseRate / SECONDS_PER_YEAR, SECONDS_PER_YEAR) - 1) * 100;
    return apy.toFixed(2);
  };

  const supplyApy = rateToApy(liquidityRate);
  const borrowApy = rateToApy(variableBorrowRate);

  return {
    supplyApy,
    borrowApy,
    liquidityRate,
    variableBorrowRate,
    stableBorrowRate,
    totalAToken,
    totalVariableDebt,
    totalStableDebt,
    unbacked,
    liquidityIndex,
    variableBorrowIndex,
    accruedToTreasuryScaled,
    averageStableBorrowRate,
    lastUpdateTimestamp: Number(lastUpdateTimestamp),
    isLoading,
    error: error as Error | null,
  };
}
