import {
  CREDITIFY_ORACLE_ABI,
  POOL_ABI,
  POOL_ADDRESSES_PROVIDER_ABI,
} from "@/config/abis";
import { useChainConfig } from "@/hooks/useChainConfig";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";

export const useAssetPrice = (assetAddress: string) => {
  const { contracts, network } = useChainConfig();
  const { data: priceOracleAddress } = useReadContract({
    address: contracts.pool,
    abi: POOL_ABI,
    functionName: "ADDRESSES_PROVIDER",
    chainId: network.chainId,
  });

  const { data: oracleAddress } = useReadContract({
    address: priceOracleAddress as `0x${string}`,
    abi: POOL_ADDRESSES_PROVIDER_ABI,
    functionName: "getPriceOracle",
    chainId: network.chainId,
    query: {
      enabled: !!priceOracleAddress,
    },
  });

  const { data: assetPrice, isLoading } = useReadContract({
    address: oracleAddress as `0x${string}`,
    abi: CREDITIFY_ORACLE_ABI,
    functionName: "getAssetPrice",
    args: [assetAddress as `0x${string}`],
    chainId: network.chainId,
    query: {
      enabled: !!oracleAddress && !!assetAddress,
    },
  });

  // Aave price oracle returns prices in USD with 8 decimals
  const priceInUsd = assetPrice
    ? parseFloat(formatUnits(assetPrice as bigint, 8))
    : 0;

  return {
    price: priceInUsd,
    isLoading,
  };
};
