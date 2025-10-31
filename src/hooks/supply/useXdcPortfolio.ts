import { useQuery } from "@tanstack/react-query";
import { readContracts } from "@wagmi/core";
import { useAccount, useChainId } from "wagmi";
import { xrc20Abi } from "@/config/abis";
import { config } from "@/providers/WalletProvider";
import { XDC_MARKETS } from "@/config/market.xdc";

// 🆕 Example Arbitrum Sepolia market list
export const ARBITRUM_SEPOLIA_MARKETS = [
  {
    symbol: "USDC",
    underlyingDecimals: 6,
    aToken: "0xYourATokenAddressHere",
    variableDebtToken: "0xYourVariableDebtTokenAddressHere",
    stableDebtToken: null,
    priceFeed: "0xYourChainlinkPriceFeedAddressHere",
    priceFeedDecimals: 8,
  },
  {
    symbol: "WETH",
    underlyingDecimals: 18,
    aToken: "0xYourWETHATokenAddressHere",
    variableDebtToken: "0xYourWETHVariableDebtTokenAddressHere",
    stableDebtToken: null,
    priceFeed: "0xYourWETHChainlinkFeedAddressHere",
    priceFeedDecimals: 8,
  },
];

// --- Shared AggregatorV3Interface ABI ---
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

// --- Helper functions ---
const toNumber = (x: bigint, decimals: number) => Number(x) / 10 ** decimals;

const computeNetApyPct = (totalSupplyUsd: number, totalDebtUsd: number) => {
  if (totalSupplyUsd <= 0 && totalDebtUsd <= 0) return 0;
  const supplyApr = 0.03;
  const borrowApr = 0.07;
  const denom = Math.max(1, totalSupplyUsd - totalDebtUsd);
  return (
    ((totalSupplyUsd * supplyApr - totalDebtUsd * borrowApr) / denom) * 100
  );
};

const queryKeys = {
  portfolio: (address?: `0x${string}`, chainId?: number) =>
    ["portfolio", { address, chainId }] as const,
};

// --- Chain to Market mapping ---
const MARKET_MAP: Record<number, any[]> = {
  50: XDC_MARKETS, // XDC Mainnet
  421614: ARBITRUM_SEPOLIA_MARKETS, // ✅ Arbitrum Sepolia Testnet
};

type SupportedChainId = (typeof config.chains)[number]["id"];

export function useXdcPortfolio() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const chainIsSupported =
    !!chainId && config.chains.some((c) => c.id === chainId);

  const markets = chainId && MARKET_MAP[chainId] ? MARKET_MAP[chainId] : [];

  const query = useQuery({
    queryKey: queryKeys.portfolio(address, chainId),
    enabled: isConnected && !!address && chainIsSupported && markets.length > 0,
    refetchInterval: 10_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (!address || !isConnected || !chainIsSupported || !chainId)
        return null;

      const contracts: any[] = [];

      for (const m of markets) {
        // aToken balance
        contracts.push({
          address: m.aToken,
          abi: xrc20Abi,
          functionName: "balanceOf",
          args: [address],
          chainId: chainId as SupportedChainId,
        });

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

      let idx = 0;
      let totalSupplyUsd = 0;
      let totalDebtUsd = 0;

      for (const m of markets) {
        const supplyRes = res[idx++]?.result as bigint | undefined;
        const supplyTokens = supplyRes
          ? toNumber(supplyRes, m.underlyingDecimals)
          : 0;

        let vDebtTokens = 0;
        if (m.variableDebtToken) {
          const r = res[idx++]?.result as bigint | undefined;
          vDebtTokens = r ? toNumber(r, m.underlyingDecimals) : 0;
        }

        let sDebtTokens = 0;
        if (m.stableDebtToken) {
          const r = res[idx++]?.result as bigint | undefined;
          sDebtTokens = r ? toNumber(r, m.underlyingDecimals) : 0;
        }

        let priceUsd = m.hardcodedUsdPrice ?? 0;
        if (m.priceFeed) {
          const feed = res[idx++]?.result as { answer: bigint } | undefined;
          if (feed?.answer != null) {
            const denom = 10 ** (m.priceFeedDecimals ?? 8);
            priceUsd = Number(feed.answer) / denom;
          }
        }

        totalSupplyUsd += supplyTokens * priceUsd;
        totalDebtUsd += (vDebtTokens + sDebtTokens) * priceUsd;
      }

      const netWorthUsd = totalSupplyUsd - totalDebtUsd;
      const netApyPct = computeNetApyPct(totalSupplyUsd, totalDebtUsd);
      const rewardsUsd = 0;

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
