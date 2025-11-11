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

const AssetInfo: React.FC<Props> = ({ token = "xdc" }) => {
  const queryClient = useQueryClient();
  const { tokens } = useChainConfig();
  // Local tab state - sync with token prop
  const [selectedToken, setSelectedToken] = useState<
    "wxdc" | "usdc" | "xdc" | "cgo"
  >(token as "wxdc" | "usdc" | "xdc" | "cgo");
  const [amount, setAmount] = useState("");
  const [isSupplyModal, setIsSupplyModal] = useState<boolean>(false);
  const [isSupplyDoneModal, setIsSupplyDoneModal] = useState<boolean>(false);
  const [isBorrowModal, setIsBorrowModal] = useState<boolean>(false);
  const [isBorrowDoneModal, setIsBorrowDoneModal] = useState<boolean>(false);
  const { address } = useAccount();
  const accountData = useUserAccountData();
  const supplyHook = useSupply();
  const borrowHook = useBorrow();

  // Sync selectedToken with token prop when it changes
  React.useEffect(() => {
    setSelectedToken(token as "wxdc" | "usdc" | "xdc" | "cgo");
  }, [token]);

  // Balances
  const { data: xdcBalance } = useBalance({ address });
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

  // Prices
  const { price: xdcPrice } = useAssetPrice(tokens.wrappedNative.address);
  const { price: usdcPrice } = useAssetPrice(tokens.usdc.address);
  const { price: cgoPrice } = useAssetPrice(tokens.cgo.address);

  // Derived data
  const borrowedXdc = formatValue(
    parseFloat(accountData.availableBorrows) / xdcPrice
  );
  const borrowedUsdc = formatValue(
    parseFloat(accountData.availableBorrows) / usdcPrice
  );
  const borrowedCgo = formatValue(
    parseFloat(accountData.availableBorrows) / cgoPrice
  );

  // Get reserve data (APY, etc.) for each asset
  const wxdcReserveData = useReserveData(tokens.wrappedNative.address);
  const usdcReserveData = useReserveData(tokens.usdc.address);
  const cgoReserveData = useReserveData(tokens.cgo.address);

  // Token config — depends on selected tab, not prop
  const tokenConfig = {
    xdc: {
      name: "XDC",
      symbol: "XDC",
      balance: xdcBalance?.formatted || "0",
      price: xdcPrice,
    },
    wxdc: {
      name: tokens.wrappedNative.symbol,
      symbol: tokens.wrappedNative.symbol,
      balance: wxdcBalance,
      price: xdcPrice,
    },
    usdc: {
      name: "USDC",
      symbol: "USDC",
      balance: usdcBalance,
      price: usdcPrice,
    },
    cgo: {
      name: "CGO",
      symbol: "CGO",
      balance: cgoBalance,
      price: cgoPrice,
    },
  }[selectedToken];

  const handleSupply = async () => {
    if (!address || !amount) return;
    const token =
      selectedToken === "xdc" || selectedToken === "wxdc"
        ? tokens.wrappedNative
        : tokens[selectedToken];
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
    const token =
      selectedToken === "xdc" || selectedToken === "wxdc"
        ? tokens.wrappedNative
        : tokens[selectedToken];
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

  const openSupplyModal = (tokenSymbol: "wxdc" | "usdc" | "xdc" | "cgo") => {
    setSelectedToken(tokenSymbol);
    setIsSupplyModal(true);
  };

  const openBorrowModal = (tokenSymbol: "wxdc" | "usdc" | "xdc" | "cgo") => {
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
                  openSupplyModal(
                    selectedToken as "wxdc" | "usdc" | "xdc" | "cgo"
                  )
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
                  openBorrowModal(
                    selectedToken as "wxdc" | "usdc" | "xdc" | "cgo"
                  )
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
              selectedToken === "wxdc" || selectedToken === "xdc"
                ? wxdcReserveData.supplyApy
                : selectedToken === "cgo"
                  ? cgoReserveData.supplyApy
                  : usdcReserveData.supplyApy
            }
            xdcPrice={xdcPrice}
            usdcPrice={usdcPrice}
            cgoPrice={cgoPrice}
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
              selectedToken === "xdc" || selectedToken === "wxdc"
                ? formatValue(
                    parseFloat(accountData.availableBorrows) / xdcPrice
                  )
                : selectedToken === "cgo"
                  ? formatValue(
                      parseFloat(accountData.availableBorrows) / cgoPrice
                    )
                  : formatValue(
                      parseFloat(accountData.availableBorrows) / usdcPrice
                    )
            }
            xdcPrice={xdcPrice}
            usdcPrice={usdcPrice}
            cgoPrice={cgoPrice}
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

        {token === "xdc" || token === "wxdc" ? (
          <Tabs.Root
            defaultValue={token}
            variant="plain"
            onValueChange={(val) =>
              setSelectedToken(val.value as "wxdc" | "usdc" | "xdc" | "cgo")
            }
          >
            <Tabs.List bg="bg.inverted" rounded="l3" p="1" w="100%" mb="15px">
              <Tabs.Trigger value="wxdc" w="50%" justifyContent="center">
                {tokens.wrappedNative.symbol}
              </Tabs.Trigger>
              <Tabs.Trigger value="xdc" w="50%" justifyContent="center">
                XDC
              </Tabs.Trigger>
              <Tabs.Indicator rounded="l2" />
            </Tabs.List>

            <Tabs.Content value="wxdc">
              {renderWalletSection(
                "Wallet balance",
                formatValue(parseFloat(wxdcBalance)),
                formatUsdValue(Number(wxdcBalance) * xdcPrice)
              )}
              {renderSupplyBorrow(
                formatValue(parseFloat(wxdcBalance)),
                formatValue(parseFloat(borrowedXdc))
              )}
            </Tabs.Content>

            <Tabs.Content value="xdc">
              {renderWalletSection(
                "Wallet balance",
                formatValue(parseFloat(xdcBalance?.formatted || "0")),
                formatUsdValue(Number(xdcBalance?.formatted) * xdcPrice)
              )}
              {renderSupplyBorrow(
                formatValue(parseFloat(xdcBalance?.formatted || "0")),
                formatValue(parseFloat(borrowedXdc))
              )}
            </Tabs.Content>
          </Tabs.Root>
        ) : token === "cgo" ? (
          <>
            {renderWalletSection(
              "Wallet balance",
              formatValue(parseFloat(cgoBalance)),
              formatUsdValue(Number(cgoBalance) * cgoPrice)
            )}
            {renderSupplyBorrow(
              formatValue(parseFloat(cgoBalance)),
              borrowedCgo
            )}
          </>
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
