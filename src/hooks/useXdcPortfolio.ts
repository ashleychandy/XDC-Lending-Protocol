// src/hooks/useXdcPortfolio.ts
import { XDC_MARKETS, type XdcMarket } from "@/config/market.xdc"; // ensure filename matches your actual file
import { useQuery } from "@tanstack/react-query";
import { readContracts } from "@wagmi/core";
import { useAccount, useChainId } from "wagmi";
import { config } from '../config/wagmi';
const erc20Abi = [
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ type: "uint256" }] },
] as const;

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

const toNumber = (x: bigint, decimals: number) => Number(x) / 10 ** decimals;

/** Replace with your real APR sources (protocol contracts/indexer) */
const computeNetApyPct = (totalSupplyUsd: number, totalDebtUsd: number) => {
  if (totalSupplyUsd <= 0 && totalDebtUsd <= 0) return 0;
  // Simple placeholder: 3% supply APR vs 7% borrow APR
  const supplyApr = 0.03;
  const borrowApr = 0.07;
  const denom = Math.max(1, totalSupplyUsd - totalDebtUsd);
  return ((totalSupplyUsd * supplyApr - totalDebtUsd * borrowApr) / denom) * 100;
};

const queryKeys = {
  portfolio: (address?: `0x${string}`, chainId?: number) =>
    ["xdcPortfolio", { address, chainId }] as const,
};

type SupportedChainId = (typeof config.chains)[number]["id"];

export function useXdcPortfolio() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const chainIsSupported = !!chainId && config.chains.some((c) => c.id === chainId);

  const query = useQuery({
    queryKey: queryKeys.portfolio(address, chainId),
    enabled: isConnected && !!address && chainIsSupported && XDC_MARKETS.length > 0,
    refetchInterval: 10_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (!address || !isConnected || !chainIsSupported || !chainId) return null;

      // ---- Multicall build ----
      // Option A (simple): loosen typing
      const contracts: any[] = [];

      // Option B (strict types): 
      // import type { ReadContractsParameters } from '@wagmi/core'
      // type ContractsParam = ReadContractsParameters<typeof config>['contracts']
      // const contracts: ContractsParam = [];

      for (const m of XDC_MARKETS) {
        // aToken balance
        contracts.push({
          address: m.aToken,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [address],
          chainId: chainId as SupportedChainId,
        });

        if (m.variableDebtToken) {
          contracts.push({
            address: m.variableDebtToken,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [address],
            chainId: chainId as SupportedChainId,
          });
        }

        if (m.stableDebtToken) {
          contracts.push({
            address: m.stableDebtToken,
            abi: erc20Abi,
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

      // Walk through results in the same order we pushed
      let idx = 0;
      let totalSupplyUsd = 0;
      let totalDebtUsd = 0;

      for (const m of XDC_MARKETS) {
        // supply
        const supplyRes = res[idx++]?.result as bigint | undefined;
        const supplyTokens = supplyRes ? toNumber(supplyRes, m.underlyingDecimals) : 0;

        // variable debt
        let vDebtTokens = 0;
        if (m.variableDebtToken) {
          const r = res[idx++]?.result as bigint | undefined;
          vDebtTokens = r ? toNumber(r, m.underlyingDecimals) : 0;
        }

        // stable debt
        let sDebtTokens = 0;
        if (m.stableDebtToken) {
          const r = res[idx++]?.result as bigint | undefined;
          sDebtTokens = r ? toNumber(r, m.underlyingDecimals) : 0;
        }

        // price
        let priceUsd = m.hardcodedUsdPrice != null ? m.hardcodedUsdPrice : 0;
        if (m.priceFeed) {
          const feed = res[idx++]?.result as { answer: bigint } | undefined;
          if (feed?.answer != null) {
            const denom = 10 ** (m.priceFeedDecimals ?? 8);
            priceUsd = Number(feed.answer) / denom;
          }
        }

        const supplyUsd = supplyTokens * priceUsd;
        const debtUsd = (vDebtTokens + sDebtTokens) * priceUsd;

        totalSupplyUsd += supplyUsd;
        totalDebtUsd += debtUsd;
      }

      const netWorthUsd = totalSupplyUsd - totalDebtUsd;
      const netApyPct = computeNetApyPct(totalSupplyUsd, totalDebtUsd);
      const rewardsUsd = 0; // plug your incentives later

      return { netWorthUsd, netApyPct, rewardsUsd };
    },
  });

  return {
    netWorthUsd: query.data?.netWorthUsd ?? null,
    netApyPct: query.data?.netApyPct ?? null,
    rewardsUsd: query.data?.rewardsUsd ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
