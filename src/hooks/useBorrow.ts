import {
  POOL_ABI,
  VARIABLE_DEBT_TOKEN_ABI,
  WRAPPED_TOKEN_GATEWAY_V3_ABI,
} from "@/config/abis";
import { useChainConfig } from "@/hooks/useChainConfig";
import { maxUint256, parseUnits } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export function useBorrow() {
  const { contracts, tokens } = useChainConfig();

  // Separate hook for delegation approval
  const delegationContract = useWriteContract();
  const delegationReceipt = useWaitForTransactionReceipt({
    hash: delegationContract.data,
  });

  // Main borrow contract
  const borrowContract = useWriteContract();
  const borrowReceipt = useWaitForTransactionReceipt({
    hash: borrowContract.data,
  });

  /**
   * Approve credit delegation to the gateway for native token borrowing
   * This must be called before borrowNative if user hasn't delegated before
   */
  const approveDelegation = async (amount?: string) => {
    // Use max uint256 for unlimited delegation, or specific amount
    const delegationAmount = amount ? parseUnits(amount, 18) : maxUint256;

    return delegationContract.writeContractAsync({
      address: tokens.wrappedNative.variableDebtToken,
      abi: VARIABLE_DEBT_TOKEN_ABI,
      functionName: "approveDelegation",
      args: [contracts.wrappedTokenGateway, delegationAmount],
    });
  };

  const borrow = async (
    tokenAddress: string,
    amount: string,
    decimals: number,
    userAddress: string,
    interestRateMode: number = 2 // 2 = variable rate
  ) => {
    const amountInWei = parseUnits(amount, decimals);

    return borrowContract.writeContractAsync({
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
   * Borrow native token (XDC) directly - automatically unwraps
   * Note: The gateway borrows WXDC from the pool and unwraps it to native XDC
   * Interest rate mode is hardcoded to VARIABLE in the gateway contract
   * IMPORTANT: User must first call approveDelegation to allow gateway to borrow on their behalf
   */
  const borrowNative = async (amount: string, userAddress: string) => {
    const amountInWei = parseUnits(amount, 18);

    return borrowContract.writeContractAsync({
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
    approveDelegation,
    // Delegation approval state
    delegationHash: delegationContract.data,
    delegationIsPending: delegationContract.isPending,
    delegationIsConfirming: delegationReceipt.isLoading,
    delegationIsSuccess: delegationReceipt.isSuccess,
    delegationError: delegationContract.error,
    // Borrow transaction state
    hash: borrowContract.data,
    isPending: borrowContract.isPending,
    isConfirming: borrowReceipt.isLoading,
    isSuccess: borrowReceipt.isSuccess,
    error: borrowContract.error,
  };
}
