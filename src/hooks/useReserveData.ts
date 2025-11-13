import { POOL_ABI } from "@/config/abis";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useProtocolReserveData } from "@/hooks/useProtocolReserveData";
import { useReadContract } from "wagmi";

/**
 * Fetches reserve data for a specific asset
 *
 * This hook can use either the Protocol Data Provider (default) or the Pool contract
 * directly for backward compatibility. The Protocol Data Provider is more efficient
 * as it provides more data in a single call.
 *
 * @param assetAddress - The address of the reserve asset
 * @param useProtocolProvider - Whether to use Protocol Data Provider (default: true)
 * @returns Reserve data including APYs, liquidity, and aToken address
 */
export const useReserveData = (
  assetAddress: string,
  useProtocolProvider: boolean = true
) => {
  const { contracts, network } = useChainConfig();

  // Use Protocol Data Provider by default
  const protocolData = useProtocolReserveData(assetAddress);

  // We need to get aTokenAddress from Pool contract as Protocol Data Provider doesn't return it
  // This call is made regardless of useProtocolProvider to get the aTokenAddress
  const {
    data: poolData,
    isLoading: poolLoading,
    error: poolError,
  } = useReadContract({
    address: contracts.pool,
    abi: POOL_ABI,
    functionName: "getReserveData",
    args: [assetAddress as `0x${string}`],
    chainId: network.chainId,
  });

  // If using Protocol Data Provider, return transformed data with aTokenAddress from Pool
  if (useProtocolProvider) {
    const aTokenAddress = poolData ? (poolData as any).aTokenAddress : "";

    return {
      supplyApy: protocolData.supplyApy,
      borrowApy: protocolData.borrowApy,
      totalLiquidity: protocolData.liquidityIndex.toString(),
      aTokenAddress,
      isLoading: protocolData.isLoading || poolLoading,
      error: protocolData.error || (poolError as Error | null),
    };
  }

  // Legacy Pool contract implementation
  if (!poolData) {
    if (poolError) {
      console.error("useReserveData error for", assetAddress, ":", poolError);
    }
    return {
      supplyApy: "0.00",
      borrowApy: "0.00",
      totalLiquidity: "0",
      aTokenAddress: "",
      isLoading: poolLoading,
      error: poolError as Error | null,
    };
  }

  const RAY = BigInt(10 ** 27);
  const SECONDS_PER_YEAR = 31_536_000;

  const rateToApy = (rate: bigint) => {
    if (rate === BigInt(0)) return "0.00";
    const baseRate = Number(rate) / Number(RAY);
    const apy =
      (Math.pow(1 + baseRate / SECONDS_PER_YEAR, SECONDS_PER_YEAR) - 1) * 100;
    return apy.toFixed(2);
  };

  const reserveData = poolData as any;
  const supplyApy = rateToApy(reserveData.currentLiquidityRate);
  const borrowApy = rateToApy(reserveData.currentVariableBorrowRate);

  return {
    supplyApy,
    borrowApy,
    totalLiquidity: reserveData.liquidityIndex.toString(),
    aTokenAddress: reserveData.aTokenAddress,
    isLoading: poolLoading,
    error: poolError as Error | null,
  };
};
