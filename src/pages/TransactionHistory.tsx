import Footer from "@/components/Footer";
import FormattedCounter from "@/components/ui/Counter/FormattedCounter";
import { useAssetDetails } from "@/hooks/useAssetDetails";
import { useChainConfig } from "@/hooks/useChainConfig";
import Header from "@/pages/Header";
import {
  Badge,
  Box,
  Button,
  Text as ChakraText,
  Container,
  createListCollection,
  Flex,
  Heading,
  Icon,
  Image,
  Portal,
  Select,
  Skeleton,
  Spinner,
  Table,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiExternalLink } from "react-icons/fi";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formatUnits } from "viem";
import { useAccount, useBlockNumber, usePublicClient } from "wagmi";

interface Transaction {
  hash: string;
  type: string;
  asset: string;
  amount: string;
  timestamp: number;
  blockNumber: bigint;
}

interface CachedData {
  transactions: Transaction[];
  lastFetchBlock: bigint;
  timestamp: number;
}

// Cache key generator
const getCacheKey = (address: string, chainId: number) =>
  `tx_history_${address}_${chainId}`;

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

const TransactionHistory = () => {
  const chainConfig = useChainConfig();
  const { network, contracts, tokens } = chainConfig;
  const { chain, address } = useAccount();
  const publicClient = usePublicClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "xdc";
  const [txData, setTxData] = useState<Transaction[]>([]);
  const [isLoadingTxs, setIsLoadingTxs] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["all"]);
  const itemsPerPage = 10;

  useAssetDetails(token);

  // Load cached data on mount
  useEffect(() => {
    if (!address || !chain?.id) return;

    const cacheKey = getCacheKey(address, chain.id);
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const parsedCache: CachedData = JSON.parse(cached, (_key, value) => {
          // Convert bigint strings back to bigint
          if (_key === "blockNumber" || _key === "lastFetchBlock") {
            return BigInt(value);
          }
          return value;
        });

        // Check if cache is still valid
        const now = Date.now();
        if (now - parsedCache.timestamp < CACHE_DURATION) {
          setTxData(parsedCache.transactions);
        }
      } catch (error) {
        console.error("Error loading cached transactions:", error);
        localStorage.removeItem(cacheKey);
      }
    }
  }, [address, chain?.id]);

  // Filter transactions based on selected filters
  const filteredTxData = useMemo(() => {
    if (selectedFilters.includes("all") || selectedFilters.length === 0) {
      return txData;
    }

    return txData.filter((tx) =>
      selectedFilters.some(
        (filter) => filter.toLowerCase() === tx.type.toLowerCase()
      )
    );
  }, [txData, selectedFilters]);

  // Calculate pagination with useMemo for performance
  const { totalPages, startIndex, endIndex, currentTxData } = useMemo(() => {
    const total = Math.ceil(filteredTxData.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const current = filteredTxData.slice(start, end);

    return {
      totalPages: total,
      startIndex: start,
      endIndex: end,
      currentTxData: current,
    };
  }, [filteredTxData, currentPage, itemsPerPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters]);

  const transactions = createListCollection({
    items: [
      { label: "All Transactions", value: "all" },
      { label: "Supply", value: "supply" },
      { label: "Withdraw", value: "withdraw" },
      { label: "Borrow", value: "borrow" },
      { label: "Repay", value: "repay" },
    ],
  });

  // Get current block number using wagmi hook
  const { data: currentBlockNumber } = useBlockNumber({
    watch: false,
  });

  // Fetch transaction history from contract events
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address || !publicClient || !currentBlockNumber) return;

      setIsLoadingTxs(true);
      setCurrentPage(1); // Reset to first page on new fetch
      try {
        // Fetch more blocks to show more transactions (last ~50k blocks)
        const fromBlock =
          currentBlockNumber > 50000n ? currentBlockNumber - 50000n : 0n;

        // Pool contract ABI events
        const poolAbi = [
          {
            type: "event",
            name: "Supply",
            inputs: [
              { name: "reserve", type: "address", indexed: true },
              { name: "user", type: "address", indexed: false },
              { name: "onBehalfOf", type: "address", indexed: true },
              { name: "amount", type: "uint256", indexed: false },
              { name: "referralCode", type: "uint16", indexed: true },
            ],
          },
          {
            type: "event",
            name: "Withdraw",
            inputs: [
              { name: "reserve", type: "address", indexed: true },
              { name: "user", type: "address", indexed: true },
              { name: "to", type: "address", indexed: true },
              { name: "amount", type: "uint256", indexed: false },
            ],
          },
          {
            type: "event",
            name: "Borrow",
            inputs: [
              { name: "reserve", type: "address", indexed: true },
              { name: "user", type: "address", indexed: false },
              { name: "onBehalfOf", type: "address", indexed: true },
              { name: "amount", type: "uint256", indexed: false },
              { name: "interestRateMode", type: "uint8", indexed: false },
              { name: "borrowRate", type: "uint256", indexed: false },
              { name: "referralCode", type: "uint16", indexed: true },
            ],
          },
          {
            type: "event",
            name: "Repay",
            inputs: [
              { name: "reserve", type: "address", indexed: true },
              { name: "user", type: "address", indexed: true },
              { name: "repayer", type: "address", indexed: true },
              { name: "amount", type: "uint256", indexed: false },
              { name: "useATokens", type: "bool", indexed: false },
            ],
          },
        ] as const;

        // Fetch all event types
        const [supplyLogs, withdrawLogs, borrowLogs, repayLogs] =
          await Promise.all([
            publicClient.getLogs({
              address: contracts.pool,
              event: poolAbi[0],
              fromBlock,
              toBlock: currentBlockNumber,
              args: { onBehalfOf: address },
            }),
            publicClient.getLogs({
              address: contracts.pool,
              event: poolAbi[1],
              fromBlock,
              toBlock: currentBlockNumber,
              args: { user: address },
            }),
            publicClient.getLogs({
              address: contracts.pool,
              event: poolAbi[2],
              fromBlock,
              toBlock: currentBlockNumber,
              args: { onBehalfOf: address },
            }),
            publicClient.getLogs({
              address: contracts.pool,
              event: poolAbi[3],
              fromBlock,
              toBlock: currentBlockNumber,
              args: { user: address },
            }),
          ]);

        // Combine all logs
        const allLogs = [
          ...supplyLogs.map((log) => ({ ...log, eventType: "Supply" })),
          ...withdrawLogs.map((log) => ({ ...log, eventType: "Withdraw" })),
          ...borrowLogs.map((log) => ({ ...log, eventType: "Borrow" })),
          ...repayLogs.map((log) => ({ ...log, eventType: "Repay" })),
        ];

        // Get unique block numbers
        const uniqueBlockNumbers = [
          ...new Set(allLogs.map((log) => log.blockNumber)),
        ];

        // Batch fetch all blocks at once
        const blockPromises = uniqueBlockNumbers.map((blockNumber) =>
          publicClient.getBlock({ blockNumber })
        );
        const blocks = await Promise.all(blockPromises);

        // Create a block cache
        const blockCache = new Map(
          blocks.map((block) => [block.number, block])
        );

        // Process and combine all transactions
        const allTxs: Transaction[] = [];

        for (const log of supplyLogs) {
          const block = blockCache.get(log.blockNumber);
          if (block) {
            allTxs.push({
              hash: log.transactionHash,
              type: "Supply",
              asset: log.args.reserve || "Unknown",
              amount: log.args.amount?.toString() || "0",
              timestamp: Number(block.timestamp),
              blockNumber: log.blockNumber,
            });
          }
        }

        for (const log of withdrawLogs) {
          const block = blockCache.get(log.blockNumber);
          if (block) {
            allTxs.push({
              hash: log.transactionHash,
              type: "Withdraw",
              asset: log.args.reserve || "Unknown",
              amount: log.args.amount?.toString() || "0",
              timestamp: Number(block.timestamp),
              blockNumber: log.blockNumber,
            });
          }
        }

        for (const log of borrowLogs) {
          const block = blockCache.get(log.blockNumber);
          if (block) {
            allTxs.push({
              hash: log.transactionHash,
              type: "Borrow",
              asset: log.args.reserve || "Unknown",
              amount: log.args.amount?.toString() || "0",
              timestamp: Number(block.timestamp),
              blockNumber: log.blockNumber,
            });
          }
        }

        for (const log of repayLogs) {
          const block = blockCache.get(log.blockNumber);
          if (block) {
            allTxs.push({
              hash: log.transactionHash,
              type: "Repay",
              asset: log.args.reserve || "Unknown",
              amount: log.args.amount?.toString() || "0",
              timestamp: Number(block.timestamp),
              blockNumber: log.blockNumber,
            });
          }
        }

        // Sort by timestamp descending
        allTxs.sort((a, b) => b.timestamp - a.timestamp);

        setTxData(allTxs);

        // Cache the results
        if (address && chain?.id) {
          const cacheKey = getCacheKey(address, chain.id);
          const cacheData: CachedData = {
            transactions: allTxs,
            lastFetchBlock: currentBlockNumber,
            timestamp: Date.now(),
          };

          try {
            // Convert bigint to string for JSON serialization
            const serialized = JSON.stringify(cacheData, (_key, value) =>
              typeof value === "bigint" ? value.toString() : value
            );
            localStorage.setItem(cacheKey, serialized);
          } catch (error) {
            console.error("Error caching transactions:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoadingTxs(false);
      }
    };

    fetchTransactions();
  }, [address, publicClient, contracts.pool, currentBlockNumber, chain?.id]);

  const getTypeColor = (type: string) => {
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

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const getAssetInfo = (address: string) => {
    // Map reserve addresses to symbols and decimals
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
    return { symbol: address.slice(0, 6) + "...", decimals: 18, slug: "" };
  };

  const formatAmount = (amount: string, decimals: number = 18) => {
    try {
      const formatted = formatUnits(BigInt(amount), decimals);
      const num = parseFloat(formatted);
      // Return raw number for FormattedCounter to handle formatting
      return num.toFixed(2);
    } catch {
      return "0.00";
    }
  };

  // Show skeleton rows when loading
  const skeletonRows = Array.from({ length: 5 }, (_, i) => i);

  return (
    <Box display="flex" flexDirection="column" minH="100vh">
      <Header />
      <Box pt={"70px"} pb={"94px"} maxH={"290px"} bg={"#2b2d3c"}>
        <Container
          maxW={{
            base: "100%",
            lg: "container.lg",
            xl: "container.xl",
            "2xl": "container.2xl",
          }}
          px={{ base: "auto", "2xl": "0" }}
          h="100%"
        >
          <Box className="light-text-1" fontSize={"18px"}>
            Transaction history
          </Box>
          <Flex alignItems="center" gap="10px" mb="15px">
            <Flex gap="2" alignItems="center">
              <Image
                src={network.icon}
                width="100px"
                height="50px"
                objectFit="contain"
                flexShrink={0}
              />

              <Heading
                size="lg"
                className="text-white-1"
                fontSize={"32px"}
                lineHeight={"32px"}
              >
                {network.name.replace(/^XDC\s+/i, "")} Market
              </Heading>
            </Flex>
          </Flex>
          <Button
            size="sm"
            variant="plain"
            className="btn-color-dark-1-hover"
            onClick={() => navigate(-1)}
          >
            <Icon>
              <IoMdArrowBack />
            </Icon>
            Back
          </Button>
        </Container>
      </Box>
      <Box mt={"-50px"}>
        <Container
          maxW={{
            base: "100%",
            lg: "container.lg",
            xl: "container.xl",
            "2xl": "container.2xl",
          }}
          px={{ base: "auto", "2xl": "0" }}
          h="100%"
        >
          <Box
            shadow="rgba(0, 0, 0, 0.05) 0px 2px 1px, rgba(0, 0, 0, 0.25) 0px 0px 1px"
            bg={"#fff"}
            border={"1px solid #eaebef"}
            borderRadius="5px"
            p="16px 24px"
          >
            <Heading size="xl" className="title-text-1" mb={"30px"}>
              Transactions
            </Heading>
            <Select.Root
              multiple
              value={selectedFilters}
              onValueChange={(e) => {
                const newFilters = e.value;
                // If "all" is selected, clear other filters
                if (
                  newFilters.includes("all") &&
                  !selectedFilters.includes("all")
                ) {
                  setSelectedFilters(["all"]);
                }
                // If other filter is selected while "all" is active, remove "all"
                else if (newFilters.length > 1 && newFilters.includes("all")) {
                  setSelectedFilters(newFilters.filter((f) => f !== "all"));
                }
                // If no filters selected, default to "all"
                else if (newFilters.length === 0) {
                  setSelectedFilters(["all"]);
                } else {
                  setSelectedFilters(newFilters);
                }
              }}
              collection={transactions}
              size="sm"
              width="320px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="All Transactions" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {transactions.items.map((framework) => (
                      <Select.Item item={framework} key={framework.value}>
                        {framework.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
            {isLoadingTxs && txData.length === 0 ? (
              <Box mt={"24px"} overflowX="auto">
                <Table.Root size="sm" variant="outline">
                  <Table.Header>
                    <Table.Row bg={"#f7f8fa"}>
                      <Table.ColumnHeader fontWeight="600" color="#62677b">
                        Type
                      </Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="600" color="#62677b">
                        Asset
                      </Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="600" color="#62677b">
                        Amount
                      </Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="600" color="#62677b">
                        Time
                      </Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="600" color="#62677b">
                        Tx
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {skeletonRows.map((i) => (
                      <Table.Row key={i}>
                        <Table.Cell>
                          <Skeleton height="20px" width="60px" />
                        </Table.Cell>
                        <Table.Cell>
                          <Skeleton height="20px" width="50px" />
                        </Table.Cell>
                        <Table.Cell>
                          <Skeleton height="20px" width="80px" />
                        </Table.Cell>
                        <Table.Cell>
                          <Skeleton height="20px" width="70px" />
                        </Table.Cell>
                        <Table.Cell>
                          <Skeleton height="24px" width="50px" />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
            ) : filteredTxData.length === 0 ? (
              <Box py={"120px"} textAlign={"center"} color="#62677b">
                {txData.length === 0
                  ? "No transactions yet."
                  : "No transactions match the selected filters."}
              </Box>
            ) : (
              <>
                <Box mt={"24px"} overflowX="auto" position="relative">
                  {isLoadingTxs && (
                    <Box
                      position="absolute"
                      top="0"
                      right="0"
                      p="2"
                      zIndex="10"
                    >
                      <Spinner size="sm" color="blue.500" />
                    </Box>
                  )}
                  <Table.Root size="sm" variant="outline">
                    <Table.Header>
                      <Table.Row bg={"#f7f8fa"}>
                        <Table.ColumnHeader fontWeight="600" color="#62677b">
                          Type
                        </Table.ColumnHeader>
                        <Table.ColumnHeader fontWeight="600" color="#62677b">
                          Asset
                        </Table.ColumnHeader>
                        <Table.ColumnHeader fontWeight="600" color="#62677b">
                          Amount
                        </Table.ColumnHeader>
                        <Table.ColumnHeader fontWeight="600" color="#62677b">
                          Time
                        </Table.ColumnHeader>
                        <Table.ColumnHeader fontWeight="600" color="#62677b">
                          Tx
                        </Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {currentTxData.map((tx: Transaction, index: number) => {
                        const assetInfo = getAssetInfo(tx.asset);
                        return (
                          <Table.Row key={`${tx.hash}-${index}`}>
                            <Table.Cell>
                              <Badge
                                colorPalette={getTypeColor(tx.type)}
                                size="sm"
                              >
                                {tx.type}
                              </Badge>
                            </Table.Cell>
                            <Table.Cell
                              fontWeight="500"
                              color="blue.500"
                              cursor={assetInfo.slug ? "pointer" : "default"}
                              _hover={
                                assetInfo.slug
                                  ? { textDecoration: "underline" }
                                  : {}
                              }
                              onClick={() => {
                                if (assetInfo.slug) {
                                  navigate(
                                    `/asset-details?token=${assetInfo.slug}`
                                  );
                                }
                              }}
                            >
                              {assetInfo.symbol}
                            </Table.Cell>
                            <Table.Cell>
                              <FormattedCounter
                                value={formatAmount(
                                  tx.amount,
                                  assetInfo.decimals
                                )}
                                fontSize={14}
                                textColor="#000"
                              />
                            </Table.Cell>
                            <Table.Cell color="#62677b" fontSize="sm">
                              {formatTimestamp(tx.timestamp)}
                            </Table.Cell>
                            <Table.Cell>
                              <Button
                                size="xs"
                                variant="outline"
                                colorPalette="blue"
                                onClick={() => {
                                  if (chain?.blockExplorers?.default?.url) {
                                    window.open(
                                      `${chain.blockExplorers.default.url}/tx/${tx.hash}`,
                                      "_blank"
                                    );
                                  }
                                }}
                              >
                                <Icon>
                                  <FiExternalLink />
                                </Icon>
                                Tx
                              </Button>
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </Table.Root>
                </Box>

                {/* Pagination Controls */}
                <Flex
                  mt={"24px"}
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                  gap="4"
                >
                  <ChakraText fontSize="sm" color="#62677b">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, filteredTxData.length)} of{" "}
                    {filteredTxData.length} transactions
                    {selectedFilters.length > 0 &&
                      !selectedFilters.includes("all") &&
                      ` (filtered from ${txData.length})`}
                  </ChakraText>
                  <Flex gap="2" alignItems="center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
                    >
                      <Icon>
                        <FiChevronLeft />
                      </Icon>
                      Previous
                    </Button>
                    <ChakraText fontSize="sm" color="#62677b" px="2">
                      Page {currentPage} of {totalPages}
                    </ChakraText>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
                    >
                      Next
                      <Icon>
                        <FiChevronRight />
                      </Icon>
                    </Button>
                  </Flex>
                </Flex>
              </>
            )}
          </Box>
        </Container>
      </Box>
      <Box mt="auto">
        <Footer />
      </Box>
    </Box>
  );
};

export default TransactionHistory;
