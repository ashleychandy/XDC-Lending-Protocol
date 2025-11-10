import { parseUnits } from "viem";
import { useAccount, useSignTypedData } from "wagmi";
import { useChainConfig } from "./useChainConfig";

/**
 * EIP-2612 Permit signature generation hook
 * Allows gasless approvals for ERC20 tokens
 */
export function usePermit() {
  const { address, chain } = useAccount();
  const { contracts } = useChainConfig();
  const { signTypedDataAsync } = useSignTypedData();

  /**
   * Generate permit signature for ERC20 token
   * @param tokenAddress - Address of the ERC20 token
   * @param spender - Address that will be approved (usually Pool contract)
   * @param amount - Amount to approve (in token units, e.g., "1.0")
   * @param decimals - Token decimals
   * @param deadline - Unix timestamp when permit expires (default: 1 hour from now)
   * @returns Permit signature components (v, r, s, deadline)
   */
  const generatePermitSignature = async (
    tokenAddress: `0x${string}`,
    spender: `0x${string}`,
    amount: string,
    decimals: number,
    deadline?: number
  ) => {
    if (!address || !chain) {
      throw new Error("Wallet not connected");
    }

    // Default deadline: 1 hour from now
    const permitDeadline = deadline || Math.floor(Date.now() / 1000) + 3600;
    const amountInWei = parseUnits(amount, decimals);

    // Get current nonce from token contract
    // Note: In production, you should fetch this from the token contract
    // For now, we'll use 0 as default (first permit)
    const nonce = 0;

    // EIP-2612 Permit type
    const types = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };

    const message = {
      owner: address,
      spender,
      value: amountInWei,
      nonce: BigInt(nonce),
      deadline: BigInt(permitDeadline),
    };

    // Domain separator for the token
    const domain = {
      name: "Aave interest bearing token", // This should be fetched from token
      version: "1",
      chainId: chain.id,
      verifyingContract: tokenAddress,
    };

    try {
      // Sign the permit
      const signature = await signTypedDataAsync({
        domain,
        types,
        primaryType: "Permit",
        message,
      });

      // Split signature into v, r, s components
      const r = `0x${signature.slice(2, 66)}` as `0x${string}`;
      const s = `0x${signature.slice(66, 130)}` as `0x${string}`;
      const v = parseInt(signature.slice(130, 132), 16);

      return {
        v,
        r,
        s,
        deadline: permitDeadline,
      };
    } catch (error) {
      console.error("Error generating permit signature:", error);
      throw error;
    }
  };

  /**
   * Generate permit signature for supply operation
   * @param tokenAddress - Token to supply
   * @param amount - Amount to supply
   * @param decimals - Token decimals
   * @param deadline - Optional deadline
   */
  const generateSupplyPermit = async (
    tokenAddress: `0x${string}`,
    amount: string,
    decimals: number,
    deadline?: number
  ) => {
    return generatePermitSignature(
      tokenAddress,
      contracts.pool,
      amount,
      decimals,
      deadline
    );
  };

  /**
   * Generate permit signature for repay operation
   * @param tokenAddress - Token to repay
   * @param amount - Amount to repay
   * @param decimals - Token decimals
   * @param deadline - Optional deadline
   */
  const generateRepayPermit = async (
    tokenAddress: `0x${string}`,
    amount: string,
    decimals: number,
    deadline?: number
  ) => {
    return generatePermitSignature(
      tokenAddress,
      contracts.pool,
      amount,
      decimals,
      deadline
    );
  };

  return {
    generatePermitSignature,
    generateSupplyPermit,
    generateRepayPermit,
  };
}
