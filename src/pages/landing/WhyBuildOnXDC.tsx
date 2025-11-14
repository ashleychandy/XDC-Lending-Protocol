// FeatureStrips.tsx
import { Box, Flex, Heading, Image, Text, VStack } from "@chakra-ui/react";
import xdcIcon from "../../assets/images/landing/xdc-big-icon.png";

const items = [
  {
    bold: "2-Second Finality",
    rest: "ensures instant and reliable execution.",
    ml: { base: 0, md: 0, lg: 0 },
  },
  {
    bold: "Gas Fees < $0.0001",
    rest: "make user transactions nearly free.",
    ml: { base: 0, md: "80px", xl: "180px" },
  },
  {
    bold: "Hybrid & Compliance-Ready",
    rest: "Architecture",
    ml: { base: 0, md: "200px", xl: "340px" },
  },
  {
    bold: "Scaleable & Energy Effieient",
    rest: "Layer-1 network with global reach",
    ml: { base: 0, md: "300px", xl: "500px" },
  },
];

const WhyBuildOnXDC = () => {
  return (
    <Box as={"section"}>
      <Heading fontSize={"32px"} mb={"40px"}>
        Why build on XDC Network?
      </Heading>
      <Box w="full" bgGradient="linear(to-br, #ffffff, #f1f1f1)">
        <VStack align="stretch" gap={"30px"}>
          {items.map((item, i) => (
            <Box
              key={item.bold}
              position="relative"
              pl="35px"
              // stagger horizontally on desktop
              ml={item.ml}
            >
              {/* X icon */}
              <Flex
                position="absolute"
                left="0"
                top="50%"
                transform="translateY(-50%)"
                w="25px"
                h="25px"
                align="center"
                justify="center"
              >
                <Image src={xdcIcon} />
              </Flex>

              {/* pill */}
              <Flex
                as="div"
                align="center"
                justifyContent={"center"}
                px={{ base: 5, md: "10px" }}
                py={{ base: 3, md: "21px" }}
                borderRadius="250px"
                maxW={"626px"}
                w={"100%"}
                background="linear-gradient(90deg, #777777 0%, #FFFFFF 100%)"
                border="1px solid #000000"
                boxShadow="0px 3.3px 3.3px 0px #00000040"
              >
                <Text
                  as={"div"}
                  fontSize={{ base: "sm", md: "md" }}
                  color={"#000"}
                >
                  <Text as="span" fontWeight="700" fontSize={"20px"}>
                    {item.bold}{" "}
                  </Text>
                  <Text as="span" fontWeight="400" fontSize={"20px"}>
                    {item.rest}
                  </Text>
                </Text>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default WhyBuildOnXDC;
