import { POOL_ABI } from "@/config/abis";
import { useChainConfig } from "@/hooks/useChainConfig";
import { parseUnits } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export function useBorrow() {
  const { contracts } = useChainConfig();
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
      address: contracts.pool,
      abi: POOL_ABI,
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
