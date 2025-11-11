import { Box, Button, Flex, Heading, Image } from "@chakra-ui/react";
import securityImg from "../../assets/images/landing/security.png";

const GovernanceSecurity = () => {
  return (
    <Box as={"section"} mb={{ base: "60px", md: "100px", lg: "150px" }}>
      <Heading
        fontSize={{ base: "40px", lg: "60px" }}
        lineHeight={{ base: "40px", lg: "60px" }}
        mb={"20px"}
      >
        Security & Audits
      </Heading>
      <Box as={"p"} mb={"40px"}>
        Creditify uses audited smart contracts with a non-custodial design that
        ensures users keep control of their private keys.
      </Box>
      <Flex
        gap={"20px"}
        direction={{ base: "column", md: "row" }}
        alignItems={"center"}
      >
        <Box w={{ base: "100%", md: "62%" }}>
          <Box className="box" p={"20px"} borderRadius={"15px"}>
            <Box
              fontWeight={"700"}
              fontSize={{ base: "14px", sm: "18px", lg: "22px" }}
              mb={"20px"}
            >
              Audits
            </Box>
            <Box
              as={"p"}
              mb={"15px"}
              fontSize={{ base: "14px", sm: "18px", lg: "22px" }}
            >
              Third-party security audits and bug bounty program. Proofs and
              reports are available in the documentation.
            </Box>
            <Box
              as="ul"
              listStyleType="disc"
              listStylePosition="inside"
              ps={"30px"}
              mb={"15px"}
              className="governance-list"
            >
              <Box
                as={"li"}
                className="p"
                fontSize={{ base: "14px", sm: "18px", lg: "22px" }}
              >
                Smart contract audits (2025)
              </Box>
              <Box
                as={"li"}
                className="p"
                fontSize={{ base: "14px", sm: "18px", lg: "22px" }}
              >
                Ongoing formal verification
              </Box>
              <Box
                as={"li"}
                className="p"
                fontSize={{ base: "14px", sm: "18px", lg: "22px" }}
              >
                Bug bounty program
              </Box>
            </Box>
            <Button className="primary-btn">View Documentation</Button>
          </Box>
        </Box>
        <Box w={{ base: "100%", md: "38%" }}>
          <Image
            src={securityImg}
            mx={"auto"}
            w={"400px"}
            h={"auto"}
            alt="security-img"
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default GovernanceSecurity;
