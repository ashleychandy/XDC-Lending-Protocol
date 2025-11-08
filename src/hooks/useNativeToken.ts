import { useChainConfig } from "@/hooks/useChainConfig";
import { formatUnits } from "viem";
import { useAccount, useBalance } from "wagmi";

/**
 * Hook to get native token information and balance for the current chain
 * Returns native token details (XDC, ETH, etc.) based on connected chain
 */
export function useNativeToken() {
  const { address, chain } = useAccount();
  const { network } = useChainConfig();

  // Get native token balance
  const {
    data: balance,
    isLoading,
    refetch,
  } = useBalance({
    address,
    query: {
      enabled: !!address,
    },
  });

  // Get native token info from chain
  const nativeToken = chain?.nativeCurrency || {
    name: "XDC",
    symbol: "XDC",
    decimals: 18,
  };

  // Format balance
  const formattedBalance = balance
    ? formatUnits(balance.value, balance.decimals)
    : "0";

  return {
    // Native token info
    name: nativeToken.name,
    symbol: nativeToken.symbol,
    decimals: nativeToken.decimals,

    // Balance info
    balance: balance?.value || BigInt(0),
    formattedBalance,
    balanceInUsd: 0, // Can be calculated with price oracle

    // Chain info
    chainId: network.chainId,
    chainName: network.name,

    // Loading states
    isLoading,
    refetch,
  };
}
