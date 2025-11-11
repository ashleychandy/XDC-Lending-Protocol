import {
  Box,
  Button,
  Dialog,
  Flex,
  Heading,
  HStack,
  Icon,
  Portal,
} from "@chakra-ui/react";
import React from "react";
import { FaCheck } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { useAccount } from "wagmi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  tokenSymbol: string;
  txHash?: `0x${string}`;
}

const WithdrawDoneModal: React.FC<Props> = ({
  isOpen,
  onClose,
  amount,
  tokenSymbol,
  txHash,
}) => {
  const { chain } = useAccount();

  const handleOpenExplorer = () => {
    if (!txHash || !chain?.blockExplorers?.default?.url) return;
    const explorerUrl = `${chain.blockExplorers.default.url}/tx/${txHash}`;
    window.open(explorerUrl, "_blank");
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
                  <Box>
                    You withdrew {amount || "0.00"} {tokenSymbol?.toUpperCase()}
                  </Box>
                </Box>
              </Dialog.Body>

              <Dialog.Footer flexDirection="column" gap="8px">
                <Button
                  variant="subtle"
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

export default WithdrawDoneModal;
