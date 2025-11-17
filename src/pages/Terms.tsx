import { landingSystem } from "@/landingSystem";
import {
  Box,
  Button,
  ChakraProvider,
  Container,
  Flex,
  Heading,
  Icon,
} from "@chakra-ui/react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import LandingFooter from "./landing/LandingFooter";
import LandingHeader from "./landing/LandingHeader";

// 🔹 Dynamic sections array
const termsSections = [
  {
    id: 1,
    title: "1. Acceptance of Terms",
    content: (
      <Box as="p">
        By accessing and using Creditify (&quot;the Protocol&quot;), you accept
        and agree to be bound by these Terms of Service. If you do not agree to
        these terms, you should not use the Protocol.
      </Box>
    ),
  },
  {
    id: 2,
    title: "2. Description of Service",
    content: (
      <Box as="p">
        Creditify is a decentralized, non-custodial liquidity protocol built on
        the XDC Network. Users can supply digital assets to earn yield and
        borrow assets against their collateral. The Protocol operates through
        smart contracts deployed on the XDC blockchain.
      </Box>
    ),
  },
  {
    id: 3,
    title: "3. Eligibility",
    content: (
      <Box as="p">
        You must be at least 18 years old and have the legal capacity to enter
        into these Terms. By using the Protocol, you represent and warrant that
        you meet these eligibility requirements and comply with all applicable
        laws and regulations in your jurisdiction.
      </Box>
    ),
  },
  {
    id: 4,
    title: "4. Risks and Disclaimers",
    content: (
      <>
        <Box as="p" mb="15px">
          Using decentralized finance protocols involves significant risks,
          including but not limited to:
        </Box>
        <Box as="ul" pl="20px" mb="15px">
          <Box as="li" listStyle="disc" mb="8px">
            Smart contract vulnerabilities and potential exploits
          </Box>
          <Box as="li" listStyle="disc" mb="8px">
            Liquidation risk if collateral value falls below required thresholds
          </Box>
          <Box as="li" listStyle="disc" mb="8px">
            Token price volatility and market risks
          </Box>
          <Box as="li" listStyle="disc" mb="8px">
            Network congestion and transaction failures
          </Box>
          <Box as="li" listStyle="disc" mb="8px">
            Regulatory uncertainty and potential legal changes
          </Box>
          <Box as="li" listStyle="disc" mb="8px">
            Impermanent loss and opportunity costs
          </Box>
        </Box>
        <Box as="p">
          You acknowledge and accept these risks. The Protocol is provided
          &quot;as is&quot; without warranties of any kind.
        </Box>
      </>
    ),
  },
  {
    id: 5,
    title: "5. Non-Custodial Nature",
    content: (
      <Box as="p">
        Creditify is a non-custodial protocol. You retain full control and
        ownership of your digital assets at all times. The Protocol does not
        hold, custody, or control your assets. You are solely responsible for
        maintaining the security of your private keys and wallet credentials.
      </Box>
    ),
  },
  {
    id: 6,
    title: "6. User Responsibilities",
    content: (
      <>
        <Box as="p" mb="15px">
          As a user of the Protocol, you agree to:
        </Box>
        <Box as="ul" pl="20px">
          <Box as="li" listStyle="disc" mb="8px">
            Maintain the security of your wallet and private keys
          </Box>
          <Box as="li" listStyle="disc" mb="8px">
            Verify all transaction details before confirming
          </Box>
          <Box as="li" listStyle="disc" mb="8px">
            Monitor your positions and collateralization ratios
          </Box>
          <Box as="li" listStyle="disc" mb="8px">
            Comply with all applicable laws and regulations
          </Box>
          <Box as="li" listStyle="disc" mb="8px">
            Not use the Protocol for illegal activities or money laundering
          </Box>
          <Box as="li" listStyle="disc" mb="8px">
            Accept full responsibility for your trading decisions
          </Box>
        </Box>
      </>
    ),
  },
  {
    id: 7,
    title: "7. Fees and Costs",
    content: (
      <Box as="p">
        The Protocol may charge fees for certain operations. Additionally, you
        are responsible for all blockchain transaction fees (gas fees) required
        to interact with the Protocol. Fee structures may change based on
        governance decisions or protocol updates.
      </Box>
    ),
  },
  {
    id: 8,
    title: "8. Liquidations",
    content: (
      <Box as="p">
        If your collateral value falls below the required threshold, your
        position may be liquidated to maintain protocol solvency. Liquidations
        are automated and executed by third-party liquidators. You may incur
        liquidation penalties as specified in the Protocol documentation.
      </Box>
    ),
  },
  {
    id: 9,
    title: "9. Intellectual Property",
    content: (
      <Box as="p">
        The Protocol interface, documentation, and related materials are
        protected by intellectual property rights. The underlying smart
        contracts are open source and available for review. You may not copy,
        modify, or distribute the interface without permission.
      </Box>
    ),
  },
  {
    id: 10,
    title: "10. Limitation of Liability",
    content: (
      <Box as="p">
        To the maximum extent permitted by law, the Protocol developers,
        contributors, and affiliates shall not be liable for any direct,
        indirect, incidental, special, consequential, or punitive damages
        arising from your use of the Protocol, including but not limited to loss
        of funds, loss of profits, or loss of data.
      </Box>
    ),
  },
  {
    id: 11,
    title: "11. Indemnification",
    content: (
      <Box as="p">
        You agree to indemnify and hold harmless the Protocol, its developers,
        contributors, and affiliates from any claims, damages, losses,
        liabilities, and expenses arising from your use of the Protocol or
        violation of these Terms.
      </Box>
    ),
  },
  {
    id: 12,
    title: "12. Modifications to Terms",
    content: (
      <Box as="p">
        These Terms may be updated from time to time. Continued use of the
        Protocol after changes constitutes acceptance of the modified Terms. You
        are responsible for reviewing these Terms periodically.
      </Box>
    ),
  },
  {
    id: 13,
    title: "13. Governing Law and Dispute Resolution",
    content: (
      <Box as="p">
        These Terms shall be governed by and construed in accordance with
        applicable laws. Any disputes arising from these Terms or use of the
        Protocol shall be resolved through binding arbitration, except where
        prohibited by law.
      </Box>
    ),
  },
  {
    id: 14,
    title: "14. Severability",
    content: (
      <Box as="p">
        If any provision of these Terms is found to be invalid or unenforceable,
        the remaining provisions shall continue in full force and effect.
      </Box>
    ),
  },
  {
    id: 15,
    title: "15. Contact Information",
    content: (
      <Box as="p">
        For questions about these Terms, please contact us through our official
        communication channels or visit our documentation portal.
      </Box>
    ),
  },
];

const Terms = () => {
  const navigate = useNavigate();

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

          <Box maxW="986px" mx="auto">
            <Flex
              justifyContent={"space-between"}
              pt={"20px"}
              pb={"50px"}
              borderBottom={"1px solid #f1f1f0"}
              mb={"50px"}
            >
              <Box>
                <Heading
                  as="h1"
                  fontSize={{ base: "32px", md: "40px", lg: "48px" }}
                  mb={{ base: "10px", md: "20px" }}
                  fontWeight={700}
                >
                  Terms of Service
                </Heading>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  <Icon>
                    <IoMdArrowBack />
                  </Icon>
                  Back
                </Button>
              </Box>
              <Box as="p" fontSize={"20px"}>
                Updated 30 May 2025
              </Box>
            </Flex>

            <Box
              fontSize={{ base: "14px", md: "16px" }}
              lineHeight={1.8}
              letterSpacing="0.2px"
            >
              {termsSections.map((section) => (
                <Box key={section.id} mb={"40px"}>
                  <Heading
                    as="h2"
                    fontSize={{ base: "20px", md: "22px" }}
                    mb={"15px"}
                    fontWeight={600}
                  >
                    {section.title}
                  </Heading>
                  {section.content}
                </Box>
              ))}

              <Box
                as="p"
                mt="40px"
                p="20px"
                bg="rgba(0,0,0,0.05)"
                borderRadius="8px"
                fontWeight={500}
              >
                By using Creditify, you acknowledge that you have read,
                understood, and agree to be bound by these Terms of Service.
              </Box>
            </Box>
          </Box>

          <LandingFooter />
        </Container>
      </Box>
    </ChakraProvider>
  );
};

export default Terms;
