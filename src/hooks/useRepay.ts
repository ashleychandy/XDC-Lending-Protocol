import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, maxUint256, erc20Abi } from "viem";
import { CONTRACTS } from "@/chains/arbitrum/arbHelper";
import { poolAbi } from "@/config/poolAbi";

export function useRepay() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const approve = async (
    tokenAddress: string,
    amount: string,
    decimals: number
  ) => {
    const amountInWei = parseUnits(amount, decimals);

    return writeContract({
      address: tokenAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: "approve",
      args: [CONTRACTS.pool, amountInWei],
    });
  };

  const repay = async (
    tokenAddress: string,
    amount: string,
    decimals: number,
    userAddress: string,
    interestRateMode: number = 2, // 2 = variable rate
    repayAll: boolean = false
  ) => {
    const amountInWei = repayAll ? maxUint256 : parseUnits(amount, decimals);

    return writeContract({
      address: CONTRACTS.pool,
      abi: poolAbi,
      functionName: "repay",
      args: [
        tokenAddress as `0x${string}`,
        amountInWei,
        BigInt(interestRateMode),
        userAddress as `0x${string}`,
      ],
    });
  };

  return {
    approve,
    repay,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
