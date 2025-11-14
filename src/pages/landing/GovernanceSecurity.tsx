import { Box, Button, Flex, Heading, Image, Input } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const GovernanceSecurity = () => {
  return (
    <Box as={"section"}>
      <Box mb={"60px"}>
        <Heading fontSize={"32px"} mb={"10px"}>
          SECURITY
        </Heading>
        <Box as={"p"} fontSize={"12px"}>
          Protection beyond collateral.
        </Box>
      </Box>
      <Flex
        border="1px solid #9E9E9E"
        backdropFilter="blur(12.399999618530273px)"
        boxShadow="0px 12px 10.3px 0px #0000004D"
        borderRadius={"15px"}
        direction={{ base: "column", md: "row" }}
        maxW={"1100px"}
      >
        <Flex
          direction={"column"}
          justifyContent={"center"}
          p={{ base: "15px", sm: "20px", md: "20px", lg: "30px" }}
          w={{ base: "100%", md: "28%" }}
        >
          <Heading
            fontSize={{ base: "24px", md: "28px", lg: "32px" }}
            lineHeight={"32px"}
            mb={"15px"}
          >
            Extensive Audits
          </Heading>
        </Flex>
        <Flex
          direction={"column"}
          justifyContent={"center"}
          p={{ base: "15px", sm: "20px", md: "20px", lg: "30px 100px" }}
          w={{ base: "100%", md: "72%" }}
          borderRadius={"15px"}
          background="linear-gradient(90deg, #777777 0%, #FFFFFF 100%)"
          color={"#000"}
        >
          <Box>
            <Box
              fontWeight={"700"}
              fontSize={{ base: "14px", sm: "18px", lg: "22px" }}
              fontStyle={"italic"}
              mb={"10px"}
            >
              Audits
            </Box>
            <Box
              mb={"15px"}
              fontSize={{ base: "14px", sm: "18px", lg: "16px" }}
            >
              Third-party security audits and bug bounty program. Proofs and
              reports are available in the documentation.
            </Box>
            <Box
              as="ul"
              listStyleType="disc"
              mb={"15px"}
              className="governance-list"
            >
              <Box
                as={"li"}
                mb={"10px"}
                fontSize={{ base: "14px", sm: "16px", lg: "16px" }}
              >
                Smart contract audits (2025)
              </Box>
              <Box
                as={"li"}
                mb={"10px"}
                fontSize={{ base: "14px", sm: "16px", lg: "16px" }}
              >
                Ongoing formal verification
              </Box>
              <Box
                as={"li"}
                mb={"10px"}
                fontSize={{ base: "14px", sm: "16px", lg: "16px" }}
              >
                Bug bounty program
              </Box>
            </Box>
            <Link to={""} color="#000" style={{ textDecoration: "underline" }}>
              Learn more
            </Link>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default GovernanceSecurity;
