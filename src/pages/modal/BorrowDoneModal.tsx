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
import { FaCheck } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { useAccount } from "wagmi";
import { useChainConfig } from "../../hooks/useChainConfig";
import { IoWalletOutline } from "react-icons/io5";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  tokenSymbol: string;
  txHash?: `0x${string}`;
}

const BorrowDoneModal: React.FC<Props> = ({
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
    console.log("Add debt token to wallet clicked");

    if (!window.ethereum) {
      console.error("MetaMask not detected");
      return;
    }

    // Map token symbol to variable debt token address and custom symbol
    const debtTokenConfig: Record<
      string,
      { address: string; symbol: string; decimals: number }
    > = {
      wxdc: {
        address: tokens.wrappedNative.variableDebtToken,
        symbol: "vdWXDC",
        decimals: tokens.wrappedNative.decimals,
      },
      xdc: {
        address: tokens.wrappedNative.variableDebtToken,
        symbol: "vdWXDC",
        decimals: tokens.wrappedNative.decimals,
      },
      usdc: {
        address: tokens.usdc.variableDebtToken,
        symbol: "vdUSDC",
        decimals: tokens.usdc.decimals,
      },
      cgo: {
        address: tokens.cgo.variableDebtToken,
        symbol: "vdCGO",
        decimals: tokens.cgo.decimals,
      },
    };

    const normalizedSymbol = tokenSymbol.toLowerCase();
    const debtToken = debtTokenConfig[normalizedSymbol];

    console.log("Token symbol:", tokenSymbol);
    console.log("Normalized symbol:", normalizedSymbol);
    console.log("Debt token config:", debtToken);

    if (
      !debtToken ||
      debtToken.address === "0x0000000000000000000000000000000000000000"
    ) {
      console.error("Debt token address not configured for", tokenSymbol);
      return;
    }

    try {
      // Specify custom symbol to avoid MetaMask's 11-character limit
      const result = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: debtToken.address,
            symbol: debtToken.symbol,
            decimals: debtToken.decimals,
          },
        },
      });
      console.log("Add debt token result:", result);
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
                  <Heading size="xl" mb="7px" className="title-text-1">
                    All done
                  </Heading>
                  <Box mb="20px" className="title-text-1">
                    You Borrowed{" "}
                    <Box as={"span"} fontWeight={"700"}>
                      {amount || "0.00"}
                    </Box>{" "}
                    {tokenSymbol?.toUpperCase()}
                  </Box>
                  <Text fontSize="sm" className="title-text-1" mb={"7px"}>
                    Add debt token to wallet to track your balance.
                  </Text>
                  <Button
                    size={"sm"}
                    variant="plain"
                    className="btn-color-dark-1"
                    onClick={handleAddToWallet}
                  >
                    <Icon size="md" className="light-text-1">
                      <IoWalletOutline />
                    </Icon>
                    Add to wallet
                  </Button>
                </Box>
              </Dialog.Body>
              <Dialog.Footer flexDirection="column" gap="8px">
                <Button
                  size={"xl"}
                  variant="plain"
                  className="btn-color-light-1"
                  w="100%"
                  fontSize="16px"
                  onClick={handleOpenExplorer}
                  disabled={!txHash}
                >
                  Review tx details
                  <Icon size="md" ml="6px">
                    <FiExternalLink />
                  </Icon>
                </Button>
                <Dialog.ActionTrigger asChild>
                  <Button
                    size={"xl"}
                    variant="plain"
                    className="btn-color-dark-1"
                    w="100%"
                    fontSize="16px"
                    mb="30px"
                  >
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

export default BorrowDoneModal;
