import { landingSystem } from "@/landingSystem";
import {
  Box,
  Button,
  ChakraProvider,
  Container,
  Flex,
  Heading,
  Icon,
  Link,
} from "@chakra-ui/react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import LandingFooter from "./landing/LandingFooter";
import LandingHeader from "./landing/LandingHeader";

const Documentation = () => {
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
        >
          <LandingHeader />

          <Box
            py={{ base: "40px", md: "60px", lg: "80px" }}
            maxW="1000px"
            mx="auto"
          >
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(-1)}
              mb="20px"
            >
              <Icon>
                <IoMdArrowBack />
              </Icon>
              Back
            </Button>

            <Heading
              as="h1"
              fontSize={{ base: "32px", md: "40px", lg: "48px" }}
              mb={{ base: "10px", md: "15px" }}
              fontWeight={700}
            >
              Documentation
            </Heading>

            <Box
              as="p"
              fontSize={{ base: "14px", md: "16px" }}
              mb={{ base: "30px", md: "40px" }}
              opacity={0.7}
            >
              Complete guide to using Creditify protocol
            </Box>

            {/* Table of Contents */}
            <Box
              mb={{ base: "30px", md: "40px" }}
              p={{ base: "20px", md: "24px" }}
              bg="rgba(0,0,0,0.03)"
              borderRadius="12px"
            >
              <Heading
                as="h3"
                fontSize={{ base: "18px", md: "20px" }}
                mb="15px"
                fontWeight={600}
              >
                Table of Contents
              </Heading>
              <Flex direction="column" gap="8px">
                {sections.map((section) => (
                  <Link
                    key={section.id}
                    href={`#${section.id}`}
                    fontSize={{ base: "14px", md: "15px" }}
                    color="#0066cc"
                    _hover={{ textDecoration: "underline" }}
                  >
                    {section.title}
                  </Link>
                ))}
              </Flex>
            </Box>

            {/* Documentation Sections */}
            {sections.map((section, index) => (
              <Box
                key={section.id}
                id={section.id}
                mb={{ base: "40px", md: "50px" }}
              >
                <Heading
                  as="h2"
                  fontSize={{ base: "24px", md: "28px", lg: "32px" }}
                  mb={{ base: "20px", md: "25px" }}
                  fontWeight={700}
                  pb="10px"
                  borderBottom="2px solid #eee"
                >
                  {section.title}
                </Heading>

                {section.content.map((item, idx) => (
                  <Box key={idx} mb="20px">
                    {item.subtitle && (
                      <Heading
                        as="h3"
                        fontSize={{ base: "18px", md: "20px" }}
                        mb="12px"
                        fontWeight={600}
                      >
                        {item.subtitle}
                      </Heading>
                    )}
                    {item.text && (
                      <Box
                        as="p"
                        fontSize={{ base: "14px", md: "16px" }}
                        lineHeight={1.8}
                        mb="12px"
                      >
                        {item.text}
                      </Box>
                    )}
                    {item.list && (
                      <Box as="ul" pl="20px" mb="12px">
                        {item.list.map((listItem, listIdx) => (
                          <Box
                            as="li"
                            key={listIdx}
                            fontSize={{ base: "14px", md: "16px" }}
                            lineHeight={1.8}
                            mb="8px"
                          >
                            {listItem}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            ))}

            {/* Additional Resources */}
            <Box
              mt={{ base: "40px", md: "60px" }}
              p={{ base: "20px", md: "30px" }}
              bg="rgba(0,0,0,0.03)"
              borderRadius="12px"
            >
              <Heading
                as="h3"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                fontWeight={600}
              >
                Need More Help?
              </Heading>
              <Box
                as="p"
                fontSize={{ base: "14px", md: "16px" }}
                lineHeight={1.8}
                mb="15px"
              >
                If you have questions not covered in this documentation, please
                reach out through our official channels:
              </Box>
              <Flex direction="column" gap="8px">
                <Link
                  href="https://xdc.network"
                  target="_blank"
                  fontSize={{ base: "14px", md: "15px" }}
                  color="#0066cc"
                  _hover={{ textDecoration: "underline" }}
                >
                  → XDC Network Official Website
                </Link>
                <Link
                  href="https://docs.xdc.network"
                  target="_blank"
                  fontSize={{ base: "14px", md: "15px" }}
                  color="#0066cc"
                  _hover={{ textDecoration: "underline" }}
                >
                  → XDC Network Documentation
                </Link>
              </Flex>
            </Box>
          </Box>

          <LandingFooter />
        </Container>
      </Box>
    </ChakraProvider>
  );
};

export default Documentation;
