import React from "react";
import { Box, Button, Flex, Heading, Image } from "@chakra-ui/react";
import creditiFyImg from "../../assets/images/landing/creditify.png";

const OwnMoney = () => {
  return (
    <Box as={"section"} mb={"100px"}>
      <Box pos={"relative"}>
        <Box mb={"80px"}>
          <Image src={creditiFyImg} alt="creditify-img" />
        </Box>
        <Box
          pos={"absolute"}
          top={"50px"}
          left={"0"}
          right={"0"}
          bottom={"0"}
          my={"auto"}
          textAlign={"center"}
        >
          <Heading fontSize={"60px"} lineHeight={"60px"} mb={"15px"}>
            Own your money,
          </Heading>
          <Heading fontSize={"70px"} lineHeight={"70px"}>
            Shape your future.
          </Heading>
        </Box>
      </Box>
      <Flex
        p="20px"
        borderRadius={"14px"}
        maxW={"1144px"}
        mx={"auto"}
        justifyContent={"space-between"}
        border="1px solid #FFFFFF08"
        background="linear-gradient(90deg, rgba(99, 102, 241, 0.06) 0%, rgba(6, 182, 212, 0.03) 100%)"
      >
        <Box>
          <Box fontWeight={"700"}>Ready to get started?</Box>
          <Box as={"p"} fontSize={"13px"}>
            Connect your wallet and launch xVault to start supplying or
            borrowing.
          </Box>
        </Box>
        <Flex alignItems={"center"} gap={"10px"}>
          <Button className="primary-btn">Launch App</Button>
          <Button className="secondary-btn">View Markets</Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default OwnMoney;
