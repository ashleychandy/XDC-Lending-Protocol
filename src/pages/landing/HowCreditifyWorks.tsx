import React from "react";
import { Box, Heading, Flex, SimpleGrid, Image } from "@chakra-ui/react";
import supplyImg from "../../assets/images/landing/supply.png";
import borrowImg from "../../assets/images/landing/borrow.png";

const HowCreditifyWorks = () => {
  return (
    <Box as={"section"} gap={"20px"}>
      <Heading fontSize={"32px"} mb={"20px"}>
        How Creditify works
      </Heading>
      <Box as={"p"} mb={"20px"}>
        Simple steps to supply and borrow — automated protection and transparent
        economics.
      </Box>
      <Flex wrap={"wrap"} pb={{ base: "40px", md: "60px", lg: "100px" }}>
        <Box
          p={{ base: "15px", xl: "25px 50px" }}
          w={{ base: "100%", lg: "50%" }}
        >
          <Heading
            className="big-heading"
            fontSize={{ base: "100px", lg: "128px" }}
            lineHeight={{ base: "100px", lg: "128px" }}
          >
            1
          </Heading>
          <Heading
            ml={"-40px"}
            display={"inline-block"}
            verticalAlign={"super"}
            fontSize={{ base: "30px", sm: "32px", md: "40px", lg: "48px" }}
          >
            Supply Assets
          </Heading>
          <Box
            as={"p"}
            fontSize={{ base: "14px", sm: "18px", lg: "22px" }}
            p={"15px 40px"}
          >
            Deposit USDC or WETH into the reserve and receive
            <br />
            xTokens (xUSDC/xWETH) that accrue yield automatically.
          </Box>
        </Box>
        <Box
          p={{ base: "15px", xl: "25px 50px" }}
          w={{ base: "100%", lg: "50%" }}
        >
          <Heading
            className="big-heading"
            fontSize={{ base: "100px", lg: "128px" }}
            lineHeight={{ base: "100px", lg: "128px" }}
          >
            2
          </Heading>
          <Heading
            ml={"-40px"}
            display={"inline-block"}
            verticalAlign={"super"}
            fontSize={{ base: "30px", sm: "32px", md: "40px", lg: "48px" }}
          >
            Borrow Instantly
          </Heading>
          <Box
            as={"p"}
            fontSize={{ base: "14px", sm: "18px", lg: "22px" }}
            p={"15px 40px"}
          >
            Use your xTokens as collateral to borrow other assets.
            <br />
            Interest is algorithmic and tied to utilization.
          </Box>
        </Box>
        <Flex w={"100%"} justifyContent={"center"}>
          <Box
            p={{ base: "15px", xl: "25px 50px" }}
            w={{ base: "100%", lg: "63%", xl: "53%" }}
          >
            <Heading
              className="big-heading"
              fontSize={{ base: "100px", lg: "128px" }}
              lineHeight={{ base: "100px", lg: "128px" }}
            >
              3
            </Heading>
            <Heading
              ml={"-40px"}
              display={"inline-block"}
              verticalAlign={"super"}
              fontSize={{ base: "30px", sm: "32px", md: "40px", lg: "48px" }}
            >
              Automated Protection
            </Heading>
            <Box
              as={"p"}
              fontSize={{ base: "14px", sm: "18px", lg: "22px" }}
              p={"15px 40px"}
            >
              Health Factor monitoring and automated liquidation
              <br />
              safeguards help maintain solvency and protect lenders
            </Box>
          </Box>
        </Flex>
      </Flex>
      <SimpleGrid
        columns={2}
        gap={{ base: "40px", md: "60px", lg: "80px" }}
        py={{ base: "40px", md: "60px", lg: "100px" }}
      >
        <Flex direction={"column"}>
          <Image
            src={supplyImg}
            mx={"auto"}
            maxW={"400px"}
            maxH={"400px"}
            alt="supply-img"
            pb={"50px"}
          />
          <Heading
            fontSize={"40px"}
            color={"#06B6D4"}
            py={"25px"}
            borderTop="2px solid #06B6D4"
          >
            Supply
          </Heading>
          <Box as={"p"}>
            Earn interests by supplying assets to the lending network.
          </Box>
        </Flex>
        <Box>
          <Flex direction={"column"}>
            <Image
              src={borrowImg}
              mx={"auto"}
              maxW={"400px"}
              maxH={"400px"}
              alt="borrow-img"
              pb={"50px"}
            />
            <Heading
              fontSize={"40px"}
              color={"#06B6D4"}
              py={"25px"}
              borderTop="2px solid #06B6D4"
            >
              Borrow
            </Heading>
            <Box as={"p"}>
              Borrow against your collateral from across multiple networks and
              assets.
            </Box>
          </Flex>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default HowCreditifyWorks;
