import { CREDITIFY_PROTOCOL_DATA_PROVIDER_ABI } from "@/config/abis";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useReadContract } from "wagmi";

/**
 * Reserve token data structure returned by Protocol Data Provider
 */
export interface ReserveToken {
  symbol: string;
  tokenAddress: string;
}

/**
 * Return type for useAllReserves hook
 */
export interface UseAllReservesReturn {
  reserves: ReserveToken[];
  aTokens: ReserveToken[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * Fetches all reserve tokens and aTokens from Protocol Data Provider
 *
 * This hook makes two calls to get all reserves and aTokens instead of
 * multiple individual calls, reducing RPC usage.
 *
 * Protocol Data Provider methods:
 * - getAllReservesTokens(): Returns array of {symbol, tokenAddress} for all reserves
 * - getAllATokens(): Returns array of {symbol, tokenAddress} for all aTokens
 *
 * @returns {UseAllReservesReturn} Object containing reserves and aTokens arrays with loading/error states
 *
 * @example
 * const { reserves, aTokens, isLoading, error } = useAllReserves();
 * if (!isLoading && !error) {
 *   reserves.forEach(reserve => {
 *     console.log(reserve.symbol, reserve.tokenAddress);
 *   });
 * }
 */
export function useAllReserves(): UseAllReservesReturn {
  const { contracts, network } = useChainConfig();

  // Fetch all reserve tokens
  const {
    data: reservesData,
    isLoading: reservesLoading,
    error: reservesError,
  } = useReadContract({
    address: contracts.protocolDataProvider,
    abi: CREDITIFY_PROTOCOL_DATA_PROVIDER_ABI,
    functionName: "getAllReservesTokens",
    chainId: network.chainId,
  });

  // Fetch all aTokens
  const {
    data: aTokensData,
    isLoading: aTokensLoading,
    error: aTokensError,
  } = useReadContract({
    address: contracts.protocolDataProvider,
    abi: CREDITIFY_PROTOCOL_DATA_PROVIDER_ABI,
    functionName: "getAllATokens",
    chainId: network.chainId,
  });

  const isLoading = reservesLoading || aTokensLoading;
  const error = (reservesError || aTokensError) as Error | null;

  if (error) {
    console.error("useAllReserves error:", error);
  }

  // Return empty arrays if data is not available
  if (!reservesData || !aTokensData) {
    return {
      reserves: [],
      aTokens: [],
      isLoading,
      error,
    };
  }

  // Transform the data to match our interface
  // Protocol Data Provider returns array of tuples: [symbol, tokenAddress]
  const reserves = (reservesData as any[]).map((item: any) => ({
    symbol: item.symbol || item[0],
    tokenAddress: item.tokenAddress || item[1],
  }));

  const aTokens = (aTokensData as any[]).map((item: any) => ({
    symbol: item.symbol || item[0],
    tokenAddress: item.tokenAddress || item[1],
  }));

  return {
    reserves,
    aTokens,
    isLoading,
    error,
  };
}
