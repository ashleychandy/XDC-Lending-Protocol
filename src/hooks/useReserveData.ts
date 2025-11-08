import { POOL_ABI } from "@/config/abis";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useReadContract } from "wagmi";

export const useReserveData = (assetAddress: string) => {
  const { contracts, network } = useChainConfig();

  const { data, isLoading, error } = useReadContract({
    address: contracts.pool,
    abi: POOL_ABI,
    functionName: "getReserveData",
    args: [assetAddress as `0x${string}`],
    chainId: network.chainId,
  });

  if (!data) {
    if (error) {
      console.error("useReserveData error for", assetAddress, ":", error);
    }
    return {
      supplyApy: "0.00",
      borrowApy: "0.00",
      totalLiquidity: "0",
      aTokenAddress: "",
      isLoading,
      error,
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

  const reserveData = data as any;
  const supplyApy = rateToApy(reserveData.currentLiquidityRate);
  const borrowApy = rateToApy(reserveData.currentVariableBorrowRate);

  return {
    supplyApy,
    borrowApy,
    totalLiquidity: reserveData.liquidityIndex.toString(),
    aTokenAddress: reserveData.aTokenAddress,
    isLoading,
    error,
  };
};
