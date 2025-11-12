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

  const netWorth =
    parseFloat(accountData.totalCollateral) - parseFloat(accountData.totalDebt);
  const healthFactorValue = parseFloat(accountData.healthFactor);
  const healthFactorColor = getHealthFactorColor(healthFactorValue);

  const totalSuppliedUsd =
    parseFloat(wxdcSupplied) * xdcPrice +
    parseFloat(usdcSupplied) * usdcPrice +
    parseFloat(cgoSupplied) * cgoPrice;
  const weightedSupplyApy =
    totalSuppliedUsd > 0
      ? (
          (parseFloat(wxdcSupplied) *
            xdcPrice *
            parseFloat(wxdcReserveData.supplyApy) +
            parseFloat(usdcSupplied) *
              usdcPrice *
              parseFloat(usdcReserveData.supplyApy) +
            parseFloat(cgoSupplied) *
              cgoPrice *
              parseFloat(cgoReserveData.supplyApy)) /
          totalSuppliedUsd
        ).toFixed(2)
      : "0.00";

  return (
    <>
      <Header />
      <Container
        maxW={{
          base: "100%",
          md: "container.md",
          lg: "container.lg",
          xl: "container.xl",
        }}
        px={{ base: 4, md: 6 }}
        py={4}
        h="100%"
      >
        <Box h="100%" p="30px 0">
          <Flex gap="2" alignItems="center" mb="15px">
            <Image
              src={network.icon}
              width="100px"
              height="100px"
              objectFit="contain"
              flexShrink={0}
            />
            <Heading size="4xl">
              {network.name.replace(/^XDC\s+/i, "")} Market
            </Heading>
          </Flex>

          <Flex gap="6" alignItems="center" mb="50px" flexWrap="wrap">
            <Flex direction="column">
              <Box>Net worth</Box>
              <Heading size="2xl">
                $
                {netWorth.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Heading>
            </Flex>
            <Flex direction="column">
              <Box>Net APY</Box>
              <Heading size="2xl">{weightedSupplyApy}%</Heading>
            </Flex>
            <Flex direction="column">
              <Box>Health factor</Box>
              <Heading size="2xl" color={healthFactorColor}>
                {healthFactorValue > 1000 ? "∞" : healthFactorValue.toFixed(2)}
              </Heading>
            </Flex>
          </Flex>

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
