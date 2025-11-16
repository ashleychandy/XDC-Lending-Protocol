import { Box, Container, Flex, Link } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box bg="#f7f8fa" py="20px" mt="40px" borderTop="1px solid #eaebef">
      <Container
        maxW={{
          md: "container.md",
          lg: "container.lg",
          xl: "container.xl",
        }}
      >
        <Flex
          direction={{ base: "column", sm: "row" }}
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={"10px"}
        >
          <Box fontSize={"13px"} color="#62677b">
            © Creditify • Built for DeFi • Non-custodial
          </Box>
          <Flex alignItems={"center"} gap={"15px"}>
            <Link
              fontSize={"13px"}
              color="#62677b"
              href="/terms"
              _hover={{ color: "#000", textDecoration: "underline" }}
            >
              Terms
            </Link>
            <Link
              fontSize={"13px"}
              color="#62677b"
              href="/privacy"
              _hover={{ color: "#000", textDecoration: "underline" }}
            >
              Privacy
            </Link>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
