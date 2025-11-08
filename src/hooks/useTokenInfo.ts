import {
  getNativeTokenSymbol,
  getTokenLogo,
  getWrappedTokenSymbol,
  isNativeToken,
  isWrappedNativeToken,
} from "@/config/tokenLogos";
import { useChainConfig } from "@/hooks/useChainConfig";

export interface TokenInfo {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logo: string;
  isNative: boolean;
  isWrappedNative: boolean;
}

/**
 * Hook to get comprehensive token information
 * Supports both native and ERC20 tokens
 */
export function useTokenInfo(tokenSymbol: string): TokenInfo {
  const { tokens, network } = useChainConfig();

  // Normalize symbol
  const symbol = tokenSymbol.toUpperCase();

  // Check if it's a native token
  const native = isNativeToken(symbol, network.chainId);
  const wrappedNative = isWrappedNativeToken(symbol, network.chainId);

  // Get token details based on symbol
  let tokenDetails: TokenInfo;

  if (symbol === "WETH" || symbol === "ETH") {
    tokenDetails = {
      symbol: symbol === "ETH" ? getNativeTokenSymbol(network.chainId) : "WETH",
      name: symbol === "ETH" ? "Native Token" : "Wrapped Ether",
      address: tokens.weth.address,
      decimals: tokens.weth.decimals,
      logo: getTokenLogo(symbol),
      isNative: symbol === "ETH",
      isWrappedNative: symbol === "WETH",
    };
  } else if (symbol === "USDC") {
    tokenDetails = {
      symbol: "USDC",
      name: "USD Coin",
      address: tokens.usdc.address,
      decimals: tokens.usdc.decimals,
      logo: getTokenLogo("USDC"),
      isNative: false,
      isWrappedNative: false,
    };
  } else if (symbol === "XDC" || symbol === "WXDC") {
    // XDC specific handling
    tokenDetails = {
      symbol: symbol === "XDC" ? "XDC" : "WXDC",
      name: symbol === "XDC" ? "XDC Network" : "Wrapped XDC",
      address: tokens.weth.address, // WXDC uses the weth address slot
      decimals: 18,
      logo: getTokenLogo(symbol),
      isNative: symbol === "XDC",
      isWrappedNative: symbol === "WXDC",
    };
  } else {
    // Default/fallback
    tokenDetails = {
      symbol,
      name: symbol,
      address: tokens.weth.address,
      decimals: 18,
      logo: getTokenLogo(symbol),
      isNative: native,
      isWrappedNative: wrappedNative,
    };
  }

  return tokenDetails;
}

/**
 * Get all available tokens for the current chain
 */
export function useAvailableTokens(): TokenInfo[] {
  const { tokens, network } = useChainConfig();

  const nativeSymbol = getNativeTokenSymbol(network.chainId);
  const wrappedSymbol = getWrappedTokenSymbol(network.chainId);

  return [
    {
      symbol: nativeSymbol,
      name: `Native ${nativeSymbol}`,
      address: "0x0000000000000000000000000000000000000000", // Native token address
      decimals: 18,
      logo: getTokenLogo(nativeSymbol),
      isNative: true,
      isWrappedNative: false,
    },
    {
      symbol: wrappedSymbol,
      name: `Wrapped ${nativeSymbol}`,
      address: tokens.weth.address,
      decimals: tokens.weth.decimals,
      logo: getTokenLogo(wrappedSymbol),
      isNative: false,
      isWrappedNative: true,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      address: tokens.usdc.address,
      decimals: tokens.usdc.decimals,
      logo: getTokenLogo("USDC"),
      isNative: false,
      isWrappedNative: false,
    },
  ];
}
