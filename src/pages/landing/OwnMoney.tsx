import React from "react";
import { Box, Button, Flex, Heading, Image } from "@chakra-ui/react";
import creditiFyImg from "../../assets/images/landing/creditify.png";
import { useNavigate } from "react-router-dom";

const OwnMoney = () => {
  const navigate = useNavigate();
  return (
    <Box as={"section"} mb={{ base: "60px", md: "80px", lg: "100px" }}>
      <Box pos={"relative"}>
        <Box mb={{ base: "40px", md: "60px", lg: "80px" }}>
          <Image src={creditiFyImg} alt="creditify-img" />
        </Box>
        <Box
          pos={"absolute"}
          top={{ base: "15px", md: "20px", lg: "50px" }}
          left={"0"}
          right={"0"}
          bottom={"0"}
          my={"auto"}
          textAlign={"center"}
        >
          <Heading
            fontSize={{ base: "30px", md: "45px", lg: "60px" }}
            lineHeight={{ base: "30px", md: "45px", lg: "60px" }}
            mb={{ base: "5px", md: "10px", lg: "15px" }}
          >
            Own your money,
          </Heading>
          <Heading
            fontSize={{ base: "35px", md: "50px", lg: "70px" }}
            lineHeight={{ base: "35px", md: "50px", lg: "70px" }}
          >
            Shape your future.
          </Heading>
        </Box>
      </Box>
      <Flex
        p="20px"
        borderRadius={"14px"}
        maxW={"1140px"}
        mx={"auto"}
        direction={{ base: "column", md: "row" }}
        justifyContent={"space-between"}
        border="1px solid #FFFFFF08"
        background="linear-gradient(90deg, rgba(99, 102, 241, 0.06) 0%, rgba(6, 182, 212, 0.03) 100%)"
      >
        <Box mb={{ base: "20px", md: "0" }}>
          <Box fontWeight={"700"}>Ready to get started?</Box>
          <Box as={"p"} fontSize={"13px"}>
            Connect your wallet and launch xVault to start supplying or
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

export default OwnMoney;
