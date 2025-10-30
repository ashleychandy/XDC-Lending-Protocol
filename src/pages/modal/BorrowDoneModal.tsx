import {
  Box,
  Button,
  Dialog,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Portal,
} from "@chakra-ui/react";
import { IoMdClose } from "react-icons/io";
import { IoWalletOutline } from "react-icons/io5";
import usdcIcon from "../../assets/images/usdc.svg";
import { FaCheck } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const BorrowDoneModal: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <HStack wrap="wrap" gap="4">
      <Dialog.Root
        open={isOpen}
        onOpenChange={onClose}
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
                  <Box>You Borrowed 1000.00 USDC</Box>
                </Box>
                <Box m="15px">
                  <Box p="12px" bg="bg.muted" borderRadius="6px">
                    <Image
                      src={usdcIcon}
                      width="32px"
                      height="32px"
                      m="0 auto 10px"
                    ></Image>
                    <Box mb="10px">
                      Add aToken to wallet to track your balance.
                    </Box>
                    <Button size="sm">
                      <Icon size="md">
                        <IoWalletOutline />
                      </Icon>
                      Add to wallet
                    </Button>
                  </Box>
                </Box>
              </Dialog.Body>
              <Dialog.Footer flexDirection="column" gap="8px">
                <Button variant="subtle" w="100%" fontSize="16px">
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

export default BorrowDoneModal;
