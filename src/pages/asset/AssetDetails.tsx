import Footer from "@/components/Footer";
import FormattedCounter from "@/components/ui/Counter/FormattedCounter";
import { useAssetDetails } from "@/hooks/useAssetDetails";
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
          pt="80px"
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
    <Box display="flex" flexDirection="column" minH="100vh">
      <Header />
      <Box pt={"91px"} pb={"94px"} maxH={"290px"} bg={"#2b2d3c"}>
        <Container
          maxW={{
            base: "100%",
            lg: "container.lg",
            xl: "container.xl",
            "2xl": "container.2xl",
          }}
          px={{ base: "auto", "2xl": "0" }}
          h="100%"
        >
          <Flex alignItems="center" gap="10px" mb="15px">
            <Button
              variant={"plain"}
              className="btn-color-dark-1-hover"
              size="sm"
              onClick={() => navigate(-1)}
            >
              <Icon size="md">
                <IoMdArrowBack />
              </Icon>
              Go Back
            </Button>
            <Flex gap="2" alignItems="center">
              <Image
                src={network.icon}
                width="50px"
                height="20px"
                objectFit="contain"
                flexShrink={0}
              />
              <Heading size="lg" className="text-white-1">
                {network.name.replace(/^XDC\s+/i, "")} Market
              </Heading>
            </Flex>
          </Flex>

          <Flex
            alignItems="center"
            gap={{ base: "15px", md: "32px" }}
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
                <Heading size="md" className="light-text-2">
                  {tokenInfo.symbol}
                </Heading>
                <Flex gap="2" alignItems="center">
                  <Heading size="xl" fontWeight="700" className="text-white-1">
                    {tokenInfo.fullName}
                  </Heading>
                  <Button
                    width="24px"
                    height="24px"
                    minWidth="auto"
                    p="5px"
                    variant="plain"
                    className="btn-color-dark-1-hover"
                    borderRadius="50%"
                    onClick={handleOpenExplorer}
                    title="View on Explorer"
                  >
                    <Icon size="sm" className="icon-dark">
                      <FiExternalLink />
                    </Icon>
                  </Button>
                  <Button
                    width="24px"
                    height="24px"
                    minWidth="auto"
                    p="5px"
                    variant="plain"
                    className="btn-color-dark-1-hover"
                    borderRadius="50%"
                    onClick={addToWallet}
                    title="Add to Wallet"
                  >
                    <Icon size="sm" className="icon-dark">
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
              borderColor={"#62677b"}
              display={{ base: "none", md: "block" }}
            />

            <Flex gap={{ base: "15px", md: "32px" }} flexWrap="wrap" flex="1">
              <Flex direction="column">
                <Box fontSize="sm" className="light-text-1">
                  Reserve Size
                </Box>
                <FormattedCounter
                  value={reserveSize}
                  fontSize={21}
                  textColor="#fff"
                  prefix="$"
                  decimalPlaces={2}
                />
              </Flex>

              <Flex direction="column">
                <Box fontSize="sm" className="light-text-1">
                  Available liquidity
                </Box>
                <FormattedCounter
                  value={availableLiquidity}
                  fontSize={21}
                  textColor="#fff"
                  prefix="$"
                  decimalPlaces={2}
                />
              </Flex>

              <Flex direction="column">
                <Box fontSize="sm" className="light-text-1">
                  Utilization Rate
                </Box>
                <FormattedCounter
                  value={utilizationRate}
                  fontSize={21}
                  textColor="#fff"
                  suffix="%"
                  decimalPlaces={2}
                />
              </Flex>

              <Flex direction="column">
                <Box fontSize="sm" className="light-text-1">
                  Oracle price
                </Box>
                <FormattedCounter
                  value={oraclePrice}
                  fontSize={21}
                  textColor="#fff"
                  prefix="$"
                  decimalPlaces={oraclePrice < 10 ? 4 : 2}
                />
              </Flex>
            </Flex>
          </Flex>
        </Container>
      </Box>
      <Container
        maxW={{
          base: "100%",
          lg: "container.lg",
          xl: "container.xl",
          "2xl": "container.2xl",
        }}
        px={{ base: "auto", "2xl": "0" }}
        h="100%"
      >
        <Box mt={"-50px"}>
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
      <Box mt="auto">
        <Footer />
      </Box>
    </Box>
  );
};

export default AssetDetails;
