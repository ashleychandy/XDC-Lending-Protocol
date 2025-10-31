// src/config/wagmi.ts
import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { defineChain } from 'viem'

// XDC mainnet
export const xdc = defineChain({
  id: 50,
  name: 'XDC Network',
  nativeCurrency: { name: 'XDC', symbol: 'XDC', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.xinfin.network'] } },
  blockExplorers: { default: { name: 'XDC Explorer', url: 'https://explorer.xinfin.network' } },
})

// XDC testnet (Apothem)
export const apothem = defineChain({
  id: 51,
  name: 'Apothem (XDC Testnet)',
  nativeCurrency: { name: 'TXDC', symbol: 'TXDC', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.apothem.network'] } },
  blockExplorers: { default: { name: 'Apothem Explorer', url: 'https://explorer.apothem.network' } },
})

export const config = createConfig({
  chains: [xdc, apothem],
  connectors: [injected()],
  transports: {
    [xdc.id]: http(),
    [apothem.id]: http(),
  },
})
