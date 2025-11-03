import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, maxUint256 } from "viem";
import { CONTRACTS } from "@/chains/arbitrum/arbHelper";
import { poolAbi } from "@/config/poolAbi";

export function useWithdraw() {
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
      address: CONTRACTS.pool,
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
