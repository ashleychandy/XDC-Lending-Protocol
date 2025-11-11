// Token logo configuration
import ethIcon from "@/assets/images/eth.svg";
import usdcIcon from "@/assets/images/usdc.svg";
import wethIcon from "@/assets/images/weth.svg";
import xdc from "@/assets/images/XDC Primary Color Logo.svg";
import xdcIcon from "@/assets/images/xdc-icon.webp";
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
  50: xdc, // XDC Mainnet
  51: xdc, // XDC Apothem Testnet
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
  return CHAIN_LOGOS[chainId];
}

/**
 * Get native token symbol for a chain
 */
export function getNativeTokenSymbol(chainId: number): string {
  const nativeTokens: Record<number, string> = {
    50: "XDC", // XDC Mainnet
    51: "XDC", // XDC Apothem Testnet
  };

  return nativeTokens[chainId] || "XDC";
}

/**
 * Get wrapped native token symbol for a chain
 */
export function getWrappedTokenSymbol(chainId: number): string {
  const wrappedTokens: Record<number, string> = {
    50: "WXDC", // XDC Mainnet
    51: "WXDC", // XDC Apothem Testnet
  };

  return wrappedTokens[chainId] || "WXDC";
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
