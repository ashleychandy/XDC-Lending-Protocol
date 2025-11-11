import { formatUsdValue, formatValue } from "@/helpers/formatValue";
import { useAssetPrice } from "@/hooks/useAssetPrice";
import { useBorrow } from "@/hooks/useBorrow";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useReserveData } from "@/hooks/useReserveData";
import { useSupply } from "@/hooks/useSupply";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useTransactionFlow } from "@/hooks/useTransactionFlow";
import { useUserAccountData } from "@/hooks/useUserAccountData";
import { Box, Button, Flex, Heading, Icon, Tabs } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { IoWalletOutline } from "react-icons/io5";
import { useAccount, useBalance } from "wagmi";
import BorrowDoneModal from "../modal/BorrowDoneModal";
import BorrowModal from "../modal/BorrowModal";
import SupplyDoneModal from "../modal/SupplyDoneModal";
import SupplyModal from "../modal/SupplyModal";

interface Props {
  token?: string;
}

const AssetInfo: React.FC<Props> = ({ token = "eth" }) => {
  const queryClient = useQueryClient();
  const { tokens } = useChainConfig();
  // Local tab state
  const [selectedToken, setSelectedToken] = useState<"weth" | "usdc" | "eth">(
    token as "weth" | "usdc" | "eth"
  );
  const [amount, setAmount] = useState("");
  const [isSupplyModal, setIsSupplyModal] = useState<boolean>(false);
  const [isSupplyDoneModal, setIsSupplyDoneModal] = useState<boolean>(false);
  const [isBorrowModal, setIsBorrowModal] = useState<boolean>(false);
  const [isBorrowDoneModal, setIsBorrowDoneModal] = useState<boolean>(false);
  const { address } = useAccount();
  const accountData = useUserAccountData();
  const supplyHook = useSupply();
  const borrowHook = useBorrow();

  // Balances
  const { data: ethBalance } = useBalance({ address });
  const { balance: wethBalance } = useTokenBalance(
    tokens.weth.address,
    tokens.weth.decimals
  );
  const { balance: usdcBalance } = useTokenBalance(
    tokens.usdc.address,
    tokens.usdc.decimals
  );

  // Prices
  const { price: ethPrice } = useAssetPrice(tokens.weth.address);
  const { price: usdcPrice } = useAssetPrice(tokens.usdc.address);

  // Derived data
  const borrowedEth = formatValue(
    parseFloat(accountData.availableBorrows) / ethPrice
  );
  const borrowedUsdc = formatValue(
    parseFloat(accountData.availableBorrows) / usdcPrice
  );

  // Get reserve data (APY, etc.) for each asset
  const wethReserveData = useReserveData(tokens.weth.address);
  const usdcReserveData = useReserveData(tokens.usdc.address);

  // Token config — depends on selected tab, not prop
  const tokenConfig = {
    eth: {
      name: "ETH",
      symbol: "ETH",
      balance: ethBalance?.formatted || "0",
      price: ethPrice,
    },
    weth: {
      name: "WETH",
      symbol: "WETH",
      balance: wethBalance,
      price: ethPrice,
    },
    usdc: {
      name: "USDC",
      symbol: "USDC",
      balance: usdcBalance,
      price: usdcPrice,
    },
  }[selectedToken];

  const handleSupply = async () => {
    if (!address || !amount) return;
    const token = selectedToken === "eth" ? tokens.weth : tokens[selectedToken];
    try {
      // First, approve the tokens
      await supplyHook.approve(token.address, amount, token.decimals);

      // Wait for approval to be confirmed (wagmi handles this automatically)
      // Then call supply
      await supplyHook.supply(token.address, amount, token.decimals, address);
    } catch (err) {
      console.error("Supply error:", err);
    }
  };

  useTransactionFlow({
    hash: supplyHook.hash,
    onSuccess: () => {
      setIsSupplyModal(false);
      setIsSupplyDoneModal(true);
      queryClient.invalidateQueries();
    },
    onError: (err) => {
      console.log("error in supply transaction", err);
      setAmount("");
    },
  });

  const handleBorrow = async () => {
    if (!address || !amount) return;
    const token = selectedToken === "eth" ? tokens.weth : tokens[selectedToken];
    try {
      await borrowHook.borrow(token.address, amount, token.decimals, address);
    } catch (err) {
      console.error("Borrow error:", err);
    }
  };

  useTransactionFlow({
    hash: borrowHook.hash,
    onSuccess: () => {
      setIsBorrowModal(false);
      setIsBorrowDoneModal(true);
      queryClient.invalidateQueries();
    },
    onError: (err) => {
      console.log("error in borrow transaction", err);
      setAmount("");
    },
  });

  const openSupplyModal = (tokenSymbol: "weth" | "usdc" | "eth") => {
    setSelectedToken(tokenSymbol);
    setIsSupplyModal(true);
  };

  const openBorrowModal = (tokenSymbol: "weth" | "usdc" | "eth") => {
    setSelectedToken(tokenSymbol);
    setIsBorrowModal(true);
  };

  const renderWalletSection = (label: string, value: string, usd: string) => (
    <Flex
      gap="3"
      alignItems="center"
      borderBottom="1px solid"
      borderColor="bg.emphasized"
      pb="25px"
      mb="15px"
    >
      <Flex
        w="42px"
        h="42px"
        borderRadius="12px"
        bg="bg.muted"
        justifyContent="center"
        alignItems="center"
      >
        <Icon size="lg">
          <IoWalletOutline />
        </Icon>
      </Flex>
      <Flex direction="column">
        <Box>{label}</Box>
        <Flex gap="2" alignItems="center">
          <Heading size="md">
            {value}{" "}
            <span style={{ fontSize: "14px" }}>{tokenConfig?.symbol}</span>
          </Heading>
        </Flex>
      </Flex>
    </Flex>
  );

  const renderSupplyBorrow = (available: string, borrowed: string) => (
    <>
      {tokenConfig && (
        <>
          <Box mb="15px">
            <Box>Available to supply</Box>
            <Flex justifyContent="space-between" alignItems="center">
              <Flex direction="column">
                <Box>
                  {available} {tokenConfig.symbol}
                </Box>
                <Box fontSize="13px">
                  {formatUsdValue(Number(available) * tokenConfig.price)}
                </Box>
              </Flex>
              <Button
                size="sm"
                onClick={() =>
                  openSupplyModal(selectedToken as "weth" | "usdc" | "eth")
                }
              >
                Supply
              </Button>
            </Flex>
          </Box>

          <Box mb="15px">
            <Box>Available to borrow</Box>
            <Flex justifyContent="space-between" alignItems="center">
              <Flex direction="column">
                <Box>
                  {borrowed} {tokenConfig.symbol}
                </Box>
                <Box fontSize="13px">
                  {formatUsdValue(Number(borrowed) * tokenConfig.price)}
                </Box>
              </Flex>
              <Button
                size="sm"
                onClick={() =>
                  openBorrowModal(selectedToken as "weth" | "usdc" | "eth")
                }
              >
                Borrow
              </Button>
            </Flex>
          </Box>
        </>
      )}
    </>
  );

  return (
    <Box width={{ base: "100%", xl: "35%" }}>
      <Box
        shadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
        borderRadius="5px"
        p="16px 24px"
      >
        {isSupplyModal && (
          <SupplyModal
            isOpen={isSupplyModal}
            onClose={() => {
              setIsSupplyModal(false);
              setAmount("");
            }}
            tokenSymbol={selectedToken}
            amount={amount}
            setAmount={setAmount}
            onClickSupply={() => {
              handleSupply();
            }}
            supplyApy={
              selectedToken === "weth"
                ? wethReserveData.supplyApy
                : usdcReserveData.supplyApy
            }
            ethPrice={ethPrice}
            usdcPrice={usdcPrice}
            isPending={supplyHook.isPending}
            isConfirming={supplyHook.isConfirming}
          />
        )}
        {isSupplyDoneModal && (
          <SupplyDoneModal
            isOpen={isSupplyDoneModal}
            onClose={() => {
              setIsSupplyDoneModal(false);
              setAmount("");
            }}
            amount={amount}
            tokenSymbol={selectedToken.toUpperCase()}
            txHash={supplyHook.hash as `0x${string}`}
          />
        )}
        {isBorrowModal && (
          <BorrowModal
            isOpen={isBorrowModal}
            onClose={() => {
              setIsBorrowModal(false);
              setAmount("");
            }}
            tokenSymbol={selectedToken}
            amount={amount}
            setAmount={setAmount}
            onClickBorrow={() => {
              handleBorrow();
            }}
            borrowedBalance={
              selectedToken === "eth" || selectedToken === "weth"
                ? formatValue(
                    parseFloat(accountData.availableBorrows) / ethPrice
                  )
                : formatValue(
                    parseFloat(accountData.availableBorrows) / usdcPrice
                  )
            }
            ethPrice={ethPrice}
            usdcPrice={usdcPrice}
            isPending={borrowHook.isPending}
            isConfirming={borrowHook.isConfirming}
          />
        )}
        {isBorrowDoneModal && (
          <BorrowDoneModal
            isOpen={isBorrowDoneModal}
            onClose={() => {
              setIsBorrowDoneModal(false);
              setAmount("");
            }}
            amount={amount}
            tokenSymbol={selectedToken.toUpperCase()}
            txHash={borrowHook.hash as `0x${string}`}
          />
        )}
        <Heading size="xl" mb="20px">
          Your info
        </Heading>

        {token === "eth" || token === "weth" ? (
          <Tabs.Root
            defaultValue={token}
            variant="plain"
            onValueChange={(val) =>
              setSelectedToken(val.value as "weth" | "usdc" | "eth")
            }
          >
            <Tabs.List bg="bg.inverted" rounded="l3" p="1" w="100%" mb="15px">
              <Tabs.Trigger value="weth" w="50%" justifyContent="center">
                WETH
              </Tabs.Trigger>
              <Tabs.Trigger value="eth" w="50%" justifyContent="center">
                ETH
              </Tabs.Trigger>
              <Tabs.Indicator rounded="l2" />
            </Tabs.List>

            <Tabs.Content value="weth">
              {renderWalletSection(
                "Wallet balance",
                formatValue(parseFloat(wethBalance)),
                formatUsdValue(Number(wethBalance) * ethPrice)
              )}
              {renderSupplyBorrow(
                formatValue(parseFloat(wethBalance)),
                formatValue(parseFloat(borrowedEth))
              )}
            </Tabs.Content>

            <Tabs.Content value="eth">
              {renderWalletSection(
                "Wallet balance",
                formatValue(parseFloat(ethBalance?.formatted || "0")),
                formatUsdValue(Number(ethBalance?.formatted) * ethPrice)
              )}
              {renderSupplyBorrow(
                formatValue(parseFloat(ethBalance?.formatted || "0")),
                formatValue(parseFloat(borrowedEth))
              )}
            </Tabs.Content>
          </Tabs.Root>
        ) : (
          <>
            {renderWalletSection(
              "Wallet balance",
              formatValue(parseFloat(usdcBalance)),
              formatUsdValue(Number(usdcBalance) * usdcPrice)
            )}
            {renderSupplyBorrow(
              formatValue(parseFloat(usdcBalance)),
              borrowedUsdc
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default AssetInfo;
