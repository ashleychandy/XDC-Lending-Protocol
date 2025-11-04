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
import { useUserAccountData } from "@/hooks/useUserAccountData";
import { formatValue } from "@/helpers/formatValue";
import { getHealthFactorColor } from "@/helpers/getHealthFactorColor";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tokenSymbol: "weth" | "usdc" | "eth";
  amount: string;
  setAmount: (value: string) => void;
  onClickBorrow: () => void;
  borrowedBalance?: string;
  ethPrice?: number;
  usdcPrice?: number;
  isPending?: boolean;
  isConfirming?: boolean;
}

const BorrowModal: React.FC<Props> = ({
  isOpen,
  onClose,
  tokenSymbol,
  amount,
  setAmount,
  onClickBorrow,
  borrowedBalance = "0",
  ethPrice = 2500,
  usdcPrice = 1,
  isPending,
  isConfirming,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [unwrapToNative, setUnwrapToNative] = useState<boolean>(true);

  // Get account data for health factor
  const accountData = useUserAccountData();

  // Token configuration
  const getTokenConfig = () => {
    // If WETH/ETH and unwrap is enabled, show ETH
    if ((tokenSymbol === "weth" || tokenSymbol === "eth") && unwrapToNative) {
      return {
        name: "ETH",
        symbol: "ETH",
        icon: ethIcon,
        decimals: 18,
        price: ethPrice,
      };
    }
    // If WETH and unwrap is disabled, show WETH
    if (tokenSymbol === "weth" && !unwrapToNative) {
      return {
        name: "WETH",
        symbol: "WETH",
        icon: wethIcon,
        decimals: 18,
        price: ethPrice,
      };
    }
    // For ETH selection, always show based on toggle
    if (tokenSymbol === "eth") {
      return {
        name: unwrapToNative ? "ETH" : "WETH",
        symbol: unwrapToNative ? "ETH" : "WETH",
        icon: unwrapToNative ? ethIcon : wethIcon,
        decimals: 18,
        price: ethPrice,
      };
    }
    // USDC
    return {
      name: "USDC",
      symbol: "USDC",
      icon: usdcIcon,
      decimals: 6,
      price: usdcPrice,
    };
  };

  const tokenConfig = getTokenConfig();

  // Calculate dollar value
  const getDollarValue = () => {
    if (!amount || amount === "0") return "0.00";
    const amountNum = parseFloat(amount);
    return (amountNum * tokenConfig.price).toFixed(2);
  };

  // Calculate new health factor after borrow
  const getNewHealthFactor = () => {
    const currentHF = parseFloat(accountData.healthFactor);
    if (currentHF > 1000) return "∞";

    const borrowAmount = parseFloat(amount || "0");
    if (borrowAmount === 0) return currentHF.toFixed(2);

    // Simplified calculation: borrowing collateral decreases health factor
    const collateralValue = borrowAmount * tokenConfig.price;
    const currentCollateral = parseFloat(accountData.totalCollateral);
    const currentDebt = parseFloat(accountData.totalDebt);

    if (currentDebt === 0) return "∞";

    const newCollateral = Math.max(0, currentCollateral - collateralValue);
    const liquidationThreshold =
      parseFloat(accountData.currentLiquidationThreshold) / 100;
    const newHF = (newCollateral * liquidationThreshold) / currentDebt;

    return newHF > 1000 ? "∞" : newHF.toFixed(2);
  };

  const healthFactorValue = parseFloat(accountData.healthFactor);
  const newHealthFactorValue = parseFloat(getNewHealthFactor());

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

  // Check if borrow would make health factor too low
  const isBorrowRisky =
    newHealthFactorValue < 1.5 && newHealthFactorValue !== Infinity;

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
                  Borrow {tokenConfig.symbol}
                </Dialog.Title>
                <Dialog.CloseTrigger asChild pos="static">
                  <Icon size="xl" cursor="pointer">
                    <IoMdClose />
                  </Icon>
                </Dialog.CloseTrigger>
              </Dialog.Header>

              <Dialog.Body>
                {/* Amount input */}
                <Box mb="15px">
                  <Box mb="7px" fontSize="sm" fontWeight="medium">
                    Amount
                  </Box>
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
                            let input = e.currentTarget.value;
                            if (input.startsWith(".")) input = "0" + input;
                            if (/^\d*\.?\d*$/.test(input)) {
                              setAmount(input);
                            }
                          }}
                        />
                      </InputGroup>
                      <Flex gap="8px" alignItems="center">
                        <Image
                          src={tokenConfig.icon}
                          width="24px"
                          height="24px"
                          alt={tokenConfig.symbol}
                        />
                        <Heading size="md">{tokenConfig.symbol}</Heading>
                      </Flex>
                    </Flex>

                    <Flex justifyContent="space-between" alignItems="center">
                      <Box fontSize="sm" color="gray.600">
                        $ {getDollarValue()}
                      </Box>
                      <Flex alignItems="center" gap="5px">
                        <Box fontSize="13px" color="gray.600">
                          Available {formatValue(parseFloat(borrowedBalance))}
                        </Box>
                        <Button
                          variant="plain"
                          p="0"
                          fontSize="10px"
                          minWidth="auto"
                          h="auto"
                          colorScheme="blue"
                          onClick={() => {
                            setAmount(formatValue(parseFloat(borrowedBalance)));
                          }}
                        >
                          MAX
                        </Button>
                      </Flex>
                    </Flex>
                  </Box>
                </Box>

                {/* Unwrap toggle for WETH/ETH */}
                {(tokenSymbol === "weth" || tokenSymbol === "eth") && (
                  <Box mb="15px" p="12px" bg="gray.50" borderRadius="6px">
                    <Switch.Root
                      colorPalette="green"
                      checked={unwrapToNative}
                      onCheckedChange={(e) => setUnwrapToNative(e.checked)}
                      size="sm"
                    >
                      <Switch.HiddenInput />
                      <Switch.Control />
                      <Switch.Label fontSize="sm">
                        Unwrap WETH (to borrow ETH)
                      </Switch.Label>
                    </Switch.Root>
                  </Box>
                )}

                {/* Transaction overview */}
                <Box>
                  <Box mb="7px" fontSize="sm" fontWeight="medium">
                    Transaction overview
                  </Box>
                  <Box p="12px" border="1px solid #eaebef" borderRadius="6px">
                    <Flex justifyContent="space-between" gap="7px">
                      <Box fontSize="sm">Health factor</Box>
                      <Box textAlign="right">
                        <Flex
                          gap="5px"
                          alignItems="center"
                          justifyContent="flex-end"
                        >
                          <Box
                            color={getHealthFactorColor(healthFactorValue)}
                            fontSize="sm"
                            fontWeight="semibold"
                          >
                            {healthFactorValue > 1000
                              ? "∞"
                              : healthFactorValue.toFixed(2)}
                          </Box>
                          <Box fontSize="sm">→</Box>
                          <Box
                            color={getHealthFactorColor(newHealthFactorValue)}
                            fontWeight="semibold"
                          >
                            {getNewHealthFactor()}
                          </Box>
                        </Flex>
                        <Box fontSize="12px" color="gray.500" mt="2px">
                          {`Liquidation at < 1.0`}
                        </Box>
                      </Box>
                    </Flex>
                  </Box>
                </Box>

                {/* Gas cost */}
                <Flex mt="20px" alignItems="center" gap="5px" color="gray.600">
                  <MdLocalGasStation size="16px" />
                  <Box fontSize="sm">{`< $0.01`}</Box>
                </Flex>
              </Dialog.Body>

              <Dialog.Footer>
                <Button
                  disabled={
                    !amount ||
                    amount.trim() === "" ||
                    parseFloat(amount) === 0 ||
                    parseFloat(amount) > parseFloat(borrowedBalance) ||
                    isPending ||
                    isConfirming
                  }
                  w="100%"
                  fontSize="18px"
                  onClick={onClickBorrow}
                  colorScheme={isBorrowRisky ? "orange" : "blue"}
                >
                  {!amount || amount.trim() === "" || parseFloat(amount) === 0
                    ? "Enter an amount"
                    : parseFloat(amount) > parseFloat(borrowedBalance)
                    ? "Insufficient balance"
                    : `Borrow ${tokenConfig.symbol}`}
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </HStack>
  );
};

export default BorrowModal;
