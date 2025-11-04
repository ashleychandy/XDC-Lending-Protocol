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
import { useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { MdLocalGasStation } from "react-icons/md";
import ethIcon from "../../assets/images/eth.svg";
import usdcIcon from "../../assets/images/usdc.svg";
import { TOKENS } from "@/chains/arbitrum/arbHelper";
import { useUserAccountData } from "@/hooks/useUserAccountData";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { getHealthFactorColor } from "@/helpers/getHealthFactorColor";
import { formatUsdValue, formatValue } from "@/helpers/formatValue";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tokenSymbol: "weth" | "usdc" | "eth";
  amount: string;
  setAmount: (value: string) => void;
  onClickRepay: () => void;
  borrowedAmount?: string; // User's borrowed amount in token units
  ethPrice?: number;
  usdcPrice?: number;
  isPending?: boolean;
  isConfirming?: boolean;
}

const RepayModal: React.FC<Props> = ({
  isOpen,
  onClose,
  tokenSymbol,
  amount,
  setAmount,
  onClickRepay,
  borrowedAmount = "0",
  ethPrice = 2500,
  usdcPrice = 1,
  isPending = false,
  isConfirming = false,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Get account data for health factor
  const accountData = useUserAccountData();

  // Get wallet balances for validation
  const { balance: wethBalance } = useTokenBalance(
    TOKENS.weth.address,
    TOKENS.weth.decimals
  );
  const { balance: usdcBalance } = useTokenBalance(
    TOKENS.usdc.address,
    TOKENS.usdc.decimals
  );

  // Token configuration
  const getTokenConfig = () => {
    switch (tokenSymbol) {
      case "eth":
      case "weth":
        return {
          name: "ETH",
          symbol: "ETH",
          icon: ethIcon,
          decimals: 18,
          price: ethPrice,
          walletBalance: wethBalance,
        };
      case "usdc":
        return {
          name: "USDC",
          symbol: "USDC",
          icon: usdcIcon,
          decimals: 6,
          price: usdcPrice,
          walletBalance: usdcBalance,
        };
      default:
        return {
          name: "ETH",
          symbol: "ETH",
          icon: ethIcon,
          decimals: 18,
          price: ethPrice,
          walletBalance: wethBalance,
        };
    }
  };

  const tokenConfig = getTokenConfig();

  // Calculate dollar value
  const getDollarValue = () => {
    if (!amount || amount === "0") return "$0";
    const amountNum = parseFloat(amount);
    return formatUsdValue(amountNum * tokenConfig.price);
  };

  // Calculate borrowed amount in USD
  const getBorrowedAmountUsd = () => {
    const borrowed = parseFloat(borrowedAmount);
    return formatUsdValue(borrowed * tokenConfig.price);
  };

  // Calculate remaining debt after repayment
  const getRemainingDebt = () => {
    const borrowed = parseFloat(borrowedAmount);
    const repayAmount = parseFloat(amount || "0");
    const remaining = Math.max(0, borrowed - repayAmount);
    return formatValue(remaining);
  };

  // Calculate remaining debt in USD
  const getRemainingDebtUsd = () => {
    const remaining = parseFloat(getRemainingDebt());
    return formatUsdValue(remaining * tokenConfig.price);
  };

  // Calculate new health factor after repayment
  const getNewHealthFactor = () => {
    const currentHF = parseFloat(accountData.healthFactor);

    const repayAmount = parseFloat(amount || "0");
    if (repayAmount === 0) return currentHF > 1000 ? "∞" : currentHF.toFixed(2);

    // Calculate new health factor with reduced debt
    const repayValue = repayAmount * tokenConfig.price;
    const currentCollateral = parseFloat(accountData.totalCollateral);
    const currentDebt = parseFloat(accountData.totalDebt);
    const liquidationThreshold =
      parseFloat(accountData.currentLiquidationThreshold) / 100;

    const newDebt = Math.max(0, currentDebt - repayValue);

    if (newDebt === 0) return "∞";

    const newHF = (currentCollateral * liquidationThreshold) / newDebt;
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

  // Check if repaying more than borrowed
  const exceedsBorrowed =
    parseFloat(amount || "0") > parseFloat(borrowedAmount);

  // Check if wallet has sufficient balance
  const insufficientBalance =
    parseFloat(amount || "0") > parseFloat(tokenConfig.walletBalance);

  // Check if this is full repayment
  const isFullRepayment =
    parseFloat(amount || "0") >= parseFloat(borrowedAmount) * 0.999;

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
                  Repay {tokenConfig.symbol}
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
                        {getDollarValue()}
                      </Box>
                      <Flex alignItems="center" gap="5px">
                        <Box fontSize="13px" color="gray.600">
                          Wallet balance{" "}
                          {formatValue(parseFloat(tokenConfig.walletBalance))}
                        </Box>
                        <Button
                          variant="plain"
                          p="0"
                          fontSize="10px"
                          minWidth="auto"
                          h="auto"
                          colorScheme="blue"
                          onClick={() => {
                            // Set to minimum of wallet balance or borrowed amount
                            const walletBal = parseFloat(
                              tokenConfig.walletBalance
                            );
                            const borrowed = parseFloat(borrowedAmount);
                            const maxRepay = Math.min(walletBal, borrowed);
                            setAmount(formatValue(maxRepay));
                          }}
                        >
                          MAX
                        </Button>
                      </Flex>
                    </Flex>
                  </Box>
                </Box>

                {/* Transaction overview */}
                <Box>
                  <Box mb="7px" fontSize="sm" fontWeight="medium">
                    Transaction overview
                  </Box>
                  <Box p="12px" border="1px solid #eaebef" borderRadius="6px">
                    <Flex
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb="15px"
                    >
                      <Box w="22%" fontSize="sm">
                        Remaining debt
                      </Box>
                      <Box textAlign="right">
                        <Flex
                          gap="5px"
                          alignItems="center"
                          justifyContent="flex-end"
                        >
                          <Flex alignItems="flex-end">
                            <Box fontSize="sm" fontWeight="semibold">
                              {formatValue(parseFloat(borrowedAmount))}{" "}
                              {tokenConfig.symbol}
                            </Box>
                          </Flex>
                          <Box fontSize="sm">→</Box>
                          <Flex alignItems="flex-end">
                            <Box fontSize="sm" fontWeight="semibold">
                              {getRemainingDebt()} {tokenConfig.symbol}
                            </Box>
                          </Flex>
                        </Flex>
                        <Flex
                          gap="5px"
                          alignItems="center"
                          justifyContent="flex-end"
                        >
                          <Flex alignItems="flex-end">
                            <Box fontSize="xs" color="gray.500">
                              {getBorrowedAmountUsd()}
                            </Box>
                          </Flex>
                          <Box fontSize="sm">→</Box>
                          <Flex alignItems="flex-end">
                            <Box fontSize="xs" color="gray.500">
                              {getRemainingDebtUsd()}
                            </Box>
                          </Flex>
                        </Flex>
                      </Box>
                    </Flex>
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

                {/* Full repayment info */}
                {/* {isFullRepayment && parseFloat(amount) > 0 && (
                  <Box
                    mt="15px"
                    p="10px"
                    bg="green.50"
                    border="1px solid"
                    borderColor="green.300"
                    borderRadius="6px"
                  >
                    <Flex gap="8px" alignItems="flex-start">
                      <Box color="green.600" fontWeight="bold" fontSize="lg">
                        ✓
                      </Box>
                      <Box>
                        <Box fontSize="sm" fontWeight="semibold" color="green.700">
                          Full debt repayment
                        </Box>
                        <Box fontSize="xs" color="green.600" mt="2px">
                          You're repaying your entire {tokenConfig.symbol} debt. Your
                          health factor will improve significantly.
                        </Box>
                      </Box>
                    </Flex>
                  </Box>
                )} */}

                {/* Error if exceeds borrowed */}
                {/* {exceedsBorrowed && parseFloat(amount) > 0 && (
                  <Box
                    mt="15px"
                    p="10px"
                    bg="orange.50"
                    border="1px solid"
                    borderColor="orange.300"
                    borderRadius="6px"
                  >
                    <Flex gap="8px" alignItems="flex-start">
                      <Box color="orange.600" fontWeight="bold" fontSize="lg">
                        ℹ️
                      </Box>
                      <Box>
                        <Box fontSize="sm" fontWeight="semibold" color="orange.700">
                          Amount exceeds debt
                        </Box>
                        <Box fontSize="xs" color="orange.600" mt="2px">
                          You can repay up to{" "}
                          {parseFloat(borrowedAmount).toFixed(
                            tokenConfig.decimals === 6 ? 2 : 6
                          )}{" "}
                          {tokenConfig.symbol}. Excess amount will be refunded.
                        </Box>
                      </Box>
                    </Flex>
                  </Box>
                )} */}

                {/* Error if insufficient balance */}
                {/* {insufficientBalance && parseFloat(amount) > 0 && (
                  <Box
                    mt="15px"
                    p="10px"
                    bg="red.50"
                    border="1px solid"
                    borderColor="red.300"
                    borderRadius="6px"
                  >
                    <Flex gap="8px" alignItems="flex-start">
                      <Box color="red.600" fontWeight="bold" fontSize="lg">
                        ⛔
                      </Box>
                      <Box>
                        <Box fontSize="sm" fontWeight="semibold" color="red.700">
                          Insufficient wallet balance
                        </Box>
                        <Box fontSize="xs" color="red.600" mt="2px">
                          Your wallet has{" "}
                          {parseFloat(tokenConfig.walletBalance).toFixed(
                            tokenConfig.decimals === 6 ? 2 : 4
                          )}{" "}
                          {tokenConfig.symbol}. You need more tokens to repay this
                          amount.
                        </Box>
                      </Box>
                    </Flex>
                  </Box>
                )} */}

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
                    insufficientBalance ||
                    isPending ||
                    isConfirming
                  }
                  w="100%"
                  fontSize="18px"
                  onClick={onClickRepay}
                  colorScheme="blue"
                  loading={isPending || isConfirming}
                >
                  {isPending || isConfirming
                    ? "Repaying..."
                    : !amount ||
                      amount.trim() === "" ||
                      parseFloat(amount) === 0
                    ? "Enter an amount"
                    : insufficientBalance
                    ? "Insufficient balance"
                    : `Repay ${tokenConfig.symbol}`}
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </HStack>
  );
};

export default RepayModal;
