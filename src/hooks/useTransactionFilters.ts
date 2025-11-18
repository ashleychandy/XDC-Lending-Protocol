import { useMemo, useState } from "react";
import type { Transaction } from "./useTransactionHistory";

interface UseTransactionFiltersParams {
  transactions: Transaction[];
  itemsPerPage?: number;
}

interface UseTransactionFiltersReturn {
  filteredTransactions: Transaction[];
  currentPageTransactions: Transaction[];
  selectedFilters: string[];
  setSelectedFilters: (filters: string[]) => void;
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
}

/**
 * Hook for filtering and paginating transactions
 * Optimized for transaction history display
 *
 * @example
 * const { transactions } = useTransactionHistory();
 * const {
 *   filteredTransactions,
 *   currentPageTransactions,
 *   selectedFilters,
 *   setSelectedFilters,
 *   currentPage,
 *   totalPages,
 *   nextPage,
 *   prevPage
 * } = useTransactionFilters({ transactions });
 */
export function useTransactionFilters({
  transactions,
  itemsPerPage = 10,
}: UseTransactionFiltersParams): UseTransactionFiltersReturn {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["all"]);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter transactions based on selected filters
  const filteredTransactions = useMemo(() => {
    if (selectedFilters.includes("all") || selectedFilters.length === 0) {
      return transactions;
    }

    return transactions.filter((tx) =>
      selectedFilters.some(
        (filter) => filter.toLowerCase() === tx.type.toLowerCase()
      )
    );
  }, [transactions, selectedFilters]);

  // Calculate pagination
  const { totalPages, startIndex, endIndex, currentPageTransactions } =
    useMemo(() => {
      const total = Math.ceil(filteredTransactions.length / itemsPerPage);
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const current = filteredTransactions.slice(start, end);

      return {
        totalPages: total,
        startIndex: start,
        endIndex: end,
        currentPageTransactions: current,
      };
    }, [filteredTransactions, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [selectedFilters]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    filteredTransactions,
    currentPageTransactions,
    selectedFilters,
    setSelectedFilters,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    nextPage,
    prevPage,
    goToPage,
  };
}
