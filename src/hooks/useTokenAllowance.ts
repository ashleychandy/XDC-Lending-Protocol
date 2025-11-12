import { ERC20_ABI } from "@/config/abis";
import { useReadContract } from "wagmi";

/**
 * Hook to check ERC20 token allowance
 */
export function useTokenAllowance(
  tokenAddress?: string,
  ownerAddress?: string,
  spenderAddress?: string
) {
  const {
    data: allowance,
    isLoading,
    refetch,
  } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args:
      ownerAddress && spenderAddress
        ? [ownerAddress as `0x${string}`, spenderAddress as `0x${string}`]
        : undefined,
    query: {
      enabled: !!tokenAddress && !!ownerAddress && !!spenderAddress,
    },
  });

  return {
    allowance: allowance as bigint | undefined,
    isLoading,
    refetch,
  };
}
