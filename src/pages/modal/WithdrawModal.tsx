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
  Switch,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdLocalGasStation } from "react-icons/md";
import ethIcon from "../../assets/images/eth.svg";
import wethIcon from "../../assets/images/weth.svg";
import usdcIcon from "../../assets/images/usdc.svg";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tokenSymbol: "weth" | "usdc" | "eth";
  amount: string;
  setAmount: (value: string) => void;
  onClickWithdraw: () => void;
}

const WithdrawModal: React.FC<Props> = ({
  isOpen,
  onClose,
  tokenSymbol,
  amount,
  setAmount,
  onClickWithdraw,
}) => {
  console.log("symbol", tokenSymbol);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(true);

  // 🪙 Token metadata map
  const tokenData = {
    weth: { label: isChecked ? "ETH" : "WETH", icon: wethIcon },
    usdc: { label: "USDC", icon: usdcIcon },
    eth: { label: "ETH", icon: ethIcon },
  };

  const currentToken = tokenData[tokenSymbol];

  const endElement = amount ? (
    <CloseButton
      size="xs"
      onClick={() => {
        setAmount("");
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
                <Dialog.Title fontSize="22px">
                  Withdraw {currentToken.label}
                </Dialog.Title>
                <Dialog.CloseTrigger asChild pos="static">
                  <Icon size="xl" cursor="pointer">
                    <IoMdClose />
                  </Icon>
                </Dialog.CloseTrigger>
              </Dialog.Header>

              <Dialog.Body>
                {/* Amount input */}
                <Box mb="20px">
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
                          value={amount}
                          onChange={(e) => {
                            const input = e.currentTarget.value;
                            if (/^\d*\.?\d*$/.test(input)) {
                              setAmount(input);
                            }
                          }}
                        />
                      </InputGroup>
                      <Flex gap="8px" alignItems="center">
                        <Image
                          src={currentToken.icon}
                          width="24px"
                          height="24px"
                          alt={currentToken.label}
                        />
                        <Heading>{currentToken.label}</Heading>
                      </Flex>
                    </Flex>

                    <Flex justifyContent="space-between" alignItems="center">
                      <Box>$ 0</Box>
                      <Flex alignItems="center" gap="5px">
                        <Box fontSize="13px">Supply balance 0.6185892</Box>
                        <Button
                          variant="plain"
                          p="0"
                          fontSize="10px"
                          minWidth="auto"
                          h="auto"
                          onClick={() => setAmount("0.6185892")}
                        >
                          MAX
                        </Button>
                      </Flex>
                    </Flex>
                  </Box>
                </Box>

                {/* Optional unwrap switch for WETH/XDC */}
                {tokenSymbol === "weth" || tokenSymbol === "eth" ? (
                  <Box mb="20px">
                    <Switch.Root
                      colorPalette="green"
                      checked={isChecked}
                      onCheckedChange={(e) => setIsChecked(e.checked)}
                    >
                      <Switch.HiddenInput />
                      <Switch.Control />
                      <Switch.Label>
                        Unwrap {tokenSymbol === "eth" ? "WETH" : "WXDC"} (to
                        withdraw {tokenSymbol === "eth" ? "ETH" : "XDC"})
                      </Switch.Label>
                    </Switch.Root>
                  </Box>
                ) : null}

                {/* Transaction overview */}
                <Box>
                  <Box mb="7px">Transaction overview</Box>
                  <Box p="12px" border="1px solid #eaebef" borderRadius="6px">
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      mb="15px"
                    >
                      <Box>Remaining APY</Box>
                      <Box>0.5000000 {currentToken.label}</Box>
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

                {/* Gas cost */}
                <Flex mt="20px" alignItems="center" gap="4px">
                  <MdLocalGasStation size="16px" />
                  <Box>{`< $ 0.01`}</Box>
                </Flex>
              </Dialog.Body>

              <Dialog.Footer>
                <Button
                  disabled={amount.trim() === ""}
                  w="100%"
                  fontSize="18px"
                  onClick={onClickWithdraw}
                >
                  {amount.trim() === ""
                    ? "Enter an amount"
                    : `Withdraw ${currentToken.label}`}
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </HStack>
  );
};

export default WithdrawModal;
