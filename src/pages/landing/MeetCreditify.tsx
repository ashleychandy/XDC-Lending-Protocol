import { SimpleGrid, Flex, Heading, Box } from "@chakra-ui/react";
import React from "react";

const MeetCreditify = () => {
  return (
    <Box maxW={"1000px"} mx={"auto"} pt={{ base: "100px", lg: "150px" }}>
      <Box textAlign={"center"}>
        <Heading
          fontSize={{ base: "32px", md: "40px", lg: "64px" }}
          lineHeight={{ base: "40px", md: "48px", lg: "64px" }}
          mb={{ base: "15px", md: "15px" }}
        >
          Meet Creditify.
        </Heading>
        <Box as={"p"} fontSize={"24px"} fontStyle={"italic"}>
          Grow your assets.
        </Box>
        <Box as={"p"} fontSize={"24px"} fontStyle={"italic"}>
          Access funds easily. Anytime.{" "}
        </Box>
      </Box>
      <SimpleGrid
        columns={2}
        gap={{ base: "40px", md: "60px", lg: "200px" }}
        pt={{ base: "40px", md: "60px", lg: "100px" }}
        pb={{ base: "40px", md: "60px", lg: "150px" }}
        borderBottom={"2px solid #00000024"}
      >
        <Flex direction={"column"}>
          <Heading
            fontSize={"36px"}
            color={"#000"}
            py={"25px"}
            borderTop="2px solid #000"
          >
            Supply
          </Heading>
          <Box as={"p"} fontSize={"12px"}>
            Supply your asset. Watch your earnings grow.
          </Box>
        </Flex>
        <Box>
          <Flex direction={"column"}>
            <Heading
              fontSize={"36px"}
              color={"#000"}
              py={"25px"}
              borderTop="2px solid #000"
            >
              Borrow
            </Heading>
            <Box as={"p"} fontSize={"12px"}>
              Borrow securely using your multi-chain collateral.
            </Box>
          </Flex>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default MeetCreditify;
