import React from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Image,
  Tabs,
  useBreakpointValue,
} from "@chakra-ui/react";
import arbIcon from "../../assets/images/arbitrum.svg";
import wethIcon from "../../assets/images/weth.svg";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { FiExternalLink } from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";
import AssetInfo from "./AssetInfo";
import AssetOverview from "./AssetOverview";

const AssetDetails = () => {
  const isTabLayout = useBreakpointValue({ base: true, xl: false });
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();
  return (
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
          <Button size="sm" onClick={() => navigate("/dashboard")}>
            <Icon size="md">
              <IoMdArrowBack />
            </Icon>
            Go Back
          </Button>
          <Flex gap="2" alignItems="center">
            <Image src={arbIcon} width="20px" height="20px" />
            <Heading size="lg">Arbitrum Sepolia Market</Heading>
          </Flex>
        </Flex>
        <Flex alignItems="center" gap="32px" mb="40px">
          <Flex gap="3" alignItems="center">
            <Image src={wethIcon} width="40px" height="40px" />
            <Flex direction="column">
              <Heading size="md">WETH</Heading>
              <Flex gap="2" alignItems="center">
                <Heading size="xl" fontWeight="700">
                  Wrapped ETH
                </Heading>
                <Button
                  width="24px"
                  height="24px"
                  minWidth="auto"
                  p="5px"
                  variant="surface"
                  borderRadius="50%"
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
                >
                  <Icon size="sm">
                    <IoWalletOutline />
                  </Icon>
                </Button>
              </Flex>
            </Flex>
          </Flex>
          <Box as="hr" borderWidth="1px" height="42px" />
          <Flex direction="column">
            <Box>Reserve Size</Box>
            <Heading size="2xl">$ 8.53M</Heading>
          </Flex>
          <Flex direction="column">
            <Box>Available liquidity</Box>
            <Heading size="2xl">$ 10,449.67</Heading>
          </Flex>
          <Flex direction="column">
            <Box>Utilization Rate</Box>
            <Heading size="2xl">99.88 %</Heading>
          </Flex>
          <Flex direction="column">
            <Box>Oracle price</Box>
            <Heading size="2xl">$ 3,346.25</Heading>
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
              <AssetOverview token={token!} />
            </Tabs.Content>

            <Tabs.Content value="info">
              <AssetInfo token={token!} />
            </Tabs.Content>
          </Tabs.Root>
        ) : (
          <Flex gap="4" direction={{ base: "column", xl: "row" }}>
            <AssetOverview token={token!} />
            <AssetInfo token={token!} />
          </Flex>
        )}
      </Box>
    </Container>
  );
};

export default AssetDetails;
