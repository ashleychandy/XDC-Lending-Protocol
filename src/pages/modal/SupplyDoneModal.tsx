import {
  Box,
  Button,
  Dialog,
  Flex,
  Heading,
  HStack,
  Icon,
  Portal,
  Text,
} from "@chakra-ui/react";
import { FaCheck, FaWallet } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { useAccount } from "wagmi";
import { useChainConfig } from "../../hooks/useChainConfig";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  tokenSymbol: string;
  txHash?: `0x${string}`;
}

const SupplyDoneModal: React.FC<Props> = ({
  isOpen,
  onClose,
  amount,
  tokenSymbol,
  txHash,
}) => {
  const { chain } = useAccount();
  const { tokens } = useChainConfig();

  const handleOpenExplorer = () => {
    if (!txHash || !chain?.blockExplorers?.default?.url) return;
    const explorerUrl = `${chain.blockExplorers.default.url}/tx/${txHash}`;
    window.open(explorerUrl, "_blank");
  };

  const handleAddToWallet = async () => {
    console.log("Add to wallet clicked");

    if (!window.ethereum) {
      console.error("MetaMask not detected");
      return;
    }

    // Map token symbol to aToken address and custom symbol
    const aTokenConfig: Record<
      string,
      { address: string; symbol: string; decimals: number }
    > = {
      wxdc: {
        address: tokens.wrappedNative.aToken,
        symbol: "cWXDC",
        decimals: tokens.wrappedNative.decimals,
      },
      xdc: {
        address: tokens.wrappedNative.aToken,
        symbol: "cWXDC",
        decimals: tokens.wrappedNative.decimals,
      },
      usdc: {
        address: tokens.usdc.aToken,
        symbol: "cUSDC",
        decimals: tokens.usdc.decimals,
      },
      cgo: {
        address: tokens.cgo.aToken,
        symbol: "cCGO",
        decimals: tokens.cgo.decimals,
      },
    };

    const normalizedSymbol = tokenSymbol.toLowerCase();
    const aToken = aTokenConfig[normalizedSymbol];

    console.log("Token symbol:", tokenSymbol);
    console.log("Normalized symbol:", normalizedSymbol);
    console.log("aToken config:", aToken);

    if (
      !aToken ||
      aToken.address === "0x0000000000000000000000000000000000000000"
    ) {
      console.error("aToken address not configured for", tokenSymbol);
      return;
    }

    try {
      // Specify custom symbol for consistency and to ensure it works with MetaMask
      const result = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: aToken.address,
            symbol: aToken.symbol,
            decimals: aToken.decimals,
          },
        },
      });
      console.log("Add token result:", result);
    } catch (error) {
      console.error("Failed to add token to wallet:", error);
    }
  };

  return (
    <HStack wrap="wrap" gap="4">
      <Dialog.Root
        open={isOpen}
        onOpenChange={(e) => {
          if (!e.open) onClose();
        }}
        placement="center"
        motionPreset="slide-in-bottom"
        size="xs"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header justifyContent="space-between">
                <Box></Box>
                <Dialog.CloseTrigger asChild pos="static">
                  <Icon size="xl" cursor="pointer">
                    <IoMdClose />
                  </Icon>
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body textAlign="center" pb="0">
                <Box mb="20px">
                  <Flex
                    w="48px"
                    h="48px"
                    m="0 auto 15px"
                    justifyContent="center"
                    alignItems="center"
                    bg="#ecf8ed"
                    borderRadius="50%"
                  >
                    <Icon size="lg" color="green.600">
                      <FaCheck />
                    </Icon>
                  </Flex>
                  <Heading size="xl" mb="7px">
                    All done
                  </Heading>
                  <Box mb="10px">
                    You Supplied {amount || "0.00"} {tokenSymbol?.toUpperCase()}
                  </Box>
                  <Text fontSize="sm" color="gray.500">
                    Add cToken to wallet to track your balance.
                  </Text>
                </Box>
              </Dialog.Body>
              <Dialog.Footer flexDirection="column" gap="8px">
                <Button
                  variant="outline"
                  w="100%"
                  fontSize="16px"
                  onClick={handleAddToWallet}
                >
                  <Icon size="md" mr="2">
                    <FaWallet />
                  </Icon>
                  Add to wallet
                </Button>
                <Button
                  variant="subtle"
                  w="100%"
                  fontSize="16px"
                  onClick={handleOpenExplorer}
                  disabled={!txHash}
                >
                  Review tx details
                  <Icon size="md">
                    <FiExternalLink />
                  </Icon>
                </Button>
                <Dialog.ActionTrigger asChild>
                  <Button w="100%" fontSize="16px" mb="30px">
                    Ok, Close
                  </Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </HStack>
  );
};

export default SupplyDoneModal;
