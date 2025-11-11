import { getTokenLogo } from "@/config/tokenLogos";
import { formatUsdValue, formatValue } from "@/helpers/formatValue";
import { useAssetPrice } from "@/hooks/useAssetPrice";
import { useBorrow } from "@/hooks/useBorrow";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useRepay } from "@/hooks/useRepay";
import { useReserveData } from "@/hooks/useReserveData";
import { useTransactionFlow } from "@/hooks/useTransactionFlow";
import { useUserAccountData } from "@/hooks/useUserAccountData";
import { useUserReserveData } from "@/hooks/useUserReserveData";
import { buildAssetDetailsRoute } from "@/routes/paths";
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Image,
  Table,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import usdcIcon from "../assets/images/usdc.svg";
import BorrowDoneModal from "./modal/BorrowDoneModal";
import BorrowModal from "./modal/BorrowModal";
import RepayDoneModal from "./modal/RepayDoneModal";
import RepayModal from "./modal/RepayModal";

function BorrowContent() {
  const queryClient = useQueryClient();
  const { tokens, network, contracts } = useChainConfig();
  const [selectedToken, setSelectedToken] = useState<
    "wxdc" | "usdc" | "xdc" | "cgo"
  >("wxdc");

  // Get native token symbol (XDC, XDC, etc.)
  const nativeTokenSymbol = network.nativeToken.symbol;

  // Get token logo dynamically
  const wrappedTokenLogo = getTokenLogo(tokens.wrappedNative.symbol);
  const [amount, setAmount] = useState("");
  const [isBorrowModal, setIsBorrowModal] = useState<boolean>(false);
  const [isBorrowDoneModal, setIsBorrowDoneModal] = useState<boolean>(false);
  const [isRepayModal, setIsRepayModal] = useState<boolean>(false);
  const [isRepayDoneModal, setIsRepayDoneModal] = useState<boolean>(false);
  const [unwrapToNative, setUnwrapToNative] = useState<boolean>(true);
  const [useNativeForRepay, setUseNativeForRepay] = useState<boolean>(false);

  // Sorting state for Your Borrows table
  const [borrowsSortField, setBorrowsSortField] = useState<
    "apy" | "debt" | null
  >(null);
  const [borrowsSortDirection, setBorrowsSortDirection] = useState<
    "asc" | "desc"
  >("desc");

  // Sorting state for Assets to Borrow table
  const [assetsSortField, setAssetsSortField] = useState<
    "apy" | "available" | null
  >(null);
  const [assetsSortDirection, setAssetsSortDirection] = useState<
    "asc" | "desc"
  >("desc");

  const navigate = useNavigate();
  const { address } = useAccount();
  const borrowHook = useBorrow();
  const repayHook = useRepay();
  const accountData = useUserAccountData();

  const { price: xdcPrice } = useAssetPrice(tokens.wrappedNative.address);
  const { price: usdcPrice } = useAssetPrice(tokens.usdc.address);
  const { price: cgoPrice } = useAssetPrice(tokens.cgo.address);

  const wxdcReserveData = useReserveData(tokens.wrappedNative.address);
  const usdcReserveData = useReserveData(tokens.usdc.address);
  const cgoReserveData = useReserveData(tokens.cgo.address);

  const wxdcUserData = useUserReserveData(
    tokens.wrappedNative.address,
    wxdcReserveData.aTokenAddress
  );

  const usdcUserData = useUserReserveData(
    tokens.usdc.address,
    usdcReserveData.aTokenAddress
  );

  const cgoUserData = useUserReserveData(
    tokens.cgo.address,
    cgoReserveData.aTokenAddress
  );

  const wxdcBorrowed = formatUnits(
    wxdcUserData.borrowedAmount as bigint,
    tokens.wrappedNative.decimals
  );

  const usdcBorrowed = formatUnits(
    usdcUserData.borrowedAmount as bigint,
    tokens.usdc.decimals
  );

  const cgoBorrowed = formatUnits(
    cgoUserData.borrowedAmount as bigint,
    tokens.cgo.decimals
  );

  const borrowPowerUsed =
    parseFloat(accountData.totalCollateral) > 0
      ? (
          (parseFloat(accountData.totalDebt) /
            (parseFloat(accountData.totalCollateral) *
              (parseFloat(accountData.ltv) / 100))) *
          100
        ).toFixed(2)
      : "0.00";

  const totalBorrowedUsd =
    parseFloat(wxdcBorrowed) * xdcPrice +
    parseFloat(usdcBorrowed) * usdcPrice +
    parseFloat(cgoBorrowed) * cgoPrice;
  const weightedBorrowApy =
    totalBorrowedUsd > 0
      ? (
          (parseFloat(wxdcBorrowed) *
            xdcPrice *
            parseFloat(wxdcReserveData.borrowApy) +
            parseFloat(usdcBorrowed) *
              usdcPrice *
              parseFloat(usdcReserveData.borrowApy) +
            parseFloat(cgoBorrowed) *
              cgoPrice *
              parseFloat(cgoReserveData.borrowApy)) /
          totalBorrowedUsd
        ).toFixed(2)
      : "0.00";

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
        // Check if gateway is configured
        if (
          contracts.wrappedTokenGateway ===
          "0x0000000000000000000000000000000000000000"
        ) {
          console.error("Wrapped token gateway not configured for this chain");
          return;
        }
        await borrowHook.borrowNative(amount, address);
      } else {
        // Standard borrow
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

  const handleRepay = async (useNative: boolean = false) => {
    if (!address || !amount) return;
    const token =
      selectedToken === "xdc" || selectedToken === "wxdc"
        ? tokens.wrappedNative
        : tokens[selectedToken];

    try {
      // If repaying with native token (XDC)
      if ((selectedToken === "xdc" || selectedToken === "wxdc") && useNative) {
        // Check if gateway is configured
        if (
          contracts.wrappedTokenGateway ===
          "0x0000000000000000000000000000000000000000"
        ) {
          console.error("Wrapped token gateway not configured for this chain");
          return;
        }
        await repayHook.repayNative(amount, address);
      } else {
        // Standard ERC20 flow: approve then repay
        // First, approve the tokens and wait for confirmation
        await repayHook.approve(token.address, amount, token.decimals);

        // Then call repay (writeContractAsync waits for user confirmation)
        await repayHook.repay(token.address, amount, token.decimals, address);
      }
    } catch (err) {
      console.error("Repay error:", err);
    }
  };

  useTransactionFlow({
    hash: repayHook.hash,
    onSuccess: () => {
      setIsRepayModal(false);
      setIsRepayDoneModal(true);
      queryClient.invalidateQueries();
    },
    onError: (err) => {
      console.log("error in repay transaction", err);
      setAmount("");
    },
  });

  const openBorrowModal = (tokenSymbol: "wxdc" | "usdc" | "xdc" | "cgo") => {
    setSelectedToken(tokenSymbol);
    setIsBorrowModal(true);
  };

  const openRepayModal = (tokenSymbol: "wxdc" | "usdc" | "xdc" | "cgo") => {
    setSelectedToken(tokenSymbol);
    setIsRepayModal(true);
  };

  const yourBorrowsBase = [
    {
      id: 1,
      name: "USDC",
      symbol: "usdc",
      debt: formatValue(parseFloat(usdcBorrowed)),
      dollarDebt: `${formatUsdValue(parseFloat(usdcBorrowed) * usdcPrice)}`,
      apy: `${usdcReserveData.borrowApy}%`,
      img: usdcIcon,
      actualAmount: usdcUserData.borrowedAmount,
      apyValue: parseFloat(usdcReserveData.borrowApy),
      debtValue: parseFloat(usdcBorrowed) * usdcPrice,
    },
    {
      id: 2,
      name: tokens.wrappedNative.symbol, // WXDC
      symbol: "wxdc",
      debt: formatValue(parseFloat(wxdcBorrowed)),
      dollarDebt: `${formatUsdValue(parseFloat(wxdcBorrowed) * xdcPrice)}`,
      apy: `${wxdcReserveData.borrowApy}%`,
      img: wrappedTokenLogo,
      actualAmount: wxdcUserData.borrowedAmount,
      apyValue: parseFloat(wxdcReserveData.borrowApy),
      debtValue: parseFloat(wxdcBorrowed) * xdcPrice,
    },
    {
      id: 3,
      name: "CGO",
      symbol: "cgo",
      debt: formatValue(parseFloat(cgoBorrowed)),
      dollarDebt: `${formatUsdValue(parseFloat(cgoBorrowed) * cgoPrice)}`,
      apy: `${cgoReserveData.borrowApy}%`,
      img: getTokenLogo("CGO"),
      actualAmount: cgoUserData.borrowedAmount,
      apyValue: parseFloat(cgoReserveData.borrowApy),
      debtValue: parseFloat(cgoBorrowed) * cgoPrice,
    },
  ].filter((item) => (item.actualAmount as bigint) > BigInt(0));

  // Sorted your borrows
  const yourBorrows = useMemo(() => {
    if (!borrowsSortField) return yourBorrowsBase;

    return [...yourBorrowsBase].sort((a, b) => {
      let comparison = 0;

      if (borrowsSortField === "apy") {
        comparison = a.apyValue - b.apyValue;
      } else if (borrowsSortField === "debt") {
        comparison = a.debtValue - b.debtValue;
      }

      return borrowsSortDirection === "asc" ? comparison : -comparison;
    });
  }, [yourBorrowsBase, borrowsSortField, borrowsSortDirection]);

  // Assets to Borrow
  const assetsToBorrowBase = [
    {
      id: 1,
      name: tokens.wrappedNative.symbol, // WXDC
      symbol: "wxdc",
      available: formatValue(
        parseFloat(accountData.availableBorrows) / xdcPrice
      ),
      dollarAvailable: `${formatUsdValue(
        parseFloat(accountData.availableBorrows)
      )}`,
      apy: `${wxdcReserveData.borrowApy}%`,
      img: wrappedTokenLogo,
      apyValue: parseFloat(wxdcReserveData.borrowApy),
      availableValue: parseFloat(accountData.availableBorrows) / xdcPrice,
    },
    {
      id: 2,
      name: "USDC",
      symbol: "usdc",
      available: formatValue(
        parseFloat(accountData.availableBorrows) / usdcPrice
      ),
      dollarAvailable: `${formatUsdValue(
        parseFloat(accountData.availableBorrows)
      )}`,
      apy: `${usdcReserveData.borrowApy}%`,
      img: usdcIcon,
      apyValue: parseFloat(usdcReserveData.borrowApy),
      availableValue: parseFloat(accountData.availableBorrows) / usdcPrice,
    },
    {
      id: 3,
      name: "CGO",
      symbol: "cgo",
      available: formatValue(
        parseFloat(accountData.availableBorrows) / cgoPrice
      ),
      dollarAvailable: `${formatUsdValue(
        parseFloat(accountData.availableBorrows)
      )}`,
      apy: `${cgoReserveData.borrowApy}%`,
      img: getTokenLogo("CGO"),
      apyValue: parseFloat(cgoReserveData.borrowApy),
      availableValue: parseFloat(accountData.availableBorrows) / cgoPrice,
    },
  ];

  // Sorted assets to borrow
  const assetsToBorrow = useMemo(() => {
    if (!assetsSortField) return assetsToBorrowBase;

    return [...assetsToBorrowBase].sort((a, b) => {
      let comparison = 0;

      if (assetsSortField === "apy") {
        comparison = a.apyValue - b.apyValue;
      } else if (assetsSortField === "available") {
        comparison = a.availableValue - b.availableValue;
      }

      return assetsSortDirection === "asc" ? comparison : -comparison;
    });
  }, [assetsToBorrowBase, assetsSortField, assetsSortDirection]);

  // Handle column header click for sorting - Your Borrows
  const handleBorrowsSort = (field: "apy" | "debt") => {
    if (borrowsSortField === field) {
      if (borrowsSortDirection === "desc") {
        setBorrowsSortDirection("asc");
      } else {
        setBorrowsSortField(null);
        setBorrowsSortDirection("desc");
      }
    } else {
      setBorrowsSortField(field);
      setBorrowsSortDirection("desc");
    }
  };

  // Handle column header click for sorting - Assets to Borrow
  const handleAssetsSort = (field: "apy" | "available") => {
    if (assetsSortField === field) {
      if (assetsSortDirection === "desc") {
        setAssetsSortDirection("asc");
      } else {
        setAssetsSortField(null);
        setAssetsSortDirection("desc");
      }
    } else {
      setAssetsSortField(field);
      setAssetsSortDirection("desc");
    }
  };

  // Get sort icon for column header - Your Borrows
  const getBorrowsSortIcon = (field: "apy" | "debt") => {
    if (borrowsSortField !== field) {
      return <FaSort />;
    }
    return borrowsSortDirection === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  // Get sort icon for column header - Assets to Borrow
  const getAssetsSortIcon = (field: "apy" | "available") => {
    if (assetsSortField !== field) {
      return <FaSort />;
    }
    return assetsSortDirection === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  return (
    <Box width={{ base: "100%", lg: "50%" }}>
      {isBorrowModal && (
        <BorrowModal
          isOpen={isBorrowModal}
          onClose={() => {
            setIsBorrowModal(false);
            setAmount("");
            setUnwrapToNative(true);
          }}
          tokenSymbol={selectedToken}
          amount={amount}
          setAmount={setAmount}
          onClickBorrow={() => {
            handleBorrow(unwrapToNative);
          }}
          borrowedBalance={
            selectedToken === "xdc" || selectedToken === "wxdc"
              ? formatValue(parseFloat(accountData.availableBorrows) / xdcPrice)
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
          unwrapToNative={unwrapToNative}
          setUnwrapToNative={setUnwrapToNative}
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
      {isRepayModal && (
        <RepayModal
          isOpen={isRepayModal}
          onClose={() => {
            setIsRepayModal(false);
            setAmount("");
            setUseNativeForRepay(false);
          }}
          tokenSymbol={selectedToken}
          amount={amount}
          setAmount={setAmount}
          onClickRepay={() => {
            handleRepay(useNativeForRepay);
          }}
          borrowedAmount={
            selectedToken === "xdc" || selectedToken === "wxdc"
              ? wxdcBorrowed
              : selectedToken === "cgo"
                ? cgoBorrowed
                : usdcBorrowed
          }
          xdcPrice={xdcPrice}
          usdcPrice={usdcPrice}
          cgoPrice={cgoPrice}
          isPending={repayHook.isPending}
          isConfirming={repayHook.isConfirming}
          useNative={useNativeForRepay}
          setUseNative={setUseNativeForRepay}
        />
      )}
      {isRepayDoneModal && (
        <RepayDoneModal
          isOpen={isRepayDoneModal}
          onClose={() => {
            setIsRepayDoneModal(false);
            setAmount("");
          }}
          amount={amount}
          tokenSymbol={selectedToken.toUpperCase()}
          txHash={repayHook.hash as `0x${string}`}
        />
      )}

      <Box
        shadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
        borderRadius="5px"
        mb="20px"
      >
        <Heading size="xl" p="16px 24px">
          Your borrows
        </Heading>
        {yourBorrows.length !== 0 && (
          <Flex gap="2" alignItems="center" px="24px" mb="10px" flexWrap="wrap">
            <Box
              p="4px 8px"
              borderRadius="4px"
              border="1px solid #eaebef"
              fontSize="sm"
            >
              Balance $
              {parseFloat(accountData.totalDebt).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Box>
            <Box
              p="4px 8px"
              borderRadius="4px"
              border="1px solid #eaebef"
              fontSize="sm"
            >
              APY {weightedBorrowApy}%
            </Box>
            <Box
              p="4px 8px"
              borderRadius="4px"
              border="1px solid #eaebef"
              fontSize="sm"
            >
              Borrow power used {borrowPowerUsed}%
            </Box>
          </Flex>
        )}
        {yourBorrows.length !== 0 ? (
          <Box p="15px" overflowX="auto">
            <Table.Root size="sm">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader w="30%" minW="100px">
                    Asset
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    w="25%"
                    minW="100px"
                    cursor="pointer"
                    onClick={() => handleBorrowsSort("debt")}
                    _hover={{ bg: "gray.50" }}
                  >
                    <Flex alignItems="center" gap="5px">
                      Debt
                      <Icon fontSize="xs" color="gray.500">
                        {getBorrowsSortIcon("debt")}
                      </Icon>
                    </Flex>
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    w="15%"
                    minW="60px"
                    cursor="pointer"
                    onClick={() => handleBorrowsSort("apy")}
                    _hover={{ bg: "gray.50" }}
                  >
                    <Flex alignItems="center" gap="5px">
                      APY
                      <Icon fontSize="xs" color="gray.500">
                        {getBorrowsSortIcon("apy")}
                      </Icon>
                    </Flex>
                  </Table.ColumnHeader>
                  <Table.ColumnHeader w="30%" minW="150px"></Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {yourBorrows.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell w="30%">
                      <Flex gap="10px" alignItems="center">
                        <Image
                          src={item.img}
                          w="28px"
                          h="28px"
                          cursor="pointer"
                          onClick={() =>
                            navigate(buildAssetDetailsRoute(item.symbol))
                          }
                          _hover={{ opacity: 0.7 }}
                        />
                        <Box
                          cursor="pointer"
                          onClick={() =>
                            navigate(buildAssetDetailsRoute(item.symbol))
                          }
                          _hover={{ textDecoration: "underline" }}
                        >
                          {item.name}
                        </Box>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell w="25%">
                      <Flex direction="column">
                        <Box fontSize="sm">{item.debt}</Box>
                        <Box fontSize="xs">{item.dollarDebt}</Box>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell w="15%" fontSize="sm">
                      {item.apy}
                    </Table.Cell>
                    <Table.Cell w="30%">
                      <Flex justify="flex-end" gap="5px">
                        <Button
                          size="sm"
                          onClick={() =>
                            openBorrowModal(
                              item.symbol as "wxdc" | "usdc" | "xdc" | "cgo"
                            )
                          }
                        >
                          Borrow
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            openRepayModal(
                              item.symbol as "wxdc" | "usdc" | "xdc" | "cgo"
                            )
                          }
                        >
                          Repay
                        </Button>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        ) : (
          <Box p="16px 24px">Nothing borrowed yet</Box>
        )}
      </Box>

      {/* Assets to Borrow */}
      <Box
        shadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
        borderRadius="5px"
        mb="20px"
      >
        <Heading size="xl" p="16px 24px">
          Assets to borrow
        </Heading>
        <Box p="15px" overflowX="auto">
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader w="30%" minW="100px">
                  Asset
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  w="25%"
                  minW="100px"
                  cursor="pointer"
                  onClick={() => handleAssetsSort("available")}
                  _hover={{ bg: "gray.50" }}
                >
                  <Flex alignItems="center" gap="5px">
                    Available
                    <Icon fontSize="xs" color="gray.500">
                      {getAssetsSortIcon("available")}
                    </Icon>
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  w="18%"
                  minW="80px"
                  cursor="pointer"
                  onClick={() => handleAssetsSort("apy")}
                  _hover={{ bg: "gray.50" }}
                >
                  <Flex alignItems="center" gap="5px">
                    APY, variable
                    <Icon fontSize="xs" color="gray.500">
                      {getAssetsSortIcon("apy")}
                    </Icon>
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader w="27%" minW="150px"></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {assetsToBorrow.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell w="30%">
                    <Flex gap="10px" alignItems="center">
                      <Image
                        src={item.img}
                        width="28px"
                        height="28px"
                        cursor="pointer"
                        onClick={() =>
                          navigate(buildAssetDetailsRoute(item.symbol))
                        }
                        _hover={{ opacity: 0.7 }}
                      />
                      <Box
                        cursor="pointer"
                        onClick={() =>
                          navigate(buildAssetDetailsRoute(item.symbol))
                        }
                        _hover={{ textDecoration: "underline" }}
                      >
                        {item.name}
                      </Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell w="25%">
                    <Flex direction="column">
                      <Box fontSize="sm">{item.available}</Box>
                      <Box fontSize="xs">{item.dollarAvailable}</Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell w="18%" fontSize="sm">
                    {item.apy}
                  </Table.Cell>
                  <Table.Cell w="27%">
                    <Flex justify="flex-end" gap="5px">
                      <Button
                        size="sm"
                        onClick={() =>
                          openBorrowModal(
                            item.symbol as "wxdc" | "usdc" | "xdc" | "cgo"
                          )
                        }
                        disabled={
                          parseFloat(accountData.availableBorrows) === 0
                        }
                      >
                        Borrow
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate(buildAssetDetailsRoute(item.symbol))
                        }
                      >
                        Details
                      </Button>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>
    </Box>
  );
}

export default BorrowContent;
