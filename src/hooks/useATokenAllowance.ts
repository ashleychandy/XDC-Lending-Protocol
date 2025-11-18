import { ATOKEN_ABI } from "@/config/abis";
import { useReadContract } from "wagmi";

/**
 * Hook to check aToken allowance for a spender (e.g., WrappedTokenGateway)
 */
export const useATokenAllowance = (
  aTokenAddress: string | undefined,
  ownerAddress: string | undefined,
  spenderAddress: string | undefined
) => {
  const { data, isLoading, error, refetch } = useReadContract({
    address: aTokenAddress as `0x${string}`,
    abi: ATOKEN_ABI,
    functionName: "allowance",
    args: [ownerAddress as `0x${string}`, spenderAddress as `0x${string}`],
    query: {
      enabled: !!aTokenAddress && !!ownerAddress && !!spenderAddress,
    },
  });

  // Format the allowance (aTokens typically have 18 decimals, but we'll keep it as bigint)
  const allowance = data as bigint | undefined;

  return {
    allowance: allowance || BigInt(0),
    isLoading,
    error,
    refetch,
  };
};
