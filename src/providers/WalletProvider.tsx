import React from "react";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type Chain, http } from "viem";

// XDC Mainnet
const xdcMainnet: Chain = {
  id: 50,
  name: "XDC Mainnet",
  nativeCurrency: {
    name: "XDC",
    symbol: "XDC",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.xinfin.network"],
    },
    public: {
      http: ["https://rpc.xinfin.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "XDC Explorer",
      url: "https://explorer.xinfin.network",
    },
  },
  testnet: false,
};

// XDC Apothem Testnet
const xdcTestnet: Chain = {
  id: 51,
  name: "XDC Apothem Testnet",
  nativeCurrency: {
    name: "TXDC",
    symbol: "TXDC",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.apothem.network"],
    },
    public: {
      http: ["https://rpc.apothem.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Apothem Explorer",
      url: "https://apothem.network",
    },
  },
  testnet: true,
};

const config = getDefaultConfig({
  appName: "XDC Lending Protocol",
  projectId: "YOUR_PROJECT_ID",
  chains: [xdcMainnet, xdcTestnet],
  transports: {
    [xdcMainnet.id]: http(),
    [xdcTestnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={xdcMainnet}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
