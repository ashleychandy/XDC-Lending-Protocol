import { getTokenLogo } from "@/config/tokenLogos";
import { formatUsdValue, formatValue } from "@/helpers/formatValue";
import { getHealthFactorColor } from "@/helpers/getHealthFactorColor";
import { useChainConfig } from "@/hooks/useChainConfig";
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
  tokenSymbol: "weth" | "usdc" | "eth";
  amount: string;
  setAmount: (value: string) => void;
  onClickWithdraw: () => void;
  suppliedBalance?: string;
  ethPrice?: number;
  usdcPrice?: number;
  isPending?: boolean;
  isConfirming?: boolean;
  unwrapToNative?: boolean;
  setUnwrapToNative?: (value: boolean) => void;
}

const WithdrawModal: React.FC<Props> = ({
  isOpen,
  onClose,
  tokenSymbol,
  amount,
  setAmount,
  onClickWithdraw,
  suppliedBalance = "0",
  ethPrice = 2500,
  usdcPrice = 1,
  isPending,
  isConfirming,
  unwrapToNative: externalUnwrapToNative,
  setUnwrapToNative: externalSetUnwrapToNative,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [internalUnwrapToNative, setInternalUnwrapToNative] =
    useState<boolean>(true);

  // Use external state if provided, otherwise use internal state
  const unwrapToNative = externalUnwrapToNative ?? internalUnwrapToNative;
  const setUnwrapToNative =
    externalSetUnwrapToNative ?? setInternalUnwrapToNative;

  // Get chain config for dynamic tokens
  const { tokens, network } = useChainConfig();
  const nativeTokenSymbol = network.nativeToken.symbol;
  const wrappedTokenSymbol = tokens.weth.symbol;

  // Get account data for health factor
  const accountData = useUserAccountData();

  // Token configuration
  const getTokenConfig = () => {
    // If WETH/ETH and unwrap is enabled, show native token
    if ((tokenSymbol === "weth" || tokenSymbol === "eth") && unwrapToNative) {
      return {
        name: nativeTokenSymbol,
        symbol: nativeTokenSymbol,
        icon: getTokenLogo(nativeTokenSymbol),
        decimals: 18,
        price: ethPrice,
      };
    }
    // If WETH and unwrap is disabled, show wrapped token
    if (tokenSymbol === "weth" && !unwrapToNative) {
      return {
        name: wrappedTokenSymbol,
        symbol: wrappedTokenSymbol,
        icon: getTokenLogo(wrappedTokenSymbol),
        decimals: 18,
        price: ethPrice,
      };
    }
    // For ETH selection, always show based on toggle
    if (tokenSymbol === "eth") {
      return {
        name: unwrapToNative ? nativeTokenSymbol : wrappedTokenSymbol,
        symbol: unwrapToNative ? nativeTokenSymbol : wrappedTokenSymbol,
        icon: unwrapToNative
          ? getTokenLogo(nativeTokenSymbol)
          : getTokenLogo(wrappedTokenSymbol),
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
    if (!amount || amount === "0") return "$0.00";
    const amountNum = parseFloat(amount);
    return formatUsdValue(amountNum * tokenConfig.price);
  };

  // Calculate remaining supply after withdrawal
  const getRemainingSupply = () => {
    const supplied = parseFloat(suppliedBalance);
    const withdrawAmount = parseFloat(amount || "0");
    const remaining = Math.max(0, supplied - withdrawAmount);
    return formatValue(remaining);
  };

  // Calculate new health factor after withdrawal
  const getNewHealthFactor = () => {
    const withdrawAmount = parseFloat(amount || "0");
    if (withdrawAmount === 0) {
      const currentHF = parseFloat(accountData.healthFactor);
      return currentHF > 1000 ? "∞" : currentHF.toFixed(2);
    }

    const withdrawValueUsd = withdrawAmount * tokenConfig.price;
    const currentCollateralUsd = parseFloat(accountData.totalCollateral);
    const currentDebtUsd = parseFloat(accountData.totalDebt);
    const avgLiquidationThreshold = parseFloat(
      accountData.currentLiquidationThreshold
    );

    const newTotalCollateral = Math.max(
      0,
      currentCollateralUsd - withdrawValueUsd
    );

    // If no debt, health factor is infinite
    if (currentDebtUsd === 0 || currentDebtUsd < 0.01) {
      return "∞";
    }

    // If withdrawing all collateral but still have debt, HF = 0
    if (newTotalCollateral === 0) {
      return "0.00";
    }

    // Assume asset has 80% liquidation threshold
    // In production, this should be fetched from reserve configuration
    const assetLiquidationThreshold = 80; // 80%

    // Calculate new weighted average liquidation threshold
    // When withdrawing, we need to recalculate based on remaining collateral
    const remainingCollateralValue =
      currentCollateralUsd * avgLiquidationThreshold -
      withdrawValueUsd * assetLiquidationThreshold;

    const newAvgLiquidationThreshold =
      newTotalCollateral > 0
        ? remainingCollateralValue / newTotalCollateral
        : avgLiquidationThreshold;

    // Calculate new health factor
    // HF = (collateral * liquidationThreshold%) / debt
    const healthFactor =
      (newTotalCollateral * newAvgLiquidationThreshold) / 100 / currentDebtUsd;

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

  // Check if withdrawal would make health factor too low
  const isWithdrawalRisky =
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
                  Withdraw {tokenConfig.symbol}
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
                          Supply balance{" "}
                          {formatValue(parseFloat(suppliedBalance))}
                        </Box>
                        <Button
                          variant="plain"
                          p="0"
                          fontSize="10px"
                          minWidth="auto"
                          h="auto"
                          colorPalette="blue"
                          onClick={() => {
                            setAmount(formatValue(parseFloat(suppliedBalance)));
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
                  <Box mb="15px" p="12px" borderRadius="6px">
                    <Switch.Root
                      colorPalette="green"
                      checked={unwrapToNative}
                      onCheckedChange={(e) => setUnwrapToNative(e.checked)}
                      size="sm"
                    >
                      <Switch.HiddenInput />
                      <Switch.Control />
                      <Switch.Label fontSize="sm">
                        Unwrap WETH (to withdraw ETH)
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
                      alignItems="center"
                      mb="15px"
                    >
                      <Box fontSize="sm">Remaining supply</Box>
                      <Box fontSize="sm" fontWeight="semibold">
                        {getRemainingSupply()} {tokenConfig.symbol}
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
                <Button
                  disabled={
                    !amount ||
                    amount.trim() === "" ||
                    parseFloat(amount) === 0 ||
                    parseFloat(amount) > parseFloat(suppliedBalance) ||
                    isPending ||
                    isConfirming
                  }
                  w="100%"
                  fontSize="18px"
                  onClick={onClickWithdraw}
                  colorPalette={isWithdrawalRisky ? "orange" : "blue"}
                >
                  {!amount || amount.trim() === "" || parseFloat(amount) === 0
                    ? "Enter an amount"
                    : parseFloat(amount) > parseFloat(suppliedBalance)
                      ? "Insufficient balance"
                      : `Withdraw ${tokenConfig.symbol}`}
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
