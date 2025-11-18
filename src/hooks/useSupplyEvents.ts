import { POOL_ABI } from "@/config/abis";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useAccount } from "wagmi";
import { useContractEvents } from "./useContractEvents";

interface SupplyEvent {
  reserve: string;
  user: string;
  onBehalfOf: string;
  amount: bigint;
  referralCode: number;
  blockNumber: bigint;
  transactionHash: string;
  logIndex: number;
}

interface UseSupplyEventsParams {
  userAddress?: string;
  assetAddress?: string;
  fromBlock?: bigint;
  toBlock?: bigint;
  enabled?: boolean;
}

/**
 * Hook to fetch Supply events from the Pool contract
 *
 * @example
 * // Fetch all supply events for current user
 * const { events, isLoading, refetch } = useSupplyEvents();
 *
 * @example
 * // Fetch supply events for specific asset
 * const { events } = useSupplyEvents({
 *   assetAddress: '0x...',
 *   fromBlock: 1000000n
 * });
 */
export function useSupplyEvents({
  userAddress,
  assetAddress,
  fromBlock,
  toBlock,
  enabled = true,
}: UseSupplyEventsParams = {}) {
  const { contracts } = useChainConfig();
  const { address: connectedAddress } = useAccount();

  const targetAddress = userAddress || connectedAddress;

  // Build args for filtering
  const args: Record<string, any> = {};
  if (assetAddress) args.reserve = assetAddress;
  if (targetAddress) args.onBehalfOf = targetAddress;

  return useContractEvents<SupplyEvent>({
    address: contracts.pool,
    abi: POOL_ABI,
    eventName: "Supply",
    args: Object.keys(args).length > 0 ? args : undefined,
    fromBlock,
    toBlock,
    enabled,
  });
}
