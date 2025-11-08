import { POOL_ABI } from "@/config/abis";
import { useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useChainConfig } from "./useChainConfig";

export const useCollateral = () => {
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const { writeContractAsync, isPending } = useWriteContract();
  const { contracts } = useChainConfig();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const setCollateral = async (
    assetAddress: `0x${string}`,
    useAsCollateral: boolean
  ) => {
    try {
      const txHash = await writeContractAsync({
        address: contracts.pool,
        abi: POOL_ABI,
        functionName: "setUserUseReserveAsCollateral",
        args: [assetAddress, useAsCollateral],
      });

      setHash(txHash);
      return txHash;
    } catch (error) {
      console.error("Error setting collateral:", error);
      throw error;
    }
  };

  return {
    setCollateral,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
  };
};
