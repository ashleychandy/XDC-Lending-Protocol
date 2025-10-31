// src/config/markets.xdc.ts
export type XdcMarket = {
  symbol: string

  // underlying (ERC20). If native XDC is wrapped, put WXDC here.
  underlying: `0x${string}`
  underlyingDecimals: number

  // Aave-like tokens – these balances are interest-accruing
  aToken: `0x${string}`
  variableDebtToken?: `0x${string}` | null
  stableDebtToken?: `0x${string}` | null

  // Price source: either a Chainlink-like AggregatorV3 feed...
  priceFeed?: `0x${string}` | null
  priceFeedDecimals?: number // usually 8

  // ...or a temporary hardcoded USD price if you don't have a feed yet
  hardcodedUsdPrice?: number | null
}

/**
 * >>> FILL THESE with your real XDC contracts <<<
 * Below are placeholders to show the shape.
 */
export const XDC_MARKETS: XdcMarket[] = [
  {
    symbol: "XDC",
    underlying: "0xUnderlyingXdcOrWXDC",
    underlyingDecimals: 18,
    aToken: "0xATokenForXDC",
    variableDebtToken: "0xVariableDebtTokenForXDC",
    stableDebtToken: null,
    // Use a feed if you have it, else temp hardcode
    priceFeed: null,
    priceFeedDecimals: 8,
    hardcodedUsdPrice: 0.05, // TEMP EXAMPLE
  },
  {
    symbol: "USDC",
    underlying: "0xUSDC",
    underlyingDecimals: 6,
    aToken: "0xATokenForUSDC",
    variableDebtToken: "0xVariableDebtForUSDC",
    stableDebtToken: null,
    priceFeed: null,
    priceFeedDecimals: 8,
    hardcodedUsdPrice: 1.0,
  },
];
