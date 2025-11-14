import { Box, Flex, Heading, SimpleGrid } from "@chakra-ui/react";

const MeetCreditify = () => {
  return (
    <Box maxW={"1000px"} mx={"auto"} pt={{ base: "100px", lg: "150px" }}>
      <Box textAlign={"center"}>
        <Heading
          as="h2"
          fontSize={{ base: "32px", md: "40px", lg: "64px" }}
          lineHeight={{ base: "1.2", md: "1.15", lg: "1.1" }}
          mb={{ base: "15px", md: "15px" }}
          fontWeight={700}
          letterSpacing={{ base: "-0.5px", lg: "-1px" }}
        >
          Meet Creditify.
        </Heading>
        <Box
          as={"p"}
          fontSize={"24px"}
          fontStyle={"italic"}
          fontWeight={500}
          lineHeight={1.5}
          letterSpacing={"0.3px"}
        >
          Grow your assets.
        </Box>
        <Box
          as={"p"}
          fontSize={"24px"}
          fontStyle={"italic"}
          fontWeight={500}
          lineHeight={1.5}
          letterSpacing={"0.3px"}
        >
          Access funds easily. Anytime.{" "}
        </Box>
      </Box>
      <SimpleGrid
        columns={{ base: 1, sm: 2 }}
        gap={{ base: "40px", md: "60px", lg: "200px" }}
        pt={{ base: "40px", md: "60px", lg: "100px" }}
        pb={{ base: "40px", md: "60px", lg: "150px" }}
        borderBottom={"2px solid #00000024"}
      >
        <Flex direction={"column"}>
          <Heading
            as="h3"
            fontSize={"36px"}
            color={"#000"}
            py={"25px"}
            borderTop="2px solid #000"
            fontWeight={700}
            letterSpacing={"0.5px"}
            lineHeight={1.2}
          >
            Supply
          </Heading>
          <Box
            as={"p"}
            fontSize={"12px"}
            fontWeight={400}
            lineHeight={1.6}
            letterSpacing={"0.2px"}
          >
            Supply your asset. Watch your earnings grow.
          </Box>
        </Flex>
        <Box>
          <Flex direction={"column"}>
            <Heading
              as="h3"
              fontSize={"36px"}
              color={"#000"}
              py={"25px"}
              borderTop="2px solid #000"
              fontWeight={700}
              letterSpacing={"0.5px"}
              lineHeight={1.2}
            >
              Borrow
            </Heading>
            <Box
              as={"p"}
              fontSize={"12px"}
              fontWeight={400}
              lineHeight={1.6}
              letterSpacing={"0.2px"}
            >
              Borrow securely using your collateral.
            </Box>
          </Flex>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default MeetCreditify;
