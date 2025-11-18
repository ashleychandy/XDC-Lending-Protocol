import { useChainConfig } from "@/hooks/useChainConfig";
import { formatUnits } from "viem";

interface AssetInfo {
  symbol: string;
  decimals: number;
  slug: string;
}

/**
 * Hook for formatting transaction data
 * Provides utilities for displaying transaction information
 */
export function useTransactionFormatter() {
  const { tokens } = useChainConfig();

  const getAssetInfo = (address: string): AssetInfo => {
    const addressLower = address.toLowerCase();

    if (addressLower === tokens.wrappedNative.address.toLowerCase()) {
      return { symbol: "WXDC", decimals: 18, slug: "xdc" };
    }
    if (addressLower === tokens.usdc.address.toLowerCase()) {
      return { symbol: "USDC", decimals: 6, slug: "usdc" };
    }
    if (addressLower === tokens.cgo.address.toLowerCase()) {
      return { symbol: "CGO", decimals: 18, slug: "cgo" };
    }

    return {
      symbol: address.slice(0, 6) + "...",
      decimals: 18,
      slug: "",
    };
  };

  const formatAmount = (amount: string, decimals: number = 18): string => {
    try {
      const formatted = formatUnits(BigInt(amount), decimals);
      const num = parseFloat(formatted);
      return num.toFixed(2);
    } catch {
      return "0.00";
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const formatFullDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const getTypeColor = (
    type: string
  ): "green" | "blue" | "purple" | "orange" | "gray" => {
    switch (type) {
      case "Supply":
        return "green";
      case "Borrow":
        return "blue";
      case "Repay":
        return "purple";
      case "Withdraw":
        return "orange";
      default:
        return "gray";
    }
  };

  return {
    getAssetInfo,
    formatAmount,
    formatTimestamp,
    formatFullDate,
    getTypeColor,
  };
}
