import { getTokenLogo } from "@/config/tokenLogos";
import { formatUsdValue, formatValue } from "@/helpers/formatValue";
import { getHealthFactorColor } from "@/helpers/getHealthFactorColor";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useUserAccountData } from "@/hooks/useUserAccountData";
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
import usdcIcon from "../../assets/images/usdc.svg";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tokenSymbol: "wxdc" | "usdc" | "xdc" | "cgo";
  amount: string;
  setAmount: (value: string) => void;
  onClickApprove: () => void;
  onClickRepay: () => void;
  isApproved: boolean;
  isApprovePending: boolean;
  allowance?: bigint;
  borrowedAmount?: string; // User's borrowed amount in token units
  xdcPrice?: number;
  usdcPrice?: number;
  cgoPrice?: number;
  isPending?: boolean;
  isConfirming?: boolean;
  useNative?: boolean;
  setUseNative?: (value: boolean) => void;
}

const RepayModal: React.FC<Props> = ({
  isOpen,
  onClose,
  tokenSymbol,
  allowance,
  amount,
  setAmount,
  onClickApprove,
  onClickRepay,
  isApproved,
  isApprovePending,
  borrowedAmount = "0",
  xdcPrice = 2500,
  usdcPrice = 1,
  cgoPrice = 1,
  isPending = false,
  isConfirming = false,
  useNative: externalUseNative,
  setUseNative: externalSetUseNative,
}) => {
  const { tokens, network } = useChainConfig();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [internalUseNative, setInternalUseNative] = useState<boolean>(false);

  // Use external state if provided, otherwise use internal state
  const useNative = externalUseNative ?? internalUseNative;
  const setUseNative = externalSetUseNative ?? setInternalUseNative;

  // Get native token info
  const nativeTokenSymbol = network.nativeToken.symbol;
  const wrappedTokenSymbol = tokens.wrappedNative.symbol;

  // Get account data for health factor
  const accountData = useUserAccountData();

  // Get wallet balances for validation
  const { balance: wxdcBalance } = useTokenBalance(
    tokens.wrappedNative.address,
    tokens.wrappedNative.decimals
  );
  const { balance: usdcBalance } = useTokenBalance(
    tokens.usdc.address,
    tokens.usdc.decimals
  );
  const { balance: cgoBalance } = useTokenBalance(
    tokens.cgo.address,
    tokens.cgo.decimals
  );

  // Token configuration
  const getTokenConfig = () => {
    switch (tokenSymbol) {
      case "xdc":
      case "wxdc":
        return {
          name: wrappedTokenSymbol,
          symbol: wrappedTokenSymbol,
          icon: getTokenLogo(wrappedTokenSymbol),
          decimals: 18,
          price: xdcPrice,
          walletBalance: wxdcBalance,
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
      case "cgo":
        return {
          name: "CGO",
          symbol: "CGO",
          icon: getTokenLogo("CGO"),
          decimals: tokens.cgo.decimals,
          price: cgoPrice,
          walletBalance: cgoBalance,
        };
      default:
        return {
          name: wrappedTokenSymbol,
          symbol: wrappedTokenSymbol,
          icon: getTokenLogo(wrappedTokenSymbol),
          decimals: 18,
          price: xdcPrice,
          walletBalance: wxdcBalance,
        };
    }
  };

  const tokenConfig = getTokenConfig();

  // Calculate dollar value
  const getDollarValue = () => {
    if (!amount || amount === "0") return "$0.00";
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
    const repayAmount = parseFloat(amount || "0");
    if (repayAmount === 0) {
      const currentHF = parseFloat(accountData.healthFactor);
      return currentHF > 1000 ? "∞" : currentHF.toFixed(2);
    }

    const repayValueUsd = repayAmount * tokenConfig.price;
    const currentCollateralUsd = parseFloat(accountData.totalCollateral);
    const currentDebtUsd = parseFloat(accountData.totalDebt);
    // avgLiquidationThreshold is already in percentage (e.g., 80 for 80%)
    const avgLiquidationThreshold = parseFloat(
      accountData.currentLiquidationThreshold
    );

    const newTotalDebt = Math.max(0, currentDebtUsd - repayValueUsd);

    // If repaying all debt, health factor is infinite
    if (newTotalDebt === 0 || newTotalDebt < 0.01) {
      return "∞";
    }

    // Calculate new health factor
    // HF = (collateral * liquidationThreshold%) / debt
    const healthFactor =
      (currentCollateralUsd * avgLiquidationThreshold) / 100 / newTotalDebt;

    return healthFactor > 1000 ? "∞" : healthFactor.toFixed(2);
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
                      <Box fontSize="sm">{getDollarValue()}</Box>
                      <Flex alignItems="center" gap="5px">
                        <Box fontSize="13px">
                          Wallet balance{" "}
                          {formatValue(parseFloat(tokenConfig.walletBalance))}
                        </Box>
                        <Button
                          variant="plain"
                          p="0"
                          fontSize="10px"
                          minWidth="auto"
                          h="auto"
                          colorPalette="blue"
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

                {/* Use native token toggle for WXDC */}
                {(tokenSymbol === "wxdc" || tokenSymbol === "xdc") && (
                  <Box mb="15px" p="12px" borderRadius="6px">
                    <Switch.Root
                      colorPalette="green"
                      checked={useNative}
                      onCheckedChange={(e) => setUseNative(e.checked)}
                      size="sm"
                    >
                      <Switch.HiddenInput />
                      <Switch.Control />
                      <Switch.Label fontSize="sm">
                        Repay with native {network.nativeToken.symbol}
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
                            <Box fontSize="xs">{getBorrowedAmountUsd()}</Box>
                          </Flex>
                          <Box fontSize="sm">→</Box>
                          <Flex alignItems="flex-end">
                            <Box fontSize="xs">{getRemainingDebtUsd()}</Box>
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
                        <Box fontSize="12px" mt="2px">
                          {`Liquidation at < 1.0`}
                        </Box>
                      </Box>
                    </Flex>
                  </Box>
                </Box>

                {/* Gas cost */}
                <Flex mt="20px" alignItems="center" gap="5px">
                  <MdLocalGasStation size="16px" />
                  <Box fontSize="sm">~$0.0001 (12.5 Gwei)</Box>
                </Flex>
              </Dialog.Body>

              <Dialog.Footer>
                {(() => {
                  // For native token repay, no approval needed
                  if (useNative) {
                    return (
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
                        colorPalette="blue"
                        loading={isPending || isConfirming}
                      >
                        {!amount ||
                        amount.trim() === "" ||
                        parseFloat(amount) === 0
                          ? "Enter an amount"
                          : insufficientBalance
                            ? "Insufficient balance"
                            : `Repay ${tokenConfig.symbol}`}
                      </Button>
                    );
                  }

                  // Check if allowance is sufficient for the input amount
                  const amountInWei = amount
                    ? BigInt(
                        Math.floor(
                          parseFloat(amount) * 10 ** tokenConfig.decimals
                        )
                      )
                    : BigInt(0);
                  const needsApproval = !allowance || allowance < amountInWei;

                  return (
                    <Button
                      disabled={
                        !amount ||
                        amount.trim() === "" ||
                        parseFloat(amount) === 0 ||
                        insufficientBalance ||
                        isPending ||
                        isConfirming ||
                        isApprovePending
                      }
                      w="100%"
                      fontSize="18px"
                      onClick={needsApproval ? onClickApprove : onClickRepay}
                      colorPalette="blue"
                      loading={isApprovePending || isPending || isConfirming}
                    >
                      {!amount ||
                      amount.trim() === "" ||
                      parseFloat(amount) === 0
                        ? "Enter an amount"
                        : insufficientBalance
                          ? "Insufficient balance"
                          : needsApproval
                            ? `Approve ${tokenConfig.symbol}`
                            : `Repay ${tokenConfig.symbol}`}
                    </Button>
                  );
                })()}
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </HStack>
  );
};

export default RepayModal;
