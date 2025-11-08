// src/hooks/useAssetDetails.ts
import { erc20Abi, formatUnits } from "viem";
import { useReadContract } from "wagmi";
import usdcIcon from "../assets/images/usdc.svg";
import wethIcon from "../assets/images/weth.svg";
import { useChainConfig } from "./useChainConfig";

const getTokenMetadata = (tokens: any) =>
  ({
    eth: {
      symbol: "WETH",
      name: "Wrapped Ether",
      fullName: "Wrapped Ether",
      icon: wethIcon,
      address: tokens.weth.address,
      decimals: 18,
    },
    weth: {
      symbol: "WETH",
      name: "Wrapped Ether",
      fullName: "Wrapped Ether",
      icon: wethIcon,
      address: tokens.weth.address,
      decimals: 18,
    },
    usdc: {
      symbol: "USDC",
      name: "USD Coin",
      fullName: "USD Coin",
      icon: usdcIcon,
      address: tokens.usdc.address,
      decimals: 6,
    },
  }) as const;

function decodeReserveConfiguration(configuration: bigint) {
  const BORROW_CAP_START = 80n;
  const SUPPLY_CAP_START = 116n;
  const CAP_MASK = (1n << 36n) - 1n; // 36 bits for each cap

  const borrowCap = Number((configuration >> BORROW_CAP_START) & CAP_MASK);
  const supplyCap = Number((configuration >> SUPPLY_CAP_START) & CAP_MASK);

  return {
    borrowCap,
    supplyCap,
  };
}

export function useAssetDetails(tokenSymbol: string) {
  const { contracts, tokens, network } = useChainConfig();
  const TOKEN_METADATA = getTokenMetadata(tokens);

  const token =
    TOKEN_METADATA[tokenSymbol?.toLowerCase() as keyof typeof TOKEN_METADATA] ||
    TOKEN_METADATA.weth;

  // Get reserve data from Aave Pool
  const { data: reserveData, isLoading: isLoadingReserve } = useReadContract({
    address: contracts.pool,
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
    args: [token.address as `0x${string}`],
    chainId: network.chainId,
  });

  // Get aToken total supply (total supplied)
  const { data: aTokenTotalSupply } = useReadContract({
    address: reserveData?.aTokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "totalSupply",
    chainId: network.chainId,
    query: {
      enabled: !!reserveData?.aTokenAddress,
    },
  });

  // Get total stable debt
  const { data: totalStableDebt } = useReadContract({
    address: reserveData?.stableDebtTokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "totalSupply",
    chainId: network.chainId,
    query: {
      enabled: !!reserveData?.stableDebtTokenAddress,
    },
  });

  // Get total variable debt
  const { data: totalVariableDebt } = useReadContract({
    address: reserveData?.variableDebtTokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "totalSupply",
    chainId: network.chainId,
    query: {
      enabled: !!reserveData?.variableDebtTokenAddress,
    },
  });

  // Get underlying token balance of aToken (actual available liquidity in the pool)
  const { data: underlyingBalance } = useReadContract({
    address: token.address as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [reserveData?.aTokenAddress as `0x${string}`],
    chainId: network.chainId,
    query: {
      enabled: !!reserveData?.aTokenAddress,
    },
  });

  // Get asset price from oracle
  const { data: priceOracleAddress } = useReadContract({
    address: contracts.pool,
    chainId: network.chainId,
    abi: [
      {
        inputs: [],
        name: "ADDRESSES_PROVIDER",
        outputs: [{ name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
    ] as const,
    functionName: "ADDRESSES_PROVIDER",
  });

  const { data: oracleAddress } = useReadContract({
    address: priceOracleAddress as `0x${string}`,
    abi: [
      {
        inputs: [],
        name: "getPriceOracle",
        outputs: [{ name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
    ] as const,
    functionName: "getPriceOracle",
    chainId: network.chainId,
    query: {
      enabled: !!priceOracleAddress,
    },
  });

  const { data: assetPrice } = useReadContract({
    address: oracleAddress as `0x${string}`,
    abi: [
      {
        inputs: [{ name: "asset", type: "address" }],
        name: "getAssetPrice",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ] as const,
    functionName: "getAssetPrice",
    args: [token.address as `0x${string}`],
    chainId: network.chainId,
    query: {
      enabled: !!oracleAddress,
    },
  });

  // Decode supply and borrow caps from configuration
  const caps = reserveData?.configuration
    ? decodeReserveConfiguration(reserveData.configuration)
    : { borrowCap: 0, supplyCap: 0 };

  // Calculate metrics
  const RAY = BigInt(10 ** 27);
  const SECONDS_PER_YEAR = 31_536_000;

  const rateToApy = (rate: bigint) => {
    if (rate === BigInt(0)) return "0.00";
    const baseRate = Number(rate) / Number(RAY);
    const apy =
      (Math.pow(1 + baseRate / SECONDS_PER_YEAR, SECONDS_PER_YEAR) - 1) * 100;
    return apy.toFixed(2);
  };

  // Oracle price (8 decimals)
  const oraclePrice = assetPrice ? parseFloat(formatUnits(assetPrice, 8)) : 0;

  // Total borrowed = stable debt + variable debt
  const stableDebt = totalStableDebt
    ? parseFloat(formatUnits(totalStableDebt, token.decimals))
    : 0;

  const variableDebt = totalVariableDebt
    ? parseFloat(formatUnits(totalVariableDebt, token.decimals))
    : 0;

  const totalBorrowed = stableDebt + variableDebt;

  // Available liquidity = actual balance of underlying token in aToken contract
  const availableLiquidityInTokens = underlyingBalance
    ? parseFloat(formatUnits(underlyingBalance, token.decimals))
    : 0;

  // Total supplied = available liquidity + total borrowed (Aave standard)
  const totalSupplied = availableLiquidityInTokens + totalBorrowed;

  // Reserve size in USD
  const reserveSize = totalSupplied * oraclePrice;

  // Available liquidity in USD
  const availableLiquidity = availableLiquidityInTokens * oraclePrice;

  // Utilization rate = totalBorrowed / (availableLiquidity + totalBorrowed)
  const utilizationRate =
    totalBorrowed > 0
      ? (totalBorrowed / (availableLiquidityInTokens + totalBorrowed)) * 100
      : 0;

  // Supply APY
  const supplyApy = rateToApy(reserveData?.currentLiquidityRate as bigint);
  const borrowApy = rateToApy(reserveData?.currentVariableBorrowRate as bigint);

  // Calculate cap percentages for progress circles
  const supplyCapPercentage =
    caps.supplyCap > 0
      ? Math.min((totalSupplied / caps.supplyCap) * 100, 100)
      : 0;

  const borrowCapPercentage =
    caps.borrowCap > 0
      ? Math.min((totalBorrowed / caps.borrowCap) * 100, 100)
      : 0;

  return {
    // Token metadata
    tokenInfo: {
      symbol: token.symbol,
      name: token.name,
      fullName: token.fullName,
      icon: token.icon,
      address: token.address,
      decimals: token.decimals,
    },

    // Reserve metrics
    reserveSize,
    availableLiquidity,
    availableLiquidityInTokens,
    utilizationRate,
    oraclePrice,

    // Supply/Borrow data
    totalSupplied,
    totalSuppliedUsd: totalSupplied * oraclePrice,
    totalBorrowed,
    totalBorrowedUsd: totalBorrowed * oraclePrice,
    stableDebt,
    variableDebt,

    // Caps and percentages
    supplyCap: caps.supplyCap,
    supplyCapUsd: caps.supplyCap * oraclePrice,
    supplyCapPercentage,
    borrowCap: caps.borrowCap,
    borrowCapUsd: caps.borrowCap * oraclePrice,
    borrowCapPercentage,
    hasSupplyCap: caps.supplyCap > 0,
    hasBorrowCap: caps.borrowCap > 0,

    // APY
    supplyApy,
    borrowApy,

    // Raw reserve data
    reserveData,
    aTokenAddress: reserveData?.aTokenAddress,
    stableDebtTokenAddress: reserveData?.stableDebtTokenAddress,
    variableDebtTokenAddress: reserveData?.variableDebtTokenAddress,

    // Loading state
    isLoading: isLoadingReserve,
  };
}

// Formatting utilities
export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function formatTokenAmount(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }
  return `${value.toFixed(2)}`;
}
