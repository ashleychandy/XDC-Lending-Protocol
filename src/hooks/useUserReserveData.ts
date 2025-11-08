import {
  ATOKEN_ABI,
  CREDITIFY_PROTOCOL_DATA_PROVIDER_ABI,
  POOL_ABI,
  VARIABLE_DEBT_TOKEN_ABI,
} from "@/config/abis";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useAccount, useReadContract } from "wagmi";

export const useUserReserveData = (
  assetAddress: string,
  aTokenAddress: string
) => {
  const { contracts, network } = useChainConfig();
  const { address } = useAccount();

  // Get aToken balance (supplied amount)
  const { data: aTokenBalance } = useReadContract({
    address: aTokenAddress as `0x${string}`,
    abi: ATOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: network.chainId,
    query: {
      enabled: !!address && !!aTokenAddress && aTokenAddress !== "",
    },
  });

  // Get variable debt token balance (borrowed amount)
  const { data: reserveData } = useReadContract({
    address: contracts.pool,
    chainId: network.chainId,
    abi: POOL_ABI,
    functionName: "getReserveData",
    args: [assetAddress as `0x${string}`],
  });

  const variableDebtTokenAddress = (reserveData as any)
    ?.variableDebtTokenAddress;

  const { data: debtBalance } = useReadContract({
    address: variableDebtTokenAddress as `0x${string}`,
    abi: VARIABLE_DEBT_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: network.chainId,
    query: {
      enabled: !!address && !!variableDebtTokenAddress,
    },
  });

  // Get user reserve data from ProtocolDataProvider which includes collateral status
  const { data: userReserveData } = useReadContract({
    address: contracts.protocolDataProvider,
    chainId: network.chainId,
    abi: CREDITIFY_PROTOCOL_DATA_PROVIDER_ABI,
    functionName: "getUserReserveData",
    args:
      address && assetAddress
        ? [assetAddress as `0x${string}`, address]
        : undefined,
    query: {
      enabled: !!address && !!assetAddress,
    },
  });

  // Extract usageAsCollateralEnabled from the returned data
  // getUserReserveData returns a tuple with usageAsCollateralEnabled as the last element
  const isUsingAsCollateral = userReserveData
    ? (userReserveData as any)[8] || false
    : false;

  return {
    suppliedAmount: aTokenBalance || BigInt(0),
    borrowedAmount: debtBalance || BigInt(0),
    isUsingAsCollateral,
  };
};
