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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import xdcMiniIcon from "../../assets/images/landing/xdc-mini-icon.png";
import usdcIcon from "../../assets/images/usdc.svg";
import Faq from "./Faq";
import GovernanceSecurity from "./GovernanceSecurity";
import HowCreditifyWorks from "./HowCreditifyWorks";
import InstantCapital from "./InstantCapital";
import LandingFooter from "./LandingFooter";
import LandingHeader from "./LandingHeader";
import MarketOverview from "./MarketOverview";
import MeetCreditify from "./MeetCreditify";
import OwnMoney from "./OwnMoney";
import type { TokenDetailsDTO } from "./types/type";
import WhyBuildOnXDC from "./WhyBuildOnXDC";
import NewsLetter from "./NewsLetter";

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
          label: "Liquidity",
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
      shortName: "XDC",
      fullName: "XDC Network Reserve",
      icon: xdcMiniIcon,
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
          label: "Liquidity",
          value: formatCurrency(wxdcLiquidity),
        },
        {
          label: "Utilization",
          value: formatPercentage(wxdcUtilizationRate),
        },
      ],
    },
    /* {
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
    }, */
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
            py={{ base: "40px", md: "60px", lg: "120px" }}
          >
            <Box w={"100%"} textAlign={"center"}>
              <Box
                as={"p"}
                className="section-label"
                fontSize={{ base: "12px", md: "13px" }}
                mb={{ base: "15px", md: "20px" }}
                fontWeight={500}
                letterSpacing={"1px"}
              >
                Decentralized Liquidity Protocol
              </Box>
              <Heading
                as="h1"
                fontSize={{ base: "32px", md: "40px", lg: "64px" }}
                lineHeight={{ base: "1.2", md: "1.15", lg: "1.1" }}
                mb={{ base: "15px", md: "20px" }}
                fontWeight={700}
                letterSpacing={{ base: "-0.5px", lg: "-1px" }}
              >
                Lend, Borrow & Earn with Near-Zero Fees.
              </Heading>
              <Box
                as={"p"}
                className="section-subtitle"
                mb={{ base: "15px", md: "40px" }}
                fontSize={{ base: "14px", md: "16px" }}
                maxW={{ base: "90%", md: "70%", lg: "50%" }}
                mx={"auto"}
                fontWeight={400}
                lineHeight={1.6}
                letterSpacing={"0.2px"}
              >
                The fastest, lowest-cost DeFi experience on XDC, earn real yield
                and unlock instant liquidity using USDC, XDC, or gold-backed
                CGO.
              </Box>
              <Flex
                alignItems={"center"}
                gap={"15px"}
                justifyContent={"center"}
                mb={{ base: "30px", md: "30px" }}
                flexWrap={"wrap"}
              >
                <Button
                  className="primary-btn"
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                >
                  Launch Creditify
                </Button>
                <Button
                  className="secondary-btn"
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                >
                  View Markets
                </Button>
                <Button
                  className="secondary-btn"
                  onClick={() => navigate(ROUTES.DOCUMENTATION)}
                >
                  Read Documentation
                </Button>
              </Flex>
              <Flex
                alignItems={"center"}
                gap={"15px"}
                justifyContent={"center"}
                flexWrap={"wrap"}
              >
                <Box
                  className="box"
                  p={{ base: "12px 18px", md: "14px 22px" }}
                  borderRadius={"12px"}
                >
                  <Flex alignItems={"center"} gap={"10px"}>
                    <Image
                      src={usdcIcon}
                      w={{ base: "18px", md: "20px" }}
                      h={{ base: "18px", md: "20px" }}
                    />
                    <Box textAlign={"left"}>
                      <Box
                        fontSize={{ base: "11px", md: "12px" }}
                        opacity={0.7}
                        mb={"2px"}
                      >
                        Supply APY
                      </Box>
                      <Box
                        fontSize={{ base: "16px", md: "18px" }}
                        fontWeight={700}
                        lineHeight={1}
                      >
                        {tokenDetails[0].tokenInfo[0].value}
                      </Box>
                    </Box>
                  </Flex>
                </Box>
                <Box
                  className="box"
                  p={{ base: "12px 18px", md: "14px 22px" }}
                  borderRadius={"12px"}
                >
                  <Flex alignItems={"center"} gap={"10px"}>
                    <Image
                      src={usdcIcon}
                      w={{ base: "18px", md: "20px" }}
                      h={{ base: "18px", md: "20px" }}
                    />
                    <Box textAlign={"left"}>
                      <Box
                        fontSize={{ base: "11px", md: "12px" }}
                        opacity={0.7}
                        mb={"2px"}
                      >
                        Borrow APY
                      </Box>
                      <Box
                        fontSize={{ base: "16px", md: "18px" }}
                        fontWeight={700}
                        lineHeight={1}
                      >
                        {tokenDetails[0].tokenInfo[1].value}
                      </Box>
                    </Box>
                  </Flex>
                </Box>
              </Flex>
              {/* <Flex
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
              </Flex> */}
            </Box>
          </Flex>
          <Box
            maxW={"1000px"}
            w={"100%"}
            mx={"auto"}
            mb={{ base: "60px", md: "60px", lg: "60px" }}
            borderBottom={"2px solid #00000024"}
          ></Box>
          {/* How Creditify works */}
          <Box id="how-creditify-works">
            <HowCreditifyWorks />
          </Box>
          {/* Market Overview section */}
          <Box id="market-overview">
            <MarketOverview tokenDetails={tokenDetails} />
          </Box>
          {/* MeetCreditify */}
          <MeetCreditify />
          {/* Own your money */}
          <OwnMoney />
          {/* WhyBuildOnXDC */}
          <WhyBuildOnXDC />
          <Box
            pt={{ base: "60px", md: "60px", lg: "100px" }}
            maxW={"1000px"}
            w={"100%"}
            mx={"auto"}
            mb={{ base: "60px", md: "80px", lg: "120px" }}
            borderBottom={"2px solid #00000024"}
          ></Box>
          {/* Security & Audits */}
          <GovernanceSecurity />
          <Box
            pt={{ base: "60px", md: "60px", lg: "140px" }}
            maxW={"1000px"}
            w={"100%"}
            mx={"auto"}
            mb={{ base: "60px", md: "80px", lg: "120px" }}
            borderBottom={"2px solid #00000024"}
          ></Box>
          {/* InstantCapital */}
          <InstantCapital />
          {/* Faq */}
          <Faq />
          {/* News Letter */}
          <NewsLetter />
          {/* Footer */}
          <LandingFooter />
        </Container>
      </Box>
    </ChakraProvider>
  );
};

export default LandingPage;
