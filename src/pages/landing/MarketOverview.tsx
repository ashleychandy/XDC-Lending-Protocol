import { Box, Flex, Heading, Image, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import xdcBigIcon from "../../assets/images/landing/xdc-big-icon.png";
import type { TokenDetailsDTO } from "./types/type";

interface Props {
  tokenDetails: TokenDetailsDTO[];
}

const MarketOverview: React.FC<Props> = ({ tokenDetails }) => {
  return (
    <Box
      as={"section"}
      pt={{ base: "25px", lg: "50px" }}
      mb={{ base: "60px", md: "80px", lg: "100px" }}
    >
      <Heading
        as="h2"
        fontSize={"32px"}
        mb={"20px"}
        fontWeight={700}
        letterSpacing={"0.5px"}
        lineHeight={1.2}
      >
        Market Overview
      </Heading>
      <Flex
        direction={{ base: "column", lg: "row" }}
        gap={{ base: "30px", lg: "0" }}
      >
        <Flex
          alignItems={"stretch"}
          justifyContent={"flex-start"}
          flexDirection={{ base: "column", sm: "row" }}
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
                      <Box
                        fontWeight={700}
                        fontSize={"19px"}
                        letterSpacing={"0.3px"}
                      >
                        {x.shortName}
                      </Box>
                      <Box
                        as={"p"}
                        fontSize="15px"
                        fontWeight={400}
                        lineHeight={1.5}
                        letterSpacing={"0.2px"}
                      >
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
                        <Box
                          fontSize={"13px"}
                          fontWeight={400}
                          letterSpacing={"0.3px"}
                          mb={"4px"}
                        >
                          {y.label}
                        </Box>
                        <Box fontWeight={600} fontSize={"15px"}>
                          {y.value}
                        </Box>
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
          justifyContent={{ base: "center", lg: "flex-end" }}
          alignItems={"center"}
          minH={{ base: "200px", lg: "auto" }}
        >
          <Box
            fontSize={{ base: "20px", md: "22px", lg: "24px" }}
            fontStyle={"italic"}
            maxW={{ base: "100%", lg: "80%" }}
            pr={{ base: "0", lg: "140px" }}
            textAlign={{ base: "center", lg: "left" }}
            fontWeight={500}
            lineHeight={1.4}
            letterSpacing={"0.3px"}
            zIndex={1}
          >
            Supply, Borrow, Earn on Lightning-Fast XDC Network
          </Box>
          <Image
            src={xdcBigIcon}
            opacity={"30%"}
            maxW={{ base: "180px", lg: "240px" }}
            maxH={{ base: "180px", lg: "240px" }}
            position={"absolute"}
            right={{ base: "50%", lg: "0" }}
            transform={{ base: "translateX(50%)", lg: "none" }}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default MarketOverview;
