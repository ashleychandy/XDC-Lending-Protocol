import { getHealthFactorColor } from "@/helpers/getHealthFactorColor";
import { useAssetPrice } from "@/hooks/useAssetPrice";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useReserveData } from "@/hooks/useReserveData";
import { useUserAccountData } from "@/hooks/useUserAccountData";
import { useUserReserveData } from "@/hooks/useUserReserveData";
import { Box, Container, Flex, Heading, Image } from "@chakra-ui/react";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import BorrowContent from "./BorrowContent";
import ConnectYourWalletContent from "./ConnectYourWalletContent";
import Header from "./Header";
import SupplyContent from "./SupplyContent";

const Dashboard = () => {
  const { isConnected } = useAccount();
  const { tokens, network } = useChainConfig();

  const wxdcReserveData = useReserveData(tokens.wrappedNative.address);
  const usdcReserveData = useReserveData(tokens.usdc.address);
  const cgoReserveData = useReserveData(tokens.cgo.address);

  const { price: xdcPrice } = useAssetPrice(tokens.wrappedNative.address);
  const { price: usdcPrice } = useAssetPrice(tokens.usdc.address);
  const { price: cgoPrice } = useAssetPrice(tokens.cgo.address);

  const wxdcUserData = useUserReserveData(
    tokens.wrappedNative.address,
    wxdcReserveData.aTokenAddress
  );

  const usdcUserData = useUserReserveData(
    tokens.usdc.address,
    usdcReserveData.aTokenAddress
  );

  const cgoUserData = useUserReserveData(
    tokens.cgo.address,
    cgoReserveData.aTokenAddress
  );

  const accountData = useUserAccountData();

  const wxdcSupplied = formatUnits(
    (wxdcUserData.suppliedAmount || 0n) as bigint,
    tokens.wrappedNative.decimals
  );

  const usdcSupplied = formatUnits(
    (usdcUserData.suppliedAmount || 0n) as bigint,
    tokens.usdc.decimals
  );

  const cgoSupplied = formatUnits(
    (cgoUserData.suppliedAmount || 0n) as bigint,
    tokens.cgo.decimals
  );

  const wxdcBorrowed = formatUnits(
    (wxdcUserData.borrowedAmount || 0n) as bigint,
    tokens.wrappedNative.decimals
  );

  const usdcBorrowed = formatUnits(
    (usdcUserData.borrowedAmount || 0n) as bigint,
    tokens.usdc.decimals
  );

  const cgoBorrowed = formatUnits(
    (cgoUserData.borrowedAmount || 0n) as bigint,
    tokens.cgo.decimals
  );

  const netWorth =
    parseFloat(accountData.totalCollateral) - parseFloat(accountData.totalDebt);
  const healthFactorValue = parseFloat(accountData.healthFactor);
  const healthFactorColor = getHealthFactorColor(healthFactorValue);

  // Calculate total supplied and borrowed in USD
  const totalSuppliedUsd =
    parseFloat(wxdcSupplied) * xdcPrice +
    parseFloat(usdcSupplied) * usdcPrice +
    parseFloat(cgoSupplied) * cgoPrice;

  const totalBorrowedUsd =
    parseFloat(wxdcBorrowed) * xdcPrice +
    parseFloat(usdcBorrowed) * usdcPrice +
    parseFloat(cgoBorrowed) * cgoPrice;

  // Calculate weighted supply APY
  const weightedSupplyApy =
    totalSuppliedUsd > 0
      ? (parseFloat(wxdcSupplied) *
          xdcPrice *
          parseFloat(wxdcReserveData.supplyApy) +
          parseFloat(usdcSupplied) *
            usdcPrice *
            parseFloat(usdcReserveData.supplyApy) +
          parseFloat(cgoSupplied) *
            cgoPrice *
            parseFloat(cgoReserveData.supplyApy)) /
        totalSuppliedUsd
      : 0;

  // Calculate weighted borrow APY
  const weightedBorrowApy =
    totalBorrowedUsd > 0
      ? (parseFloat(wxdcBorrowed) *
          xdcPrice *
          parseFloat(wxdcReserveData.borrowApy) +
          parseFloat(usdcBorrowed) *
            usdcPrice *
            parseFloat(usdcReserveData.borrowApy) +
          parseFloat(cgoBorrowed) *
            cgoPrice *
            parseFloat(cgoReserveData.borrowApy)) /
        totalBorrowedUsd
      : 0;

  // Calculate net APY: (Supply APY × Supply Amount) - (Borrow APY × Borrow Amount) / Total Position
  const totalPositionUsd = totalSuppliedUsd + totalBorrowedUsd;
  const netApy =
    totalPositionUsd > 0
      ? (
          (weightedSupplyApy * totalSuppliedUsd -
            weightedBorrowApy * totalBorrowedUsd) /
          totalPositionUsd
        ).toFixed(2)
      : "0.00";

  return (
    <>
      <Header />
      <Box pt={"0"} pb={"94px"} bg={"#2b2d3c"} mt={"-80px"} paddingTop={"80px"}>
        <Container
          maxW={{
            md: "container.md",
            lg: "container.lg",
            xl: "container.xl",
          }}
          h="100%"
        >
          <Flex gap="2" alignItems="center" mb="15px">
            <Image
              src={network.icon}
              width="100px"
              height="50px"
              objectFit="contain"
              flexShrink={0}
            />
            <Heading size="4xl" className="text-white-1">
              {network.name.replace(/^XDC\s+/i, "")} Market
            </Heading>
          </Flex>

          <Flex gap="6" alignItems="center" flexWrap="wrap">
            <Flex direction="column">
              <Box className="light-text-1">Net worth</Box>
              <Heading size="2xl" className="text-white-2">
                <Box as={"span"} className="light-text-1" mr={"2px"}>
                  $
                </Box>
                {netWorth.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Heading>
            </Flex>
            <Flex direction="column">
              <Box className="light-text-1">Net APY</Box>
              <Heading
                size="2xl"
                className="text-white-2"
                color={parseFloat(netApy) < 0 ? "red.500" : "text-white-2"}
              >
                {netApy}
                <Box as={"span"} className="light-text-1" ml={"2px"}>
                  %
                </Box>
              </Heading>
            </Flex>
            <Flex direction="column">
              <Box className="light-text-1">Health factor</Box>
              <Heading size="2xl" color={healthFactorColor}>
                {healthFactorValue > 1000 ? "∞" : healthFactorValue.toFixed(2)}
              </Heading>
            </Flex>
          </Flex>
        </Container>
      </Box>
      <Container
        maxW={{
          md: "container.md",
          lg: "container.lg",
          xl: "container.xl",
        }}
        h="100%"
      >
        <Box mt={"-50px"}>
          {isConnected ? (
            <Flex gap="4" direction={{ base: "column", lg: "row" }}>
              {/* LEFT CONTENT - SUPPLY */}
              <SupplyContent />
              {/* RIGHT CONTENT - BORROW */}
              <BorrowContent />
            </Flex>
          ) : (
            <ConnectYourWalletContent />
          )}
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;
