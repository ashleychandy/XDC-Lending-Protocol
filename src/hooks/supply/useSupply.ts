import { useAccount, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { useState } from "react";
import { xrc20Abi, lendingPoolAbi } from "@/config/abis";

export function useSupply({
  tokenAddress,
  lendingPoolAddress,
}: {
  tokenAddress: `0x${string}`;
  lendingPoolAddress: `0x${string}`;
}) {
  const { address } = useAccount();
  const [step, setStep] = useState<"idle" | "approving" | "supplying" | "done">(
    "idle"
  );
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const { writeContractAsync } = useWriteContract();

  async function handleSupply(amount: string) {
    if (!address) throw new Error("Wallet not connected");
    console.log("amount", amount);

    try {
      setStep("approving");

      // Step 1 — Approve lending pool to spend tokens
      const approveHash = await writeContractAsync({
        address: tokenAddress,
        abi: xrc20Abi,
        functionName: "approve",
        args: [lendingPoolAddress, parseEther(amount)],
      });
      console.log("Approval TX:", approveHash);

      setTxHash(approveHash);
      setStep("supplying");

      // Step 2 — Call supply on lending pool
      const supplyHash = await writeContractAsync({
        address: lendingPoolAddress,
        abi: lendingPoolAbi,
        functionName: "supply",
        args: [tokenAddress, parseEther(amount), address, 0],
      });

      console.log("Supply TX:", supplyHash);
      setTxHash(supplyHash);
      setStep("done");
    } catch (err) {
      console.error("Supply error", err);
      setStep("idle");
    }
  }

  return {
    step,
    txHash,
    handleSupply,
  };
}
