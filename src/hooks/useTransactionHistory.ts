import { POOL_ABI } from "@/config/abis";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useBlockNumber, usePublicClient } from "wagmi";

export interface Transaction {
  hash: string;
  type: "Supply" | "Withdraw" | "Borrow" | "Repay";
  asset: string;
  amount: string;
  timestamp: number;
  blockNumber: bigint;
}

interface CachedData {
  transactions: Transaction[];
  lastFetchBlock: bigint;
  timestamp: number;
}

interface UseTransactionHistoryParams {
  userAddress?: string;
  blockRange?: bigint;
  enabled?: boolean;
  cacheEnabled?: boolean;
  cacheDuration?: number; // in milliseconds
  onBlockRangeChange?: (newRange: bigint) => void;
}

interface UseTransactionHistoryReturn {
  transactions: Transaction[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  fetchOlderTransactions: () => void;
  currentBlockRange: bigint;
}

const getCacheKey = (address: string, chainId: number) =>
  `tx_history_${address}_${chainId}`;

const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const DEFAULT_BLOCK_RANGE = 50000n;

/**
 * Comprehensive hook for fetching transaction history from Pool contract events
 * Optimized for transaction history pages with caching and batch fetching
 *
 * @example
 * // Basic usage - fetches all transactions for connected user
 * const { transactions, isLoading, refetch } = useTransactionHistory();
 *
 * @example
 * // Custom block range and specific user
 * const { transactions } = useTransactionHistory({
 *   userAddress: '0x...',
 *   blockRange: 100000n,
 *   cacheEnabled: true
 * });
 */
export function useTransactionHistory({
  userAddress,
  blockRange = DEFAULT_BLOCK_RANGE,
  enabled = true,
  cacheEnabled = true,
  cacheDuration = DEFAULT_CACHE_DURATION,
  onBlockRangeChange,
}: UseTransactionHistoryParams = {}): UseTransactionHistoryReturn {
  const { contracts } = useChainConfig();
  const { address: connectedAddress, chain } = useAccount();
  const publicClient = usePublicClient();
  const { data: currentBlockNumber } = useBlockNumber({ watch: true });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentBlockRange, setCurrentBlockRange] =
    useState<bigint>(blockRange);

  const targetAddress = userAddress || connectedAddress;

  // Load cached data on mount
  useEffect(() => {
    if (!cacheEnabled || !targetAddress || !chain?.id) return;

    const cacheKey = getCacheKey(targetAddress, chain.id);
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const parsedCache: CachedData = JSON.parse(cached, (_key, value) => {
          if (_key === "blockNumber" || _key === "lastFetchBlock") {
            return BigInt(value);
          }
          return value;
        });

        const now = Date.now();
        if (now - parsedCache.timestamp < cacheDuration) {
          setTransactions(parsedCache.transactions);
        }
      } catch (err) {
        console.error("Error loading cached transactions:", err);
        localStorage.removeItem(cacheKey);
      }
    }
  }, [targetAddress, chain?.id, cacheEnabled, cacheDuration]);

  const fetchTransactions = useCallback(async () => {
    if (!targetAddress || !publicClient || !currentBlockNumber || !enabled) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fromBlock =
        currentBlockNumber > currentBlockRange
          ? currentBlockNumber - currentBlockRange
          : 0n;

      // Fetch all event types in parallel
      const [supplyLogs, withdrawLogs, borrowLogs, repayLogs] =
        await Promise.all([
          publicClient.getLogs({
            address: contracts.pool,
            event: POOL_ABI.find((e: any) => e.name === "Supply") as any,
            fromBlock,
            toBlock: currentBlockNumber,
            args: { onBehalfOf: targetAddress },
          }),
          publicClient.getLogs({
            address: contracts.pool,
            event: POOL_ABI.find((e: any) => e.name === "Withdraw") as any,
            fromBlock,
            toBlock: currentBlockNumber,
            args: { user: targetAddress },
          }),
          publicClient.getLogs({
            address: contracts.pool,
            event: POOL_ABI.find((e: any) => e.name === "Borrow") as any,
            fromBlock,
            toBlock: currentBlockNumber,
            args: { onBehalfOf: targetAddress },
          }),
          publicClient.getLogs({
            address: contracts.pool,
            event: POOL_ABI.find((e: any) => e.name === "Repay") as any,
            fromBlock,
            toBlock: currentBlockNumber,
            args: { user: targetAddress },
          }),
        ]);

      // Get unique block numbers for batch fetching
      const allLogs = [
        ...supplyLogs,
        ...withdrawLogs,
        ...borrowLogs,
        ...repayLogs,
      ];
      const uniqueBlockNumbers = [
        ...new Set(allLogs.map((log) => log.blockNumber)),
      ];

      // Batch fetch all blocks
      const blocks = await Promise.all(
        uniqueBlockNumbers.map((blockNumber) =>
          publicClient.getBlock({ blockNumber })
        )
      );

      // Create block cache for O(1) lookup
      const blockCache = new Map(blocks.map((block) => [block.number, block]));

      // Process all transactions
      const allTxs: Transaction[] = [];

      const processLogs = (
        logs: any[],
        type: Transaction["type"],
        amountKey: string = "amount"
      ) => {
        logs.forEach((log) => {
          const block = blockCache.get(log.blockNumber);
          if (block) {
            allTxs.push({
              hash: log.transactionHash,
              type,
              asset: log.args.reserve || "Unknown",
              amount: log.args[amountKey]?.toString() || "0",
              timestamp: Number(block.timestamp),
              blockNumber: log.blockNumber,
            });
          }
        });
      };

      processLogs(supplyLogs, "Supply");
      processLogs(withdrawLogs, "Withdraw");
      processLogs(borrowLogs, "Borrow");
      processLogs(repayLogs, "Repay");

      // Sort by timestamp descending (newest first)
      allTxs.sort((a, b) => b.timestamp - a.timestamp);

      setTransactions(allTxs);

      // Cache the results
      if (cacheEnabled && targetAddress && chain?.id) {
        const cacheKey = getCacheKey(targetAddress, chain.id);
        const cacheData: CachedData = {
          transactions: allTxs,
          lastFetchBlock: currentBlockNumber,
          timestamp: Date.now(),
        };

        try {
          const serialized = JSON.stringify(cacheData, (_key, value) =>
            typeof value === "bigint" ? value.toString() : value
          );
          localStorage.setItem(cacheKey, serialized);
        } catch (err) {
          console.error("Error caching transactions:", err);
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err : new Error("Failed to fetch transactions");
      setError(errorMessage);
      console.error("Error fetching transactions:", err);
    } finally {
      setIsLoading(false);
    }
  }, [
    targetAddress,
    publicClient,
    currentBlockNumber,
    enabled,
    currentBlockRange,
    contracts.pool,
    cacheEnabled,
    chain?.id,
  ]);

  const fetchOlderTransactions = useCallback(() => {
    const newRange = currentBlockRange + 50000n;
    setCurrentBlockRange(newRange);
    if (onBlockRangeChange) {
      onBlockRangeChange(newRange);
    }
  }, [currentBlockRange, onBlockRangeChange]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    isLoading,
    error,
    refetch: fetchTransactions,
    fetchOlderTransactions,
    currentBlockRange,
  };
}
