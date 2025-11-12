import { VARIABLE_DEBT_TOKEN_ABI } from "@/config/abis";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useReadContract } from "wagmi";

/**
 * Hook to check borrow delegation allowance
 */
export function useBorrowAllowance(userAddress?: string) {
  const { contracts, tokens } = useChainConfig();

  const {
    data: allowance,
    isLoading,
    refetch,
  } = useReadContract({
    address: tokens.wrappedNative.variableDebtToken as `0x${string}`,
    abi: VARIABLE_DEBT_TOKEN_ABI,
    functionName: "borrowAllowance",
    args: userAddress
      ? [
          userAddress as `0x${string}`,
          contracts.wrappedTokenGateway as `0x${string}`,
        ]
      : undefined,
    query: {
      enabled:
        !!userAddress &&
        contracts.wrappedTokenGateway !==
          "0x0000000000000000000000000000000000000000",
    },
  });

  return {
    allowance: allowance as bigint | undefined,
    isLoading,
    refetch,
  };
}
