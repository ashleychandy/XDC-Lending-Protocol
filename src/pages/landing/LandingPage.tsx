import {
  formatCurrency,
  formatPercentage,
  useAssetDetails,
} from "@/hooks/useAssetDetails";
import { landingSystem } from "@/landingSystem";
import { ROUTES } from "@/routes/paths";
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
import HowCreditifyWorks from "./HowCreditifyWorks";
import MarketOverview from "./MarketOverview";
import type { TokenDetailsDTO } from "./types/type";
import YourAssets from "./YourAssets";
import GovernanceSecurity from "./GovernanceSecurity";
import OwnMoney from "./OwnMoney";
import Faq from "./Faq";
import LandingFooter from "./LandingFooter";

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

  const tokenDetails: TokenDetailsDTO[] = [
    {
      symbol: "US",
      shortName: "USDC",
      fullName: "Stablecoin Reserve",
      // tvl:,
      // hf:,
      tokenInfo: [
        {
          label: "Supply APY",
          value: formatPercentage(parseFloat(usdcSupplyApy)),
        },
        {
          label: "Borrow APY",
          value: formatPercentage(parseFloat(usdcBorrowApy)),
        },
        {
          label: "Available Liquidity",
          value: formatCurrency(usdcLiquidity),
        },
        {
          label: "Utilization",
          value: formatPercentage(usdcUtilizationRate),
        },
      ],
    },
    {
      symbol: "WT",
      shortName: "WETH",
      fullName: "Wrapped ETH Reserve",
      tokenInfo: [
        {
          label: "Supply APY",
          value: formatPercentage(parseFloat(wethSupplyApy)),
        },
        {
          label: "Borrow APY",
          value: formatPercentage(parseFloat(wethBorrowApy)),
        },
        {
          label: "Available Liquidity",
          value: formatCurrency(wethLiquidity),
        },
        {
          label: "Utilization",
          value: formatPercentage(wethUtilizationRate),
        },
      ],
    },
  ];

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
          px={{ base: 4, lg: 6 }}
          pt={{ base: 4, lg: 10 }}
          pb={{ base: 2, lg: 6 }}
          h="100%"
        >
          <LandingHeader />
          <Flex
            as={"section"}
            gap={{ lg: "20px" }}
            alignItems={"center"}
            direction={{ base: "column", lg: "row" }}
            py={{ base: "40px", md: "60px", lg: "100px" }}
          >
            <Box w={{ base: "100%", lg: "55%" }}>
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
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                >
                  Launch xVault
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
                {tokenDetails.map((x, i) => {
                  return (
                    <Box
                      p="10px"
                      className="box"
                      borderRadius={"14px"}
                      w={"50%"}
                      key={i}
                    >
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
                          {x.symbol}
                        </Flex>
                        <Flex direction="column">
                          <Box fontWeight={"700"}>{x.shortName}</Box>
                          <Box as={"p"} fontSize="13px">
                            {x.fullName}
                          </Box>
                        </Flex>
                      </Flex>
                      <SimpleGrid columns={{ base: 1, sm: 2 }} gap="10px">
                        {x.tokenInfo.map((y, index) => {
                          return (
                            <Box
                              p="10px"
                              borderRadius="10px"
                              className="box2"
                              key={index}
                            >
                              <Box>{y.label}</Box>
                              <Box fontWeight={"700"}>{y.value}</Box>
                            </Box>
                          );
                        })}
                      </SimpleGrid>
                    </Box>
                  );
                })}
              </Flex>
            </Box>
            <Box w={{ base: "100%", lg: "45%" }}>
              <Image
                src={section1Img}
                alt="section1Img"
                maxW={"100%"}
                width={{ base: "500px", lg: "100%" }}
                height={{ base: "400px", lg: "auto" }}
                mx={"auto"}
              ></Image>
            </Box>
          </Flex>
          {/* How Creditify works */}
          <HowCreditifyWorks />
          {/* Market Overview section */}
          <MarketOverview tokenDetails={tokenDetails} />
          <Box
            pt={{ base: "60px", md: "80px", lg: "120px" }}
            maxW={"1054px"}
            w={"100%"}
            mx={"auto"}
            mb={{ base: "60px", md: "80px", lg: "150px" }}
            borderBottom={"1px solid #404040"}
          ></Box>
          {/* Your assets, your control */}
          <YourAssets />
          {/* Governance & Security */}
          <GovernanceSecurity />
          {/* Own your money */}
          <OwnMoney />
          {/* Faq */}
          <Faq />
          {/* Footer */}
          <LandingFooter />
        </Container>
      </Box>
    </ChakraProvider>
  );
};

export default LandingPage;
