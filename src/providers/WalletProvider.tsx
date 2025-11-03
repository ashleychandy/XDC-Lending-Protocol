import React from "react";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { xdc, xdcTestnet, arbitrumSepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "XDC Lending Protocol",
  projectId: "YOUR_PROJECT_ID",
  chains: [xdc, xdcTestnet, arbitrumSepolia],
  transports: {
    [xdc.id]: http(),
    [xdcTestnet.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={arbitrumSepolia}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
