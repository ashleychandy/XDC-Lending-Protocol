import { XDC_MARKETS } from "@/config/market.xdc";
import { useQuery } from "@tanstack/react-query";
import { readContracts } from "@wagmi/core";
import { useAccount, useChainId } from "wagmi";
import { xrc20Abi } from "@/config/abis";
import { config } from "@/providers/WalletProvider";

// Chainlink aggregator ABI
const aggV3Abi = [
  {
    type: "function",
    name: "latestRoundData",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "roundId", type: "uint80" },
      { name: "answer", type: "int256" },
      { name: "startedAt", type: "uint256" },
      { name: "updatedAt", type: "uint256" },
      { name: "answeredInRound", type: "uint80" },
    ],
  },
] as const;

// Helper to normalize BigInt
const toNumber = (x: bigint, decimals: number) => Number(x) / 10 ** decimals;

// Placeholder: simple borrow APRs
const computeBorrowApyPct = (totalDebtUsd: number) => {
  if (totalDebtUsd <= 0) return 0;
  const baseBorrowApr = 0.07; // 7% average APR
  return baseBorrowApr * 100;
};

const queryKeys = {
  borrow: (address?: `0x${string}`, chainId?: number) =>
    ["xdcBorrow", { address, chainId }] as const,
};

type SupportedChainId = (typeof config.chains)[number]["id"];

export function useXdcBorrow() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const chainIsSupported =
    !!chainId && config.chains.some((c) => c.id === chainId);

  const query = useQuery({
    queryKey: queryKeys.borrow(address, chainId),
    enabled:
      isConnected && !!address && chainIsSupported && XDC_MARKETS.length > 0,
    refetchInterval: 10_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (!address || !isConnected || !chainIsSupported || !chainId)
        return null;

      const contracts: any[] = [];

      // Push variable + stable debt tokens + price feeds
      for (const m of XDC_MARKETS) {
        if (m.variableDebtToken) {
          contracts.push({
            address: m.variableDebtToken,
            abi: xrc20Abi,
            functionName: "balanceOf",
            args: [address],
            chainId: chainId as SupportedChainId,
          });
        }

        if (m.stableDebtToken) {
          contracts.push({
            address: m.stableDebtToken,
            abi: xrc20Abi,
            functionName: "balanceOf",
            args: [address],
            chainId: chainId as SupportedChainId,
          });
        }

        if (m.priceFeed) {
          contracts.push({
            address: m.priceFeed,
            abi: aggV3Abi,
            functionName: "latestRoundData",
            args: [],
            chainId: chainId as SupportedChainId,
          });
        }
      }

      const res = await readContracts(config, {
        contracts,
        allowFailure: true,
      });

      // Parse results
      let idx = 0;
      let totalDebtUsd = 0;

      for (const m of XDC_MARKETS) {
        let vDebtTokens = 0;
        let sDebtTokens = 0;
        let priceUsd = m.hardcodedUsdPrice != null ? m.hardcodedUsdPrice : 0;

        // variable debt
        if (m.variableDebtToken) {
          const r = res[idx++]?.result as bigint | undefined;
          vDebtTokens = r ? toNumber(r, m.underlyingDecimals) : 0;
        }

        // stable debt
        if (m.stableDebtToken) {
          const r = res[idx++]?.result as bigint | undefined;
          sDebtTokens = r ? toNumber(r, m.underlyingDecimals) : 0;
        }

        // price feed
        if (m.priceFeed) {
          const feed = res[idx++]?.result as { answer: bigint } | undefined;
          if (feed?.answer != null) {
            const denom = 10 ** (m.priceFeedDecimals ?? 8);
            priceUsd = Number(feed.answer) / denom;
          }
        }

        const totalTokens = vDebtTokens + sDebtTokens;
        const debtUsd = totalTokens * priceUsd;
        totalDebtUsd += debtUsd;
      }

      const avgBorrowApy = computeBorrowApyPct(totalDebtUsd);

      return { totalDebtUsd, avgBorrowApy };
    },
  });

  return {
    totalDebtUsd: query.data?.totalDebtUsd ?? null,
    avgBorrowApy: query.data?.avgBorrowApy ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
