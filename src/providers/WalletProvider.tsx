import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { http } from "viem";
import { WagmiProvider } from "wagmi";
import { xdc, xdcTestnet } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Creditify",
  projectId: "YOUR_PROJECT_ID",
  chains: [xdc, xdcTestnet],

  transports: {
    [xdc.id]: http("https://erpc.xinfin.network"),
    [xdcTestnet.id]: http("https://erpc.apothem.network"),
  },
  batch: {
    multicall: false,
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 1,
      staleTime: 5000,
    },
  },
});

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
