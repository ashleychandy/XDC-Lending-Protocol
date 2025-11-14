import { getTokenLogo } from "@/config/tokenLogos";
import { formatUsdValue, formatValue } from "@/helpers/formatValue";
import { getHealthFactorColor } from "@/helpers/getHealthFactorColor";
import { useAssetPrice } from "@/hooks/useAssetPrice";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useReserveCaps } from "@/hooks/useReserveCaps";
import { useReserveData } from "@/hooks/useReserveData";
import { useReserveSupply } from "@/hooks/useReserveSupply";
import { useTokenAllowance } from "@/hooks/useTokenAllowance";
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
} from "@chakra-ui/react";
import { useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { MdLocalGasStation } from "react-icons/md";
import { useAccount, useBalance } from "wagmi";
import usdcIcon from "../../assets/images/usdc.svg";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tokenSymbol: "wxdc" | "usdc" | "xdc" | "cgo";
  amount: string;
  setAmount: (value: string) => void;
  onClickApprove: () => void;
  onClickSupply: () => void;
  isApproved: boolean;
  isApprovePending: boolean;
  isPending?: boolean;
  isConfirming?: boolean;
}

const SupplyModal: React.FC<Props> = ({
  isOpen,
  onClose,
  tokenSymbol,
  amount,
  setAmount,
  onClickApprove,
  onClickSupply,
  isApproved,
  isApprovePending,
  isPending,
  isConfirming,
}) => {
  const { tokens, network, contracts } = useChainConfig();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { address } = useAccount();

  // Get token configuration
  const token =
    tokenSymbol === "xdc" || tokenSymbol === "wxdc"
      ? tokens.wrappedNative
      : tokens[tokenSymbol as "usdc" | "cgo"];

  // Fetch all required data
  const accountData = useUserAccountData();
  const { price: tokenPrice } = useAssetPrice(token.address);
  const caps = useReserveCaps(token.address, token.decimals);
  const reserveData = useReserveData(token.address);
  const supplyData = useReserveSupply(
    reserveData.aTokenAddress,
    token.decimals
  );
  const { allowance } = useTokenAllowance(
    token.address,
    address,
    contracts.pool
  );

  // Get asset prices
  const { price: xdcPrice } = useAssetPrice(tokens.wrappedNative.address);
  const { price: usdcPrice } = useAssetPrice(tokens.usdc.address);
  const { price: cgoPrice } = useAssetPrice(tokens.cgo.address);

  // Get native token info
  const nativeTokenSymbol = network.nativeToken.symbol;
  const wrappedTokenSymbol = tokens.wrappedNative.symbol;

  // Get XDC balance for native XDC
  const { data: xdcBalance } = useBalance({
    address,
  });

  // Get token balances
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

  // Get supply cap and total supplied
  const supplyCap = caps.supplyCap || "0";
  const totalSupplied = supplyData.totalSupply || "0";
  const supplyApy = reserveData.supplyApy;

  // Separate display token from contract token
  // Display: Show what user selected (XDC or WXDC)
  // Contract: Use WXDC for both XDC and WXDC
  const displayToken = tokenSymbol; // Keep original selection for display
  const contractToken = tokenSymbol === "xdc" ? "wxdc" : tokenSymbol; // Convert XDC to WXDC for contracts

  // Token configuration based on DISPLAY token (what user sees)
  const getTokenConfig = () => {
    switch (displayToken) {
      case "xdc":
        return {
          name: nativeTokenSymbol,
          symbol: nativeTokenSymbol,
          icon: getTokenLogo(nativeTokenSymbol),
          balance: xdcBalance?.formatted || "0",
          decimals: 18,
          price: xdcPrice,
        };
      case "wxdc":
        return {
          name: wrappedTokenSymbol,
          symbol: wrappedTokenSymbol,
          icon: getTokenLogo(wrappedTokenSymbol),
          balance: wxdcBalance,
          decimals: tokens.wrappedNative.decimals,
          price: xdcPrice,
        };
      case "usdc":
        return {
          name: "USDC",
          symbol: "USDC",
          icon: usdcIcon,
          balance: usdcBalance,
          decimals: tokens.usdc.decimals,
          price: usdcPrice,
        };
      case "cgo":
        return {
          name: "CGO",
          symbol: "CGO",
          icon: getTokenLogo("CGO"),
          balance: cgoBalance,
          decimals: tokens.cgo.decimals,
          price: cgoPrice,
        };
      default:
        return {
          name: nativeTokenSymbol,
          symbol: nativeTokenSymbol,
          icon: getTokenLogo(nativeTokenSymbol),
          balance: "0",
          decimals: 18,
          price: xdcPrice,
        };
    }
  };

  const tokenConfig = getTokenConfig();

  // Calculate dollar value (placeholder - you can integrate with price oracle)
  const getDollarValue = () => {
    if (!amount || amount === "0") return "$0.00";
    const amountNum = parseFloat(amount);
    return formatUsdValue(amountNum * tokenConfig.price);
  };

  // Calculate new health factor after supply
  const getNewHealthFactor = () => {
    const amountNum = parseFloat(amount || "0");
    if (amountNum === 0) {
      const currentHF = parseFloat(accountData.healthFactor);
      return currentHF > 1000 ? "∞" : currentHF.toFixed(2);
    }

    const supplyValueUsd = amountNum * tokenConfig.price;
    const currentCollateralUsd = parseFloat(accountData.totalCollateral);
    const currentDebtUsd = parseFloat(accountData.totalDebt);
    // avgLiquidationThreshold is already in percentage (e.g., 80 for 80%)
    const avgLiquidationThreshold = parseFloat(
      accountData.currentLiquidationThreshold
    );

    // If no debt, health factor is infinite
    if (currentDebtUsd === 0 || currentDebtUsd < 0.01) {
      return "∞";
    }

    // Assume asset has 80% liquidation threshold
    // In production, this should be fetched from reserve configuration
    const assetLiquidationThreshold = 80; // 80%

    // Calculate new weighted average liquidation threshold
    const newTotalCollateral = currentCollateralUsd + supplyValueUsd;
    const newAvgLiquidationThreshold =
      newTotalCollateral > 0
        ? (currentCollateralUsd * avgLiquidationThreshold +
            supplyValueUsd * assetLiquidationThreshold) /
          newTotalCollateral
        : avgLiquidationThreshold;

    // Calculate new health factor
    // HF = (collateral * liquidationThreshold%) / debt
    const healthFactor =
      (newTotalCollateral * newAvgLiquidationThreshold) / 100 / currentDebtUsd;

    return healthFactor > 1000 ? "∞" : healthFactor.toFixed(2);
  };

  const healthFactorValue = parseFloat(accountData.healthFactor);
  const healthFactorColor = getHealthFactorColor(healthFactorValue);

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
                <Dialog.Title fontSize="22px" className="title-text-1">
                  Supply {tokenConfig.symbol}
                </Dialog.Title>
                <Dialog.CloseTrigger asChild pos="static">
                  <Icon size="xl" cursor="pointer">
                    <IoMdClose />
                  </Icon>
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>
                <Box mb="15px">
                  <Box mb="7px" className="light-text-2">
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
                            if (/^\d*\.?\d*$/.test(input)) setAmount(input);
                          }}
                        />
                      </InputGroup>
                      <Flex gap="8px" alignItems="center">
                        <Image
                          src={tokenConfig.icon}
                          width="24px"
                          height="24px"
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
                          Wallet balance{" "}
                          {formatValue(parseFloat(tokenConfig.balance))}
                        </Box>

                        <Button
                          variant="plain"
                          p="0"
                          fontSize="10px"
                          minWidth="auto"
                          h="auto"
                          className="title-text-1"
                          onClick={() => {
                            const walletBalance = parseFloat(
                              tokenConfig.balance
                            );
                            const supplyCapNum = parseFloat(supplyCap);
                            const totalSuppliedNum = parseFloat(totalSupplied);

                            // Calculate remaining capacity
                            // Subtract a small amount (0.01) to account for rounding errors
                            const remainingCapacity =
                              supplyCapNum > 0
                                ? Math.max(
                                    0,
                                    supplyCapNum - totalSuppliedNum - 0.01
                                  )
                                : walletBalance; // If no cap, use wallet balance

                            // Take minimum of wallet balance and remaining capacity
                            let maxAmount = Math.min(
                              walletBalance,
                              remainingCapacity
                            );

                            // Leave a small amount for gas if it's native XDC
                            const finalAmount =
                              displayToken === "xdc"
                                ? Math.max(0, maxAmount - 0.01)
                                : maxAmount;

                            // Don't use formatValue here - it adds commas which break decimal parsing
                            setAmount(finalAmount.toString());
                          }}
                        >
                          MAX
                        </Button>
                      </Flex>
                    </Flex>
                  </Box>
                </Box>
                <Box>
                  <Box mb="7px" className="light-text-2">
                    Transaction overview
                  </Box>
                  <Box p="12px" border="1px solid #eaebef" borderRadius="6px">
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      mb="15px"
                    >
                      <Box fontSize="sm" className="title-text-1">
                        Supply APY
                      </Box>
                      <Box
                        fontSize="sm"
                        fontWeight="semibold"
                        className="title-text-1"
                      >
                        {supplyApy}%
                      </Box>
                    </Flex>
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      mb="15px"
                    >
                      <Box fontSize="sm" className="title-text-1">
                        Collateralization
                      </Box>
                      <Box
                        color="green.600"
                        fontSize="sm"
                        fontWeight="semibold"
                      >
                        Enabled
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
                          justifyContent="end"
                        >
                          <Box fontSize="sm" className="title-text-1">
                            {healthFactorValue > 1000
                              ? "∞"
                              : healthFactorValue.toFixed(2)}
                          </Box>
                          <Box fontSize="sm" className="light-text-2">
                            →
                          </Box>
                          <Box color={healthFactorColor} fontWeight="semibold">
                            {getNewHealthFactor()}
                          </Box>
                        </Flex>
                        <Box
                          fontSize="12px"
                          className="light-text-2"
                        >{`Liquidation at < 1.0`}</Box>
                      </Box>
                    </Flex>
                  </Box>
                </Box>
                <Flex mt="20px" alignItems="center" gap="5px">
                  <MdLocalGasStation size="16px" className="light-text-2" />
                  <Box fontSize="sm" className="title-text-1">
                    ~$0.0001 (12.5 Gwei)
                  </Box>
                </Flex>
              </Dialog.Body>
              <Dialog.Footer>
                {(() => {
                  // Check if supply would exceed cap
                  const supplyCapNum = parseFloat(supplyCap || "0");
                  const totalSuppliedNum = parseFloat(totalSupplied || "0");
                  const supplyAmount = parseFloat(amount || "0");

                  // Only check cap if it's set (> 0)
                  // Cap of 0 means unlimited
                  // Add small buffer (0.01) to account for rounding errors
                  const exceedsSupplyCap =
                    supplyCapNum > 0 &&
                    totalSuppliedNum + supplyAmount > supplyCapNum + 0.01;

                  // For native token (XDC), no approval needed
                  if (tokenSymbol === "xdc") {
                    return (
                      <Button
                        disabled={
                          !amount ||
                          amount.trim() === "" ||
                          parseFloat(amount) === 0 ||
                          exceedsSupplyCap ||
                          isPending ||
                          isConfirming
                        }
                        w="100%"
                        fontSize="18px"
                        onClick={onClickSupply}
                        variant={"plain"}
                        className="btn-color-dark-1"
                        loading={isPending || isConfirming}
                      >
                        {!amount ||
                        amount.trim() === "" ||
                        parseFloat(amount) === 0
                          ? "Enter an amount"
                          : exceedsSupplyCap
                            ? "Exceeds supply cap"
                            : `Supply ${tokenConfig.symbol}`}
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
                        exceedsSupplyCap ||
                        isPending ||
                        isConfirming ||
                        isApprovePending
                      }
                      w="100%"
                      variant={"plain"}
                      className="btn-color-dark-1"
                      fontSize="18px"
                      onClick={needsApproval ? onClickApprove : onClickSupply}
                      loading={isApprovePending || isPending || isConfirming}
                    >
                      {!amount ||
                      amount.trim() === "" ||
                      parseFloat(amount) === 0
                        ? "Enter an amount"
                        : exceedsSupplyCap
                          ? "Exceeds supply cap"
                          : needsApproval
                            ? `Approve ${tokenConfig.symbol}`
                            : `Supply ${tokenConfig.symbol}`}
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

export default SupplyModal;
