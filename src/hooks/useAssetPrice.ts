import { CONTRACTS } from "@/chains/arbitrum/arbHelper";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";

export const useAssetPrice = (assetAddress: string) => {
  const { data: priceOracleAddress } = useReadContract({
    address: CONTRACTS.pool,
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
