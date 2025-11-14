import React from "react";
import { Box, Button, Flex, Heading, Image } from "@chakra-ui/react";
import cgoBigImg from "../../assets/images/landing/cgo-big-icon.png";
import usdcImg from "../../assets/images/landing/usdc-cctp-v2.png";
import { useNavigate } from "react-router-dom";

const InstantCapital = () => {
  const navigate = useNavigate();
  return (
    <Box as={"section"}>
      <Flex maxW={"1100px"} alignItems={"center"} mb={"150px"}>
        <Box w={"50%"}>
          <Heading fontSize={"64px"} lineHeight={"70px"} mb={"15px"}>
            Turn Gold Into Instant Capital{" "}
          </Heading>
          <Box fontSize={"24px"} fontStyle={"italic"}>
            Supply CGO tokens backed by real physical gold, earn yield, and
            borrow stablecoins instantly. No selling. No waiting. No middlemen
          </Box>
        </Box>
        <Flex w={"50%"} justifyContent={"flex-end"}>
          <Image src={cgoBigImg} maxW={"420px"}></Image>
        </Flex>
      </Flex>
      <Box maxW={"1100px"} ml={"auto"} mb={"150px"}>
        <Flex alignItems={"center"}>
          <Flex w={"50%"} justifyContent={"flex-start"}>
            <Image src={usdcImg} maxW={"350px"}></Image>
          </Flex>
          <Flex w={"50%"} direction={"column"} justifyContent={"flex-end"}>
            <Heading fontSize={"64px"} lineHeight={"70px"} mb={"15px"}>
              Earn Yield With Native USDC
            </Heading>
            <Box fontSize={"24px"} fontStyle={"italic"}>
              Supply USDC to earn passive yield or borrow with your crypto
              collateral powered by the XDC Network
            </Box>
          </Flex>
        </Flex>
      </Box>
      <Flex
        p="20px"
        borderRadius={"14px"}
        maxW={"1140px"}
        mx={"auto"}
        direction={{ base: "column", md: "row" }}
        justifyContent={"space-between"}
        className="cta-box"
      >
        <Box mb={{ base: "20px", md: "0" }}>
          <Box fontWeight={"700"}>Ready to get started?</Box>
          <Box as={"p"} fontSize={"13px"}>
            Connect your wallet and launch Creditify to start supplying or
            borrowing.
          </Box>
        </Box>
        <Flex alignItems={"center"} gap={"10px"}>
          <Button
            className="primary-btn"
            onClick={() => navigate("/dashboard")}
          >
            Launch App
          </Button>
          <Button className="secondary-btn" onClick={() => navigate("/market")}>
            View Markets
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default InstantCapital;
