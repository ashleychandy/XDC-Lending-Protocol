import { useBorrow } from "./useBorrow";
import { useChainConfig } from "./useChainConfig";
import { useRepay } from "./useRepay";
import { useSupply } from "./useSupply";
import { useWithdraw } from "./useWithdraw";

/**
 * Hook to handle native token operations with automatic routing
 * between native and wrapped token functions
 */
export function useNativeTokenOperations() {
  const { tokens, contracts } = useChainConfig();
  const supplyHook = useSupply();
  const borrowHook = useBorrow();
  const repayHook = useRepay();
  const withdrawHook = useWithdraw();

  /**
   * Supply tokens - automatically uses native gateway if token is native
   */
  const supply = async (
    tokenSymbol: "wxdc" | "usdc" | "xdc" | "cgo",
    amount: string,
    userAddress: string,
    useNative: boolean = false
  ) => {
    // If XDC and useNative is true, use native supply
    if ((tokenSymbol === "xdc" || tokenSymbol === "wxdc") && useNative) {
      // Check if gateway is configured
      if (
        contracts.wrappedTokenGateway ===
        "0x0000000000000000000000000000000000000000"
      ) {
        throw new Error("Wrapped token gateway not configured for this chain");
      }
      return supplyHook.supplyNative(amount, userAddress);
    }

    // Otherwise use standard ERC20 supply
    const token =
      tokenSymbol === "xdc" || tokenSymbol === "wxdc"
        ? tokens.wrappedNative
        : tokens[tokenSymbol as "usdc" | "cgo"];
    return supplyHook.supply(
      token.address,
      amount,
      token.decimals,
      userAddress
    );
  };

  /**
   * Borrow tokens - automatically uses native gateway if unwrap is requested
   */
  const borrow = async (
    tokenSymbol: "wxdc" | "usdc" | "xdc" | "cgo",
    amount: string,
    userAddress: string,
    unwrapToNative: boolean = false
  ) => {
    // If WXDC and unwrap is true, use native borrow
    if ((tokenSymbol === "xdc" || tokenSymbol === "wxdc") && unwrapToNative) {
      // Check if gateway is configured
      if (
        contracts.wrappedTokenGateway ===
        "0x0000000000000000000000000000000000000000"
      ) {
        throw new Error("Wrapped token gateway not configured for this chain");
      }
      return borrowHook.borrowNative(amount, userAddress);
    }

    // Otherwise use standard borrow
    const token =
      tokenSymbol === "xdc" || tokenSymbol === "wxdc"
        ? tokens.wrappedNative
        : tokens[tokenSymbol as "usdc" | "cgo"];
    return borrowHook.borrow(
      token.address,
      amount,
      token.decimals,
      userAddress
    );
  };

  /**
   * Repay tokens - automatically uses native gateway if token is native
   */
  const repay = async (
    tokenSymbol: "wxdc" | "usdc" | "xdc" | "cgo",
    amount: string,
    userAddress: string,
    useNative: boolean = false,
    repayAll: boolean = false
  ) => {
    // If XDC and useNative is true, use native repay
    if ((tokenSymbol === "xdc" || tokenSymbol === "wxdc") && useNative) {
      // Check if gateway is configured
      if (
        contracts.wrappedTokenGateway ===
        "0x0000000000000000000000000000000000000000"
      ) {
        throw new Error("Wrapped token gateway not configured for this chain");
      }
      return repayHook.repayNative(amount, userAddress, repayAll);
    }

    // Otherwise use standard repay
    const token =
      tokenSymbol === "xdc" || tokenSymbol === "wxdc"
        ? tokens.wrappedNative
        : tokens[tokenSymbol as "usdc" | "cgo"];
    return repayHook.repay(
      token.address,
      amount,
      token.decimals,
      userAddress,
      2,
      repayAll
    );
  };

  /**
   * Withdraw tokens - automatically uses native gateway if unwrap is requested
   */
  const withdraw = async (
    tokenSymbol: "wxdc" | "usdc" | "xdc" | "cgo",
    amount: string,
    userAddress: string,
    unwrapToNative: boolean = false,
    withdrawAll: boolean = false
  ) => {
    // If WXDC and unwrap is true, use native withdraw
    if ((tokenSymbol === "xdc" || tokenSymbol === "wxdc") && unwrapToNative) {
      // Check if gateway is configured
      if (
        contracts.wrappedTokenGateway ===
        "0x0000000000000000000000000000000000000000"
      ) {
        throw new Error("Wrapped token gateway not configured for this chain");
      }
      return withdrawHook.withdrawNative(amount, userAddress);
    }

    // Otherwise use standard withdraw
    const token =
      tokenSymbol === "xdc" || tokenSymbol === "wxdc"
        ? tokens.wrappedNative
        : tokens[tokenSymbol as "usdc" | "cgo"];
    return withdrawHook.withdraw(
      token.address,
      amount,
      token.decimals,
      userAddress,
      withdrawAll
    );
  };

  /**
   * Approve tokens - only needed for ERC20 operations
   */
  const approve = async (
    tokenSymbol: "wxdc" | "usdc" | "xdc" | "cgo",
    amount: string,
    operation: "supply" | "repay"
  ) => {
    const token =
      tokenSymbol === "xdc" || tokenSymbol === "wxdc"
        ? tokens.wrappedNative
        : tokens[tokenSymbol as "usdc" | "cgo"];

    if (operation === "supply") {
      return supplyHook.approve(token.address);
    } else {
      return repayHook.approve(token.address);
    }
  };

  return {
    supply,
    borrow,
    repay,
    withdraw,
    approve,
    // Expose individual hooks for direct access if needed
    supplyHook,
    borrowHook,
    repayHook,
    withdrawHook,
  };
}
