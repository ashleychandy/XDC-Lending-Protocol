import { poolAbi } from "@/config/poolAbi";
import { useChainConfig } from "@/hooks/useChainConfig";
import { maxUint256, parseUnits } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export function useWithdraw() {
  const { contracts } = useChainConfig();
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const withdraw = async (
    tokenAddress: string,
    amount: string,
    decimals: number,
    userAddress: string,
    withdrawAll: boolean = false
  ) => {
    const amountInWei = withdrawAll ? maxUint256 : parseUnits(amount, decimals);

    return writeContract({
      address: contracts.pool,
      abi: poolAbi,
      functionName: "withdraw",
      args: [
        tokenAddress as `0x${string}`,
        amountInWei,
        userAddress as `0x${string}`,
      ],
    });
  };

  return {
    withdraw,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
