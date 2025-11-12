import {
  ERC20_ABI,
  POOL_ABI,
  WRAPPED_TOKEN_GATEWAY_V3_ABI,
} from "@/config/abis";
import { useChainConfig } from "@/hooks/useChainConfig";
import { maxUint256, parseUnits } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export function useRepay() {
  const { contracts } = useChainConfig();

  // Separate hook for approval transactions
  const approveContract = useWriteContract();
  const approveReceipt = useWaitForTransactionReceipt({
    hash: approveContract.data,
  });

  // Separate hook for repay transactions
  const repayContract = useWriteContract();
  const repayReceipt = useWaitForTransactionReceipt({
    hash: repayContract.data,
  });

  /**
   * Approve tokens for repay
   * Approves max uint256 for unlimited allowance
   */
  const approve = async (tokenAddress: string) => {
    return approveContract.writeContractAsync({
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [contracts.pool, maxUint256],
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

    return repayContract.writeContractAsync({
      address: contracts.pool,
      abi: POOL_ABI,
      functionName: "repay",
      args: [
        tokenAddress as `0x${string}`,
        amountInWei,
        BigInt(interestRateMode),
        userAddress as `0x${string}`,
      ],
    });
  };

  /**
   * Repay with native token (XDC) directly - automatically wraps
   */
  const repayNative = async (
    amount: string,
    userAddress: string,
    repayAll: boolean = false
  ) => {
    const amountInWei = repayAll ? maxUint256 : parseUnits(amount, 18);

    return repayContract.writeContractAsync({
      address: contracts.wrappedTokenGateway,
      abi: WRAPPED_TOKEN_GATEWAY_V3_ABI,
      functionName: "repayETH",
      args: [contracts.pool, amountInWei, userAddress as `0x${string}`],
      value: amountInWei,
    });
  };

  /**
   * Repay with permit - gasless approval in single transaction
   * @param tokenAddress - Token to repay
   * @param amount - Amount to repay
   * @param decimals - Token decimals
   * @param userAddress - User address
   * @param deadline - Permit deadline (unix timestamp)
   * @param permitV - Permit signature v
   * @param permitR - Permit signature r
   * @param permitS - Permit signature s
   * @param interestRateMode - Interest rate mode (default: 2 = variable)
   * @param repayAll - Whether to repay all debt
   */
  const repayWithPermit = async (
    tokenAddress: string,
    amount: string,
    decimals: number,
    userAddress: string,
    deadline: number,
    permitV: number,
    permitR: `0x${string}`,
    permitS: `0x${string}`,
    interestRateMode: number = 2,
    repayAll: boolean = false
  ) => {
    const amountInWei = repayAll ? maxUint256 : parseUnits(amount, decimals);

    return repayContract.writeContractAsync({
      address: contracts.pool,
      abi: POOL_ABI,
      functionName: "repayWithPermit",
      args: [
        tokenAddress as `0x${string}`,
        amountInWei,
        BigInt(interestRateMode),
        userAddress as `0x${string}`,
        BigInt(deadline),
        permitV,
        permitR,
        permitS,
      ],
    });
  };

  return {
    approve,
    repay,
    repayNative,
    repayWithPermit,
    // Approval transaction state
    approveHash: approveContract.data,
    approveIsPending: approveContract.isPending,
    approveIsConfirming: approveReceipt.isLoading,
    approveIsSuccess: approveReceipt.isSuccess,
    approveError: approveContract.error,
    // Repay transaction state
    hash: repayContract.data,
    isPending: repayContract.isPending,
    isConfirming: repayReceipt.isLoading,
    isSuccess: repayReceipt.isSuccess,
    error: repayContract.error,
  };
}
