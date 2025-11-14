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
import xdcBigIcon from "../../assets/images/landing/xdc-big-icon.png";

interface Props {
  tokenDetails: TokenDetailsDTO[];
}

const MarketOverview: React.FC<Props> = ({ tokenDetails }) => {
  return (
    <Box as={"section"} pt={{ base: "25px", lg: "50px" }}>
      <Heading fontSize={"32px"} mb={"20px"}>
        Market Overview
      </Heading>
      <Flex>
        <Flex
          alignItems={"center"}
          justifyContent={"center"}
          // flexWrap={{ base: "wrap", lg: "nowrap" }}
          gap={{ base: "15px", lg: "20px" }}
          w={{ base: "100%", lg: "55%" }}
        >
          {tokenDetails.map((x, i) => {
            return (
              <Box
                p="15px"
                className="box"
                borderRadius={"14px"}
                w={{ base: "100%", lg: "50%" }}
                key={i}
              >
                <Flex mb={"15px"} justifyContent={"space-between"}>
                  <Flex gap="3" alignItems="center">
                    <Flex
                      w="42px"
                      h="42px"
                      borderRadius="10px"
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
                          w="25px"
                          h="25px"
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
                </Flex>
                <SimpleGrid columns={2} gap="10px">
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
              </Box>
            );
          })}
        </Flex>

        <Flex
          w={{ base: "100%", lg: "45%" }}
          position={"relative"}
          justifyContent={"flex-end"}
          alignItems={"center"}
        >
          <Box fontSize={"24px"} fontStyle={"italic"} maxW={"80%"} pr={"140px"}>
            Supply, Borrow, Earn on Lightning-Fast XDC Network
          </Box>
          <Image
            src={xdcBigIcon}
            opacity={"30%"}
            maxW={"240px"}
            maxH={"240px"}
            position={"absolute"}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default MarketOverview;
