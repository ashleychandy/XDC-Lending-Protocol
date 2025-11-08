import { ERC20_ABI } from "@/config/abis";
import { formatUnits } from "viem";
import { useAccount, useReadContract } from "wagmi";

export function useTokenBalance(tokenAddress: string, decimals: number) {
  const { address } = useAccount();

  const { data, isLoading, error, refetch } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    balance: data ? formatUnits(data, decimals) : "0",
    isLoading,
    error,
    refetch,
  };
}
