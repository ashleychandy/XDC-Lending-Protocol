import {
  ERC20_ABI,
  POOL_ABI,
  WRAPPED_TOKEN_GATEWAY_V3_ABI,
} from "@/config/abis";
import { useChainConfig } from "@/hooks/useChainConfig";
import { parseUnits } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export function useSupply() {
  const { contracts } = useChainConfig();
  const {
    data: hash,
    writeContract,
    writeContractAsync,
    isPending,
    error,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const approve = async (
    tokenAddress: string,
    amount: string,
    decimals: number
  ) => {
    const amountInWei = parseUnits(amount, decimals);

    return writeContractAsync({
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI,
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
      abi: POOL_ABI,
      functionName: "supply",
      args: [
        tokenAddress as `0x${string}`,
        amountInWei,
        userAddress as `0x${string}`,
        0,
      ],
    });
  };

  /**
   * Supply native token (XDC/ETH) directly without wrapping
   */
  const supplyNative = async (amount: string, userAddress: string) => {
    const amountInWei = parseUnits(amount, 18); // Native tokens are always 18 decimals

    return writeContract({
      address: contracts.wrappedTokenGateway,
      abi: WRAPPED_TOKEN_GATEWAY_V3_ABI,
      functionName: "depositETH",
      args: [
        contracts.pool,
        userAddress as `0x${string}`,
        0, // referralCode
      ],
      value: amountInWei,
    });
  };

  /**
   * Supply with permit - gasless approval in single transaction
   * @param tokenAddress - Token to supply
   * @param amount - Amount to supply
   * @param decimals - Token decimals
   * @param userAddress - User address
   * @param deadline - Permit deadline (unix timestamp)
   * @param permitV - Permit signature v
   * @param permitR - Permit signature r
   * @param permitS - Permit signature s
   */
  const supplyWithPermit = async (
    tokenAddress: string,
    amount: string,
    decimals: number,
    userAddress: string,
    deadline: number,
    permitV: number,
    permitR: `0x${string}`,
    permitS: `0x${string}`
  ) => {
    const amountInWei = parseUnits(amount, decimals);

    return writeContract({
      address: contracts.pool,
      abi: POOL_ABI,
      functionName: "supplyWithPermit",
      args: [
        tokenAddress as `0x${string}`,
        amountInWei,
        userAddress as `0x${string}`,
        0, // referralCode
        BigInt(deadline),
        permitV,
        permitR,
        permitS,
      ],
    });
  };

  return {
    approve,
    supply,
    supplyNative,
    supplyWithPermit,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
