// FeatureStrips.tsx
import TextType from "@/components/ui/TextType/TextType";
import { Box, Flex, Heading, Image, VStack } from "@chakra-ui/react";
import xdcIcon from "../../assets/images/landing/xdc-big-icon.png";

const items = [
  {
    bold: "2-second finality",
    rest: "ensures instant and reliable execution.",
    ml: { base: 0, md: 0, lg: 0 },
  },
  {
    bold: "Gas fees < $0.0001",
    rest: "make user transactions nearly free.",
    ml: { base: 0, md: "80px", xl: "180px" },
  },
  {
    bold: "Hybrid and Compliance-Ready.",
    rest: "Architecture",
    ml: { base: 0, md: "200px", xl: "340px" },
  },
  {
    bold: "Scalable and energy-efficient",
    rest: "Layer-1 network with global reach.",
    ml: { base: 0, md: "300px", xl: "500px" },
  },
];

const WhyBuildOnXDC = () => {
  return (
    <Box as={"section"} mb={{ base: "60px", md: "80px", lg: "100px" }}>
      <Heading
        as="h2"
        fontSize={"32px"}
        mb={"40px"}
        fontWeight={700}
        letterSpacing={"0.5px"}
        lineHeight={1.2}
      >
        Why build on XDC Network?
      </Heading>
      <Box w="full" bgGradient="linear(to-br, #ffffff, #f1f1f1)">
        <VStack align="stretch" gap={"30px"} py={{ base: "20px", md: "30px" }}>
          {items.map((item, i) => (
            <Box
              key={item.bold}
              position="relative"
              pl={{ base: "35px", md: "35px" }}
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
                px={{ base: "15px", md: "20px" }}
                py={{ base: "15px", md: "21px" }}
                borderRadius="250px"
                maxW={"626px"}
                w={"100%"}
                background="linear-gradient(90deg, #777777 0%, #FFFFFF 100%)"
                border="1px solid #000000"
                boxShadow="0px 3.3px 3.3px 0px #00000040"
              >
                <TextType
                  text={`${item.bold} ${item.rest}`}
                  typingSpeed={50}
                  showCursor={false}
                  startOnVisible={true}
                  loop={false}
                  className="text-type-xdc"
                  style={{
                    fontSize: "clamp(14px, 4vw, 20px)",
                    color: "#000",
                    lineHeight: 1.5,
                    textAlign: "center",
                  }}
                />
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default WhyBuildOnXDC;
