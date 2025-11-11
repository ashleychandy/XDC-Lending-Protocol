import { POOL_ABI, WRAPPED_TOKEN_GATEWAY_V3_ABI } from "@/config/abis";
import { useChainConfig } from "@/hooks/useChainConfig";
import { parseUnits } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export function useBorrow() {
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

  const borrow = async (
    tokenAddress: string,
    amount: string,
    decimals: number,
    userAddress: string,
    interestRateMode: number = 2 // 2 = variable rate
  ) => {
    const amountInWei = parseUnits(amount, decimals);

    return writeContractAsync({
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

  /**
   * Borrow native token (XDC/ETH) directly - automatically unwraps
   */
  const borrowNative = async (amount: string, userAddress: string) => {
    const amountInWei = parseUnits(amount, 18);

    return writeContractAsync({
      address: contracts.wrappedTokenGateway,
      abi: WRAPPED_TOKEN_GATEWAY_V3_ABI,
      functionName: "borrowETH",
      args: [
        contracts.pool,
        amountInWei,
        0, // referralCode
      ],
    });
  };

  return {
    borrow,
    borrowNative,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
