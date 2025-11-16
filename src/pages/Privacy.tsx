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

const Privacy = () => {
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
              Privacy Policy
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
                1. Introduction
              </Heading>
              <Box as="p" mb="20px">
                This Privacy Policy explains how Creditify ("we," "us," or "the
                Protocol") handles information when you interact with our
                decentralized protocol. As a non-custodial DeFi protocol, we are
                committed to protecting your privacy and maintaining
                transparency about data practices.
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                2. Information We Collect
              </Heading>
              <Box as="p" mb="10px">
                <strong>Blockchain Data:</strong> When you interact with the
                Protocol, your transactions are recorded on the XDC blockchain.
                This includes:
              </Box>
              <Box as="ul" pl="20px" mb="20px">
                <Box as="li" mb="8px">
                  Wallet addresses
                </Box>
                <Box as="li" mb="8px">
                  Transaction hashes and timestamps
                </Box>
                <Box as="li" mb="8px">
                  Token amounts and types
                </Box>
                <Box as="li" mb="8px">
                  Smart contract interactions
                </Box>
              </Box>
              <Box as="p" mb="20px">
                This data is publicly available on the blockchain and cannot be
                deleted or modified.
              </Box>

              <Box as="p" mb="10px">
                <strong>Usage Data:</strong> We may collect anonymous usage data
                through our interface, including:
              </Box>
              <Box as="ul" pl="20px" mb="20px">
                <Box as="li" mb="8px">
                  Browser type and version
                </Box>
                <Box as="li" mb="8px">
                  Device information
                </Box>
                <Box as="li" mb="8px">
                  Pages visited and features used
                </Box>
                <Box as="li" mb="8px">
                  Time spent on the platform
                </Box>
                <Box as="li" mb="8px">
                  General location data (country/region)
                </Box>
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                3. How We Use Information
              </Heading>
              <Box as="p" mb="10px">
                We use collected information to:
              </Box>
              <Box as="ul" pl="20px" mb="20px">
                <Box as="li" mb="8px">
                  Provide and maintain the Protocol interface
                </Box>
                <Box as="li" mb="8px">
                  Improve user experience and functionality
                </Box>
                <Box as="li" mb="8px">
                  Analyze usage patterns and trends
                </Box>
                <Box as="li" mb="8px">
                  Detect and prevent fraud or security issues
                </Box>
                <Box as="li" mb="8px">
                  Comply with legal obligations
                </Box>
                <Box as="li" mb="8px">
                  Communicate important updates or changes
                </Box>
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                4. Data Sharing and Disclosure
              </Heading>
              <Box as="p" mb="20px">
                We do not sell, rent, or trade your personal information. We may
                share data in the following circumstances:
              </Box>
              <Box as="ul" pl="20px" mb="20px">
                <Box as="li" mb="8px">
                  <strong>Service Providers:</strong> Third-party services that
                  help us operate the platform (analytics, hosting, etc.)
                </Box>
                <Box as="li" mb="8px">
                  <strong>Legal Requirements:</strong> When required by law,
                  regulation, or legal process
                </Box>
                <Box as="li" mb="8px">
                  <strong>Security:</strong> To protect against fraud, security
                  threats, or illegal activity
                </Box>
                <Box as="li" mb="8px">
                  <strong>Business Transfers:</strong> In connection with
                  mergers, acquisitions, or asset sales
                </Box>
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                5. Cookies and Tracking Technologies
              </Heading>
              <Box as="p" mb="20px">
                We use cookies and similar tracking technologies to enhance your
                experience. These may include:
              </Box>
              <Box as="ul" pl="20px" mb="20px">
                <Box as="li" mb="8px">
                  <strong>Essential Cookies:</strong> Required for basic
                  platform functionality
                </Box>
                <Box as="li" mb="8px">
                  <strong>Analytics Cookies:</strong> Help us understand how
                  users interact with the platform
                </Box>
                <Box as="li" mb="8px">
                  <strong>Preference Cookies:</strong> Remember your settings
                  and preferences
                </Box>
              </Box>
              <Box as="p" mb="20px">
                You can control cookie preferences through your browser
                settings, though disabling certain cookies may affect platform
                functionality.
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                6. Third-Party Services
              </Heading>
              <Box as="p" mb="20px">
                The Protocol may integrate with third-party services such as:
              </Box>
              <Box as="ul" pl="20px" mb="20px">
                <Box as="li" mb="8px">
                  Wallet providers (MetaMask, XDC Pay, etc.)
                </Box>
                <Box as="li" mb="8px">
                  Blockchain explorers
                </Box>
                <Box as="li" mb="8px">
                  Analytics platforms
                </Box>
                <Box as="li" mb="8px">
                  Price feed providers
                </Box>
              </Box>
              <Box as="p" mb="20px">
                These services have their own privacy policies, and we are not
                responsible for their data practices.
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                7. Data Security
              </Heading>
              <Box as="p" mb="20px">
                We implement industry-standard security measures to protect your
                information, including:
              </Box>
              <Box as="ul" pl="20px" mb="20px">
                <Box as="li" mb="8px">
                  Encryption of data in transit and at rest
                </Box>
                <Box as="li" mb="8px">
                  Regular security audits and assessments
                </Box>
                <Box as="li" mb="8px">
                  Access controls and authentication
                </Box>
                <Box as="li" mb="8px">
                  Monitoring for suspicious activity
                </Box>
              </Box>
              <Box as="p" mb="20px">
                However, no method of transmission over the internet is 100%
                secure. You are responsible for maintaining the security of your
                wallet and private keys.
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                8. Data Retention
              </Heading>
              <Box as="p" mb="20px">
                We retain information only as long as necessary to fulfill the
                purposes outlined in this policy or as required by law.
                Blockchain data is permanent and cannot be deleted. Anonymous
                usage data may be retained indefinitely for analytics purposes.
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                9. Your Rights and Choices
              </Heading>
              <Box as="p" mb="10px">
                Depending on your jurisdiction, you may have the following
                rights:
              </Box>
              <Box as="ul" pl="20px" mb="20px">
                <Box as="li" mb="8px">
                  Access to your personal information
                </Box>
                <Box as="li" mb="8px">
                  Correction of inaccurate data
                </Box>
                <Box as="li" mb="8px">
                  Deletion of your data (where applicable)
                </Box>
                <Box as="li" mb="8px">
                  Objection to data processing
                </Box>
                <Box as="li" mb="8px">
                  Data portability
                </Box>
                <Box as="li" mb="8px">
                  Withdrawal of consent
                </Box>
              </Box>
              <Box as="p" mb="20px">
                Note that blockchain data cannot be modified or deleted due to
                its immutable nature.
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                10. International Data Transfers
              </Heading>
              <Box as="p" mb="20px">
                As a decentralized protocol, data may be processed and stored in
                various jurisdictions. By using the Protocol, you consent to the
                transfer of your information to countries that may have
                different data protection laws than your jurisdiction.
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                11. Children's Privacy
              </Heading>
              <Box as="p" mb="20px">
                The Protocol is not intended for users under 18 years of age. We
                do not knowingly collect information from children. If you
                believe we have collected information from a minor, please
                contact us immediately.
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                12. Changes to This Policy
              </Heading>
              <Box as="p" mb="20px">
                We may update this Privacy Policy from time to time. Changes
                will be posted on this page with an updated "Last Updated" date.
                Continued use of the Protocol after changes constitutes
                acceptance of the updated policy.
              </Box>

              <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                mb="15px"
                mt="30px"
                fontWeight={600}
              >
                13. Contact Us
              </Heading>
              <Box as="p" mb="20px">
                If you have questions about this Privacy Policy or our data
                practices, please contact us through our official communication
                channels or visit our documentation portal.
              </Box>

              <Box
                as="p"
                mt="40px"
                p="20px"
                bg="rgba(0,0,0,0.05)"
                borderRadius="8px"
                fontWeight={500}
              >
                By using Creditify, you acknowledge that you have read and
                understood this Privacy Policy and agree to the collection and
                use of information as described herein.
              </Box>
            </Box>
          </Box>

          <LandingFooter />
        </Container>
      </Box>
    </ChakraProvider>
  );
};

export default Privacy;
