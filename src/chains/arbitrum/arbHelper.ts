export const CONTRACTS = {
  pool: "0xBfC91D59fdAA134A4ED45f7B584cAf96D7792Eff",
  wethInterestRateStrategy: "0x46d3a2A27E2c700d74f21AD3290A20cB8437F7b7",
  usdcInterestRateStrategy: "0x5C0A210C9C0df2Ab147BDE7D9583c07cEb3131CD",
  uiPoolDataProvider: "0x97Cf44bF6a9A3D2B4F32b05C480dBEdC018F72A9",
  walletBalanceProvider: "0x1Be33D186a081eFDf15310e4bdEd81E828C47f9b",
} as const;

export const TOKENS = {
  weth: {
    address: "0x1dF462e2712496373A347f8ad10802a5E95f053D",
    symbol: "WETH",
    decimals: 18,
  },
  usdc: {
    address: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
    symbol: "USDC",
    decimals: 6,
  },
} as const;
