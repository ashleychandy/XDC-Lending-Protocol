import { Box, Container, Flex, Heading, Image } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import arbIcon from "../assets/images/arbitrum.svg";
import { TOKENS } from "@/chains/arbitrum/arbHelper";
import { useUserAccountData } from "@/hooks/useUserAccountData";
import { useReserveData } from "@/hooks/useReserveData";
import { useUserReserveData } from "@/hooks/useUserReserveData";
import { formatUnits } from "viem";
import { useAssetPrice } from "@/hooks/useAssetPrice";
import { getHealthFactorColor } from "@/helpers/getHealthFactorColor";
import SupplyContent from "./SupplyContent";
import BorrowContent from "./BorrowContent";
import ConnectYourWalletContent from "./ConnectYourWalletContent";

const Dashboard = () => {
  const { isConnected } = useAccount();

  const wethReserveData = useReserveData(TOKENS.weth.address);
  const usdcReserveData = useReserveData(TOKENS.usdc.address);

  const { price: ethPrice } = useAssetPrice(TOKENS.weth.address);
  const { price: usdcPrice } = useAssetPrice(TOKENS.usdc.address);

  const wethUserData = useUserReserveData(
    TOKENS.weth.address,
    wethReserveData.aTokenAddress
  );

  const usdcUserData = useUserReserveData(
    TOKENS.usdc.address,
    usdcReserveData.aTokenAddress
  );

  const accountData = useUserAccountData();

  const wethSupplied = formatUnits(
    wethUserData.suppliedAmount,
    TOKENS.weth.decimals
  );

  const usdcSupplied = formatUnits(
    usdcUserData.suppliedAmount,
    TOKENS.usdc.decimals
  );

  const netWorth =
    parseFloat(accountData.totalCollateral) - parseFloat(accountData.totalDebt);
  const healthFactorValue = parseFloat(accountData.healthFactor);
  const healthFactorColor = getHealthFactorColor(healthFactorValue);

  const totalSuppliedUsd =
    parseFloat(wethSupplied) * ethPrice + parseFloat(usdcSupplied) * usdcPrice;
  const weightedSupplyApy =
    totalSuppliedUsd > 0
      ? (
          (parseFloat(wethSupplied) *
            ethPrice *
            parseFloat(wethReserveData.supplyApy) +
            parseFloat(usdcSupplied) *
              usdcPrice *
              parseFloat(usdcReserveData.supplyApy)) /
          totalSuppliedUsd
        ).toFixed(2)
      : "0.00";

  return (
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
          <Image src={arbIcon} width="32px" height="32px" />
          <Heading size="3xl">Arbitrum Sepolia Market</Heading>
        </Flex>

        <Flex gap="6" alignItems="center" mb="50px" flexWrap="wrap">
          <Flex direction="column">
            <Box>Net worth</Box>
            <Heading size="2xl">${netWorth.toFixed(2)}</Heading>
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
          <Flex direction="column">
            <Box>Available Rewards</Box>
            <Heading size="2xl">$0</Heading>
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
  );
};

export default Dashboard;
