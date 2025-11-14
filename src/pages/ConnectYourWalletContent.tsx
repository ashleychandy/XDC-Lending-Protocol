import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FiDollarSign, FiLock, FiTrendingUp } from "react-icons/fi";

const ConnectYourWalletContent = () => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      p={{ base: "30px", md: "50px" }}
      minH="60vh"
      bg="#fff"
      boxShadow={
        "rgba(0, 0, 0, 0.05) 0px 2px 1px, rgba(0, 0, 0, 0.25) 0px 0px 1px"
      }
      borderRadius="5px"
    >
      {/* Main Heading */}
      <Heading
        size="xl"
        mb="15px"
        textAlign="center"
        color="#1a202c"
        fontWeight="600"
      >
        Connect Your Wallet
      </Heading>

      {/* Description */}
      <Text
        mb="35px"
        textAlign="center"
        color="#718096"
        fontSize="md"
        maxW="500px"
        lineHeight="1.6"
      >
        Connect your wallet to access your dashboard and start supplying,
        borrowing, and managing your positions on the XDC Network.
      </Text>

      {/* Features Grid */}
      <Flex
        gap="20px"
        mb="35px"
        flexWrap="wrap"
        justifyContent="center"
        maxW="600px"
      >
        <VStack
          flex="1"
          minW="150px"
          p="15px"
          bg="#f7fafc"
          borderRadius="8px"
          alignItems="center"
        >
          <Box as={FiDollarSign} fontSize="24px" color="#3182ce" mb="8px" />
          <Text fontSize="sm" fontWeight="600" color="#2d3748">
            Supply Assets
          </Text>
          <Text fontSize="xs" color="#718096" textAlign="center">
            Earn interest on your deposits
          </Text>
        </VStack>

        <VStack
          flex="1"
          minW="150px"
          p="15px"
          bg="#f7fafc"
          borderRadius="8px"
          alignItems="center"
        >
          <Box as={FiTrendingUp} fontSize="24px" color="#38a169" mb="8px" />
          <Text fontSize="sm" fontWeight="600" color="#2d3748">
            Borrow Funds
          </Text>
          <Text fontSize="xs" color="#718096" textAlign="center">
            Access liquidity instantly
          </Text>
        </VStack>

        <VStack
          flex="1"
          minW="150px"
          p="15px"
          bg="#f7fafc"
          borderRadius="8px"
          alignItems="center"
        >
          <Box as={FiLock} fontSize="24px" color="#805ad5" mb="8px" />
          <Text fontSize="sm" fontWeight="600" color="#2d3748">
            Secure & Safe
          </Text>
          <Text fontSize="xs" color="#718096" textAlign="center">
            Non-custodial protocol
          </Text>
        </VStack>
      </Flex>

      {/* Connect Button */}
      <ConnectButton
        label="Connect Wallet"
        chainStatus="icon"
        showBalance={false}
        accountStatus="address"
      />

      {/* Helper Text */}
      <Text fontSize="xs" color="#a0aec0" mt="20px" textAlign="center">
        By connecting, you agree to our Terms of Service
      </Text>
    </Flex>
  );
};

export default ConnectYourWalletContent;
