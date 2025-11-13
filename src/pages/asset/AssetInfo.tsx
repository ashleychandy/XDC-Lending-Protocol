import { formatUsdValue, formatValue } from "@/helpers/formatValue";
import {
  NATIVE_TOKEN_ADDRESS,
  useAllWalletBalances,
} from "@/hooks/useAllWalletBalances";
import { useAssetPrice } from "@/hooks/useAssetPrice";
import { useBorrow } from "@/hooks/useBorrow";
import { useBorrowAllowance } from "@/hooks/useBorrowAllowance";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useProtocolReserveData } from "@/hooks/useProtocolReserveData";
import { useReserveCaps } from "@/hooks/useReserveCaps";
import { useSupply } from "@/hooks/useSupply";
import { useTokenAllowance } from "@/hooks/useTokenAllowance";
import { useTransactionFlow } from "@/hooks/useTransactionFlow";
import { useUserAccountData } from "@/hooks/useUserAccountData";
import { useUserReserveData } from "@/hooks/useUserReserveData";
import { Box, Button, Flex, Heading, Icon, Tabs } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { IoWalletOutline } from "react-icons/io5";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import BorrowDoneModal from "../modal/BorrowDoneModal";
import BorrowModal from "../modal/BorrowModal";
import SupplyDoneModal from "../modal/SupplyDoneModal";
import SupplyModal from "../modal/SupplyModal";

interface Props {
  token?: string;
}

const AssetInfo: React.FC<Props> = ({ token = "xdc" }) => {
  const queryClient = useQueryClient();
  const { tokens, contracts } = useChainConfig();
  // Local tab state - sync with token prop
  const [selectedToken, setSelectedToken] = useState<
    "wxdc" | "usdc" | "xdc" | "cgo"
  >(token as "wxdc" | "usdc" | "xdc" | "cgo");
  const [amount, setAmount] = useState("");
  const [isSupplyModal, setIsSupplyModal] = useState<boolean>(false);
  const [isSupplyDoneModal, setIsSupplyDoneModal] = useState<boolean>(false);
  const [isBorrowModal, setIsBorrowModal] = useState<boolean>(false);
  const [isBorrowDoneModal, setIsBorrowDoneModal] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [unwrapToNative, setUnwrapToNative] = useState<boolean>(true);
  const [isDelegationApproved, setIsDelegationApproved] =
    useState<boolean>(false);
  const { address } = useAccount();
  const accountData = useUserAccountData();
  const supplyHook = useSupply();
  const borrowHook = useBorrow();
  const { allowance: borrowAllowance, refetch: refetchBorrowAllowance } =
    useBorrowAllowance(address);

  // Get current token for allowance check
  const currentToken =
    selectedToken === "xdc" || selectedToken === "wxdc"
      ? tokens.wrappedNative
      : tokens[selectedToken];

  // Check token allowance for supply
  const { allowance, refetch: refetchAllowance } = useTokenAllowance(
    currentToken.address,
    address,
    contracts.pool
  );

  // Sync selectedToken with token prop when it changes
  React.useEffect(() => {
    setSelectedToken(token as "wxdc" | "usdc" | "xdc" | "cgo");
  }, [token]);

  // Fetch all wallet balances in a single call (replaces useBalance + 3x useTokenBalance)
  const { balances } = useAllWalletBalances();

  // Extract individual balances from the batch result
  const xdcBalance = balances[NATIVE_TOKEN_ADDRESS]?.formattedBalance || "0";
  const wxdcBalance =
    balances[tokens.wrappedNative.address]?.formattedBalance || "0";
  const usdcBalance = balances[tokens.usdc.address]?.formattedBalance || "0";
  const cgoBalance = balances[tokens.cgo.address]?.formattedBalance || "0";

  // Prices
  const { price: xdcPrice } = useAssetPrice(tokens.wrappedNative.address);
  const { price: usdcPrice } = useAssetPrice(tokens.usdc.address);
  const { price: cgoPrice } = useAssetPrice(tokens.cgo.address);

  // Use Protocol Data Provider for reserve data (includes totalAToken and totalVariableDebt)
  const wxdcReserveData = useProtocolReserveData(tokens.wrappedNative.address);
  const usdcReserveData = useProtocolReserveData(tokens.usdc.address);
  const cgoReserveData = useProtocolReserveData(tokens.cgo.address);

  // Calculate available liquidity from Protocol Data Provider data
  // Available liquidity = totalAToken - totalVariableDebt
  const wxdcLiquidity = {
    availableLiquidity: formatUnits(
      wxdcReserveData.totalAToken - wxdcReserveData.totalVariableDebt,
      tokens.wrappedNative.decimals
    ),
  };
  const usdcLiquidity = {
    availableLiquidity: formatUnits(
      usdcReserveData.totalAToken - usdcReserveData.totalVariableDebt,
      tokens.usdc.decimals
    ),
  };
  const cgoLiquidity = {
    availableLiquidity: formatUnits(
      cgoReserveData.totalAToken - cgoReserveData.totalVariableDebt,
      tokens.cgo.decimals
    ),
  };

  // Get user reserve data (supplied amounts)
  const wxdcUserData = useUserReserveData(
    tokens.wrappedNative.address,
    "" // No longer needed
  );
  const usdcUserData = useUserReserveData(tokens.usdc.address, "");
  const cgoUserData = useUserReserveData(tokens.cgo.address, "");

  // Get supply and borrow caps
  const wxdcCaps = useReserveCaps(
    tokens.wrappedNative.address,
    tokens.wrappedNative.decimals
  );
  const usdcCaps = useReserveCaps(tokens.usdc.address, tokens.usdc.decimals);
  const cgoCaps = useReserveCaps(tokens.cgo.address, tokens.cgo.decimals);

  // Extract total supplied and borrowed from Protocol Data Provider
  // (replaces useReserveSupply and useReserveBorrowed hooks)
  const wxdcSupply = {
    totalSupply: formatUnits(
      wxdcReserveData.totalAToken,
      tokens.wrappedNative.decimals
    ),
  };
  const usdcSupply = {
    totalSupply: formatUnits(usdcReserveData.totalAToken, tokens.usdc.decimals),
  };
  const cgoSupply = {
    totalSupply: formatUnits(cgoReserveData.totalAToken, tokens.cgo.decimals),
  };

  const wxdcTotalBorrowed = {
    totalBorrowed: formatUnits(
      wxdcReserveData.totalVariableDebt,
      tokens.wrappedNative.decimals
    ),
  };
  const usdcTotalBorrowed = {
    totalBorrowed: formatUnits(
      usdcReserveData.totalVariableDebt,
      tokens.usdc.decimals
    ),
  };
  const cgoTotalBorrowed = {
    totalBorrowed: formatUnits(
      cgoReserveData.totalVariableDebt,
      tokens.cgo.decimals
    ),
  };

  // Calculate available to borrow considering borrow cap and available liquidity
  const getAvailableToBorrow = (
    capStr: string,
    totalBorrowedStr: string,
    availableLiquidityStr: string,
    price: number
  ) => {
    const userAvailableInUsd = parseFloat(accountData.availableBorrows);
    const userAvailableInToken = userAvailableInUsd / price;

    const cap = parseFloat(capStr || "0");
    const totalBorrowed = parseFloat(totalBorrowedStr || "0");
    const availableLiquidity = parseFloat(availableLiquidityStr || "0");

    // Calculate remaining borrow cap
    const remainingCap = cap > 0 ? Math.max(0, cap - totalBorrowed) : Infinity;

    // Return minimum of: user capacity, remaining cap, and available liquidity
    return Math.min(userAvailableInToken, remainingCap, availableLiquidity);
  };

  const borrowedXdc = formatValue(
    getAvailableToBorrow(
      wxdcCaps.borrowCap,
      wxdcTotalBorrowed.totalBorrowed,
      wxdcLiquidity.availableLiquidity,
      xdcPrice
    )
  );
  const borrowedUsdc = formatValue(
    getAvailableToBorrow(
      usdcCaps.borrowCap,
      usdcTotalBorrowed.totalBorrowed,
      usdcLiquidity.availableLiquidity,
      usdcPrice
    )
  );
  const borrowedCgo = formatValue(
    getAvailableToBorrow(
      cgoCaps.borrowCap,
      cgoTotalBorrowed.totalBorrowed,
      cgoLiquidity.availableLiquidity,
      cgoPrice
    )
  );

  // Token config — depends on selected tab, not prop
  const tokenConfig = {
    xdc: {
      name: "XDC",
      symbol: "XDC",
      balance: xdcBalance,
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

  const handleApprove = async () => {
    if (!address || !amount) return;
    const token =
      selectedToken === "xdc" || selectedToken === "wxdc"
        ? tokens.wrappedNative
        : tokens[selectedToken];

    try {
      await supplyHook.approve(token.address);
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  const handleSupply = async () => {
    if (!address || !amount) return;
    const token =
      selectedToken === "xdc" || selectedToken === "wxdc"
        ? tokens.wrappedNative
        : tokens[selectedToken];
    try {
      await supplyHook.supply(token.address, amount, token.decimals, address);
    } catch (err) {
      console.error("Supply error:", err);
    }
  };

  // Watch approval transaction
  useTransactionFlow({
    hash: supplyHook.approveHash,
    onSuccess: () => {
      setIsApproved(true);
    },
    onError: (err) => {
      console.log("error in approval transaction", err);
    },
  });

  // Watch supply transaction
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

  const handleDelegationApprove = async () => {
    if (!address) return;

    try {
      // Approve unlimited delegation to the gateway for native token borrowing
      await borrowHook.approveDelegation();
    } catch (err) {
      console.error("Delegation approval error:", err);
    }
  };

  const handleBorrow = async (unwrapToNative: boolean = false) => {
    if (!address || !amount) return;
    const token =
      selectedToken === "xdc" || selectedToken === "wxdc"
        ? tokens.wrappedNative
        : tokens[selectedToken];

    try {
      // If borrowing as native token (XDC) and unwrap is enabled
      if (
        (selectedToken === "xdc" || selectedToken === "wxdc") &&
        unwrapToNative
      ) {
        await borrowHook.borrowNative(amount, address);
      } else {
        await borrowHook.borrow(token.address, amount, token.decimals, address);
      }
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
    setIsApproved(false);
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

  const renderSupplyBorrow = (availableNum: number, borrowedNum: number) => (
    <>
      {tokenConfig && (
        <>
          <Box mb="15px">
            <Box>Available to supply</Box>
            <Flex justifyContent="space-between" alignItems="center">
              <Flex direction="column">
                <Box>
                  {formatValue(availableNum)} {tokenConfig.symbol}
                </Box>
                <Box fontSize="13px">
                  {formatUsdValue(availableNum * tokenConfig.price)}
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
                  {formatValue(borrowedNum)} {tokenConfig.symbol}
                </Box>
                <Box fontSize="13px">
                  {formatUsdValue(borrowedNum * tokenConfig.price)}
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
        shadow="rgba(0, 0, 0, 0.05) 0px 2px 1px, rgba(0, 0, 0, 0.25) 0px 0px 1px"
        bg={"#fff"}
        border={"1px solid #eaebef"}
        borderRadius="5px"
        p="16px 24px"
      >
        {isSupplyModal && (
          <SupplyModal
            isOpen={isSupplyModal}
            onClose={() => {
              setIsSupplyModal(false);
              setAmount("");
              setIsApproved(false);
            }}
            tokenSymbol={selectedToken}
            amount={amount}
            setAmount={setAmount}
            onClickApprove={handleApprove}
            onClickSupply={handleSupply}
            isApproved={isApproved}
            isApprovePending={
              supplyHook.approveIsPending || supplyHook.approveIsConfirming
            }
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
            onClickDelegationApprove={handleDelegationApprove}
            onClickBorrow={handleBorrow}
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
        <Heading size="xl" mb="20px" className="title-text-1">
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
                parseFloat(wxdcBalance),
                parseFloat(borrowedXdc)
              )}
            </Tabs.Content>

            <Tabs.Content value="xdc">
              {renderWalletSection(
                "Wallet balance",
                formatValue(parseFloat(xdcBalance)),
                formatUsdValue(Number(xdcBalance) * xdcPrice)
              )}
              {renderSupplyBorrow(
                parseFloat(xdcBalance),
                parseFloat(borrowedXdc)
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
              parseFloat(cgoBalance),
              parseFloat(borrowedCgo)
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
              parseFloat(usdcBalance),
              parseFloat(borrowedUsdc)
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default AssetInfo;
