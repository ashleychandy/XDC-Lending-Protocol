import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { CONTRACTS } from "@/chains/arbitrum/arbHelper";
import { poolAbi } from "@/config/poolAbi";

export function useBorrow() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const borrow = async (
    tokenAddress: string,
    amount: string,
    decimals: number,
    userAddress: string,
    interestRateMode: number = 2 // 2 = variable rate
  ) => {
    const amountInWei = parseUnits(amount, decimals);

    return writeContract({
      address: CONTRACTS.pool,
      abi: poolAbi,
      functionName: "borrow",
      args: [
        tokenAddress as `0x${string}`,
        amountInWei,
        BigInt(interestRateMode),
        0,
        userAddress as `0x${string}`,
      ],
    });
  };

  return {
    borrow,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
