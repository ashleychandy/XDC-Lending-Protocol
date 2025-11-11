// src/hooks/useMainnetAssetDetails.ts
// This hook fetches data from XDC mainnet or testnet for the landing page based on env
import {
  CREDITIFY_ORACLE_ABI,
  ERC20_ABI,
  POOL_ABI,
  POOL_ADDRESSES_PROVIDER_ABI,
} from "@/config/abis";
import { CHAIN_CONFIGS } from "@/config/chains";
import { getTokenLogo } from "@/config/tokenLogos";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";
import { xdc, xdcTestnet } from "wagmi/chains";

// Check environment variable to determine which network to use
const isTestnet = import.meta.env.VITE_TESTNET === "true";
const LANDING_CHAIN_ID = isTestnet ? xdcTestnet.id : xdc.id;
const LANDING_CONFIG = CHAIN_CONFIGS[LANDING_CHAIN_ID];

const getTokenMetadata = () =>
  ({
    eth: {
      symbol: LANDING_CONFIG.tokens.weth.symbol,
      name: LANDING_CONFIG.tokens.weth.symbol,
      fullName: `${LANDING_CONFIG.tokens.weth.symbol} Reserve`,
      icon: getTokenLogo(LANDING_CONFIG.tokens.weth.symbol),
      address: LANDING_CONFIG.tokens.weth.address,
      decimals: 18,
    },
    weth: {
      symbol: LANDING_CONFIG.tokens.weth.symbol,
      name: LANDING_CONFIG.tokens.weth.symbol,
      fullName: `${LANDING_CONFIG.tokens.weth.symbol} Reserve`,
      icon: getTokenLogo(LANDING_CONFIG.tokens.weth.symbol),
      address: LANDING_CONFIG.tokens.weth.address,
      decimals: 18,
    },
    wxdc: {
      symbol: LANDING_CONFIG.tokens.weth.symbol,
      name: LANDING_CONFIG.tokens.weth.symbol,
      fullName: `${LANDING_CONFIG.tokens.weth.symbol} Reserve`,
      icon: getTokenLogo(LANDING_CONFIG.tokens.weth.symbol),
      address: LANDING_CONFIG.tokens.weth.address,
      decimals: 18,
    },
    usdc: {
      symbol: "USDC",
      name: "USD Coin",
      fullName: "USD Coin",
      icon: getTokenLogo("USDC"),
      address: LANDING_CONFIG.tokens.usdc.address,
      decimals: 6,
    },
  }) as const;

function decodeReserveConfiguration(configuration: bigint) {
  const BORROW_CAP_START = 80n;
  const SUPPLY_CAP_START = 116n;
  const CAP_MASK = (1n << 36n) - 1n;

  const borrowCap = Number((configuration >> BORROW_CAP_START) & CAP_MASK);
  const supplyCap = Number((configuration >> SUPPLY_CAP_START) & CAP_MASK);

  return {
    borrowCap,
    supplyCap,
  };
}

export function useMainnetAssetDetails(tokenSymbol: string) {
  const TOKEN_METADATA = getTokenMetadata();

  const token =
    TOKEN_METADATA[tokenSymbol?.toLowerCase() as keyof typeof TOKEN_METADATA] ||
    TOKEN_METADATA.weth;

  // Get reserve data from Pool - from configured landing chain
  const { data: reserveData, isLoading: isLoadingReserve } = useReadContract({
    address: LANDING_CONFIG.contracts.pool,
    abi: POOL_ABI,
    functionName: "getReserveData",
    args: [token.address as `0x${string}`],
    chainId: LANDING_CHAIN_ID,
  });

  const reserveDataAny = reserveData as any;

  // Get total variable debt
  const { data: totalVariableDebt } = useReadContract({
    address: reserveDataAny?.variableDebtTokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "totalSupply",
    chainId: LANDING_CHAIN_ID,
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
    chainId: LANDING_CHAIN_ID,
    query: {
      enabled: !!reserveDataAny?.aTokenAddress,
    },
  });

  // Get asset price from oracle
  const { data: priceOracleAddress } = useReadContract({
    address: LANDING_CONFIG.contracts.pool,
    chainId: LANDING_CHAIN_ID,
    abi: POOL_ABI,
    functionName: "ADDRESSES_PROVIDER",
  });

  const { data: oracleAddress } = useReadContract({
    address: priceOracleAddress as `0x${string}`,
    abi: POOL_ADDRESSES_PROVIDER_ABI,
    functionName: "getPriceOracle",
    chainId: LANDING_CHAIN_ID,
    query: {
      enabled: !!priceOracleAddress,
    },
  });

  const { data: assetPrice } = useReadContract({
    address: oracleAddress as `0x${string}`,
    abi: CREDITIFY_ORACLE_ABI,
    functionName: "getAssetPrice",
    args: [token.address as `0x${string}`],
    chainId: LANDING_CHAIN_ID,
    query: {
      enabled: !!oracleAddress,
    },
  });

  // Decode supply and borrow caps from configuration
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

  // Total borrowed = variable debt (no stable debt in this protocol)
  const variableDebt = totalVariableDebt
    ? parseFloat(formatUnits(totalVariableDebt, token.decimals))
    : 0;

  const totalBorrowed = variableDebt;

  // Available liquidity = actual balance of underlying token in aToken contract
  const availableLiquidityInTokens = underlyingBalance
    ? parseFloat(formatUnits(underlyingBalance, token.decimals))
    : 0;

  // Total supplied = available liquidity + total borrowed
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

  // Calculate cap percentages
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
