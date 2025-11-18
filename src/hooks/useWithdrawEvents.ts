import { POOL_ABI } from "@/config/abis";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useAccount } from "wagmi";
import { useContractEvents } from "./useContractEvents";

interface WithdrawEvent {
  reserve: string;
  user: string;
  to: string;
  amount: bigint;
  blockNumber: bigint;
  transactionHash: string;
  logIndex: number;
}

interface UseWithdrawEventsParams {
  userAddress?: string;
  assetAddress?: string;
  fromBlock?: bigint;
  toBlock?: bigint;
  enabled?: boolean;
}

export function useWithdrawEvents({
  userAddress,
  assetAddress,
  fromBlock,
  toBlock,
  enabled = true,
}: UseWithdrawEventsParams = {}) {
  const { contracts } = useChainConfig();
  const { address: connectedAddress } = useAccount();

  const targetAddress = userAddress || connectedAddress;

  const args: Record<string, any> = {};
  if (assetAddress) args.reserve = assetAddress;
  if (targetAddress) args.user = targetAddress;

  return useContractEvents<WithdrawEvent>({
    address: contracts.pool,
    abi: POOL_ABI as any,
    eventName: "Withdraw",
    args: Object.keys(args).length > 0 ? args : undefined,
    fromBlock,
    toBlock,
    enabled,
  });
}
