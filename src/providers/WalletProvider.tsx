import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { http } from "viem";
import { WagmiProvider } from "wagmi";
import { arbitrumSepolia, xdc, xdcTestnet } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Creditify",
  projectId: "YOUR_PROJECT_ID",
  chains: [xdc, xdcTestnet, arbitrumSepolia],

  transports: {
    [xdc.id]: http("https://erpc.xinfin.network"),
    [xdcTestnet.id]: http("https://erpc.apothem.network"),
    [arbitrumSepolia.id]: http("https://sepolia-rollup.arbitrum.io/rpc"),
  },
  batch: {
    multicall: false,
  },
});

const queryClient = new QueryClient();

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={xdcTestnet}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
