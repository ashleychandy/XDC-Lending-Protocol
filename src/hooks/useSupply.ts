import { poolAbi } from "@/config/poolAbi";
import { useChainConfig } from "@/hooks/useChainConfig";
import { erc20Abi, parseUnits } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export function useSupply() {
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

  const supply = async (
    tokenAddress: string,
    amount: string,
    decimals: number,
    userAddress: string
  ) => {
    const amountInWei = parseUnits(amount, decimals);

    return writeContract({
      address: contracts.pool,
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
