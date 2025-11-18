import { POOL_ABI } from "@/config/abis";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useAccount } from "wagmi";
import { useContractEvents } from "./useContractEvents";

interface RepayEvent {
  reserve: string;
  user: string;
  repayer: string;
  amount: bigint;
  useATokens: boolean;
  blockNumber: bigint;
  transactionHash: string;
  logIndex: number;
}

interface UseRepayEventsParams {
  userAddress?: string;
  assetAddress?: string;
  fromBlock?: bigint;
  toBlock?: bigint;
  enabled?: boolean;
}

/**
 * Hook to fetch Repay events from the Pool contract
 */
export function useRepayEvents({
  userAddress,
  assetAddress,
  fromBlock,
  toBlock,
  enabled = true,
}: UseRepayEventsParams = {}) {
  const { contracts } = useChainConfig();
  const { address: connectedAddress } = useAccount();

  const targetAddress = userAddress || connectedAddress;

  const args: Record<string, any> = {};
  if (assetAddress) args.reserve = assetAddress;
  if (targetAddress) args.user = targetAddress;

  return useContractEvents<RepayEvent>({
    address: contracts.pool,
    abi: POOL_ABI,
    eventName: "Repay",
    args: Object.keys(args).length > 0 ? args : undefined,
    fromBlock,
    toBlock,
    enabled,
  });
}
