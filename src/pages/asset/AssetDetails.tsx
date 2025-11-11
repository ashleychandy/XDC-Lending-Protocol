import {
  formatCurrency,
  formatPercentage,
  useAssetDetails,
} from "@/hooks/useAssetDetails";
import { useChainConfig } from "@/hooks/useChainConfig";
import Header from "@/pages/Header";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Image,
  Spinner,
  Tabs,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FiExternalLink } from "react-icons/fi";
import { IoMdArrowBack } from "react-icons/io";
import { IoWalletOutline } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAccount } from "wagmi";
import AssetInfo from "./AssetInfo";
import AssetOverview from "./AssetOverview";

const AssetDetails = () => {
  const { network } = useChainConfig();
  const isTabLayout = useBreakpointValue({ base: true, xl: false });
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "xdc";
  const navigate = useNavigate();

  const {
    tokenInfo,
    reserveSize,
    availableLiquidity,
    utilizationRate,
    oraclePrice,
    isLoading,
  } = useAssetDetails(token);

  const { chain } = useAccount();

  const handleOpenExplorer = () => {
    if (!tokenInfo.address || !chain?.blockExplorers?.default?.url) return;
    const explorerUrl = `${chain.blockExplorers.default.url}/address/${tokenInfo.address}`;
    window.open(explorerUrl, "_blank");
  };

  const addToWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: tokenInfo.address,
              symbol: tokenInfo.symbol,
              decimals: tokenInfo.decimals,
              image: tokenInfo.icon,
            },
          },
        });
      } catch (error) {
        console.error("Error adding token to wallet:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <Container
          maxW="container.xl"
          px={{ base: 4, md: 6 }}
          py={4}
          h="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="xl" />
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container
        maxW={{
          base: "100%",
          lg: "container.lg",
          xl: "container.xl",
        }}
        px={{ base: 4, md: 6 }}
        py={4}
        h="100%"
      >
        <Box h="100%" p="30px 0">
          <Flex alignItems="center" gap="10px" mb="15px">
            <Button size="sm" onClick={() => navigate(-1)}>
              <Icon size="md">
                <IoMdArrowBack />
              </Icon>
              Go Back
            </Button>
            <Flex gap="2" alignItems="center">
              <Image
                src={network.icon}
                width="32px"
                height="32px"
                objectFit="contain"
                flexShrink={0}
              />
              <Heading size="lg">{network.name} Market</Heading>
            </Flex>
          </Flex>

          <Flex
            alignItems="center"
            gap={{ base: "15px", md: "32px" }}
            mb="40px"
            flexWrap="wrap"
          >
            <Flex gap="3" alignItems="center">
              <Image
                src={tokenInfo.icon}
                width="40px"
                height="40px"
                alt={tokenInfo.symbol}
              />
              <Flex direction="column">
                <Heading size="md">{tokenInfo.symbol}</Heading>
                <Flex gap="2" alignItems="center">
                  <Heading size="xl" fontWeight="700">
                    {tokenInfo.fullName}
                  </Heading>
                  <Button
                    width="24px"
                    height="24px"
                    minWidth="auto"
                    p="5px"
                    variant="surface"
                    borderRadius="50%"
                    onClick={handleOpenExplorer}
                    title="View on Explorer"
                  >
                    <Icon size="sm">
                      <FiExternalLink />
                    </Icon>
                  </Button>
                  <Button
                    width="24px"
                    height="24px"
                    minWidth="auto"
                    p="5px"
                    variant="surface"
                    borderRadius="50%"
                    onClick={addToWallet}
                    title="Add to Wallet"
                  >
                    <Icon size="sm">
                      <IoWalletOutline />
                    </Icon>
                  </Button>
                </Flex>
              </Flex>
            </Flex>

            <Box
              as="hr"
              borderWidth="1px"
              height="42px"
              display={{ base: "none", md: "block" }}
            />

            <Flex gap={{ base: "15px", md: "32px" }} flexWrap="wrap" flex="1">
              <Flex direction="column">
                <Box fontSize="sm">Reserve Size</Box>
                <Heading size="2xl">{formatCurrency(reserveSize)}</Heading>
              </Flex>

              <Flex direction="column">
                <Box fontSize="sm">Available liquidity</Box>
                <Heading size="2xl">
                  {formatCurrency(availableLiquidity)}
                </Heading>
              </Flex>

              <Flex direction="column">
                <Box fontSize="sm">Utilization Rate</Box>
                <Heading size="2xl">
                  {formatPercentage(utilizationRate)}
                </Heading>
              </Flex>

              <Flex direction="column">
                <Box fontSize="sm">Oracle price</Box>
                <Heading size="2xl">${oraclePrice.toFixed(2)}</Heading>
              </Flex>
            </Flex>
          </Flex>

          {isTabLayout ? (
            <Tabs.Root defaultValue="overview" variant="plain" w="100%">
              <Tabs.List bg="bg.inverted" w="50%" rounded="l3" p="1" mb="15px">
                <Tabs.Trigger value="overview" w="100%" justifyContent="center">
                  Overview
                </Tabs.Trigger>
                <Tabs.Trigger value="info" w="100%" justifyContent="center">
                  Your Info
                </Tabs.Trigger>
                <Tabs.Indicator rounded="l2" />
              </Tabs.List>

              <Tabs.Content value="overview">
                <AssetOverview token={token} />
              </Tabs.Content>

              <Tabs.Content value="info">
                <AssetInfo token={token} />
              </Tabs.Content>
            </Tabs.Root>
          ) : (
            <Flex gap="4" direction={{ base: "column", xl: "row" }}>
              <AssetOverview token={token} />
              <AssetInfo token={token} />
            </Flex>
          )}
        </Box>
      </Container>
    </>
  );
};

export default AssetDetails;
