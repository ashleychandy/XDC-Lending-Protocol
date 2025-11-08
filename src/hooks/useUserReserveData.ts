import { ATOKEN_ABI, POOL_ABI, VARIABLE_DEBT_TOKEN_ABI } from "@/config/abis";
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

  const variableDebtTokenAddress = reserveData?.variableDebtTokenAddress;

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

  return {
    suppliedAmount: aTokenBalance || BigInt(0),
    borrowedAmount: debtBalance || BigInt(0),
  };
};
