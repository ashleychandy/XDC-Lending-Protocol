import {
  formatCurrency,
  formatPercentage,
  formatTokenAmount,
  useAssetDetails,
} from "@/hooks/useAssetDetails";
import {
  AbsoluteCenter,
  Box,
  Flex,
  Heading,
  Icon,
  ProgressCircle,
  Spinner,
} from "@chakra-ui/react";
import React from "react";
import { BiInfinite } from "react-icons/bi";
import { FaCheck } from "react-icons/fa6";

// Helper function to format BPS values (e.g., 8050 -> "80.50%")
const formatBps = (bps: bigint): string => {
  return (Number(bps) / 100).toFixed(2) + "%";
};

interface Props {
  token?: string;
}

const AssetOverview: React.FC<Props> = ({ token = "weth" }) => {
  const {
    tokenInfo,
    reserveSize,
    availableLiquidity,
    utilizationRate,
    oraclePrice,
    totalSupplied,
    totalSuppliedUsd,
    totalBorrowed,
    totalBorrowedUsd,
    supplyCap,
    supplyCapUsd,
    supplyCapPercentage,
    borrowCap,
    borrowCapUsd,
    borrowCapPercentage,
    hasSupplyCap,
    hasBorrowCap,
    supplyApy,
    borrowApy,
    reserveData,
    isLoading,
  } = useAssetDetails(token || "weth");

  // Configuration is a nested tuple with a 'data' field
  const reserveDataAny = reserveData as any;
  const configData = reserveDataAny?.configuration
    ? (reserveDataAny.configuration as any).data || reserveDataAny.configuration
    : 0n;
  const config = BigInt(configData || 0);
  const ltv = config & 0xffffn;
  const liquidationThreshold = (config >> 16n) & 0xffffn;
  const liquidationBonus = (config >> 32n) & 0xffffn;
  const liquidationPenalty =
    liquidationBonus > 10000n ? liquidationBonus - 10000n : 0n;
  const reserveFactor = (config >> 64n) & 0xffffn;

  const supplyInfo = [
    {
      title: "Max LTV",
      value: formatBps(ltv),
    },
    {
      title: "Liquidation threshold",
      value: formatBps(liquidationThreshold),
    },
    {
      title: "Liquidation penalty",
      value: formatBps(liquidationPenalty),
    },
  ];

  const borrowInfo = [
    {
      title: "Reserve factor",
      value: formatBps(reserveFactor),
    },
  ];

  if (isLoading) {
    return (
      <Box width={{ base: "100%", xl: "65%" }}>
        <Flex
          shadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
          borderRadius="5px"
          p="16px 24px"
          minH="500px"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner size="xl" />
        </Flex>
      </Box>
    );
  }

  return (
    <Box width={{ base: "100%", xl: "65%" }}>
      <Box
        shadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
        borderRadius="5px"
        p="16px 24px"
      >
        <Heading size="xl" mb="30px">
          Reserve status & configuration
        </Heading>
        <Flex direction="column" gap="35px">
          <Flex gap="10px">
            <Heading size="md" minW="170px">
              Supply Info
            </Heading>
            <Flex direction="column" gap="30px" w="100%">
              <Flex gap="15px" alignItems="center">
                {hasSupplyCap ? (
                  <ProgressCircle.Root size="xl" value={supplyCapPercentage}>
                    <ProgressCircle.Circle css={{ "--size": "80px" }}>
                      <ProgressCircle.Track
                        stroke="gray.100"
                        css={{ "--thickness": "5px" }}
                      />
                      <ProgressCircle.Range
                        stroke="green.600"
                        css={{ "--thickness": "5px" }}
                      />
                    </ProgressCircle.Circle>
                    <AbsoluteCenter>
                      <ProgressCircle.ValueText>
                        {formatPercentage(supplyCapPercentage)}
                      </ProgressCircle.ValueText>
                    </AbsoluteCenter>
                  </ProgressCircle.Root>
                ) : (
                  <Box
                    w="80px"
                    h="80px"
                    borderRadius="full"
                    border="5px solid"
                    borderColor="gray.100"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg="white"
                    boxShadow="sm"
                  >
                    <Icon fontSize="30px" color="gray.400">
                      <BiInfinite />
                    </Icon>
                  </Box>
                )}
                <Flex direction="column">
                  <Box>Total supplied</Box>
                  <Heading size="lg">
                    {hasSupplyCap
                      ? `${formatTokenAmount(
                          totalSupplied
                        )} of ${formatTokenAmount(supplyCap)}`
                      : formatTokenAmount(totalSupplied)}
                  </Heading>
                  <Box fontSize="13px">
                    {hasSupplyCap
                      ? `${formatCurrency(
                          totalSuppliedUsd
                        )} of ${formatCurrency(supplyCapUsd)}`
                      : formatCurrency(totalSuppliedUsd)}
                  </Box>
                  {!hasSupplyCap && (
                    <Box fontSize="12px" color="gray.500" mt={1}>
                      No supply cap
                    </Box>
                  )}
                </Flex>
                <Box as="hr" borderWidth="1px" height="32px" />
                <Flex direction="column">
                  <Box>APY</Box>
                  <Heading size="lg">
                    {formatPercentage(parseFloat(supplyApy))}
                  </Heading>
                </Flex>
              </Flex>
              <Box mb="10px">
                <Flex alignItems="center" gap="10px" mb="10px" flexWrap="wrap">
                  <Box fontSize="14px">Collateral usage</Box>
                  <Flex alignItems="center" gap="5px" color="green.600">
                    <FaCheck />
                    <Box fontSize="14px" fontWeight="600">
                      Can be collateral
                    </Box>
                  </Flex>
                </Flex>
                <Flex
                  alignItems="stretch"
                  gap="10px"
                  flexWrap={{ base: "wrap", md: "nowrap" }}
                >
                  {supplyInfo.map((x, i) => {
                    return (
                      <Flex
                        p="4px 8px"
                        direction="column"
                        justifyContent="center"
                        borderWidth="1px"
                        key={i}
                        w={{ base: "100%", sm: "48%", md: "33.33%" }}
                        borderRadius="8px"
                      >
                        <Box fontSize={{ base: "xs", md: "sm" }}>{x.title}</Box>
                        <Box
                          fontSize={{ base: "sm", md: "md" }}
                          fontWeight="600"
                        >
                          {x.value}
                        </Box>
                      </Flex>
                    );
                  })}
                </Flex>
              </Box>
            </Flex>
          </Flex>
          <Box as="hr" borderWidth="100%"></Box>
          <Flex gap="10px">
            <Heading size="md" minW="170px">
              Borrow Info
            </Heading>
            <Flex direction="column" gap="30px" w="100%">
              <Flex gap="15px" alignItems="center">
                {hasBorrowCap ? (
                  <ProgressCircle.Root size="xl" value={borrowCapPercentage}>
                    <ProgressCircle.Circle css={{ "--size": "80px" }}>
                      <ProgressCircle.Track
                        stroke="gray.100"
                        css={{ "--thickness": "5px" }}
                      />
                      <ProgressCircle.Range
                        stroke="green.600"
                        css={{ "--thickness": "5px" }}
                      />
                    </ProgressCircle.Circle>
                    <AbsoluteCenter>
                      <ProgressCircle.ValueText>
                        {formatPercentage(borrowCapPercentage)}
                      </ProgressCircle.ValueText>
                    </AbsoluteCenter>
                  </ProgressCircle.Root>
                ) : (
                  <Box
                    w="80px"
                    h="80px"
                    borderRadius="full"
                    border="5px solid"
                    borderColor="gray.100"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg="white"
                    boxShadow="sm"
                  >
                    <Icon fontSize="30px" color="gray.400">
                      <BiInfinite />
                    </Icon>
                  </Box>
                )}
                <Flex direction="column">
                  <Box>Total borrowed</Box>
                  <Heading size="lg">
                    {hasBorrowCap
                      ? `${formatTokenAmount(
                          totalBorrowed
                        )} of ${formatTokenAmount(borrowCap)}`
                      : formatTokenAmount(totalBorrowed)}
                  </Heading>
                  <Box fontSize="13px">
                    {hasBorrowCap
                      ? `${formatCurrency(
                          totalBorrowedUsd
                        )} of ${formatCurrency(borrowCapUsd)}`
                      : formatCurrency(totalBorrowedUsd)}
                  </Box>
                  {!hasBorrowCap && (
                    <Box fontSize="12px" color="gray.500" mt={1}>
                      No borrow cap
                    </Box>
                  )}
                </Flex>
                <Box as="hr" borderWidth="1px" height="32px" />
                <Flex direction="column">
                  <Box>APY, variable</Box>
                  <Heading size="lg">
                    {formatPercentage(parseFloat(borrowApy))}
                  </Heading>
                </Flex>
                <Box as="hr" borderWidth="1px" height="32px" />
                <Flex direction="column">
                  <Box>Borrow cap</Box>
                  <Heading size="lg">{formatTokenAmount(borrowCap)}</Heading>
                  <Box fontSize="13px">{formatCurrency(borrowCapUsd)}</Box>
                </Flex>
              </Flex>
              <Box mb="10px">
                <Box fontSize="14px" mb="10px">
                  Collector Info
                </Box>
                <Flex
                  alignItems="stretch"
                  gap="10px"
                  flexWrap={{ base: "wrap", md: "nowrap" }}
                >
                  {borrowInfo.map((x, i) => {
                    return (
                      <Flex
                        p="4px 8px"
                        direction="column"
                        justifyContent="center"
                        borderWidth="1px"
                        key={i}
                        w={{ base: "100%", sm: "48%", md: "33.33%" }}
                        borderRadius="8px"
                      >
                        <Box fontSize={{ base: "xs", md: "sm" }}>{x.title}</Box>
                        <Box
                          fontSize={{ base: "sm", md: "md" }}
                          fontWeight="600"
                        >
                          {x.value}
                        </Box>
                      </Flex>
                    );
                  })}
                </Flex>
              </Box>
            </Flex>
          </Flex>

          <Flex gap="10px">
            <Heading size="md" minW="170px">
              Interest rate model
            </Heading>
            <Flex direction="column" gap="20px" w="100%">
              <Box mb="10px">
                <Flex direction="column">
                  <Box>Utilization Rate</Box>
                  <Heading size="lg">
                    {formatPercentage(utilizationRate)}
                  </Heading>
                </Flex>
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default AssetOverview;
