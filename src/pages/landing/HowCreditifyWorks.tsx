import { Box, Flex, Heading, SimpleGrid } from "@chakra-ui/react";

const HowCreditifyWorks = () => {
  const items = [
    {
      rank: "1",
      title: "Supply assets",
      descItems: ["Deposit USDC, XDC, or CGO to the Creditify liquidity pool."],
    },
    {
      rank: "2",
      title: "Earn Yield",
      descItems: ["Automatically earn variable APY based on market demand."],
    },
    {
      rank: "3",
      title: "Borrow Against Collateral",
      descItems: ["Use your supplied assets as collateral to borrow instantly"],
    },
    {
      rank: "4",
      title: "Repay & Withdraw",
      descItems: ["Repay loans anytime and unlock your collateral."],
    },
  ];

  return (
    <Box
      as={"section"}
      gap={"20px"}
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
        How Creditify works
      </Heading>
      <Box
        as={"p"}
        mb={"20px"}
        maxW={{ base: "100%", md: "80%", lg: "68%" }}
        fontWeight={400}
        lineHeight={1.6}
        letterSpacing={"0.2px"}
      >
        A decentralized finance protocol where you can supply assets to earn,
        use your collateral to borrow, and grow your portfolio — all powered by
        the XDC Network
      </Box>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap="15px">
        {items.map((x, i) => {
          return (
            <Box
              key={i}
              background="linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0) 100%)"
              border="0.84px solid #FFFFFF08"
              boxShadow="0px 2.94px 2.94px 0px #00000040"
              p={{ base: "15px", sm: "15px" }}
              borderRadius={"10px"}
            >
              <Flex
                w="39px"
                h="39px"
                borderRadius="10px"
                bg={"#000"}
                justifyContent="center"
                alignItems="center"
                color={"#fff"}
                fontWeight={600}
                fontSize={"14px"}
                mb={"5px"}
              >
                {x.rank}
              </Flex>
              <Heading
                as="h4"
                mb={"10px"}
                fontSize={"14px"}
                fontWeight={600}
                letterSpacing={"0.3px"}
                lineHeight={1.4}
              >
                {x.title}
              </Heading>
              {x.descItems.map((a, ind) => {
                return (
                  <Box
                    as={"p"}
                    key={ind}
                    className="p"
                    fontSize={"14px"}
                    fontWeight={400}
                    lineHeight={1.6}
                    letterSpacing={"0.2px"}
                  >
                    {a}
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default HowCreditifyWorks;
