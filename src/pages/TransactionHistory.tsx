import Footer from "@/components/Footer";
import FormattedCounter from "@/components/ui/Counter/FormattedCounter";
import { useAssetDetails } from "@/hooks/useAssetDetails";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useTransactionHistoryPage } from "@/hooks/useTransactionHistoryPage";
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
import { FiChevronLeft, FiChevronRight, FiExternalLink } from "react-icons/fi";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAccount } from "wagmi";

const TransactionHistory = () => {
  const chainConfig = useChainConfig();
  const { network } = chainConfig;
  const { chain } = useAccount();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "xdc";

  useAssetDetails(token);

  // Use the all-in-one transaction history hook
  const {
    currentPageTransactions,
    isLoading: isLoadingTxs,
    selectedFilters,
    setSelectedFilters,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    nextPage: handleNextPage,
    prevPage: handlePrevPage,
    getAssetInfo,
    formatAmount,
    formatTimestamp,
    getTypeColor,
    filteredTransactions: filteredTxData,
    transactions: txData,
    fetchOlderTransactions,
    currentBlockRange,
  } = useTransactionHistoryPage({
    blockRange: 50000n,
    itemsPerPage: 10,
  });

  const transactions = createListCollection({
    items: [
      { label: "All Transactions", value: "all" },
      { label: "Supply", value: "supply" },
      { label: "Withdraw", value: "withdraw" },
      { label: "Borrow", value: "borrow" },
      { label: "Repay", value: "repay" },
    ],
  });

  const skeletonRows = Array.from({ length: 5 }, (_, i) => i);

  return (
    <Box display="flex" flexDirection="column" minH="100vh">
      <Header />
      <Box pt={"60px"} pb={"94px"} bg={"#2b2d3c"}>
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
            <Flex
              justifyContent="space-between"
              alignItems="center"
              mb={"30px"}
              flexWrap="wrap"
              gap="3"
            >
              <Box>
                <Heading size="xl" className="title-text-1">
                  Recent Transactions
                </Heading>
                <ChakraText fontSize="sm" color="#62677b" mt="1">
                  Showing transactions from the last ~
                  {currentBlockRange.toLocaleString()} blocks
                </ChakraText>
              </Box>
              <Button
                size="sm"
                variant="outline"
                colorPalette="blue"
                onClick={fetchOlderTransactions}
                disabled={isLoadingTxs}
                loading={isLoadingTxs}
              >
                Load Older Transactions
              </Button>
            </Flex>
            <Select.Root
              multiple
              value={selectedFilters}
              onValueChange={(e) => {
                const newFilters = e.value;
                if (
                  newFilters.includes("all") &&
                  !selectedFilters.includes("all")
                ) {
                  setSelectedFilters(["all"]);
                } else if (
                  newFilters.length > 1 &&
                  newFilters.includes("all")
                ) {
                  setSelectedFilters(newFilters.filter((f) => f !== "all"));
                } else if (newFilters.length === 0) {
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
                      {currentPageTransactions.map((tx, index) => {
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
