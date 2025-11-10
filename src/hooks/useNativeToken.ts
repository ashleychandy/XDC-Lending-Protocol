import { WRAPPED_TOKEN_GATEWAY_V3_ABI } from "@/config/abis";
import { useChainConfig } from "@/hooks/useChainConfig";
import { parseUnits } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

/**
 * Hook for native token operations (XDC, ETH, etc.) via WrappedTokenGateway
 * Eliminates need for manual wrapping/unwrapping
 */
export function useNativeToken() {
  const { contracts } = useChainConfig();
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  /**
   * Deposit native token (XDC/ETH) to the protocol
   * Automatically wraps and supplies to the pool
   */
  const depositNative = async (amount: string, userAddress: string) => {
    const amountInWei = parseUnits(amount, 18); // Native tokens are always 18 decimals

    return writeContract({
      address: contracts.wrappedTokenGateway,
      abi: WRAPPED_TOKEN_GATEWAY_V3_ABI,
      functionName: "depositETH",
      args: [
        contracts.pool, // First param (unused in contract but required)
        userAddress as `0x${string}`, // onBehalfOf
        0, // referralCode
      ],
      value: amountInWei,
    });
  };

  /**
   * Withdraw native token (XDC/ETH) from the protocol
   * Automatically unwraps and sends native token
   */
  const withdrawNative = async (
    amount: string,
    userAddress: string,
    decimals: number = 18
  ) => {
    const amountInWei = parseUnits(amount, decimals);

    return writeContract({
      address: contracts.wrappedTokenGateway,
      abi: WRAPPED_TOKEN_GATEWAY_V3_ABI,
      functionName: "withdrawETH",
      args: [
        contracts.pool, // First param (unused in contract but required)
        amountInWei,
        userAddress as `0x${string}`, // to
      ],
    });
  };

  /**
   * Borrow native token (XDC/ETH) from the protocol
   * Automatically unwraps and sends native token
   */
  const borrowNative = async (amount: string, userAddress: string) => {
    const amountInWei = parseUnits(amount, 18);

    return writeContract({
      address: contracts.wrappedTokenGateway,
      abi: WRAPPED_TOKEN_GATEWAY_V3_ABI,
      functionName: "borrowETH",
      args: [
        contracts.pool, // First param (unused in contract but required)
        amountInWei,
        0, // referralCode
      ],
    });
  };

  /**
   * Repay borrowed native token (XDC/ETH)
   * Automatically wraps and repays to the pool
   */
  const repayNative = async (
    amount: string,
    userAddress: string,
    decimals: number = 18
  ) => {
    const amountInWei = parseUnits(amount, decimals);

    return writeContract({
      address: contracts.wrappedTokenGateway,
      abi: WRAPPED_TOKEN_GATEWAY_V3_ABI,
      functionName: "repayETH",
      args: [
        contracts.pool, // First param (unused in contract but required)
        amountInWei,
        userAddress as `0x${string}`, // onBehalfOf
      ],
      value: amountInWei,
    });
  };

  return {
    depositNative,
    withdrawNative,
    borrowNative,
    repayNative,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
