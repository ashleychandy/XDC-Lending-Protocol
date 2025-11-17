import { Box, Button, Flex, Heading, Input, Link } from "@chakra-ui/react";

const NewsLetter = () => {
  return (
    <Box as={"section"} mb={{ base: "20px", md: "30px", lg: "50px" }}>
      <Box maxW={"1140px"} mx={"auto"}>
        <Flex
          className="footer-newsletter"
          borderRadius={"15px"}
          direction={{ base: "column", md: "row" }}
        >
          <Flex
            direction={"column"}
            justifyContent={"center"}
            p={{ base: "15px", sm: "20px", md: "50px 20px", lg: "80px 50px" }}
            w={{ base: "100%", md: "40%" }}
          >
            <Heading
              fontSize={{ base: "24px", md: "28px", lg: "36px" }}
              lineHeight={"36px"}
              mb={"15px"}
            >
              Stay updated
            </Heading>
            <Box as={"p"} fontSize={{ base: "16px", md: "20px", lg: "24px" }}>
              Be the first to hear Creditify news.
            </Box>
          </Flex>
          <Flex
            className="footer-email-box"
            direction={"column"}
            justifyContent={"center"}
            p={{ base: "15px", sm: "20px", md: "50px 20px", lg: "80px 50px" }}
            w={{ base: "100%", md: "60%" }}
            borderRadius={"15px"}
          >
            <Heading fontSize={"20px"} mb={"15px"}>
              Email
            </Heading>
            <Flex alignItems={"center"} gap={"5px"}>
              <Input placeholder="Enter your email" />
              <Button
                className="primary-btn radius5px"
                style={{ borderRadius: "5px" }}
              >
                Subscribe
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default NewsLetter;
