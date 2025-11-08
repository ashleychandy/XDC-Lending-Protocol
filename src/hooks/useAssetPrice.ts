import { useChainConfig } from "@/hooks/useChainConfig";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";

export const useAssetPrice = (assetAddress: string) => {
  const { contracts, network } = useChainConfig();
  const { data: priceOracleAddress } = useReadContract({
    address: contracts.pool,
    abi: [
      {
        inputs: [],
        name: "ADDRESSES_PROVIDER",
        outputs: [{ name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
    ] as const,
    functionName: "ADDRESSES_PROVIDER",
    chainId: network.chainId,
  });

  const { data: oracleAddress } = useReadContract({
    address: priceOracleAddress as `0x${string}`,
    abi: [
      {
        inputs: [],
        name: "getPriceOracle",
        outputs: [{ name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
    ] as const,
    functionName: "getPriceOracle",
    chainId: network.chainId,
    query: {
      enabled: !!priceOracleAddress,
    },
  });

  const { data: assetPrice, isLoading } = useReadContract({
    address: oracleAddress as `0x${string}`,
    abi: [
      {
        inputs: [{ name: "asset", type: "address" }],
        name: "getAssetPrice",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ] as const,
    functionName: "getAssetPrice",
    args: [assetAddress as `0x${string}`],
    chainId: network.chainId,
    query: {
      enabled: !!oracleAddress && !!assetAddress,
    },
  });

  // Aave price oracle returns prices in USD with 8 decimals
  const priceInUsd = assetPrice ? parseFloat(formatUnits(assetPrice, 8)) : 0;

  return {
    price: priceInUsd,
    isLoading,
  };
};
