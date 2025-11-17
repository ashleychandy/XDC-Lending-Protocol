import React, { useState } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Link,
  Text,
  Button,
  VStack,
  HStack,
  ChakraProvider,
  Icon,
} from "@chakra-ui/react";
import { IoMdArrowBack } from "react-icons/io";
import { landingSystem } from "@/landingSystem";
import LandingHeader from "./landing/LandingHeader";
import LandingFooter from "./landing/LandingFooter";
import { useNavigate } from "react-router-dom";

const Documentation = () => {
  const [activeSection, setActiveSection] = useState("getting-started");
  const navigate = useNavigate();
  const sections = [
    {
      id: "getting-started",
      title: "Getting Started",
      content: [
        {
          subtitle: "What is Creditify?",
          text: "Creditify is a decentralized, non-custodial liquidity protocol built on the XDC Network. It allows users to supply digital assets to earn interest and borrow assets against their collateral with algorithmic interest rates.",
        },
        {
          subtitle: "Key Features",
          list: [
            "Supply assets and earn yield automatically",
            "Borrow against your collateral instantly",
            "Near-zero transaction fees on XDC Network",
            "Non-custodial - you always control your assets",
            "Algorithmic interest rates based on supply and demand",
          ],
        },
        {
          subtitle: "Supported Assets",
          text: "Creditify currently supports USDC (stablecoin), XDC (native token), and CGO (gold-backed token). More assets may be added based on governance decisions.",
        },
      ],
    },
    {
      id: "supplying",
      title: "Supplying Assets",
      content: [
        {
          subtitle: "How to Supply",
          list: [
            "Connect your Web3 wallet (MetaMask, XDC Pay, etc.)",
            "Navigate to the Dashboard",
            "Select the asset you want to supply",
            "Enter the amount and click 'Supply'",
            "Confirm the transaction in your wallet",
            "Start earning yield immediately",
          ],
        },
        {
          subtitle: "Supply APY",
          text: "The Annual Percentage Yield (APY) you earn is determined algorithmically based on the utilization rate of each asset. Higher utilization means higher APY for suppliers.",
        },
        {
          subtitle: "Withdrawing",
          text: "You can withdraw your supplied assets at any time, as long as they're not being used as collateral for an active borrow position. There are no lock-up periods or withdrawal penalties.",
        },
      ],
    },
    {
      id: "borrowing",
      title: "Borrowing Assets",
      content: [
        {
          subtitle: "How to Borrow",
          list: [
            "Supply assets to the protocol first",
            "Enable your supplied assets as collateral",
            "Select the asset you want to borrow",
            "Enter the amount (within your borrowing capacity)",
            "Confirm the transaction",
            "Borrowed assets are sent to your wallet instantly",
          ],
        },
        {
          subtitle: "Collateralization Ratio",
          text: "Each asset has a specific Loan-to-Value (LTV) ratio. For example, if USDC has an LTV of 80%, you can borrow up to 80% of your supplied USDC value. Always maintain a safe collateralization ratio to avoid liquidation.",
        },
        {
          subtitle: "Borrow APY",
          text: "The interest rate you pay on borrowed assets is determined by the utilization rate. Higher demand for borrowing increases the borrow APY.",
        },
        {
          subtitle: "Repaying",
          text: "You can repay your borrowed assets at any time. Interest accrues continuously, so repaying earlier reduces your total interest cost. After full repayment, you can withdraw your collateral.",
        },
      ],
    },
    {
      id: "health-factor",
      title: "Health Factor & Liquidation",
      content: [
        {
          subtitle: "Understanding Health Factor",
          text: "Your Health Factor represents the safety of your borrowed position. It's calculated based on your collateral value versus your borrowed amount. A Health Factor above 1.0 means your position is safe.",
        },
        {
          subtitle: "Health Factor Calculation",
          text: "Health Factor = (Collateral Value × Liquidation Threshold) / Total Borrowed Value. For example, if you have $1,000 in collateral with an 85% liquidation threshold and $500 borrowed, your Health Factor is 1.7.",
        },
        {
          subtitle: "Liquidation Process",
          text: "If your Health Factor falls below 1.0, your position becomes eligible for liquidation. Liquidators can repay part of your debt and receive your collateral at a discount (liquidation bonus). This protects the protocol's solvency.",
        },
        {
          subtitle: "Avoiding Liquidation",
          list: [
            "Monitor your Health Factor regularly",
            "Maintain a Health Factor above 1.5 for safety",
            "Supply more collateral if your Health Factor drops",
            "Repay part of your debt to improve your Health Factor",
            "Be aware of market volatility affecting asset prices",
          ],
        },
      ],
    },
    {
      id: "interest-rates",
      title: "Interest Rate Model",
      content: [
        {
          subtitle: "Algorithmic Rates",
          text: "Creditify uses an algorithmic interest rate model that adjusts rates based on the utilization rate of each asset. This ensures optimal liquidity and fair rates for all participants.",
        },
        {
          subtitle: "Utilization Rate",
          text: "Utilization Rate = Total Borrowed / Total Supplied. When more of an asset is borrowed (higher utilization), both supply and borrow APYs increase to incentivize more supply and discourage excessive borrowing.",
        },
        {
          subtitle: "Rate Curve",
          text: "Interest rates follow a curve with two slopes. Below the optimal utilization rate, rates increase gradually. Above it, rates increase steeply to protect liquidity and encourage repayment.",
        },
      ],
    },
    {
      id: "wallets",
      title: "Wallet Setup",
      content: [
        {
          subtitle: "Supported Wallets",
          list: [
            "XDC Pay - Native XDC Network wallet",
            "MetaMask - Add XDC Network manually",
            "Any Web3 wallet compatible with EVM chains",
          ],
        },
        {
          subtitle: "Adding XDC Network to MetaMask",
          list: [
            "Open MetaMask and click on the network dropdown",
            "Select 'Add Network' or 'Custom RPC'",
            "Enter XDC Network details:",
            "Network Name: XDC Network",
            "RPC URL: https://rpc.xdc.network",
            "Chain ID: 50",
            "Currency Symbol: XDC",
            "Block Explorer: https://explorer.xdc.network",
            "Save and switch to XDC Network",
          ],
        },
      ],
    },
    {
      id: "security",
      title: "Security & Audits",
      content: [
        {
          subtitle: "Smart Contract Security",
          text: "Creditify's smart contracts undergo rigorous third-party audits, formal verification, and continuous security monitoring. All audit reports are publicly available for transparency.",
        },
        {
          subtitle: "Non-Custodial Protocol",
          text: "Creditify never holds custody of your assets. All funds are stored in audited smart contracts on the XDC blockchain. You maintain full control through your private keys.",
        },
        {
          subtitle: "Best Practices",
          list: [
            "Never share your private keys or seed phrase",
            "Use hardware wallets for large amounts",
            "Verify all transaction details before confirming",
            "Be cautious of phishing attempts",
            "Only use official Creditify interfaces",
            "Keep your wallet software updated",
          ],
        },
      ],
    },
    {
      id: "risks",
      title: "Risks & Disclaimers",
      content: [
        {
          subtitle: "Smart Contract Risk",
          text: "While audited, smart contracts may contain undiscovered vulnerabilities. Use the protocol at your own risk and never invest more than you can afford to lose.",
        },
        {
          subtitle: "Liquidation Risk",
          text: "If your collateral value drops or borrowed value increases, you may be liquidated. Always maintain a healthy collateralization ratio and monitor market conditions.",
        },
        {
          subtitle: "Market Risk",
          text: "Cryptocurrency prices are highly volatile. Sudden price movements can affect your position's health and lead to liquidation.",
        },
        {
          subtitle: "Regulatory Risk",
          text: "DeFi regulations are evolving. Changes in laws or regulations may affect the protocol's operation or your ability to use it.",
        },
      ],
    },
    {
      id: "faq",
      title: "Frequently Asked Questions",
      content: [
        {
          subtitle: "Can I lose my supplied assets?",
          text: "Your supplied assets are generally safe, but smart contract risks exist. The protocol is designed to remain solvent through liquidations, protecting suppliers.",
        },
        {
          subtitle: "What happens if I get liquidated?",
          text: "A portion of your collateral is sold to repay your debt, plus a liquidation penalty. The remaining collateral stays in your position. You can still withdraw it after liquidation.",
        },
        {
          subtitle: "Are there any fees?",
          text: "Creditify charges minimal protocol fees. You'll pay XDC Network gas fees for transactions, which are significantly lower than Ethereum.",
        },
        {
          subtitle: "Can I use Creditify from any country?",
          text: "Creditify is a decentralized protocol accessible globally. However, you're responsible for complying with your local laws and regulations.",
        },
        {
          subtitle: "How often do interest rates change?",
          text: "Interest rates update continuously based on supply and demand. Each transaction that affects utilization can change the rates.",
        },
      ],
    },
  ];

  return (
    <ChakraProvider value={landingSystem}>
      <Box
        bg="#FFFFFF"
        minH="100vh"
        className="landing-page landing-page-light documentation"
      >
        {/* Header */}
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
        >
          <LandingHeader />
          {/* Main Content */}
          <Flex gap={8} direction={{ base: "column", lg: "row" }} pt={"30px"}>
            {/* Sidebar */}
            <Box
              w={{ base: "100%", lg: "280px" }}
              flexShrink={0}
              position={{ base: "relative", lg: "sticky" }}
              top={{ lg: "88px" }}
              h={{ lg: "calc(100vh - 120px)" }}
              overflowY={{ lg: "auto" }}
              pb={{ base: 4, lg: 0 }}
            >
              <Box
                bg="white"
                borderRadius="12px"
                p={4}
                border="1px solid"
                borderColor="#E2E8F0"
              >
                <Text
                  fontSize="12px"
                  fontWeight="700"
                  color="#718096"
                  textTransform="uppercase"
                  mb={3}
                  letterSpacing="0.05em"
                >
                  Contents
                </Text>
                <VStack align="stretch" gap={1}>
                  {sections.map((section) => (
                    <Link
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveSection(section.id);
                        document
                          .getElementById(section.id)
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      px={3}
                      py={2}
                      borderRadius="8px"
                      fontSize="14px"
                      fontWeight="500"
                      color={activeSection === section.id ? "#fff" : "#4A5568"}
                      bg={activeSection === section.id ? "#000" : "transparent"}
                      _hover={{
                        bg: activeSection === section.id ? "#000" : "#7d7c7c",
                        textDecoration: "none",
                        color: "#ffffff",
                      }}
                      transition="all 0.2s"
                    >
                      {section.title}
                    </Link>
                  ))}
                </VStack>
              </Box>
            </Box>

            {/* Main Documentation */}
            <Box flex={1} minW={0}>
              <Box
                bg="white"
                borderRadius="12px"
                p={{ base: 6, md: 8, lg: 10 }}
                border="1px solid"
                borderColor="#E2E8F0"
              >
                <Heading
                  fontSize={{ base: "32px", md: "40px" }}
                  fontWeight="700"
                  color="#1A202C"
                  mb={3}
                >
                  Documentation
                </Heading>
                <Text fontSize="18px" color="#718096" mb={"20px"}>
                  Complete guide to using Creditify protocol
                </Text>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  mb={"30px"}
                >
                  <Icon>
                    <IoMdArrowBack />
                  </Icon>
                  Back
                </Button>
                {/* Documentation Sections */}
                <VStack align="stretch" gap={12}>
                  {sections.map((section) => (
                    <Box key={section.id} id={section.id}>
                      <Heading
                        fontSize={{ base: "24px", md: "28px" }}
                        fontWeight="700"
                        color="#1A202C"
                        mb={6}
                        pb={3}
                        borderBottom="2px solid"
                        borderColor="#E2E8F0"
                      >
                        {section.title}
                      </Heading>

                      <VStack align="stretch" gap={6}>
                        {section.content.map((item, idx) => (
                          <Box key={idx}>
                            {item.subtitle && (
                              <Heading
                                fontSize={{ base: "18px", md: "20px" }}
                                fontWeight="600"
                                color="#2D3748"
                                mb={3}
                              >
                                {item.subtitle}
                              </Heading>
                            )}
                            {item.text && (
                              <Text
                                fontSize="16px"
                                lineHeight="1.75"
                                color="#4A5568"
                                mb={3}
                              >
                                {item.text}
                              </Text>
                            )}
                            {item.list && (
                              <VStack align="stretch" gap={2} pl={4}>
                                {item.list.map((listItem, listIdx) => (
                                  <HStack key={listIdx} align="center" gap={3}>
                                    <Box
                                      w="6px"
                                      h="6px"
                                      bg="#000"
                                      borderRadius="full"
                                      flexShrink={0}
                                    />
                                    <Text
                                      fontSize="16px"
                                      lineHeight="1.75"
                                      color="#4A5568"
                                    >
                                      {listItem}
                                    </Text>
                                  </HStack>
                                ))}
                              </VStack>
                            )}
                          </Box>
                        ))}
                      </VStack>
                    </Box>
                  ))}
                </VStack>

                {/* Additional Resources */}
                <Box
                  mt={12}
                  p={6}
                  bg="#F7FAFC"
                  borderRadius="12px"
                  border="1px solid"
                  borderColor="#E2E8F0"
                >
                  <Heading
                    fontSize="20px"
                    fontWeight="600"
                    color="#1A202C"
                    mb={3}
                  >
                    Need More Help?
                  </Heading>
                  <Text
                    fontSize="16px"
                    lineHeight="1.75"
                    color="#4A5568"
                    mb={4}
                  >
                    If you have questions not covered in this documentation,
                    please reach out through our official channels:
                  </Text>
                  <VStack alignItems="flex-start" gap={2}>
                    <Link
                      href="https://xdc.network"
                      target="_blank"
                      fontSize="15px"
                      fontWeight="500"
                      _hover={{ textDecoration: "underline" }}
                    >
                      → XDC Network Official Website
                    </Link>
                    <Link
                      href="https://docs.xdc.network"
                      target="_blank"
                      fontSize="15px"
                      fontWeight="500"
                      _hover={{ textDecoration: "underline" }}
                    >
                      → XDC Network Documentation
                    </Link>
                  </VStack>
                </Box>
              </Box>
            </Box>
          </Flex>

          {/* Footer */}
          <LandingFooter />
        </Container>
      </Box>
    </ChakraProvider>
  );
};

export default Documentation;
