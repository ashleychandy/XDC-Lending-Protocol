import { useReadContract, useAccount } from "wagmi";
import { formatUnits } from "viem";
import { CONTRACTS } from "@/chains/arbitrum/arbHelper";
import { poolAbi } from "@/config/poolAbi";

export function useUserAccountData() {
  const { address } = useAccount();

  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACTS.pool,
    abi: poolAbi,
    functionName: "getUserAccountData",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  if (!data) {
    return {
      totalCollateral: "0",
      totalDebt: "0",
      availableBorrows: "0",
      currentLiquidationThreshold: "0",
      ltv: "0",
      healthFactor: "0",
      isLoading,
      error,
      refetch,
    };
  }

  const [
    totalCollateralBase,
    totalDebtBase,
    availableBorrowsBase,
    currentLiquidationThreshold,
    ltv,
    healthFactor,
  ] = data;

  return {
    totalCollateral: formatUnits(totalCollateralBase, 8), // Base currency has 8 decimals
    totalDebt: formatUnits(totalDebtBase, 8),
    availableBorrows: formatUnits(availableBorrowsBase, 8),
    currentLiquidationThreshold: (
      Number(currentLiquidationThreshold) / 100
    ).toString(),
    ltv: (Number(ltv) / 100).toString(),
    healthFactor: formatUnits(healthFactor, 18),
    isLoading,
    error,
    refetch,
  };
}
