import { useEffect, useState } from "react";
import type { Abi, Address } from "viem";
import { usePublicClient } from "wagmi";

interface UseContractEventsParams {
  address: Address;
  abi: Abi;
  eventName: string;
  fromBlock?: bigint;
  toBlock?: bigint;
  args?: Record<string, any>;
  enabled?: boolean;
}

interface UseContractEventsReturn<T = any> {
  events: T[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch contract events using viem
 *
 * @example
 * // Fetch Supply events for a specific user
 * const { events, isLoading } = useContractEvents({
 *   address: poolAddress,
 *   abi: POOL_ABI,
 *   eventName: 'Supply',
 *   args: { onBehalfOf: userAddress },
 *   fromBlock: 0n,
 * });
 */
export function useContractEvents<T = any>({
  address,
  abi,
  eventName,
  fromBlock,
  toBlock,
  args,
  enabled = true,
}: UseContractEventsParams): UseContractEventsReturn<T> {
  const publicClient = usePublicClient();
  const [events, setEvents] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = async () => {
    if (!publicClient || !enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const logs = await publicClient.getLogs({
        address,
        event: abi.find(
          (item: any) => item.type === "event" && item.name === eventName
        ) as any,
        args,
        fromBlock: fromBlock || "earliest",
        toBlock: toBlock || "latest",
      });

      // Parse the logs to extract event data
      const parsedEvents = logs.map((log: any) => ({
        ...log.args,
        blockNumber: log.blockNumber,
        transactionHash: log.transactionHash,
        logIndex: log.logIndex,
      }));

      setEvents(parsedEvents as T[]);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch events")
      );
      console.error("Error fetching events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [address, eventName, fromBlock, toBlock, JSON.stringify(args), enabled]);

  return {
    events,
    isLoading,
    error,
    refetch: fetchEvents,
  };
}
