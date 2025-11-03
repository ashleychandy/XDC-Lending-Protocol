import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { erc20Abi, parseUnits } from "viem";
import { CONTRACTS } from "@/chains/arbitrum/arbHelper";
import { poolAbi } from "@/config/poolAbi";

export function useSupply() {
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

  const supply = async (
    tokenAddress: string,
    amount: string,
    decimals: number,
    userAddress: string
  ) => {
    const amountInWei = parseUnits(amount, decimals);

    return writeContract({
      address: CONTRACTS.pool,
      abi: poolAbi,
      functionName: "supply",
      args: [
        tokenAddress as `0x${string}`,
        amountInWei,
        userAddress as `0x${string}`,
        0,
      ],
    });
  };

  return {
    approve,
    supply,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
