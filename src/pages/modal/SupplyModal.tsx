import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  InputGroup,
  Portal,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdLocalGasStation } from "react-icons/md";
import xdcIcon from "../../assets/images/xdc-icon.webp";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onClickSupply: () => void;
}

const SupplyModal: React.FC<Props> = ({ isOpen, onClose, onClickSupply }) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const endElement = value ? (
    <CloseButton
      size="xs"
      onClick={() => {
        setValue("");
        inputRef.current?.focus();
      }}
      me="-2"
    />
  ) : undefined;

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
                <Dialog.Title fontSize="22px">Supply XDC</Dialog.Title>
                <Dialog.CloseTrigger asChild pos="static">
                  <Icon size="xl" cursor="pointer">
                    <IoMdClose />
                  </Icon>
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>
                <Box mb="15px">
                  <Box mb="7px">Amount</Box>
                  <Box
                    p="6px 12px"
                    border="1px solid #eaebef"
                    borderRadius="6px"
                  >
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      mb="6px"
                    >
                      <InputGroup endElement={endElement} w="75%">
                        <Input
                          ref={inputRef}
                          border="none"
                          h="auto"
                          outline="none"
                          p="0"
                          fontSize="20px"
                          placeholder="0.00"
                          value={value}
                          onChange={(e) => {
                            const input = e.currentTarget.value;
                            if (/^\d*\.?\d*$/.test(input)) {
                              setValue(input);
                            }
                          }}
                        />
                      </InputGroup>
                      <Flex gap="8px" alignItems="center">
                        <Image src={xdcIcon} width="24px" height="24px"></Image>
                        <Heading>XDC</Heading>
                      </Flex>
                    </Flex>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Box>$ 0</Box>
                      <Flex alignItems="center" gap="5px">
                        <Box fontSize="13px">Wallet balance 0.6185892</Box>

                        <Button
                          variant="plain"
                          p="0"
                          fontSize="10px"
                          minWidth="auto"
                          h="auto"
                        >
                          MAX
                        </Button>
                      </Flex>
                    </Flex>
                  </Box>
                </Box>
                <Box>
                  <Box mb="7px">Transaction overview</Box>
                  <Box p="12px" border="1px solid #eaebef" borderRadius="6px">
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      mb="15px"
                    >
                      <Box>Supply APY</Box>
                      <Box>0 %</Box>
                    </Flex>
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      mb="15px"
                    >
                      <Box>Collateralization</Box>
                      <Box color="green.600">Enabled</Box>
                    </Flex>
                    <Flex justifyContent="space-between" gap="7px">
                      <Box>Health factor</Box>
                      <Box textAlign="right">
                        <Box color="green.600">3.30K</Box>
                        <Box fontSize="12px">{`Liquidation at < 1.0`}</Box>
                      </Box>
                    </Flex>
                  </Box>
                </Box>
                <Flex mt="20px" alignItems="center">
                  <MdLocalGasStation size="16px" />
                  <Box>{`< $ 0.01`}</Box>
                </Flex>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  disabled={value.trim() === ""}
                  w="100%"
                  fontSize="18px"
                  onClick={onClickSupply}
                >
                  {value.trim() === "" ? "Enter an amount" : "Supply XDC"}
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </HStack>
  );
};

export default SupplyModal;
