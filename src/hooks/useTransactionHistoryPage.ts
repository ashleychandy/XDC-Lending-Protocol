import { useTransactionFilters } from "./useTransactionFilters";
import { useTransactionFormatter } from "./useTransactionFormatter";
import { useTransactionHistory } from "./useTransactionHistory";

interface UseTransactionHistoryPageParams {
  blockRange?: bigint;
  itemsPerPage?: number;
  cacheEnabled?: boolean;
  cacheDuration?: number;
}

/**
 * All-in-one hook for transaction history pages
 * Combines fetching, filtering, pagination, and formatting
 *
 * @example
 * const {
 *   currentPageTransactions,
 *   isLoading,
 *   selectedFilters,
 *   setSelectedFilters,
 *   nextPage,
 *   prevPage,
 *   formatAmount,
 *   getAssetInfo,
 *   getTypeColor
 * } = useTransactionHistoryPage();
 */
export function useTransactionHistoryPage({
  blockRange = 50000n,
  itemsPerPage = 10,
  cacheEnabled = true,
  cacheDuration = 5 * 60 * 1000,
}: UseTransactionHistoryPageParams = {}) {
  // Fetch transactions
  const {
    transactions,
    isLoading,
    error,
    refetch,
    fetchOlderTransactions,
    currentBlockRange,
  } = useTransactionHistory({
    blockRange,
    cacheEnabled,
    cacheDuration,
  });

  // Filter and paginate
  const {
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
  } = useTransactionFilters({
    transactions,
    itemsPerPage,
  });

  // Format utilities
  const {
    getAssetInfo,
    formatAmount,
    formatTimestamp,
    formatFullDate,
    getTypeColor,
  } = useTransactionFormatter();

  return {
    // Data
    transactions,
    filteredTransactions,
    currentPageTransactions,

    // Loading states
    isLoading,
    error,

    // Filters
    selectedFilters,
    setSelectedFilters,

    // Pagination
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    nextPage,
    prevPage,
    goToPage,

    // Formatters
    getAssetInfo,
    formatAmount,
    formatTimestamp,
    formatFullDate,
    getTypeColor,

    // Actions
    refetch,
    fetchOlderTransactions,
    currentBlockRange,
  };
}
