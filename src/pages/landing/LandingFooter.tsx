import { Box, Button, Flex, Heading, Input, Link } from "@chakra-ui/react";

const LandingFooter = () => {
  return (
    <Box as={"section"} pt={{ base: "20px", md: "30px", lg: "50px" }}>
      <Box maxW={"1140px"} mx={"auto"}>
        <Flex
          direction={{ base: "column", sm: "row" }}
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={"10px"}
        >
          <Box fontSize={"13px"} as={"p"}>
            © Creditify • Built for DeFi • Non-custodial
          </Box>
          <Flex alignItems={"center"} gap={"8px"}>
            <Link fontSize={"13px"} className="footer-link" href="/terms">
              Terms
            </Link>
            <Link fontSize={"13px"} className="footer-link" href="/privacy">
              Privacy
            </Link>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default LandingFooter;
