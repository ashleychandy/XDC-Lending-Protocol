import FormattedCounter from "@/components/ui/Counter/FormattedCounter";
import { getTokenLogo } from "@/config/tokenLogos";
import { formatValue } from "@/helpers/formatValue";
import { getHealthFactorColor } from "@/helpers/getHealthFactorColor";
import { useAssetPrice } from "@/hooks/useAssetPrice";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useReserveData } from "@/hooks/useReserveData";
import { useUserAccountData } from "@/hooks/useUserAccountData";
import { useUserReserveData } from "@/hooks/useUserReserveData";
import { Box, Button, Dialog, Flex, Icon, Portal } from "@chakra-ui/react";
import { IoMdClose } from "react-icons/io";
import { MdLocalGasStation } from "react-icons/md";
import { formatUnits } from "viem";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tokenSymbol: "wxdc" | "usdc" | "cgo";
  currentCollateralStatus: boolean;
  onConfirm: () => void;
  isPending?: boolean;
  isConfirming?: boolean;
}

const CollateralModal: React.FC<Props> = ({
  isOpen,
  onClose,
  tokenSymbol,
  currentCollateralStatus,
  onConfirm,
  isPending,
  isConfirming,
}) => {
  const { tokens } = useChainConfig();
  const accountData = useUserAccountData();

  // Get token configuration
  const token =
    tokenSymbol === "wxdc"
      ? tokens.wrappedNative
      : tokens[tokenSymbol as "usdc" | "cgo"];

  // Fetch required data
  const reserveData = useReserveData(token.address);
  const userReserveData = useUserReserveData(
    token.address,
    reserveData.aTokenAddress
  );
  const { price: tokenPrice } = useAssetPrice(token.address);

  const tokenConfig = {
    symbol: token.symbol,
    icon: getTokenLogo(token.symbol),
    price: tokenPrice,
  };

  // Calculate new health factor after toggling collateral
  const getNewHealthFactor = () => {
    const currentCollateralUsd = parseFloat(accountData.totalCollateral);
    const currentDebtUsd = parseFloat(accountData.totalDebt);
    const avgLiquidationThreshold = parseFloat(
      accountData.currentLiquidationThreshold
    );
    const suppliedAmount = parseFloat(
      formatUnits(userReserveData.suppliedAmount as bigint, token.decimals)
    );
    const suppliedValueUsd = suppliedAmount * tokenPrice;

    // If no debt, health factor is infinite
    if (currentDebtUsd === 0 || currentDebtUsd < 0.01) {
      return "∞";
    }

    let newTotalCollateral: number;

    if (currentCollateralStatus) {
      // Disabling collateral - subtract this asset's value
      newTotalCollateral = Math.max(0, currentCollateralUsd - suppliedValueUsd);
    } else {
      // Enabling collateral - add this asset's value
      newTotalCollateral = currentCollateralUsd + suppliedValueUsd;
    }

    // If no collateral left but still have debt, HF = 0
    if (newTotalCollateral === 0 || newTotalCollateral < 0.01) {
      return "0.00";
    }

    // Calculate new health factor
    const healthFactor =
      (newTotalCollateral * avgLiquidationThreshold) / 100 / currentDebtUsd;

    return healthFactor > 1000 ? "∞" : healthFactor.toFixed(2);
  };

  const healthFactorValue = parseFloat(accountData.healthFactor);
  const newHealthFactorValue = parseFloat(getNewHealthFactor());

  // Check if disabling collateral would make health factor too low
  const isActionRisky =
    currentCollateralStatus &&
    newHealthFactorValue < 1.5 &&
    newHealthFactorValue !== Infinity;
  const isActionDangerous =
    currentCollateralStatus &&
    newHealthFactorValue < 1.05 &&
    newHealthFactorValue !== Infinity;

  const actionText = currentCollateralStatus ? "Disabling" : "Enabling";
  const buttonText = currentCollateralStatus ? "Disable" : "Enable";

  return (
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
                {buttonText} {tokenConfig.symbol} as collateral
              </Dialog.Title>
              <Dialog.CloseTrigger asChild pos="static">
                <Icon size="xl" cursor="pointer">
                  <IoMdClose />
                </Icon>
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body>
              {/* Warning message for disabling collateral */}
              {currentCollateralStatus && (
                <Box
                  p="12px"
                  bg="rgba(255, 165, 0, 0.05)"
                  border="1px solid rgba(255, 165, 0, 0.2)"
                  borderRadius="6px"
                  mb="15px"
                >
                  <Box fontSize="sm" color="orange.600">
                    {actionText} this asset as collateral affects your borrowing
                    power and Health Factor.
                  </Box>
                </Box>
              )}

              {/* Info message for enabling collateral */}
              {!currentCollateralStatus && (
                <Box
                  p="12px"
                  bg="rgba(0, 128, 0, 0.05)"
                  border="1px solid rgba(0, 128, 0, 0.2)"
                  borderRadius="6px"
                  mb="15px"
                >
                  <Box fontSize="sm" color="green.600">
                    {actionText} this asset as collateral will increase your
                    borrowing power and Health Factor.
                  </Box>
                </Box>
              )}

              {/* Risk Warning for dangerous actions */}
              {isActionDangerous && (
                <Box
                  p="12px"
                  bg="rgba(255, 0, 0, 0.05)"
                  border="1px solid rgba(255, 0, 0, 0.2)"
                  borderRadius="6px"
                  mb="15px"
                >
                  <Box fontSize="sm" color="red.600" fontWeight="semibold">
                    ⚠️ Warning: This action will significantly reduce your
                    health factor and may result in immediate liquidation!
                  </Box>
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
                      Supply balance
                    </Box>
                    <Flex alignItems="center" gap="5px">
                      <Box
                        fontSize="sm"
                        fontWeight="semibold"
                        className="title-text-1"
                      >
                        <FormattedCounter
                          value={formatValue(
                            parseFloat(
                              formatUnits(
                                userReserveData.suppliedAmount as bigint,
                                token.decimals
                              )
                            )
                          )}
                          fontSize={14}
                          textColor="#000"
                        />
                      </Box>
                      <Box fontSize="sm" className="title-text-1">
                        {tokenConfig.symbol}
                      </Box>
                    </Flex>
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
                          fontSize="sm"
                          fontWeight="semibold"
                        >
                          {newHealthFactorValue > 1000
                            ? "∞"
                            : newHealthFactorValue.toFixed(2)}
                        </Box>
                      </Flex>
                      <Box fontSize="xs" className="light-text-2" mt="2px">
                        Liquidation at &lt;1.0
                      </Box>
                    </Box>
                  </Flex>
                </Box>
              </Box>
            </Dialog.Body>

            <Dialog.Footer>
              <Flex direction="column" w="100%" gap="10px">
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  fontSize="sm"
                  className="light-text-2"
                >
                  <Flex alignItems="center" gap="5px">
                    <Icon size="sm">
                      <MdLocalGasStation />
                    </Icon>
                    <Box>Gas fee</Box>
                  </Flex>
                  <Box>~$0.01</Box>
                </Flex>
                <Button
                  w="100%"
                  colorPalette={isActionDangerous ? "red" : "green"}
                  onClick={onConfirm}
                  disabled={isPending || isConfirming || isActionDangerous}
                  loading={isPending || isConfirming}
                >
                  {isPending || isConfirming
                    ? "Processing..."
                    : isActionDangerous
                      ? "Health factor too low"
                      : `${buttonText} as collateral`}
                </Button>
              </Flex>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default CollateralModal;
