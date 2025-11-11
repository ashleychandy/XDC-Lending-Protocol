import React from "react";
import { Box, Heading, Flex, Button, SimpleGrid, Text } from "@chakra-ui/react";
import type { TokenDetailsDTO } from "./types/type";

interface Props {
  tokenDetails: TokenDetailsDTO[];
}

const MarketOverview: React.FC<Props> = ({ tokenDetails }) => {
  return (
    <Box as={"section"} gap={"20px"}>
      <Heading fontSize={"32px"} mb={"20px"}>
        Market Overview
      </Heading>
      <Box as={"p"} mb={"30px"}>
        Live reserve data — supply APY, borrow APR, available liquidity and
        utilization.
      </Box>
      <Flex alignItems={"center"} gap={"80px"}>
        {tokenDetails.map((x, i) => {
          return (
            <Box
              p="20px"
              className="box"
              borderRadius={"14px"}
              w={"50%"}
              key={i}
            >
              <Flex mb={"15px"} justifyContent={"space-between"}>
                <Flex gap="3" alignItems="center">
                  <Flex
                    w="65px"
                    h="65px"
                    borderRadius="12px"
                    className="primary-color"
                    justifyContent="center"
                    alignItems="center"
                    color={"#041022"}
                    fontWeight={"700"}
                    fontSize={"19px"}
                  >
                    {x.symbol}
                  </Flex>
                  <Flex direction="column">
                    <Box fontWeight={"700"} fontSize={"19px"}>
                      {x.shortName}
                    </Box>
                    <Box as={"p"} fontSize="15px">
                      {x.fullName}
                    </Box>
                  </Flex>
                </Flex>
                <Flex alignItems={"center"} gap={"10px"}>
                  <Button
                    className="secondary-btn-lg"
                    /* onClick={() =>
                            window.open("https://docs.xdc.network/", "_blank")
                          } */
                  >
                    Supply
                  </Button>
                  <Button
                    className="primary-btn-lg"
                    // onClick={() => navigate("/dashboard")}
                  >
                    Borrow
                  </Button>
                </Flex>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap="10px" mb={"30px"}>
                {x.tokenInfo.map((y, index) => {
                  return (
                    <Box
                      p="10px"
                      borderRadius="10px"
                      className="box2"
                      key={index}
                    >
                      <Box>{y.label}</Box>
                      <Box fontWeight={"700"}>{y.value}</Box>
                    </Box>
                  );
                })}
              </SimpleGrid>
              <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Flex alignItems={"center"} flex="1">
                  {/* Label */}
                  <Text as={"p"}>Health Factor</Text>
                  {/* Progress bar */}
                  <Box flex="1" mx="16px" position="relative" maxW={"200px"}>
                    <Box
                      w="100%"
                      h="42px"
                      borderRadius="full"
                      background="linear-gradient(90deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0) 100%)"
                      border="1px solid #FFFFFF08"
                      overflow="hidden"
                    >
                      <Box
                        w={`${50}%`}
                        h="30px"
                        m={"5px"}
                        borderRadius="full"
                        background="linear-gradient(90deg, #06B6D4 0%, #6366F1 100%)"
                        box-shadow=" 0px 9.22px 23.05px 0px #6366F10F"
                      />
                    </Box>
                  </Box>
                  {/* Value */}
                  <Text color="white" fontSize="sm" fontWeight="bold">
                    1.78
                  </Text>
                </Flex>
                <Flex>
                  <Box as={"p"}> TVL: $42.60M</Box>
                </Flex>
              </Flex>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
};

export default MarketOverview;
