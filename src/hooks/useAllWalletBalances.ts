import { WALLET_BALANCE_PROVIDER_ABI } from "@/config/abis";
import { useChainConfig } from "@/hooks/useChainConfig";
import { formatUnits } from "viem";
import { useAccount, useReadContract } from "wagmi";

/**
 * Token balance data structure
 */
export interface TokenBalance {
  tokenAddress: string;
  balance: bigint;
  formattedBalance: string;
  decimals: number;
}

/**
 * Return type for useAllWalletBalances hook
 */
export interface UseAllWalletBalancesReturn {
  balances: Record<string, TokenBalance>;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Special address used by Wallet Balance Provider for native token (XDC)
 */
export const NATIVE_TOKEN_ADDRESS =
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

/**
 * Fetches all token balances for the connected user in a single call
 *
 * This hook uses the Wallet Balance Provider contract to fetch balances for
 * multiple tokens in a single RPC call, significantly reducing network requests.
 *
 * Wallet Balance Provider method:
 * - getUserWalletBalances(provider, user): Returns two arrays:
 *   - tokens[]: Array of token addresses
 *   - balances[]: Array of balances (same order as tokens)
 *
 * The native token (XDC) is included with the special address:
 * 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE
 *
 * @returns {UseAllWalletBalancesReturn} Object with balances mapped by token address
 *
 * @example
 * const { balances, isLoading, error } = useAllWalletBalances();
 * if (!isLoading && !error) {
 *   const wxdcBalance = balances['0xC2EA...'];
 *   console.log('WXDC Balance:', wxdcBalance.formattedBalance);
 *
 *   // Native token balance
 *   const xdcBalance = balances[NATIVE_TOKEN_ADDRESS];
 *   console.log('XDC Balance:', xdcBalance.formattedBalance);
 * }
 */
export function useAllWalletBalances(): UseAllWalletBalancesReturn {
  const { contracts, network, tokens } = useChainConfig();
  const { address } = useAccount();

  const { data, isLoading, error, refetch } = useReadContract({
    address: contracts.walletBalanceProvider,
    abi: WALLET_BALANCE_PROVIDER_ABI,
    functionName: "getUserWalletBalances",
    args: address ? [contracts.poolAddressesProvider, address] : undefined,
    chainId: network.chainId,
    query: {
      enabled: !!address,
    },
  });

  if (error) {
    console.error("useAllWalletBalances error:", error);
  }

  // Return empty object if user is not connected or data is not available
  if (!address || !data) {
    return {
      balances: {},
      isLoading,
      error: error as Error | null,
      refetch,
    };
  }

  // Wallet Balance Provider returns [tokens[], balances[]]
  const [tokenAddresses, tokenBalances] = data as [string[], bigint[]];

  // Create a map to store decimals for known tokens
  const decimalsMap: Record<string, number> = {
    [tokens.wrappedNative.address.toLowerCase()]: tokens.wrappedNative.decimals,
    [tokens.usdc.address.toLowerCase()]: tokens.usdc.decimals,
    [tokens.cgo.address.toLowerCase()]: tokens.cgo.decimals,
    [NATIVE_TOKEN_ADDRESS.toLowerCase()]: network.nativeToken.decimals,
  };

  // Map token addresses to balances
  const balances: Record<string, TokenBalance> = {};

  tokenAddresses.forEach((tokenAddress, index) => {
    const balance = tokenBalances[index];
    const normalizedAddress = tokenAddress.toLowerCase();

    // Get decimals for this token (default to 18 if unknown)
    const decimals = decimalsMap[normalizedAddress] || 18;

    // Format balance with correct decimals
    const formattedBalance = formatUnits(balance, decimals);

    balances[tokenAddress] = {
      tokenAddress,
      balance,
      formattedBalance,
      decimals,
    };
  });

  return {
    balances,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}
