import { ERC20_ABI } from "@/config/abis";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";

/**
 * Hook to get total borrowed amount (variable debt token total supply)
 */
export function useReserveBorrowed(
  variableDebtTokenAddress: string,
  decimals: number = 18
) {
  const { data, isLoading } = useReadContract({
    address: variableDebtTokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "totalSupply",
  });

  if (!data) {
    return {
      totalBorrowed: "0",
      totalBorrowedRaw: BigInt(0),
      isLoading,
    };
  }

  return {
    totalBorrowed: formatUnits(data as bigint, decimals),
    totalBorrowedRaw: data as bigint,
    isLoading,
  };
}
