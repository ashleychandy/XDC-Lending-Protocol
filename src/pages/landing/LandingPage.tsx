import { getTokenLogo } from "@/config/tokenLogos";
import {
  formatCurrency,
  formatPercentage,
  useMainnetAssetDetails,
} from "@/hooks/useMainnetAssetDetails";
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
import usdcIcon from "../../assets/images/usdc.svg";
import xdcIcon from "../../assets/images/xdc-icon.webp";
import Faq from "./Faq";
import GovernanceSecurity from "./GovernanceSecurity";
import HowCreditifyWorks from "./HowCreditifyWorks";
import LandingFooter from "./LandingFooter";
import LandingHeader from "./LandingHeader";
import MarketOverview from "./MarketOverview";
import OwnMoney from "./OwnMoney";
import type { TokenDetailsDTO } from "./types/type";
import YourAssets from "./YourAssets";

const LandingPage = () => {
  const navigate = useNavigate();
  // Fetch data for landing page (XDC mainnet by default, or Apothem if VITE_TESTNET=true)
  const {
    availableLiquidity: wxdcLiquidity,
    utilizationRate: wxdcUtilizationRate,
    supplyApy: wxdcSupplyApy,
    borrowApy: wxdcBorrowApy,
    totalSuppliedUsd: wxdcTvl,
  } = useMainnetAssetDetails("wxdc");

  const {
    availableLiquidity: usdcLiquidity,
    utilizationRate: usdcUtilizationRate,
    supplyApy: usdcSupplyApy,
    borrowApy: usdcBorrowApy,
    totalSuppliedUsd: usdcTvl,
  } = useMainnetAssetDetails("usdc");

  const {
    availableLiquidity: cgoLiquidity,
    utilizationRate: cgoUtilizationRate,
    supplyApy: cgoSupplyApy,
    borrowApy: cgoBorrowApy,
    totalSuppliedUsd: cgoTvl,
  } = useMainnetAssetDetails("cgo");

  const tokenDetails: TokenDetailsDTO[] = [
    {
      symbol: "US",
      shortName: "USDC",
      fullName: "Stablecoin Reserve",
      icon: usdcIcon,
      tvl: usdcTvl,
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
      symbol: "XDC",
      shortName: "WXDC",
      fullName: "XDC Network Reserve",
      icon: xdcIcon,
      tvl: wxdcTvl,
      tokenInfo: [
        {
          label: "Supply APY",
          value: formatPercentage(parseFloat(wxdcSupplyApy)),
        },
        {
          label: "Borrow APY",
          value: formatPercentage(parseFloat(wxdcBorrowApy)),
        },
        {
          label: "Available Liquidity",
          value: formatCurrency(wxdcLiquidity),
        },
        {
          label: "Utilization",
          value: formatPercentage(wxdcUtilizationRate),
        },
      ],
    },
    {
      symbol: "CG",
      shortName: "CGO",
      fullName: "CGO Reserve",
      icon: getTokenLogo("CGO"),
      tvl: cgoTvl,
      tokenInfo: [
        {
          label: "Supply APY",
          value: formatPercentage(parseFloat(cgoSupplyApy)),
        },
        {
          label: "Borrow APY",
          value: formatPercentage(parseFloat(cgoBorrowApy)),
        },
        {
          label: "Available Liquidity",
          value: formatCurrency(cgoLiquidity),
        },
        {
          label: "Utilization",
          value: formatPercentage(cgoUtilizationRate),
        },
      ],
    },
  ];

  return (
    <ChakraProvider value={landingSystem}>
      <Box
        bg="#FFFFFF"
        minH="100vh"
        className="landing-page landing-page-light"
      >
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
              <Box
                as={"p"}
                fontSize={{ base: "12px", md: "13px" }}
                mb={{ base: "15px", md: "20px" }}
              >
                Decentralized Liquidity Protocol
              </Box>
              <Heading
                fontSize={{ base: "32px", md: "40px", lg: "48px" }}
                lineHeight={{ base: "40px", md: "48px", lg: "56px" }}
                mb={{ base: "15px", md: "20px" }}
              >
                Supply. Earn. Borrow. — Securely.
              </Heading>
              <Box
                as={"p"}
                mb={{ base: "15px", md: "20px" }}
                fontSize={{ base: "14px", md: "16px" }}
              >
                Creditify enables users to supply assets like USDC and XDC to
                earn yield, and borrow instantly against collateral with
                automated risk management. Non-custodial, audited, and governed
                by the community.
              </Box>
              <Flex
                alignItems={"center"}
                gap={{ base: "10px", md: "20px" }}
                mb={{ base: "30px", md: "40px" }}
                direction={{ base: "column", sm: "row" }}
                w={{ base: "100%", sm: "auto" }}
              >
                <Button
                  className="primary-btn"
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                  w={{ base: "100%", sm: "auto" }}
                >
                  Launch Creditify
                </Button>
                <Button
                  className="secondary-btn"
                  onClick={() =>
                    window.open("https://docs.xdc.network/", "_blank")
                  }
                  w={{ base: "100%", sm: "auto" }}
                >
                  How it works
                </Button>
              </Flex>
              <Flex
                alignItems={"stretch"}
                gap={{ base: "10px", md: "15px" }}
                direction={{ base: "column", sm: "row" }}
              >
                {tokenDetails.map((x, i) => {
                  return (
                    <Box
                      p={{ base: "12px", md: "10px" }}
                      className="box"
                      borderRadius={"14px"}
                      w={{ base: "100%", sm: "50%" }}
                      key={i}
                    >
                      <Flex gap="3" alignItems="center" mb={"10px"}>
                        <Flex
                          w={{ base: "40px", md: "44px" }}
                          h={{ base: "40px", md: "44px" }}
                          borderRadius="12px"
                          bg="rgba(255, 255, 255, 0.1)"
                          justifyContent="center"
                          alignItems="center"
                          overflow="hidden"
                          flexShrink={0}
                        >
                          <Image
                            src={x.icon}
                            alt={x.shortName}
                            w={{ base: "28px", md: "32px" }}
                            h={{ base: "28px", md: "32px" }}
                            objectFit="contain"
                          />
                        </Flex>
                        <Flex direction="column" minW={0}>
                          <Box
                            fontWeight={"700"}
                            fontSize={{ base: "14px", md: "16px" }}
                          >
                            {x.shortName}
                          </Box>
                          <Box
                            as={"p"}
                            fontSize={{ base: "11px", md: "13px" }}
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                          >
                            {x.fullName}
                          </Box>
                        </Flex>
                      </Flex>
                      <SimpleGrid columns={{ base: 1, sm: 2 }} gap="10px">
                        {x.tokenInfo.map((y, index) => {
                          return (
                            <Box
                              p={{ base: "8px", md: "10px" }}
                              borderRadius="10px"
                              className="box2"
                              key={index}
                            >
                              <Box fontSize={{ base: "11px", md: "13px" }}>
                                {y.label}
                              </Box>
                              <Box
                                fontWeight={"700"}
                                fontSize={{ base: "13px", md: "15px" }}
                              >
                                {y.value}
                              </Box>
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
            borderBottom={"1px solid #e2e8f0"}
          ></Box>
          {/* Your assets, your control */}
          <YourAssets />
          {/* Own your money */}
          <OwnMoney />
          {/* Security & Audits */}
          <GovernanceSecurity />
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
