import {
  ATOKEN_ABI,
  POOL_ABI,
  WRAPPED_TOKEN_GATEWAY_V3_ABI,
} from "@/config/abis";
import { useChainConfig } from "@/hooks/useChainConfig";
import { maxUint256, parseUnits } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export function useWithdraw() {
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

  const withdraw = async (
    tokenAddress: string,
    amount: string,
    decimals: number,
    userAddress: string,
    withdrawAll: boolean = false
  ) => {
    const amountInWei = withdrawAll ? maxUint256 : parseUnits(amount, decimals);

    return writeContractAsync({
      address: contracts.pool,
      abi: POOL_ABI,
      functionName: "withdraw",
      args: [
        tokenAddress as `0x${string}`,
        amountInWei,
        userAddress as `0x${string}`,
      ],
    });
  };

  /**
   * Approve gateway to spend aTokens (needed for withdrawETH)
   */
  const approveGateway = async (aTokenAddress: string) => {
    return writeContractAsync({
      address: aTokenAddress as `0x${string}`,
      abi: ATOKEN_ABI,
      functionName: "approve",
      args: [contracts.wrappedTokenGateway as `0x${string}`, maxUint256],
    });
  };

  /**
   * Withdraw native token (XDC) directly - automatically unwraps
   * Note: Requires prior approval of aTokens to the gateway
   */
  const withdrawNative = async (
    amount: string,
    userAddress: string,
    decimals: number = 18
  ) => {
    const amountInWei = parseUnits(amount, decimals);

    return writeContractAsync({
      address: contracts.wrappedTokenGateway,
      abi: WRAPPED_TOKEN_GATEWAY_V3_ABI,
      functionName: "withdrawETH",
      args: [contracts.pool, amountInWei, userAddress as `0x${string}`],
    });
  };

  return {
    withdraw,
    withdrawNative,
    approveGateway,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
