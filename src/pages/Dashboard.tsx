import FormattedCounter from "@/components/ui/Counter/FormattedCounter";
import { getHealthFactorColor } from "@/helpers/getHealthFactorColor";
import { useAllReserves } from "@/hooks/useAllReserves";
import { useAllWalletBalances } from "@/hooks/useAllWalletBalances";
import { useAssetPrice } from "@/hooks/useAssetPrice";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useProtocolReserveData } from "@/hooks/useProtocolReserveData";
import { useProtocolUserReserveData } from "@/hooks/useProtocolUserReserveData";
import { useUserAccountData } from "@/hooks/useUserAccountData";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Skeleton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import BorrowContent from "./BorrowContent";
import ConnectYourWalletContent from "./ConnectYourWalletContent";
import Header from "./Header";
import SupplyContent from "./SupplyContent";

const Dashboard = () => {
  const { isConnected } = useAccount();
  const { tokens, network } = useChainConfig();
  const navigate = useNavigate();
  // Fetch all reserves and aTokens for mapping token addresses
  const { reserves, aTokens } = useAllReserves();

  // Fetch all wallet balances in a single call (reduces RPC calls)
  const { balances } = useAllWalletBalances();

  // Use Protocol Data Provider for reserve data (more efficient than Pool contract)
  const wxdcReserveData = useProtocolReserveData(tokens.wrappedNative.address);
  const usdcReserveData = useProtocolReserveData(tokens.usdc.address);
  const cgoReserveData = useProtocolReserveData(tokens.cgo.address);

  const { price: xdcPrice } = useAssetPrice(tokens.wrappedNative.address);
  const { price: usdcPrice } = useAssetPrice(tokens.usdc.address);
  const { price: cgoPrice } = useAssetPrice(tokens.cgo.address);

  // Use Protocol Data Provider for user reserve data (single call per asset)
  const wxdcUserData = useProtocolUserReserveData(tokens.wrappedNative.address);
  const usdcUserData = useProtocolUserReserveData(tokens.usdc.address);
  const cgoUserData = useProtocolUserReserveData(tokens.cgo.address);

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
      <Box pt={"60px"} pb={"94px"} bg={"#2b2d3c"}>
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
          <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Flex gap="6" alignItems="center" flexWrap="wrap">
              <Flex direction="column">
                <Box className="light-text-1">Net worth</Box>
                {accountData.isLoading ? (
                  <Skeleton height="40px" width="150px" />
                ) : (
                  <FormattedCounter
                    value={netWorth}
                    fontSize={32}
                    textColor="#fff"
                    prefix="$"
                    decimalPlaces={2}
                  />
                )}
              </Flex>
              <Flex direction="column">
                <Box className="light-text-1">Net APY</Box>
                {accountData.isLoading ||
                wxdcReserveData.isLoading ||
                usdcReserveData.isLoading ||
                cgoReserveData.isLoading ? (
                  <Skeleton height="40px" width="100px" />
                ) : (
                  <FormattedCounter
                    value={parseFloat(netApy)}
                    fontSize={32}
                    textColor={parseFloat(netApy) < 0 ? "#ef4444" : "#fff"}
                    suffix="%"
                    decimalPlaces={2}
                  />
                )}
              </Flex>
              <Flex direction="column">
                <Box className="light-text-1">Health factor</Box>
                {accountData.isLoading ? (
                  <Skeleton height="40px" width="80px" />
                ) : healthFactorValue > 1000 ? (
                  <Heading size="2xl" color={healthFactorColor}>
                    ∞
                  </Heading>
                ) : (
                  <FormattedCounter
                    value={healthFactorValue}
                    fontSize={32}
                    textColor={healthFactorColor}
                    decimalPlaces={2}
                  />
                )}
              </Flex>
            </Flex>
            <Button
              size={"xs"}
              variant={"plain"}
              p={"3px 5px"}
              minH={"auto"}
              fontSize={"11px"}
              h={"auto"}
              className="btn-color-dark-1-hover"
              onClick={() => navigate("/history")}
            >
              VIEW TRANSACTIONS
            </Button>
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
