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
import wethIcon from "../../assets/images/weth.svg";
import usdcIcon from "../../assets/images/usdc.svg";
import { useAccount, useBalance } from "wagmi";
import { TOKENS } from "@/chains/arbitrum/arbHelper";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useUserAccountData } from "@/hooks/useUserAccountData";
import { getHealthFactorColor } from "@/helpers/getHealthFactorColor";
import { formatUsdValue, formatValue } from "@/helpers/formatValue";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tokenSymbol: "weth" | "usdc" | "eth";
  amount: string;
  setAmount: (value: string) => void;
  onClickSupply: () => void;
  supplyApy?: string;
  ethPrice?: number;
  usdcPrice?: number;
  isPending?: boolean;
  isConfirming?: boolean;
}

const SupplyModal: React.FC<Props> = ({
  isOpen,
  onClose,
  tokenSymbol,
  amount,
  setAmount,
  onClickSupply,
  supplyApy = "0.00",
  ethPrice = 2500,
  usdcPrice = 1,
  isPending,
  isConfirming,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { address } = useAccount();

  // Get ETH balance for native ETH
  const { data: ethBalance } = useBalance({
    address,
  });

  // Get token balances
  const { balance: wethBalance } = useTokenBalance(
    TOKENS.weth.address,
    TOKENS.weth.decimals
  );
  const { balance: usdcBalance } = useTokenBalance(
    TOKENS.usdc.address,
    TOKENS.usdc.decimals
  );

  // Get account data for health factor
  const accountData = useUserAccountData();

  // Separate display token from contract token
  // Display: Show what user selected (ETH or WETH)
  // Contract: Use WETH for both ETH and WETH
  const displayToken = tokenSymbol; // Keep original selection for display
  const contractToken = tokenSymbol === "eth" ? "weth" : tokenSymbol; // Convert ETH to WETH for contracts

  // Token configuration based on DISPLAY token (what user sees)
  const getTokenConfig = () => {
    switch (displayToken) {
      case "eth":
        return {
          name: "ETH",
          symbol: "ETH",
          icon: ethIcon,
          balance: ethBalance?.formatted || "0",
          decimals: 18,
          price: ethPrice,
        };
      case "weth":
        return {
          name: "WETH",
          symbol: "WETH",
          icon: wethIcon,
          balance: wethBalance,
          decimals: TOKENS.weth.decimals,
          price: ethPrice,
        };
      case "usdc":
        return {
          name: "USDC",
          symbol: "USDC",
          icon: usdcIcon,
          balance: usdcBalance,
          decimals: TOKENS.usdc.decimals,
          price: usdcPrice,
        };
      default:
        return {
          name: "ETH",
          symbol: "ETH",
          icon: ethIcon,
          balance: "0",
          decimals: 18,
          price: ethPrice,
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
    const currentHF = parseFloat(accountData.healthFactor);
    if (currentHF > 1000) return "∞";

    // This is a simplified calculation
    // Real calculation would need to account for the exact collateral value added
    const amountNum = parseFloat(amount || "0");
    if (amountNum === 0) return currentHF.toFixed(2);

    // Approximate increase (actual calculation is more complex)
    const increase = amountNum * 0.1; // Placeholder
    return (currentHF + increase).toFixed(2);
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
                <Dialog.Title fontSize="22px">
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
                        <Heading size="md">{tokenConfig.symbol}</Heading>
                      </Flex>
                    </Flex>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Box fontSize="sm">{getDollarValue()}</Box>
                      <Flex alignItems="center" gap="5px">
                        <Box fontSize="13px">
                          Wallet balance{" "}
                          {formatValue(parseFloat(tokenConfig.balance))}
                        </Box>

                        <Button
                          variant="plain"
                          p="0"
                          fontSize="10px"
                          minWidth="auto"
                          h="auto"
                          colorScheme="blue"
                          onClick={() => {
                            const maxAmount = parseFloat(tokenConfig.balance);
                            // Leave a small amount for gas if it's native ETH
                            const finalAmount =
                              displayToken === "eth"
                                ? Math.max(0, maxAmount - 0.01)
                                : maxAmount;
                            setAmount(formatValue(finalAmount));
                          }}
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
                      <Box fontSize="sm">Supply APY</Box>
                      <Box fontSize="sm" fontWeight="semibold">
                        {supplyApy}%
                      </Box>
                    </Flex>
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      mb="15px"
                    >
                      <Box fontSize="sm">Collateralization</Box>
                      <Box
                        color="green.600"
                        fontSize="sm"
                        fontWeight="semibold"
                      >
                        Enabled
                      </Box>
                    </Flex>
                    <Flex justifyContent="space-between" gap="7px">
                      <Box fontSize="sm">Health factor</Box>
                      <Box textAlign="right">
                        <Flex
                          gap="5px"
                          alignItems="center"
                          justifyContent="end"
                        >
                          <Box fontSize="sm">
                            {healthFactorValue > 1000
                              ? "∞"
                              : healthFactorValue.toFixed(2)}
                          </Box>
                          <Box fontSize="sm">→</Box>
                          <Box color={healthFactorColor} fontWeight="semibold">
                            {getNewHealthFactor()}
                          </Box>
                        </Flex>
                        <Box fontSize="12px">{`Liquidation at < 1.0`}</Box>
                      </Box>
                    </Flex>
                  </Box>
                </Box>
                <Flex mt="20px" alignItems="center" gap="5px">
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
                    isPending ||
                    isConfirming
                  }
                  w="100%"
                  fontSize="18px"
                  onClick={onClickSupply}
                  colorScheme="blue"
                >
                  {!amount || amount.trim() === "" || parseFloat(amount) === 0
                    ? "Enter an amount"
                    : `Supply ${tokenConfig.symbol}`}
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
