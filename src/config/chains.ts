import { arbitrumSepolia, xdc, xdcTestnet } from "wagmi/chains";

export interface ChainConfig {
  contracts: {
    pool: `0x${string}`;
    poolAddressesProvider: `0x${string}`;
    uiPoolDataProvider: `0x${string}`;
    protocolDataProvider: `0x${string}`;
    walletBalanceProvider: `0x${string}`;
    oracle: `0x${string}`;
    uiIncentiveDataProvider?: `0x${string}`;
  };
  tokens: {
    weth: {
      address: `0x${string}`;
      symbol: string;
      decimals: number;
      aToken: `0x${string}`;
      variableDebtToken: `0x${string}`;
    };
    usdc: {
      address: `0x${string}`;
      symbol: string;
      decimals: number;
      aToken: `0x${string}`;
      variableDebtToken: `0x${string}`;
    };
  };
  network: {
    name: string;
    chainId: number;
    icon: string;
  };
}

export const CHAIN_CONFIGS: Record<number, ChainConfig> = {
  // XDC Mainnet
  [xdc.id]: {
    contracts: {
      pool: "0x35d4c4c4ca208F50330edD0Bb1592be7e29bE861",
      poolAddressesProvider: "0xd0425D719be064a640868F8d4c7d0F8A70510913",
      uiPoolDataProvider: "0x547593068Df1496C7dE4fcabE64E1B214B26Ab77",
      protocolDataProvider: "0x4135bA78F54aB5fF80eb9DE7d535293a319C99b7",
      walletBalanceProvider: "0x55F14A53B0e595d6d8118dE6b14B5A4d92509AaB",
      oracle: "0x0f659a3e35BC502BF67Bf119778c8936E9A7b84e",
      uiIncentiveDataProvider: "0x69E15dF062F9C79F7eE0d377EBC9C12a34F059b5",
    },
    tokens: {
      weth: {
        address: "0x36c3461aa4Ad40153bbb666fCb4A94FBB81246f2",
        symbol: "WETH",
        decimals: 18,
        aToken: "0x09Fa3c5452Ad7da2B0041B2E92b1caDCA8aA15Fc",
        variableDebtToken: "0xC47EEfAd9c7Fe28FB1829cA5ec731a88050AD788",
      },
      usdc: {
        address: "0xE899E6C96dD269E1ea613F0B95dCB6411A510eca",
        symbol: "USDC",
        decimals: 6,
        aToken: "0xc87b0EF1327CBae802Eb8a65212B20628Ed84Ffc",
        variableDebtToken: "0xb05F802a093033bc13b3D85A00111E11315c1Ea5",
      },
    },
    network: {
      name: "XDC Mainnet",
      chainId: 50,
      icon: "/src/assets/images/xdc-icon.webp",
    },
  },
  // XDC Apothem Testnet
  [xdcTestnet.id]: {
    contracts: {
      pool: "0x35d4c4c4ca208F50330edD0Bb1592be7e29bE861",
      poolAddressesProvider: "0xd0425D719be064a640868F8d4c7d0F8A70510913",
      uiPoolDataProvider: "0x547593068Df1496C7dE4fcabE64E1B214B26Ab77",
      protocolDataProvider: "0x4135bA78F54aB5fF80eb9DE7d535293a319C99b7",
      walletBalanceProvider: "0x55F14A53B0e595d6d8118dE6b14B5A4d92509AaB",
      oracle: "0x0f659a3e35BC502BF67Bf119778c8936E9A7b84e",
      uiIncentiveDataProvider: "0x69E15dF062F9C79F7eE0d377EBC9C12a34F059b5",
    },
    tokens: {
      weth: {
        address: "0x36c3461aa4Ad40153bbb666fCb4A94FBB81246f2",
        symbol: "WETH",
        decimals: 18,
        aToken: "0x09Fa3c5452Ad7da2B0041B2E92b1caDCA8aA15Fc",
        variableDebtToken: "0xC47EEfAd9c7Fe28FB1829cA5ec731a88050AD788",
      },
      usdc: {
        address: "0xE899E6C96dD269E1ea613F0B95dCB6411A510eca",
        symbol: "USDC",
        decimals: 6,
        aToken: "0xc87b0EF1327CBae802Eb8a65212B20628Ed84Ffc",
        variableDebtToken: "0xb05F802a093033bc13b3D85A00111E11315c1Ea5",
      },
    },
    network: {
      name: "XDC Apothem",
      chainId: 51,
      icon: "/src/assets/images/xdc-icon.webp",
    },
  },
  // Arbitrum Sepolia
  [arbitrumSepolia.id]: {
    contracts: {
      pool: "0x35d4c4c4ca208F50330edD0Bb1592be7e29bE861",
      poolAddressesProvider: "0xd0425D719be064a640868F8d4c7d0F8A70510913",
      uiPoolDataProvider: "0xb4D22b730518FdA4d95C2E4110F24496FB250f33",
      protocolDataProvider: "0x4135bA78F54aB5fF80eb9DE7d535293a319C99b7",
      walletBalanceProvider: "0x9a0c75502Bf6BA8a3aAAD995Db8c2554C114DA9a",
      oracle: "0x0f659a3e35BC502BF67Bf119778c8936E9A7b84e",
    },
    tokens: {
      weth: {
        address: "0x36c3461aa4Ad40153bbb666fCb4A94FBB81246f2",
        symbol: "WETH",
        decimals: 18,
        aToken: "0x09Fa3c5452Ad7da2B0041B2E92b1caDCA8aA15Fc",
        variableDebtToken: "0xC47EEfAd9c7Fe28FB1829cA5ec731a88050AD788",
      },
      usdc: {
        address: "0xE899E6C96dD269E1ea613F0B95dCB6411A510eca",
        symbol: "USDC",
        decimals: 6,
        aToken: "0xc87b0EF1327CBae802Eb8a65212B20628Ed84Ffc",
        variableDebtToken: "0xb05F802a093033bc13b3D85A00111E11315c1Ea5",
      },
    },
    network: {
      name: "Arbitrum Sepolia",
      chainId: 421614,
      icon: "/src/assets/images/arbitrum.svg",
    },
  },
};

export const getChainConfig = (chainId: number | undefined): ChainConfig => {
  if (!chainId || !CHAIN_CONFIGS[chainId]) {
    // Default to XDC Apothem
    return CHAIN_CONFIGS[xdcTestnet.id];
  }
  return CHAIN_CONFIGS[chainId];
};
