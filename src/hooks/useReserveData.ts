import { CONTRACTS } from "@/chains/arbitrum/arbHelper";
import { useReadContract } from "wagmi";

export const useReserveData = (assetAddress: string) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACTS.pool,
    abi: [
      {
        inputs: [{ name: "asset", type: "address" }],
        name: "getReserveData",
        outputs: [
          {
            components: [
              { name: "configuration", type: "uint256" },
              { name: "liquidityIndex", type: "uint128" },
              { name: "currentLiquidityRate", type: "uint128" },
              { name: "variableBorrowIndex", type: "uint128" },
              { name: "currentVariableBorrowRate", type: "uint128" },
              { name: "currentStableBorrowRate", type: "uint128" },
              { name: "lastUpdateTimestamp", type: "uint40" },
              { name: "id", type: "uint16" },
              { name: "aTokenAddress", type: "address" },
              { name: "stableDebtTokenAddress", type: "address" },
              { name: "variableDebtTokenAddress", type: "address" },
              { name: "interestRateStrategyAddress", type: "address" },
              { name: "accruedToTreasury", type: "uint128" },
              { name: "unbacked", type: "uint128" },
              { name: "isolationModeTotalDebt", type: "uint128" },
            ],
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ] as const,
    functionName: "getReserveData",
    args: [assetAddress as `0x${string}`],
  });

  if (!data) {
    return {
      supplyApy: "0.00",
      borrowApy: "0.00",
      totalLiquidity: "0",
      aTokenAddress: "",
      isLoading,
      error,
    };
  }

  const RAY = BigInt(10 ** 27);
  const SECONDS_PER_YEAR = 31_536_000;

  const rateToApy = (rate: bigint) => {
    if (rate === BigInt(0)) return "0.00";
    const baseRate = Number(rate) / Number(RAY);
    const apy =
      (Math.pow(1 + baseRate / SECONDS_PER_YEAR, SECONDS_PER_YEAR) - 1) * 100;
    return apy.toFixed(2);
  };

  const supplyApy = rateToApy(data.currentLiquidityRate);
  const borrowApy = rateToApy(data.currentVariableBorrowRate);

  return {
    supplyApy,
    borrowApy,
    totalLiquidity: data.liquidityIndex.toString(),
    aTokenAddress: data.aTokenAddress,
    isLoading,
    error,
  };
};
