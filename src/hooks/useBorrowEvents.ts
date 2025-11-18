import { POOL_ABI } from "@/config/abis";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useAccount } from "wagmi";
import { useContractEvents } from "./useContractEvents";

interface BorrowEvent {
  reserve: string;
  user: string;
  onBehalfOf: string;
  amount: bigint;
  interestRateMode: number;
  borrowRate: bigint;
  referralCode: number;
  blockNumber: bigint;
  transactionHash: string;
  logIndex: number;
}

interface UseBorrowEventsParams {
  userAddress?: string;
  assetAddress?: string;
  fromBlock?: bigint;
  toBlock?: bigint;
  enabled?: boolean;
}

/**
 * Hook to fetch Borrow events from the Pool contract
 *
 * @example
 * // Fetch all borrow events for current user
 * const { events, isLoading, refetch } = useBorrowEvents();
 *
 * @example
 * // Fetch borrow events for specific asset
 * const { events } = useBorrowEvents({
 *   assetAddress: '0x...',
 *   fromBlock: 1000000n
 * });
 */
export function useBorrowEvents({
  userAddress,
  assetAddress,
  fromBlock,
  toBlock,
  enabled = true,
}: UseBorrowEventsParams = {}) {
  const { contracts } = useChainConfig();
  const { address: connectedAddress } = useAccount();

  const targetAddress = userAddress || connectedAddress;

  // Build args for filtering
  const args: Record<string, any> = {};
  if (assetAddress) args.reserve = assetAddress;
  if (targetAddress) args.onBehalfOf = targetAddress;

  return useContractEvents<BorrowEvent>({
    address: contracts.pool,
    abi: POOL_ABI,
    eventName: "Borrow",
    args: Object.keys(args).length > 0 ? args : undefined,
    fromBlock,
    toBlock,
    enabled,
  });
}
