import FormattedCounter from "@/components/ui/Counter/FormattedCounter";
import { getTokenLogo } from "@/config/tokenLogos";
import { formatUsdValue, formatValue } from "@/helpers/formatValue";
import { getHealthFactorColor } from "@/helpers/getHealthFactorColor";
import { useAssetPrice } from "@/hooks/useAssetPrice";
import { useBorrowAllowance } from "@/hooks/useBorrowAllowance";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useReserveBorrowed } from "@/hooks/useReserveBorrowed";
import { useReserveCaps } from "@/hooks/useReserveCaps";
import { useReserveLiquidity } from "@/hooks/useReserveLiquidity";
import { useUserAccountData } from "@/hooks/useUserAccountData";
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
import { useAccount } from "wagmi";
import usdcIcon from "../../assets/images/usdc.svg";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tokenSymbol: "wxdc" | "usdc" | "xdc" | "cgo";
  amount: string;
  setAmount: (value: string) => void;
  onClickDelegationApprove?: () => void;
  onClickBorrow: (unwrapToNative: boolean) => void;
  isPending?: boolean;
  isConfirming?: boolean;
}

const BorrowModal: React.FC<Props> = ({
  isOpen,
  onClose,
  tokenSymbol,
  amount,
  setAmount,
  onClickDelegationApprove,
  onClickBorrow,
  isPending,
  isConfirming,
}) => {
  // Get chain config and user address
  const { tokens, network } = useChainConfig();
  const { address } = useAccount();

  // Internal state for unwrap toggle
  const [unwrapToNative, setUnwrapToNative] = useState<boolean>(true);
  // State for risk acknowledgment
  const [riskAcknowledged, setRiskAcknowledged] = useState<boolean>(false);

  // Get token configuration
  const token =
    tokenSymbol === "xdc" || tokenSymbol === "wxdc"
      ? tokens.wrappedNative
      : tokens[tokenSymbol as "usdc" | "cgo"];

  // Fetch all required data
  const accountData = useUserAccountData();
  const { price: tokenPrice } = useAssetPrice(token.address);
  const caps = useReserveCaps(token.address, token.decimals);
  const liquidity = useReserveLiquidity(token.address, token.decimals);
  const totalBorrowedData = useReserveBorrowed(
    token.variableDebtToken,
    token.decimals
  );
  const { allowance: delegationAllowance } = useBorrowAllowance(address);

  // Calculate available to borrow (keep raw number for comparisons)
  const availableToBorrowRaw = Math.min(
    parseFloat(accountData.availableBorrows) / tokenPrice,
    parseFloat(liquidity.availableLiquidity),
    parseFloat(caps.borrowCap || "0") > 0
      ? Math.max(
          0,
          parseFloat(caps.borrowCap) -
            parseFloat(totalBorrowedData.totalBorrowed)
        )
      : Infinity
  );
  const availableToBorrow = formatValue(availableToBorrowRaw);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const nativeTokenSymbol = network.nativeToken.symbol;
  const wrappedTokenSymbol = tokens.wrappedNative.symbol;

  // Token configuration
  const getTokenConfig = () => {
    // If WXDC and unwrap is enabled, show native token
    if ((tokenSymbol === "wxdc" || tokenSymbol === "xdc") && unwrapToNative) {
      return {
        name: nativeTokenSymbol,
        symbol: nativeTokenSymbol,
        icon: getTokenLogo(nativeTokenSymbol),
        decimals: 18,
        price: tokenPrice,
      };
    }
    // If WXDC and unwrap is disabled, show wrapped token
    if (tokenSymbol === "wxdc" && !unwrapToNative) {
      return {
        name: wrappedTokenSymbol,
        symbol: wrappedTokenSymbol,
        icon: getTokenLogo(wrappedTokenSymbol),
        decimals: 18,
        price: tokenPrice,
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
        price: tokenPrice,
      };
    }
    // CGO
    if (tokenSymbol === "cgo") {
      return {
        name: "CGO",
        symbol: "CGO",
        icon: getTokenLogo("CGO"),
        decimals: tokens.cgo.decimals,
        price: tokenPrice,
      };
    }
    // USDC
    return {
      name: "USDC",
      symbol: "USDC",
      icon: usdcIcon,
      decimals: 6,
      price: tokenPrice,
    };
  };

  const tokenConfig = getTokenConfig();

  // Calculate dollar value
  const getDollarValue = () => {
    if (!amount || amount === "0") return "$0.00";
    const amountNum = parseFloat(amount);
    return formatUsdValue(amountNum * tokenConfig.price);
  };

  // Calculate new health factor after borrow
  const getNewHealthFactor = () => {
    const borrowAmount = parseFloat(amount || "0");
    if (borrowAmount === 0) {
      const currentHF = parseFloat(accountData.healthFactor);
      return currentHF > 1000 ? "∞" : currentHF.toFixed(2);
    }

    const borrowValueUsd = borrowAmount * tokenConfig.price;
    const currentCollateralUsd = parseFloat(accountData.totalCollateral);
    const currentDebtUsd = parseFloat(accountData.totalDebt);
    // avgLiquidationThreshold is already in percentage (e.g., 80 for 80%)
    const avgLiquidationThreshold = parseFloat(
      accountData.currentLiquidationThreshold
    );

    const newTotalDebt = currentDebtUsd + borrowValueUsd;

    // Calculate new health factor
    // HF = (collateral * liquidationThreshold%) / debt
    if (newTotalDebt === 0 || newTotalDebt < 0.01) {
      return "∞";
    }

    const healthFactor =
      (currentCollateralUsd * avgLiquidationThreshold) / 100 / newTotalDebt;

    return healthFactor > 1000 ? "∞" : healthFactor.toFixed(2);
  };

  const healthFactorValue = parseFloat(accountData.healthFactor);
  const newHealthFactorValue = parseFloat(getNewHealthFactor());

  // Calculate safe max borrow amount (keeping HF > 1.05 for safety)
  const getSafeMaxBorrow = () => {
    const currentCollateralUsd = parseFloat(accountData.totalCollateral);
    const currentDebtUsd = parseFloat(accountData.totalDebt);
    const avgLiquidationThreshold = parseFloat(
      accountData.currentLiquidationThreshold
    );
    const minHealthFactor = 1.05; // Keep HF above 1.05 for safety

    // If no collateral, can't borrow
    if (currentCollateralUsd === 0 || avgLiquidationThreshold === 0) {
      return 0;
    }

    // Calculate max debt that maintains HF > 1.05
    // HF = (collateral × liquidationThreshold%) / debt
    // Rearranging: maxDebt = (collateral × liquidationThreshold%) / minHF
    const maxDebtUsd =
      (currentCollateralUsd * avgLiquidationThreshold) / 100 / minHealthFactor;

    // Subtract current debt to get max new borrow
    const maxNewBorrowUsd = Math.max(0, maxDebtUsd - currentDebtUsd);

    // Convert to token amount
    const maxNewBorrowInToken = maxNewBorrowUsd / tokenConfig.price;

    // Also respect the availableToBorrow limit (liquidity, caps, LTV)
    const availableLimit = availableToBorrowRaw;

    // Return the minimum of both constraints
    // Add a small buffer (0.1%) to account for rounding errors
    const safeAmount = Math.min(maxNewBorrowInToken, availableLimit) * 0.999;

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

  // Check if borrow would make health factor too low
  const isBorrowRisky =
    newHealthFactorValue < 1.5 && newHealthFactorValue !== Infinity;
  const isBorrowDangerous =
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
                          Available {availableToBorrow}
                        </Box>
                        <Button
                          variant="plain"
                          p="0"
                          fontSize="10px"
                          minWidth="auto"
                          h="auto"
                          className="title-text-1"
                          onClick={() => {
                            const safeMax = getSafeMaxBorrow();
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
                      <Switch.Label fontSize="sm">
                        Unwrap WXDC (to borrow XDC)
                      </Switch.Label>
                    </Switch.Root>
                  </Box>
                )}

                {/* Risk Warning */}
                {isBorrowRisky && !isBorrowDangerous && (
                  <Box
                    p="12px"
                    bg="rgba(255, 0, 0, 0.05)"
                    border="1px solid rgba(255, 0, 0, 0.2)"
                    borderRadius="6px"
                    mb="15px"
                  >
                    <Box fontSize="sm" color="red.600" mb="8px">
                      ⚠️ Borrowing this amount will reduce your health factor
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
                            {healthFactorValue > 1000 ? (
                              "∞"
                            ) : (
                              <FormattedCounter
                                value={healthFactorValue.toFixed(2)}
                                fontSize={14}
                                textColor={getHealthFactorColor(
                                  healthFactorValue
                                )}
                              />
                            )}
                          </Box>
                          <Box fontSize="sm" className="light-text-2">
                            →
                          </Box>
                          <Box
                            color={getHealthFactorColor(newHealthFactorValue)}
                            fontWeight="semibold"
                          >
                            {getNewHealthFactor() === "∞" ? (
                              "∞"
                            ) : (
                              <FormattedCounter
                                value={getNewHealthFactor()}
                                fontSize={14}
                                textColor={getHealthFactorColor(
                                  newHealthFactorValue
                                )}
                              />
                            )}
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
                {(() => {
                  // For native token borrowing with unwrap, check delegation allowance
                  if (
                    (tokenSymbol === "wxdc" || tokenSymbol === "xdc") &&
                    unwrapToNative
                  ) {
                    // Check if delegation allowance is sufficient for the input amount
                    // If no amount entered, check if any delegation exists
                    const amountInWei =
                      amount && parseFloat(amount) > 0
                        ? BigInt(Math.floor(parseFloat(amount) * 10 ** 18))
                        : BigInt(1); // Check for at least 1 wei of delegation

                    const needsDelegation =
                      !delegationAllowance || delegationAllowance < amountInWei;

                    if (needsDelegation) {
                      return (
                        <Button
                          disabled={!onClickDelegationApprove}
                          w="100%"
                          fontSize="18px"
                          onClick={() => {
                            if (onClickDelegationApprove) {
                              onClickDelegationApprove();
                            }
                          }}
                          variant={"plain"}
                          className="btn-color-dark-1"
                        >
                          Approve delegation
                        </Button>
                      );
                    }
                  }

                  // Check if borrow would exceed cap
                  const borrowCapNum = parseFloat(caps.borrowCap || "0");
                  const totalBorrowedNum = parseFloat(
                    totalBorrowedData.totalBorrowed || "0"
                  );
                  const borrowAmount = parseFloat(amount || "0");
                  const exceedsBorrowCap =
                    borrowCapNum > 0 &&
                    totalBorrowedNum + borrowAmount > borrowCapNum + 0.01;

                  // Show borrow button
                  return (
                    <Button
                      disabled={
                        !amount ||
                        amount.trim() === "" ||
                        parseFloat(amount) === 0 ||
                        parseFloat(amount) > availableToBorrowRaw ||
                        exceedsBorrowCap ||
                        isBorrowDangerous ||
                        (isBorrowRisky && !riskAcknowledged) ||
                        isPending ||
                        isConfirming
                      }
                      w="100%"
                      fontSize="18px"
                      onClick={() => onClickBorrow(unwrapToNative)}
                      // colorPalette={isBorrowRisky ? "orange" : "blue"}
                      variant={"plain"}
                      className="btn-color-dark-1"
                    >
                      {!amount ||
                      amount.trim() === "" ||
                      parseFloat(amount) === 0
                        ? "Enter an amount"
                        : exceedsBorrowCap
                          ? "Exceeds borrow cap"
                          : parseFloat(amount) > availableToBorrowRaw
                            ? "Insufficient borrow capacity"
                            : isBorrowDangerous
                              ? "Health factor too low"
                              : `Borrow ${tokenConfig.symbol}`}
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

export default BorrowModal;
