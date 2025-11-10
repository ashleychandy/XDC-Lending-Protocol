import { usePermit } from "./usePermit";
import { useRepay } from "./useRepay";
import { useSupply } from "./useSupply";

/**
 * Hook for permit-based operations (gasless approvals)
 * Combines permit signature generation with supply/repay operations
 */
export function usePermitOperations() {
  const { generateSupplyPermit, generateRepayPermit } = usePermit();
  const { supplyWithPermit, ...supplyHook } = useSupply();
  const { repayWithPermit, ...repayHook } = useRepay();

  /**
   * Supply with permit - single transaction, no approval needed
   * @param tokenAddress - Token to supply
   * @param amount - Amount to supply
   * @param decimals - Token decimals
   * @param userAddress - User address
   * @param deadline - Optional deadline (default: 1 hour from now)
   */
  const supplyWithPermitFlow = async (
    tokenAddress: `0x${string}`,
    amount: string,
    decimals: number,
    userAddress: string,
    deadline?: number
  ) => {
    try {
      // Step 1: Generate permit signature (off-chain, no gas)
      const permit = await generateSupplyPermit(
        tokenAddress,
        amount,
        decimals,
        deadline
      );

      // Step 2: Supply with permit (single transaction)
      return await supplyWithPermit(
        tokenAddress,
        amount,
        decimals,
        userAddress,
        permit.deadline,
        permit.v,
        permit.r,
        permit.s
      );
    } catch (error) {
      console.error("Supply with permit error:", error);
      throw error;
    }
  };

  /**
   * Repay with permit - single transaction, no approval needed
   * @param tokenAddress - Token to repay
   * @param amount - Amount to repay
   * @param decimals - Token decimals
   * @param userAddress - User address
   * @param repayAll - Whether to repay all debt
   * @param deadline - Optional deadline (default: 1 hour from now)
   */
  const repayWithPermitFlow = async (
    tokenAddress: `0x${string}`,
    amount: string,
    decimals: number,
    userAddress: string,
    repayAll: boolean = false,
    deadline?: number
  ) => {
    try {
      // Step 1: Generate permit signature (off-chain, no gas)
      const permit = await generateRepayPermit(
        tokenAddress,
        amount,
        decimals,
        deadline
      );

      // Step 2: Repay with permit (single transaction)
      return await repayWithPermit(
        tokenAddress,
        amount,
        decimals,
        userAddress,
        permit.deadline,
        permit.v,
        permit.r,
        permit.s,
        2, // variable rate
        repayAll
      );
    } catch (error) {
      console.error("Repay with permit error:", error);
      throw error;
    }
  };

  return {
    supplyWithPermitFlow,
    repayWithPermitFlow,
    // Expose underlying hooks for direct access
    supplyHook,
    repayHook,
  };
}
