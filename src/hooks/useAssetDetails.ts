// src/hooks/useAssetDetails.ts
import {
  CREDITIFY_ORACLE_ABI,
  ERC20_ABI,
  POOL_ABI,
  POOL_ADDRESSES_PROVIDER_ABI,
} from "@/config/abis";
import { getTokenLogo } from "@/config/tokenLogos";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";
import { useChainConfig } from "./useChainConfig";

const getTokenMetadata = (tokens: any) =>
  ({
    eth: {
      symbol: "WETH",
      name: "Wrapped Ether",
      fullName: "Wrapped Ether",
      icon: getTokenLogo("WETH"),
      address: tokens.weth.address,
      decimals: 18,
    },
    weth: {
      symbol: "WETH",
      name: "Wrapped Ether",
      fullName: "Wrapped Ether",
      icon: getTokenLogo("WETH"),
      address: tokens.weth.address,
      decimals: 18,
    },
    usdc: {
      symbol: "USDC",
      name: "USD Coin",
      fullName: "USD Coin",
      icon: getTokenLogo("USDC"),
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
    abi: POOL_ABI,
    functionName: "getReserveData",
    args: [token.address as `0x${string}`],
    chainId: network.chainId,
  });

  const reserveDataAny = reserveData as any;

  // Get aToken total supply (total supplied)
  const { data: aTokenTotalSupply } = useReadContract({
    address: reserveDataAny?.aTokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "totalSupply",
    chainId: network.chainId,
    query: {
      enabled: !!reserveDataAny?.aTokenAddress,
    },
  });

  // Get total stable debt
  const { data: totalStableDebt } = useReadContract({
    address: reserveDataAny?.stableDebtTokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "totalSupply",
    chainId: network.chainId,
    query: {
      enabled: !!reserveDataAny?.stableDebtTokenAddress,
    },
  });

  // Get total variable debt
  const { data: totalVariableDebt } = useReadContract({
    address: reserveDataAny?.variableDebtTokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "totalSupply",
    chainId: network.chainId,
    query: {
      enabled: !!reserveDataAny?.variableDebtTokenAddress,
    },
  });

  // Get underlying token balance of aToken (actual available liquidity in the pool)
  const { data: underlyingBalance } = useReadContract({
    address: token.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [reserveDataAny?.aTokenAddress as `0x${string}`],
    chainId: network.chainId,
    query: {
      enabled: !!reserveDataAny?.aTokenAddress,
    },
  });

  // Get asset price from oracle
  const { data: priceOracleAddress } = useReadContract({
    address: contracts.pool,
    chainId: network.chainId,
    abi: POOL_ABI,
    functionName: "ADDRESSES_PROVIDER",
  });

  const { data: oracleAddress } = useReadContract({
    address: priceOracleAddress as `0x${string}`,
    abi: POOL_ADDRESSES_PROVIDER_ABI,
    functionName: "getPriceOracle",
    chainId: network.chainId,
    query: {
      enabled: !!priceOracleAddress,
    },
  });

  const { data: assetPrice } = useReadContract({
    address: oracleAddress as `0x${string}`,
    abi: CREDITIFY_ORACLE_ABI,
    functionName: "getAssetPrice",
    args: [token.address as `0x${string}`],
    chainId: network.chainId,
    query: {
      enabled: !!oracleAddress,
    },
  });

  // Decode supply and borrow caps from configuration
  // Configuration is a nested tuple with a 'data' field
  const configData = reserveDataAny?.configuration
    ? (reserveDataAny.configuration as any).data || reserveDataAny.configuration
    : 0n;
  const caps = configData
    ? decodeReserveConfiguration(BigInt(configData))
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
  const oraclePrice = assetPrice
    ? parseFloat(formatUnits(assetPrice as bigint, 8))
    : 0;

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
  const supplyApy = reserveDataAny?.currentLiquidityRate
    ? rateToApy(reserveDataAny.currentLiquidityRate as bigint)
    : "0.00";
  const borrowApy = reserveDataAny?.currentVariableBorrowRate
    ? rateToApy(reserveDataAny.currentVariableBorrowRate as bigint)
    : "0.00";

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
    aTokenAddress: reserveDataAny?.aTokenAddress,
    stableDebtTokenAddress: reserveDataAny?.stableDebtTokenAddress,
    variableDebtTokenAddress: reserveDataAny?.variableDebtTokenAddress,

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
