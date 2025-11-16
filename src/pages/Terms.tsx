import { landingSystem } from "@/landingSystem";
import {
  Box,
  Button,
  ChakraProvider,
  Container,
  Heading,
  Icon,
} from "@chakra-ui/react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import LandingFooter from "./landing/LandingFooter";
import LandingHeader from "./landing/LandingHeader";

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

          <Box
            py={{ base: "40px", md: "60px", lg: "80px" }}
            maxW="900px"
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
              mb={{ base: "20px", md: "30px" }}
              fontWeight={700}
            >
              Terms of Service
            </Heading>

            <Box
              fontSize={{ base: "14px", md: "16px" }}
              lineHeight={1.8}
              letterSpacing="0.2px"
            >
              <Box as="p" mb="20px" opacity={0.7}>
                Last Updated: November 16, 2025
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                1. Acceptance of Terms
              </Heading>
              <Box as="p" mb="20px">
                By accessing and using Creditify ("the Protocol"), you accept
                and agree to be bound by these Terms of Service. If you do not
                agree to these terms, you should not use the Protocol.
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                2. Description of Service
              </Heading>
              <Box as="p" mb="20px">
                Creditify is a decentralized, non-custodial liquidity protocol
                built on the XDC Network. Users can supply digital assets to
                earn yield and borrow assets against their collateral. The
                Protocol operates through smart contracts deployed on the XDC
                blockchain.
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                3. Eligibility
              </Heading>
              <Box as="p" mb="20px">
                You must be at least 18 years old and have the legal capacity to
                enter into these Terms. By using the Protocol, you represent and
                warrant that you meet these eligibility requirements and comply
                with all applicable laws and regulations in your jurisdiction.
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                4. Risks and Disclaimers
              </Heading>
              <Box as="p" mb="10px">
                Using decentralized finance protocols involves significant
                risks, including but not limited to:
              </Box>
              <Box as="ul" pl="20px" mb="20px">
                <Box as="li" mb="8px">
                  Smart contract vulnerabilities and potential exploits
                </Box>
                <Box as="li" mb="8px">
                  Liquidation risk if collateral value falls below required
                  thresholds
                </Box>
                <Box as="li" mb="8px">
                  Token price volatility and market risks
                </Box>
                <Box as="li" mb="8px">
                  Network congestion and transaction failures
                </Box>
                <Box as="li" mb="8px">
                  Regulatory uncertainty and potential legal changes
                </Box>
                <Box as="li" mb="8px">
                  Impermanent loss and opportunity costs
                </Box>
              </Box>
              <Box as="p" mb="20px">
                You acknowledge and accept these risks. The Protocol is provided
                "as is" without warranties of any kind.
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                5. Non-Custodial Nature
              </Heading>
              <Box as="p" mb="20px">
                Creditify is a non-custodial protocol. You retain full control
                and ownership of your digital assets at all times. The Protocol
                does not hold, custody, or control your assets. You are solely
                responsible for maintaining the security of your private keys
                and wallet credentials.
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                6. User Responsibilities
              </Heading>
              <Box as="p" mb="10px">
                As a user of the Protocol, you agree to:
              </Box>
              <Box as="ul" pl="20px" mb="20px">
                <Box as="li" mb="8px">
                  Maintain the security of your wallet and private keys
                </Box>
                <Box as="li" mb="8px">
                  Verify all transaction details before confirming
                </Box>
                <Box as="li" mb="8px">
                  Monitor your positions and collateralization ratios
                </Box>
                <Box as="li" mb="8px">
                  Comply with all applicable laws and regulations
                </Box>
                <Box as="li" mb="8px">
                  Not use the Protocol for illegal activities or money
                  laundering
                </Box>
                <Box as="li" mb="8px">
                  Accept full responsibility for your trading decisions
                </Box>
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                7. Fees and Costs
              </Heading>
              <Box as="p" mb="20px">
                The Protocol may charge fees for certain operations.
                Additionally, you are responsible for all blockchain transaction
                fees (gas fees) required to interact with the Protocol. Fee
                structures may change based on governance decisions or protocol
                updates.
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                8. Liquidations
              </Heading>
              <Box as="p" mb="20px">
                If your collateral value falls below the required threshold,
                your position may be liquidated to maintain protocol solvency.
                Liquidations are automated and executed by third-party
                liquidators. You may incur liquidation penalties as specified in
                the Protocol documentation.
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                9. Intellectual Property
              </Heading>
              <Box as="p" mb="20px">
                The Protocol interface, documentation, and related materials are
                protected by intellectual property rights. The underlying smart
                contracts are open source and available for review. You may not
                copy, modify, or distribute the interface without permission.
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                10. Limitation of Liability
              </Heading>
              <Box as="p" mb="20px">
                To the maximum extent permitted by law, the Protocol developers,
                contributors, and affiliates shall not be liable for any direct,
                indirect, incidental, special, consequential, or punitive
                damages arising from your use of the Protocol, including but not
                limited to loss of funds, loss of profits, or loss of data.
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                11. Indemnification
              </Heading>
              <Box as="p" mb="20px">
                You agree to indemnify and hold harmless the Protocol, its
                developers, contributors, and affiliates from any claims,
                damages, losses, liabilities, and expenses arising from your use
                of the Protocol or violation of these Terms.
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                12. Modifications to Terms
              </Heading>
              <Box as="p" mb="20px">
                These Terms may be updated from time to time. Continued use of
                the Protocol after changes constitutes acceptance of the
                modified Terms. You are responsible for reviewing these Terms
                periodically.
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                13. Governing Law and Dispute Resolution
              </Heading>
              <Box as="p" mb="20px">
                These Terms shall be governed by and construed in accordance
                with applicable laws. Any disputes arising from these Terms or
                use of the Protocol shall be resolved through binding
                arbitration, except where prohibited by law.
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                14. Severability
              </Heading>
              <Box as="p" mb="20px">
                If any provision of these Terms is found to be invalid or
                unenforceable, the remaining provisions shall continue in full
                force and effect.
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                15. Contact Information
              </Heading>
              <Box as="p" mb="20px">
                For questions about these Terms, please contact us through our
                official communication channels or visit our documentation
                portal.
              </Box>

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
