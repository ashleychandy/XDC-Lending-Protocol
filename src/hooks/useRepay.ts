import { poolAbi } from "@/config/poolAbi";
import { useChainConfig } from "@/hooks/useChainConfig";
import { erc20Abi, maxUint256, parseUnits } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export function useRepay() {
  const { contracts } = useChainConfig();
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
      args: [contracts.pool, amountInWei],
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
      address: contracts.pool,
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
