import {
  AbsoluteCenter,
  Box,
  Flex,
  Heading,
  ProgressCircle,
} from "@chakra-ui/react";
import React from "react";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

interface Props {
  token?: string;
}

const AssetOverview: React.FC<Props> = ({ token = "eth" }) => {
  const supplyInfo = [
    {
      title: "Max LTV",
      value: "80.50%",
    },
    {
      title: "Liquidation threshold",
      value: "83.00%",
    },
    {
      title: "Liquidation penalty",
      value: "5.00%",
    },
  ];

  const borrowInfo = [
    {
      title: "Reserve factor",
      value: "15.00%",
    },
    {
      title: "Collector Contract",
      value: "View contract",
    },
  ];

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
                <ProgressCircle.Root size="xl" value={24.66}>
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
                    <ProgressCircle.ValueText>24.66%</ProgressCircle.ValueText>
                  </AbsoluteCenter>
                </ProgressCircle.Root>
                <Flex direction="column">
                  <Box>Total supplied</Box>
                  <Heading size="lg">2.55K of 10,350.00</Heading>
                  <Box fontSize="13px">$ 8.44M of $ 34.21M</Box>
                </Flex>
                <Box as="hr" borderWidth="1px" height="32px" />
                <Flex direction="column">
                  <Box>APY</Box>
                  <Heading size="lg">101.98 %</Heading>
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
                <ProgressCircle.Root size="xl" value={71.94}>
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
                    <ProgressCircle.ValueText>71.94%</ProgressCircle.ValueText>
                  </AbsoluteCenter>
                </ProgressCircle.Root>
                <Flex direction="column">
                  <Box>Total borrowed</Box>
                  <Heading size="lg">2.09M of 2.90M</Heading>
                  <Box fontSize="13px">$ 6.90B of $ 9.60B</Box>
                </Flex>
                <Box as="hr" borderWidth="1px" height="32px" />
                <Flex direction="column">
                  <Box>APY, variable</Box>
                  <Heading size="lg">2.51 %</Heading>
                </Flex>
                <Box as="hr" borderWidth="1px" height="32px" />
                <Flex direction="column">
                  <Box>Borrow cap</Box>
                  <Heading size="lg">2.90M</Heading>
                  <Box fontSize="13px">$ 9.60B</Box>
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
                  <Heading size="lg">87.60 %</Heading>
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
