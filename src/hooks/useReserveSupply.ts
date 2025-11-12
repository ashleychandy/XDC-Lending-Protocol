import { ATOKEN_ABI } from "@/config/abis";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";

/**
 * Hook to get total supply of an aToken (total supplied to the reserve)
 */
export function useReserveSupply(aTokenAddress: string, decimals: number = 18) {
  const { data, isLoading } = useReadContract({
    address: aTokenAddress as `0x${string}`,
    abi: ATOKEN_ABI,
    functionName: "totalSupply",
  });

  if (!data) {
    return {
      totalSupply: "0",
      totalSupplyRaw: BigInt(0),
      isLoading,
    };
  }

  return {
    totalSupply: formatUnits(data as bigint, decimals),
    totalSupplyRaw: data as bigint,
    isLoading,
  };
}
