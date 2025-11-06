import {
  AbsoluteCenter,
  Box,
  Flex,
  Heading,
  ProgressCircle,
  Spinner,
} from "@chakra-ui/react";
import React from "react";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { useAssetDetails } from "@/hooks/useAssetDetails";
import {
  formatCurrency,
  formatPercentage,
  formatTokenAmount,
} from "@/hooks/useAssetDetails";

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
    supplyApy,
    borrowApy,
    reserveData,
    isLoading,
  } = useAssetDetails(token || "weth");

  const config = reserveData?.configuration || 0n;
  const ltv = config & 0xffffn;
  const liquidationThreshold = (config >> 16n) & 0xffffn;
  const liquidationBonus = (config >> 32n) & 0xffffn;
  const liquidationPenalty =
    liquidationBonus > 10000n ? liquidationBonus - 10000n : 0n;
  const reserveFactor = (config >> 56n) & 0xffffn;

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
    {
      title: "Collector Contract",
      value: "View contract",
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
                <ProgressCircle.Root size="xl" value={utilizationRate}>
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
                      {formatPercentage(utilizationRate)}
                    </ProgressCircle.ValueText>
                  </AbsoluteCenter>
                </ProgressCircle.Root>
                <Flex direction="column">
                  <Box>Total supplied</Box>
                  <Heading size="lg">
                    {`${formatTokenAmount(totalSupplied)} of 0.00`}
                  </Heading>
                  <Box fontSize="13px">
                    {formatCurrency(totalSuppliedUsd)} of $0.00
                  </Box>
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
                <Flex alignItems="center" gap="10px" mb="10px">
                  <Box fontSize="14px">Collateral usage</Box>
                  <Flex alignItems="center" gap="5px" color="green.600">
                    <FaCheck />
                    <Box fontSize="14px" fontWeight="600">
                      Can be collateral
                    </Box>
                  </Flex>
                </Flex>
                <Flex alignItems="stretch" gap="10px">
                  {supplyInfo.map((x, i) => {
                    return (
                      <Flex
                        p="4px 8px"
                        direction="column"
                        justifyContent="center"
                        borderWidth="1px"
                        key={i}
                        w="33.33%"
                        borderRadius="8px"
                      >
                        <Box>{x.title}</Box>
                        <Box>{x.value}</Box>
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
                <ProgressCircle.Root size="xl" value={utilizationRate}>
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
                      {formatPercentage(utilizationRate)}
                    </ProgressCircle.ValueText>
                  </AbsoluteCenter>
                </ProgressCircle.Root>
                <Flex direction="column">
                  <Box>Total borrowed</Box>
                  <Heading size="lg">
                    {`${formatTokenAmount(totalBorrowed)} of 0.00`}
                  </Heading>
                  <Box fontSize="13px">
                    {formatCurrency(totalBorrowedUsd)} of $0.00
                  </Box>
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
                  <Heading size="lg">0.00</Heading>
                  <Box fontSize="13px">$0.00</Box>
                </Flex>
              </Flex>
              <Box mb="10px">
                <Box fontSize="14px" mb="10px">
                  Collector Info
                </Box>
                <Flex alignItems="stretch" gap="10px">
                  {borrowInfo.map((x, i) => {
                    return (
                      <Flex
                        p="4px 8px"
                        direction="column"
                        justifyContent="center"
                        borderWidth="1px"
                        key={i}
                        w="33.33%"
                        borderRadius="8px"
                      >
                        <Box>{x.title}</Box>
                        <Box>{x.value}</Box>
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
              E-Mode info
            </Heading>
            <Flex direction="column" gap="20px" w="100%">
              <Box>
                <Flex alignItems="center" gap="10px" mb="10px">
                  <Box fontSize="14px">ETH correlated</Box>
                  <Flex alignItems="center" gap="5px" color="green.600">
                    <FaCheck />
                    <Box fontSize="14px" fontWeight="600">
                      Collateral
                    </Box>
                  </Flex>
                  <Flex alignItems="center" gap="5px" color="green.600">
                    <FaCheck />
                    <Box fontSize="14px" fontWeight="600">
                      Borrowable
                    </Box>
                  </Flex>
                </Flex>
                <Flex alignItems="stretch" gap="10px">
                  {supplyInfo.map((x, i) => {
                    return (
                      <Flex
                        p="4px 8px"
                        direction="column"
                        justifyContent="center"
                        borderWidth="1px"
                        key={i}
                        w="33.33%"
                        borderRadius="8px"
                      >
                        <Box>{x.title}</Box>
                        <Box>{x.value}</Box>
                      </Flex>
                    );
                  })}
                </Flex>
              </Box>
              <Box mb="10px">
                <Flex alignItems="center" gap="10px" mb="10px">
                  <Box fontSize="14px">weETH/wstETH ETH Correlated</Box>
                  <Flex alignItems="center" gap="5px" color="red.500">
                    <RxCross2 />
                    <Box fontSize="14px" fontWeight="600">
                      Collateral
                    </Box>
                  </Flex>
                  <Flex alignItems="center" gap="5px" color="green.600">
                    <FaCheck />
                    <Box fontSize="14px" fontWeight="600">
                      Borrowable
                    </Box>
                  </Flex>
                </Flex>
                <Flex alignItems="stretch" gap="10px">
                  {supplyInfo.map((x, i) => {
                    return (
                      <Flex
                        p="4px 8px"
                        direction="column"
                        justifyContent="center"
                        borderWidth="1px"
                        key={i}
                        w="33.33%"
                        borderRadius="8px"
                      >
                        <Box>{x.title}</Box>
                        <Box>{x.value}</Box>
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
