import { ERC20_ABI, POOL_ABI } from "@/config/abis";
import { useChainConfig } from "@/hooks/useChainConfig";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";

/**
 * Hook to get available liquidity in a reserve
 * Available liquidity = underlying token balance in aToken contract
 */
export function useReserveLiquidity(
  assetAddress: string,
  decimals: number = 18
) {
  const { contracts, network } = useChainConfig();

  // First get the aToken address from reserve data
  const { data: reserveData } = useReadContract({
    address: contracts.pool,
    abi: POOL_ABI,
    functionName: "getReserveData",
    args: [assetAddress as `0x${string}`],
    chainId: network.chainId,
  });

  const reserveDataAny = reserveData as any;

  // Get underlying token balance of aToken (actual available liquidity)
  const { data: underlyingBalance, isLoading } = useReadContract({
    address: assetAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [reserveDataAny?.aTokenAddress as `0x${string}`],
    chainId: network.chainId,
    query: {
      enabled: !!reserveDataAny?.aTokenAddress,
    },
  });

  if (!underlyingBalance) {
    return {
      availableLiquidity: "0",
      availableLiquidityRaw: BigInt(0),
      isLoading,
    };
  }

  return {
    availableLiquidity: formatUnits(underlyingBalance as bigint, decimals),
    availableLiquidityRaw: underlyingBalance as bigint,
    isLoading,
  };
}
