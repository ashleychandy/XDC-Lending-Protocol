import { getChainConfig } from "@/config/chains";
import { useAccount, useChainId } from "wagmi";
import { xdcTestnet } from "wagmi/chains";

export const useChainConfig = () => {
  const { isConnected } = useAccount();
  const connectedChainId = useChainId();

  // If wallet is not connected, use XDC Apothem as default
  // If wallet is connected, use the connected chain
  const chainId = isConnected ? connectedChainId : xdcTestnet.id;

  return getChainConfig(chainId);
};
