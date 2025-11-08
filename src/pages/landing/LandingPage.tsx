import {
  formatCurrency,
  formatPercentage,
  useAssetDetails,
} from "@/hooks/useAssetDetails";
import { landingSystem } from "@/landingSystem";
import {
  Box,
  Button,
  ChakraProvider,
  Container,
  Flex,
  Heading,
  Image,
  SimpleGrid,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import section1Img from "../../assets/images/landing/section1Img.png";
import LandingHeader from "./LandingHeader";

const LandingPage = () => {
  const navigate = useNavigate();
  const {
    availableLiquidity: wethLiquidity,
    utilizationRate: usdcUtilizationRate,
  } = useAssetDetails("weth");

  const {
    availableLiquidity: usdcLiquidity,
    utilizationRate: wethUtilizationRate,
  } = useAssetDetails("usdc");

  const { supplyApy: wethSupplyApy, borrowApy: wethBorrowApy } =
    useAssetDetails("weth");

  const { supplyApy: usdcSupplyApy, borrowApy: usdcBorrowApy } =
    useAssetDetails("usdc");

  return (
    <ChakraProvider value={landingSystem}>
      <Box bg="#0A1428" minH="100vh" className="landing-page">
        <Container
          maxW={{
            base: "100%",
            md: "container.md",
            lg: "container.lg",
            xl: "container.xl",
            "2xl": "1340px",
          }}
          px={{ base: 4, md: 6 }}
          py={{ base: 4, lg: 10 }}
          h="100%"
        >
          <LandingHeader />
          <Flex as={"section"} gap={"20px"} alignItems={"center"} py={"100px"}>
            <Box w={"55%"}>
              <Box as={"p"} fontSize={"13px"} mb={"20px"}>
                Decentralized Liquidity Protocol
              </Box>
              <Heading fontSize={"48px"} lineHeight={"56px"} mb={"20px"}>
                Supply. Earn. Borrow. — Securely.
              </Heading>
              <Box as={"p"} mb={"20px"}>
                Creditify enables users to supply assets like USDC and WETH to
                earn yield, and borrow instantly against collateral with
                automated risk management. Non-custodial, audited, and governed
                by the community.
              </Box>
              <Flex alignItems={"center"} gap={"20px"} mb={"40px"}>
                <Button
                  className="primary-btn"
                  onClick={() => navigate("/dashboard")}
                >
                  Get Started
                </Button>
                <Button
                  className="secondary-btn"
                  onClick={() =>
                    window.open("https://docs.xdc.network/", "_blank")
                  }
                >
                  How it works
                </Button>
              </Flex>
              <Flex alignItems={"center"} gap={"15px"}>
                <Box p="10px" className="box" borderRadius={"14px"} w={"50%"}>
                  <Flex gap="3" alignItems="center" mb={"10px"}>
                    <Flex
                      w="44px"
                      h="44px"
                      borderRadius="12px"
                      className="primary-color"
                      justifyContent="center"
                      alignItems="center"
                      color={"#041022"}
                      fontWeight={"700"}
                    >
                      US
                    </Flex>
                    <Flex direction="column">
                      <Box fontWeight={"700"}>USDC</Box>
                      <Box as={"p"} fontSize="13px">
                        Stablecoin Reserve
                      </Box>
                    </Flex>
                  </Flex>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap="10px">
                    <Box p="10px" borderRadius="10px" className="box2">
                      <Box>Supply APY</Box>
                      <Box fontWeight={"700"}>
                        {formatPercentage(parseFloat(usdcSupplyApy))}
                      </Box>
                    </Box>
                    <Box p="10px" borderRadius="10px" className="box2">
                      <Box>Borrow APY</Box>
                      <Box fontWeight={"700"}>
                        {formatPercentage(parseFloat(usdcBorrowApy))}
                      </Box>
                    </Box>
                    <Box p="10px" borderRadius="10px" className="box2">
                      <Box>Available Liquidity</Box>
                      <Box fontWeight={"700"}>
                        {formatCurrency(usdcLiquidity)}
                      </Box>
                    </Box>
                    <Box p="10px" borderRadius="10px" className="box2">
                      <Box>Utilization</Box>
                      <Box fontWeight={"700"}>
                        {formatPercentage(usdcUtilizationRate)}
                      </Box>
                    </Box>
                  </SimpleGrid>
                </Box>
                <Box p="10px" className="box" borderRadius={"14px"} w={"50%"}>
                  <Flex gap="3" alignItems="center" mb={"10px"}>
                    <Flex
                      w="44px"
                      h="44px"
                      borderRadius="12px"
                      className="primary-color"
                      justifyContent="center"
                      alignItems="center"
                      color={"#041022"}
                      fontWeight={"700"}
                    >
                      WT
                    </Flex>
                    <Flex direction="column">
                      <Box fontWeight={"700"}>WETH</Box>
                      <Box as={"p"} fontSize="13px">
                        Wrapped ETH Reserve
                      </Box>
                    </Flex>
                  </Flex>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap="10px">
                    <Box p="10px" borderRadius="10px" className="box2">
                      <Box>Supply APY</Box>
                      <Box fontWeight={"700"}>
                        {formatPercentage(parseFloat(wethSupplyApy))}
                      </Box>
                    </Box>
                    <Box p="10px" borderRadius="10px" className="box2">
                      <Box>Borrow APY</Box>
                      <Box fontWeight={"700"}>
                        {formatPercentage(parseFloat(wethBorrowApy))}
                      </Box>
                    </Box>
                    <Box p="10px" borderRadius="10px" className="box2">
                      <Box>Available Liquidity</Box>
                      <Box fontWeight={"700"}>
                        {formatCurrency(wethLiquidity)}
                      </Box>
                    </Box>
                    <Box p="10px" borderRadius="10px" className="box2">
                      <Box>Utilization</Box>
                      <Box fontWeight={"700"}>
                        {" "}
                        {formatPercentage(wethUtilizationRate)}
                      </Box>
                    </Box>
                  </SimpleGrid>
                </Box>
              </Flex>
            </Box>
            {/* <Box w={"45%"}> */}
            <Image
              w={"45%"}
              src={section1Img}
              alt="section1Img"
              maxW={"100%"}
            ></Image>
            {/* </Box> */}
          </Flex>
        </Container>
      </Box>
    </ChakraProvider>
  );
};

export default LandingPage;
