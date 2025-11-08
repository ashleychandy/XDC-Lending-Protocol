import { useChainConfig } from "@/hooks/useChainConfig";
import { useAccount, useReadContract } from "wagmi";

export const useUserReserveData = (
  assetAddress: string,
  aTokenAddress: string
) => {
  const { contracts, network } = useChainConfig();
  const { address } = useAccount();

  // Get aToken balance (supplied amount)
  const { data: aTokenBalance } = useReadContract({
    address: aTokenAddress as `0x${string}`,
    abi: [
      {
        inputs: [{ name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ] as const,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: network.chainId,
    query: {
      enabled: !!address && !!aTokenAddress && aTokenAddress !== "",
    },
  });

  // Get variable debt token balance (borrowed amount)
  const { data: reserveData } = useReadContract({
    address: contracts.pool,
    chainId: network.chainId,
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

  const variableDebtTokenAddress = reserveData?.variableDebtTokenAddress;

  const { data: debtBalance } = useReadContract({
    address: variableDebtTokenAddress as `0x${string}`,
    abi: [
      {
        inputs: [{ name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ] as const,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: network.chainId,
    query: {
      enabled: !!address && !!variableDebtTokenAddress,
    },
  });

  return {
    suppliedAmount: aTokenBalance || BigInt(0),
    borrowedAmount: debtBalance || BigInt(0),
  };
};
