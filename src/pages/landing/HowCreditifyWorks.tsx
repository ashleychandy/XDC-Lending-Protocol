import { Box, Flex, Heading, Image, SimpleGrid } from "@chakra-ui/react";

const HowCreditifyWorks = () => {
  const items = [
    {
      rank: "1",
      title: "Supply assets",
      descItems: [
        "Earn Yield on depositing USDC, XDC, CGO  into the protocol.",
      ],
    },
    {
      rank: "2",
      title: "Borrow instantly",
      descItems: ["Borrow against the collateral"],
    },
    {
      rank: "3",
      title: "Automated protection",
      descItems: [
        "Health Factor monitoring and automated liquidation",
        "safeguards help maintain solvency and protect lenders.",
      ],
    },
    {
      rank: "4",
      title: "Earn Yield",
      descItems: ["Automatically earn variable AYP based on market demand."],
    },
  ];

  return (
    <Box as={"section"} gap={"20px"}>
      <Heading fontSize={"32px"} mb={"20px"}>
        How Creditify works
      </Heading>
      <Box as={"p"} mb={"20px"} maxW={"68%"}>
        A decentralized finance protocol where you can supply assets to earn,
        use your collateral to borrow, and grow your portfolio — all powered by
        the XDC Network
      </Box>
      <SimpleGrid columns={{ base: 2, sm: 4 }} gap="15px">
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
                // fontWeight={x.icon ? undefined : "700"}
                fontSize={"14px"}
                mb={"5px"}
              >
                {x.rank}
              </Flex>
              <Heading mb={"10px"} fontSize={"14px"}>
                {x.title}
              </Heading>
              {x.descItems.map((a, ind) => {
                return (
                  <Box as={"p"} key={ind} className="p" fontSize={"14px"}>
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
