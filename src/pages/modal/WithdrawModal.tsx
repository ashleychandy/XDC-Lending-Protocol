import { getTokenLogo } from "@/config/tokenLogos";
import { formatUsdValue, formatValue } from "@/helpers/formatValue";
import { getHealthFactorColor } from "@/helpers/getHealthFactorColor";
import { useAssetPrice } from "@/hooks/useAssetPrice";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useReserveData } from "@/hooks/useReserveData";
import { useReserveLiquidity } from "@/hooks/useReserveLiquidity";
import { useUserAccountData } from "@/hooks/useUserAccountData";
import { useUserReserveData } from "@/hooks/useUserReserveData";
import {
  Box,
  Button,
  Checkbox,
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
import { formatUnits } from "viem";
import usdcIcon from "../../assets/images/usdc.svg";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tokenSymbol: "wxdc" | "usdc" | "xdc" | "cgo";
  amount: string;
  setAmount: (value: string) => void;
  onClickWithdraw: () => void;
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
  isPending,
  isConfirming,
  unwrapToNative: externalUnwrapToNative,
  setUnwrapToNative: externalSetUnwrapToNative,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [internalUnwrapToNative, setInternalUnwrapToNative] =
    useState<boolean>(true);
  // State for risk acknowledgment
  const [riskAcknowledged, setRiskAcknowledged] = useState<boolean>(false);

  // Use external state if provided, otherwise use internal state
  const unwrapToNative = externalUnwrapToNative ?? internalUnwrapToNative;
  const setUnwrapToNative =
    externalSetUnwrapToNative ?? setInternalUnwrapToNative;

  // Get chain config for dynamic tokens
  const { tokens, network } = useChainConfig();
  const nativeTokenSymbol = network.nativeToken.symbol;
  const wrappedTokenSymbol = tokens.wrappedNative.symbol;

  // Get account data for health factor
  const accountData = useUserAccountData();

  // Fetch data internally based on tokenSymbol
  const currentToken =
    tokenSymbol === "xdc" || tokenSymbol === "wxdc"
      ? tokens.wrappedNative
      : tokens[tokenSymbol];

  // Get reserve data
  const reserveData = useReserveData(currentToken.address);

  // Get user reserve data
  const userReserveData = useUserReserveData(
    currentToken.address,
    reserveData.aTokenAddress
  );

  // Get available liquidity
  const liquidityData = useReserveLiquidity(
    currentToken.address,
    currentToken.decimals
  );

  // Get asset prices
  const { price: xdcPrice } = useAssetPrice(tokens.wrappedNative.address);
  const { price: usdcPrice } = useAssetPrice(tokens.usdc.address);
  const { price: cgoPrice } = useAssetPrice(tokens.cgo.address);

  // Format supplied balance
  const suppliedBalance = formatUnits(
    userReserveData.suppliedAmount as bigint,
    currentToken.decimals
  );

  // Get available liquidity
  const availableLiquidity = liquidityData.availableLiquidity;

  // Token configuration
  const getTokenConfig = () => {
    // If WXDC and unwrap is enabled, show native token
    if ((tokenSymbol === "wxdc" || tokenSymbol === "xdc") && unwrapToNative) {
      return {
        name: nativeTokenSymbol,
        symbol: nativeTokenSymbol,
        icon: getTokenLogo(nativeTokenSymbol),
        decimals: 18,
        price: xdcPrice,
      };
    }
    // If WXDC and unwrap is disabled, show wrapped token
    if (tokenSymbol === "wxdc" && !unwrapToNative) {
      return {
        name: wrappedTokenSymbol,
        symbol: wrappedTokenSymbol,
        icon: getTokenLogo(wrappedTokenSymbol),
        decimals: 18,
        price: xdcPrice,
      };
    }
    // For XDC selection, always show based on toggle
    if (tokenSymbol === "xdc") {
      return {
        name: unwrapToNative ? nativeTokenSymbol : wrappedTokenSymbol,
        symbol: unwrapToNative ? nativeTokenSymbol : wrappedTokenSymbol,
        icon: unwrapToNative
          ? getTokenLogo(nativeTokenSymbol)
          : getTokenLogo(wrappedTokenSymbol),
        decimals: 18,
        price: xdcPrice,
      };
    }
    // CGO
    if (tokenSymbol === "cgo") {
      return {
        name: "CGO",
        symbol: "CGO",
        icon: getTokenLogo("CGO"),
        decimals: tokens.cgo.decimals,
        price: cgoPrice,
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
    if (newTotalCollateral === 0 || newTotalCollateral < 0.01) {
      return "0.00";
    }

    // Simplified calculation: assume the liquidation threshold stays the same
    // This is more accurate than trying to recalculate weighted average
    // HF = (newCollateral × liquidationThreshold%) / debt
    const healthFactor =
      (newTotalCollateral * avgLiquidationThreshold) / 100 / currentDebtUsd;

    return healthFactor > 1000 ? "∞" : healthFactor.toFixed(2);
  };

  const healthFactorValue = parseFloat(accountData.healthFactor);
  const newHealthFactorValue = parseFloat(getNewHealthFactor());

  // Calculate safe max withdraw amount (keeping HF > 1.05 for safety)
  const getSafeMaxWithdraw = () => {
    const currentCollateralUsd = parseFloat(accountData.totalCollateral);
    const currentDebtUsd = parseFloat(accountData.totalDebt);
    const avgLiquidationThreshold = parseFloat(
      accountData.currentLiquidationThreshold
    );
    const minHealthFactor = 1.05; // Keep HF above 1.05 for safety

    const supplied = parseFloat(suppliedBalance);
    const liquidity = parseFloat(availableLiquidity);

    // If no debt, can withdraw min of supplied balance and available liquidity
    if (currentDebtUsd === 0 || currentDebtUsd < 0.01) {
      return Math.min(supplied, liquidity);
    }

    // If no liquidation threshold, can't calculate safely
    if (avgLiquidationThreshold === 0) {
      return 0;
    }

    // Calculate minimum collateral needed to maintain HF > 1.05
    // HF = (collateral × liquidationThreshold%) / debt
    // Rearranging: minCollateral = (debt × minHF) / (liquidationThreshold% / 100)
    const minCollateralNeeded =
      (currentDebtUsd * minHealthFactor * 100) / avgLiquidationThreshold;

    // Calculate max we can withdraw
    const maxWithdrawUsd = Math.max(
      0,
      currentCollateralUsd - minCollateralNeeded
    );
    const maxWithdrawInToken = maxWithdrawUsd / tokenConfig.price;

    // Return minimum of all constraints with a small buffer (0.1%) for rounding
    const safeAmount =
      Math.min(maxWithdrawInToken, supplied, liquidity) * 0.999;

    return Math.max(0, safeAmount);
  };

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
  const isWithdrawalDangerous =
    newHealthFactorValue < 1.05 && newHealthFactorValue !== Infinity;

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
                <Dialog.Title fontSize="22px" className="title-text-1">
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
                  <Box
                    mb="7px"
                    fontSize="sm"
                    fontWeight="medium"
                    className="light-text-2"
                  >
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
                        <Heading size="md" className="title-text-1">
                          {tokenConfig.symbol}
                        </Heading>
                      </Flex>
                    </Flex>

                    <Flex justifyContent="space-between" alignItems="center">
                      <Box fontSize="sm" className="light-text-2">
                        {getDollarValue()}
                      </Box>
                      <Flex alignItems="center" gap="5px">
                        <Box fontSize="13px" className="light-text-2">
                          Supply balance{" "}
                          {formatValue(parseFloat(suppliedBalance))}
                        </Box>
                        <Button
                          variant="plain"
                          p="0"
                          fontSize="10px"
                          minWidth="auto"
                          h="auto"
                          className="title-text-1"
                          onClick={() => {
                            const safeMax = getSafeMaxWithdraw();
                            // Store raw number as string (no formatting with commas)
                            setAmount(safeMax.toString());
                          }}
                        >
                          MAX
                        </Button>
                      </Flex>
                    </Flex>
                  </Box>
                </Box>

                {/* Unwrap toggle for WXDC */}
                {(tokenSymbol === "wxdc" || tokenSymbol === "xdc") && (
                  <Box mb="15px" p="12px" borderRadius="6px">
                    <Switch.Root
                      colorPalette="green"
                      checked={unwrapToNative}
                      onCheckedChange={(e) => setUnwrapToNative(e.checked)}
                      size="sm"
                    >
                      <Switch.HiddenInput />
                      <Switch.Control />
                      <Switch.Label
                        fontSize="sm"
                        className="title-text-1"
                        cursor={"pointer"}
                      >
                        Unwrap WXDC (to withdraw XDC)
                      </Switch.Label>
                    </Switch.Root>
                  </Box>
                )}

                {/* Risk Warning */}
                {isWithdrawalRisky && !isWithdrawalDangerous && (
                  <Box
                    p="12px"
                    bg="rgba(255, 0, 0, 0.05)"
                    border="1px solid rgba(255, 0, 0, 0.2)"
                    borderRadius="6px"
                    mb="15px"
                  >
                    <Box fontSize="sm" color="red.600" mb="8px">
                      ⚠️ Withdrawing this amount will reduce your health factor
                      and increase risk of liquidation.
                    </Box>
                    <Checkbox.Root
                      checked={riskAcknowledged}
                      onCheckedChange={(e) =>
                        setRiskAcknowledged(e.checked === true)
                      }
                      size="sm"
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label fontSize="sm">
                        I acknowledge the risks involved
                      </Checkbox.Label>
                    </Checkbox.Root>
                  </Box>
                )}

                {/* Transaction overview */}
                <Box>
                  <Box
                    mb="7px"
                    fontSize="sm"
                    fontWeight="medium"
                    className="light-text-2"
                  >
                    Transaction overview
                  </Box>
                  <Box p="12px" border="1px solid #eaebef" borderRadius="6px">
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      mb="15px"
                    >
                      <Box fontSize="sm" className="title-text-1">
                        Remaining supply
                      </Box>
                      <Box
                        fontSize="sm"
                        fontWeight="semibold"
                        className="title-text-1"
                      >
                        {getRemainingSupply()} {tokenConfig.symbol}
                      </Box>
                    </Flex>
                    <Flex justifyContent="space-between" gap="7px">
                      <Box fontSize="sm" className="title-text-1">
                        Health factor
                      </Box>
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
                          <Box fontSize="sm" className="light-text-2">
                            →
                          </Box>
                          <Box
                            color={getHealthFactorColor(newHealthFactorValue)}
                            fontWeight="semibold"
                          >
                            {getNewHealthFactor()}
                          </Box>
                        </Flex>
                        <Box fontSize="12px" mt="2px" className="light-text-2">
                          {`Liquidation at < 1.0`}
                        </Box>
                      </Box>
                    </Flex>
                  </Box>
                </Box>

                {/* Gas cost */}
                <Flex mt="20px" alignItems="center" gap="5px">
                  <MdLocalGasStation size="16px" className="light-text-2" />
                  <Box fontSize="sm" className="title-text-1">
                    ~$0.0001 (12.5 Gwei)
                  </Box>
                </Flex>
              </Dialog.Body>

              <Dialog.Footer>
                <Button
                  disabled={
                    !amount ||
                    amount.trim() === "" ||
                    parseFloat(amount) === 0 ||
                    parseFloat(amount) > parseFloat(suppliedBalance) ||
                    isWithdrawalDangerous ||
                    (isWithdrawalRisky && !riskAcknowledged) ||
                    isPending ||
                    isConfirming
                  }
                  w="100%"
                  fontSize="18px"
                  onClick={onClickWithdraw}
                  variant={"plain"}
                  className="btn-color-dark-1"
                  // colorPalette={isWithdrawalRisky ? "orange" : "blue"}
                >
                  {!amount || amount.trim() === "" || parseFloat(amount) === 0
                    ? "Enter an amount"
                    : parseFloat(amount) > parseFloat(suppliedBalance)
                      ? "Insufficient balance"
                      : isWithdrawalDangerous
                        ? "Health factor too low"
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
