import { useReadContract, useAccount } from "wagmi";
import { erc20Abi, formatUnits } from "viem";

export function useTokenBalance(tokenAddress: string, decimals: number) {
  const { address } = useAccount();

  const { data, isLoading, error, refetch } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
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
