import { formatCurrency } from "@/hooks/useMainnetAssetDetails";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  SimpleGrid,
} from "@chakra-ui/react";
import React from "react";
import type { TokenDetailsDTO } from "./types/type";

interface Props {
  tokenDetails: TokenDetailsDTO[];
}

const MarketOverview: React.FC<Props> = ({ tokenDetails }) => {
  return (
    <Box as={"section"} pt={{ base: "25px", lg: "50px" }}>
      <Heading fontSize={"32px"} mb={"20px"}>
        Market Overview
      </Heading>
      <Box as={"p"} mb={"30px"}>
        Live reserve data — supply APY, borrow APR, available liquidity and
        utilization.
      </Box>
      <Flex
        alignItems={"center"}
        flexWrap={{ base: "wrap", lg: "nowrap" }}
        gap={{ base: "30px", lg: "80px" }}
      >
        {tokenDetails.map((x, i) => {
          return (
            <Box
              p="20px"
              className="box"
              borderRadius={"14px"}
              w={{ base: "100%", lg: "50%" }}
              key={i}
            >
              <Flex mb={"15px"} justifyContent={"space-between"}>
                <Flex gap="3" alignItems="center">
                  <Flex
                    w="65px"
                    h="65px"
                    borderRadius="12px"
                    className={x.icon ? "token-icon-bg" : "primary-color"}
                    justifyContent="center"
                    alignItems="center"
                    color={x.icon ? undefined : "#041022"}
                    fontWeight={x.icon ? undefined : "700"}
                    fontSize={x.icon ? undefined : "19px"}
                    overflow="hidden"
                  >
                    {x.icon ? (
                      <Image
                        src={x.icon}
                        alt={x.shortName}
                        w="48px"
                        h="48px"
                        objectFit="contain"
                      />
                    ) : (
                      x.symbol
                    )}
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
              <SimpleGrid columns={2} gap="10px" mb={"30px"}>
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
              <Flex justifyContent={"flex-end"} alignItems={"center"}>
                <Box as={"p"} fontSize={"16px"} fontWeight={"600"}>
                  TVL: {x.tvl ? formatCurrency(x.tvl) : "$0.00"}
                </Box>
              </Flex>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
};

export default MarketOverview;
