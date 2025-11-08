// Token logo configuration
import arbitrumIcon from "@/assets/images/arbitrum.svg";
import ethIcon from "@/assets/images/eth.svg";
import usdcIcon from "@/assets/images/usdc.svg";
import wethIcon from "@/assets/images/weth.svg";
import xdcIcon from "@/assets/images/xdc-network-logo.svg";

/**
 * Token logo mapping by symbol
 * Supports both native and ERC20 tokens
 */
export const TOKEN_LOGOS: Record<string, string> = {
  // Native tokens
  XDC: xdcIcon,
  ETH: ethIcon,
  MATIC: ethIcon, // Placeholder
  BNB: ethIcon, // Placeholder
  AVAX: ethIcon, // Placeholder

  // Wrapped native tokens
  WXDC: xdcIcon,
  WETH: wethIcon,
  WMATIC: ethIcon,
  WBNB: ethIcon,
  WAVAX: ethIcon,

  // Stablecoins
  USDC: usdcIcon,
  USDT: usdcIcon, // Using USDC icon as placeholder
  DAI: usdcIcon, // Using USDC icon as placeholder
  BUSD: usdcIcon, // Using USDC icon as placeholder

  // Other tokens
  WBTC: ethIcon, // Placeholder
  LINK: ethIcon, // Placeholder
  UNI: ethIcon, // Placeholder
  AAVE: ethIcon, // Placeholder
};

/**
 * Chain logo mapping by chain ID
 */
export const CHAIN_LOGOS: Record<number, string> = {
  50: xdcIcon, // XDC Mainnet
  51: xdcIcon, // XDC Apothem Testnet
  1: ethIcon, // Ethereum Mainnet
  5: ethIcon, // Goerli
  11155111: ethIcon, // Sepolia
  421614: arbitrumIcon, // Arbitrum Sepolia
  42161: arbitrumIcon, // Arbitrum One
  137: ethIcon, // Polygon (placeholder)
  80001: ethIcon, // Mumbai (placeholder)
};

/**
 * Get token logo by symbol
 * Returns a fallback icon if not found
 */
export function getTokenLogo(symbol: string): string {
  const upperSymbol = symbol.toUpperCase();
  return TOKEN_LOGOS[upperSymbol] || ethIcon; // Default to ETH icon
}

/**
 * Get chain logo by chain ID
 * Returns a fallback icon if not found
 */
export function getChainLogo(chainId: number): string {
  return CHAIN_LOGOS[chainId] || ethIcon; // Default to ETH icon
}

/**
 * Get native token symbol for a chain
 */
export function getNativeTokenSymbol(chainId: number): string {
  const nativeTokens: Record<number, string> = {
    50: "XDC", // XDC Mainnet
    51: "XDC", // XDC Apothem Testnet
    1: "ETH", // Ethereum Mainnet
    5: "ETH", // Goerli
    11155111: "ETH", // Sepolia
    421614: "ETH", // Arbitrum Sepolia
    42161: "ETH", // Arbitrum One
    137: "MATIC", // Polygon
    80001: "MATIC", // Mumbai
  };

  return nativeTokens[chainId] || "ETH";
}

/**
 * Get wrapped native token symbol for a chain
 */
export function getWrappedTokenSymbol(chainId: number): string {
  const wrappedTokens: Record<number, string> = {
    50: "WXDC", // XDC Mainnet
    51: "WXDC", // XDC Apothem Testnet
    1: "WETH", // Ethereum Mainnet
    5: "WETH", // Goerli
    11155111: "WETH", // Sepolia
    421614: "WETH", // Arbitrum Sepolia
    42161: "WETH", // Arbitrum One
    137: "WMATIC", // Polygon
    80001: "WMATIC", // Mumbai
  };

  return wrappedTokens[chainId] || "WETH";
}

/**
 * Check if a token is a native token
 */
export function isNativeToken(symbol: string, chainId: number): boolean {
  const nativeSymbol = getNativeTokenSymbol(chainId);
  return symbol.toUpperCase() === nativeSymbol;
}

/**
 * Check if a token is a wrapped native token
 */
export function isWrappedNativeToken(symbol: string, chainId: number): boolean {
  const wrappedSymbol = getWrappedTokenSymbol(chainId);
  return symbol.toUpperCase() === wrappedSymbol;
}
