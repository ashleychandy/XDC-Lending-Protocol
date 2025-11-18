import FormattedCounter from "@/components/ui/Counter/FormattedCounter";
import { getTokenLogo } from "@/config/tokenLogos";
import { formatUsdValue, formatValue } from "@/helpers/formatValue";
import { useAssetPrice } from "@/hooks/useAssetPrice";
import { useATokenAllowance } from "@/hooks/useATokenAllowance";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useCollateral } from "@/hooks/useCollateral";
import { useReserveCaps } from "@/hooks/useReserveCaps";
import { useReserveData } from "@/hooks/useReserveData";
import { useReserveLiquidity } from "@/hooks/useReserveLiquidity";
import { useReserveSupply } from "@/hooks/useReserveSupply";
import { useSupply } from "@/hooks/useSupply";
import { useTokenAllowance } from "@/hooks/useTokenAllowance";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useTransactionFlow } from "@/hooks/useTransactionFlow";
import { useUserAccountData } from "@/hooks/useUserAccountData";
import { useUserReserveData } from "@/hooks/useUserReserveData";
import { useWithdraw } from "@/hooks/useWithdraw";
import { buildAssetDetailsRoute } from "@/routes/paths";
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Image,
  Skeleton,
  Switch,
  Table,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { FaCheck, FaSort, FaSortDown, FaSortUp } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { formatUnits } from "viem";
import { useAccount, useBalance } from "wagmi";
import usdcIcon from "../assets/images/usdc.svg";
import CollateralModal from "./modal/CollateralModal";
import SupplyDoneModal from "./modal/SupplyDoneModal";
import SupplyModal from "./modal/SupplyModal";
import WithdrawDoneModal from "./modal/WithdrawDoneModal";
import WithdrawModal from "./modal/WithdrawModal";

const SupplyContent = () => {
  const queryClient = useQueryClient();
  const { tokens, network, contracts } = useChainConfig();
  const [selectedToken, setSelectedToken] = useState<
    "wxdc" | "usdc" | "xdc" | "cgo"
  >("wxdc");

  // Get native token symbol (XDC, XDC, etc.)
  const nativeTokenSymbol = network.nativeToken.symbol;

  // Get token logos dynamically
  const nativeTokenLogo = getTokenLogo(nativeTokenSymbol);
  const wrappedTokenLogo = getTokenLogo(tokens.wrappedNative.symbol);
  const [amount, setAmount] = useState("");
  const [isSupplyModal, setIsSupplyModal] = useState<boolean>(false);
  const [isSupplyDoneModal, setIsSupplyDoneModal] = useState<boolean>(false);
  const [isWithdrawModal, setIsWithdrawModal] = useState<boolean>(false);
  const [isWithdrawDoneModal, setIsWithdrawDoneModal] =
    useState<boolean>(false);
  const [unwrapToNative, setUnwrapToNative] = useState<boolean>(true);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [isGatewayApproved, setIsGatewayApproved] = useState<boolean>(false);
  const [gatewayApprovalHash, setGatewayApprovalHash] = useState<
    `0x${string}` | undefined
  >();
  const [isCollateralModal, setIsCollateralModal] = useState<boolean>(false);
  const [collateralModalToken, setCollateralModalToken] = useState<
    "wxdc" | "usdc" | "cgo"
  >("wxdc");
  const [collateralModalStatus, setCollateralModalStatus] =
    useState<boolean>(false);

  // Sorting state for Your Supplies table
  const [suppliesSortField, setSuppliesSortField] = useState<
    "apy" | "balance" | null
  >(null);
  const [suppliesSortDirection, setSuppliesSortDirection] = useState<
    "asc" | "desc"
  >("desc");

  // Sorting state for Assets to Supply table
  const [sortField, setSortField] = useState<"apy" | "balance" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const navigate = useNavigate();
  const supplyHook = useSupply();
  const withdrawHook = useWithdraw();
  const collateralHook = useCollateral();
  const { address } = useAccount();
  const accountData = useUserAccountData();

  // Get current token for allowance check
  const currentToken =
    selectedToken === "xdc" || selectedToken === "wxdc"
      ? tokens.wrappedNative
      : tokens[selectedToken];

  // Check token allowance
  const { allowance, refetch: refetchAllowance } = useTokenAllowance(
    currentToken.address,
    address,
    contracts.pool
  );

  const wxdcReserveData = useReserveData(tokens.wrappedNative.address);

  // Check aToken allowance for gateway (needed for withdrawETH)
  const { allowance: gatewayAllowance, refetch: refetchGatewayAllowance } =
    useATokenAllowance(
      wxdcReserveData.aTokenAddress,
      address,
      contracts.wrappedTokenGateway
    );
  const usdcReserveData = useReserveData(tokens.usdc.address);
  const cgoReserveData = useReserveData(tokens.cgo.address);

  // Get available liquidity for each reserve
  const wxdcLiquidity = useReserveLiquidity(
    tokens.wrappedNative.address,
    tokens.wrappedNative.decimals
  );
  const usdcLiquidity = useReserveLiquidity(
    tokens.usdc.address,
    tokens.usdc.decimals
  );
  const cgoLiquidity = useReserveLiquidity(
    tokens.cgo.address,
    tokens.cgo.decimals
  );

  // Get supply caps
  const wxdcCaps = useReserveCaps(
    tokens.wrappedNative.address,
    tokens.wrappedNative.decimals
  );
  const usdcCaps = useReserveCaps(tokens.usdc.address, tokens.usdc.decimals);
  const cgoCaps = useReserveCaps(tokens.cgo.address, tokens.cgo.decimals);

  // Get total supplied amounts
  const wxdcSupply = useReserveSupply(
    wxdcReserveData.aTokenAddress,
    tokens.wrappedNative.decimals
  );
  const usdcSupply = useReserveSupply(
    usdcReserveData.aTokenAddress,
    tokens.usdc.decimals
  );
  const cgoSupply = useReserveSupply(
    cgoReserveData.aTokenAddress,
    tokens.cgo.decimals
  );

  const { data: xdcBalance } = useBalance({
    address: address,
  });

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

  const wxdcSupplied = formatUnits(
    wxdcUserData.suppliedAmount as bigint,
    tokens.wrappedNative.decimals
  );

  const usdcSupplied = formatUnits(
    usdcUserData.suppliedAmount as bigint,
    tokens.usdc.decimals
  );

  const cgoSupplied = formatUnits(
    cgoUserData.suppliedAmount as bigint,
    tokens.cgo.decimals
  );

  const { price: xdcPrice } = useAssetPrice(tokens.wrappedNative.address);
  const { price: usdcPrice } = useAssetPrice(tokens.usdc.address);
  const { price: cgoPrice } = useAssetPrice(tokens.cgo.address);

  const totalSuppliedUsd =
    parseFloat(wxdcSupplied) * xdcPrice +
    parseFloat(usdcSupplied) * usdcPrice +
    parseFloat(cgoSupplied) * cgoPrice;
  const weightedSupplyApy =
    totalSuppliedUsd > 0
      ? (
          (parseFloat(wxdcSupplied) *
            xdcPrice *
            parseFloat(wxdcReserveData.supplyApy) +
            parseFloat(usdcSupplied) *
              usdcPrice *
              parseFloat(usdcReserveData.supplyApy) +
            parseFloat(cgoSupplied) *
              cgoPrice *
              parseFloat(cgoReserveData.supplyApy)) /
          totalSuppliedUsd
        ).toFixed(2)
      : "0.00";

  const handleApprove = async () => {
    if (!address) return;
    const token =
      selectedToken === "xdc" || selectedToken === "wxdc"
        ? tokens.wrappedNative
        : tokens[selectedToken];

    try {
      // Approve max tokens for unlimited allowance
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
      // If supplying native token (XDC), use native gateway
      if (selectedToken === "xdc") {
        // Check if gateway is configured
        if (
          contracts.wrappedTokenGateway ===
          "0x0000000000000000000000000000000000000000"
        ) {
          console.error("Wrapped token gateway not configured for this chain");
          return;
        }
        await supplyHook.supplyNative(amount, address);
      } else {
        // Standard ERC20 flow: supply after approval
        await supplyHook.supply(token.address, amount, token.decimals, address);
      }
    } catch (err) {
      console.error("Supply error:", err);
    }
  };

  // Watch approval transaction
  useTransactionFlow({
    hash: supplyHook.approveHash,
    onSuccess: () => {
      setIsApproved(true);
      // Refetch allowance after approval
      refetchAllowance();
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

  const handleGatewayApprove = async () => {
    if (!address) return;
    try {
      const hash = await withdrawHook.approveGateway(
        wxdcReserveData.aTokenAddress
      );
      setGatewayApprovalHash(hash);
    } catch (err) {
      console.error("Gateway approval error:", err);
    }
  };

  // Watch gateway approval transaction
  useTransactionFlow({
    hash: gatewayApprovalHash,
    onSuccess: () => {
      setIsGatewayApproved(true);
      setGatewayApprovalHash(undefined);
      refetchGatewayAllowance();
    },
    onError: (err) => {
      console.error("Gateway approval failed:", err);
      setGatewayApprovalHash(undefined);
    },
  });

  const handleWithdraw = async (unwrapToNative: boolean = false) => {
    if (!address || !amount) return;
    const token =
      selectedToken === "xdc" || selectedToken === "wxdc"
        ? tokens.wrappedNative
        : tokens[selectedToken as "usdc" | "cgo"];

    try {
      // If withdrawing as native token (XDC) and unwrap is enabled
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
        await withdrawHook.withdrawNative(amount, address);
      } else {
        // Standard withdraw
        await withdrawHook.withdraw(
          token.address,
          amount,
          token.decimals,
          address
        );
      }
    } catch (err) {
      console.error("Withdraw error:", err);
    }
  };

  const openCollateralModal = (
    tokenSymbol: "wxdc" | "usdc" | "cgo",
    currentStatus: boolean
  ) => {
    setCollateralModalToken(tokenSymbol);
    setCollateralModalStatus(currentStatus);
    setIsCollateralModal(true);
  };

  const handleCollateralConfirm = async () => {
    try {
      const assetAddress =
        collateralModalToken === "wxdc"
          ? tokens.wrappedNative.address
          : collateralModalToken === "cgo"
            ? tokens.cgo.address
            : tokens.usdc.address;

      await collateralHook.setCollateral(assetAddress, !collateralModalStatus);
    } catch (err) {
      console.error("Collateral toggle error:", err);
    }
  };

  useTransactionFlow({
    hash: withdrawHook.hash,
    onSuccess: () => {
      setIsWithdrawModal(false);
      setIsWithdrawDoneModal(true);
      queryClient.invalidateQueries();
    },
    onError: (err) => {
      console.log("error in withdraw transaction", err);
      setAmount("");
    },
  });

  useTransactionFlow({
    hash: collateralHook.hash,
    onSuccess: () => {
      console.log("Collateral setting updated successfully");
      setIsCollateralModal(false);
      // Invalidate all queries to refetch updated data
      queryClient.invalidateQueries();
    },
    onError: (err) => {
      console.error("Error updating collateral setting:", err);
      setIsCollateralModal(false);
    },
  });

  const openSupplyModal = (tokenSymbol: "wxdc" | "usdc" | "xdc" | "cgo") => {
    setSelectedToken(tokenSymbol);
    setIsSupplyModal(true);
    // Reset approval state when opening modal
    // Will be checked dynamically based on input amount
    setIsApproved(false);
  };

  const openWithdrawModal = (
    name: string,
    tokenSymbol: "wxdc" | "usdc" | "xdc" | "cgo"
  ) => {
    // Check if it's the native token (XDC, XDC, etc.)
    const finalToken = name === nativeTokenSymbol ? "xdc" : tokenSymbol;
    setSelectedToken(finalToken);
    setIsWithdrawModal(true);
  };

  const yourSuppliesBase = [
    {
      id: 1,
      name: tokens.wrappedNative.symbol, // WXDC
      symbol: "wxdc",
      balance: formatValue(parseFloat(wxdcSupplied)),
      dollarBalance: `${formatUsdValue(parseFloat(wxdcSupplied) * xdcPrice)}`,
      apy: `${parseFloat(wxdcReserveData.supplyApy)}%`,
      img: wrappedTokenLogo,
      isCollateral: wxdcUserData.isUsingAsCollateral,
      actualAmount: wxdcUserData.suppliedAmount,
      apyValue: parseFloat(wxdcReserveData.supplyApy),
      balanceValue: parseFloat(wxdcSupplied) * xdcPrice,
    },
    {
      id: 2,
      name: "USDC",
      symbol: "usdc",
      balance: formatValue(parseFloat(usdcSupplied)),
      dollarBalance: `${formatUsdValue(parseFloat(usdcSupplied) * usdcPrice)}`,
      apy: `${parseFloat(usdcReserveData.supplyApy)}%`,
      img: usdcIcon,
      isCollateral: usdcUserData.isUsingAsCollateral,
      actualAmount: usdcUserData.suppliedAmount,
      apyValue: parseFloat(usdcReserveData.supplyApy),
      balanceValue: parseFloat(usdcSupplied) * usdcPrice,
    },
    {
      id: 3,
      name: "CGO",
      symbol: "cgo",
      balance: formatValue(parseFloat(cgoSupplied)),
      dollarBalance: `${formatUsdValue(parseFloat(cgoSupplied) * cgoPrice)}`,
      apy: `${parseFloat(cgoReserveData.supplyApy)}%`,
      img: getTokenLogo("CGO"),
      isCollateral: cgoUserData.isUsingAsCollateral,
      actualAmount: cgoUserData.suppliedAmount,
      apyValue: parseFloat(cgoReserveData.supplyApy),
      balanceValue: parseFloat(cgoSupplied) * cgoPrice,
    },
  ].filter((item) => (item.actualAmount as bigint) > BigInt(0));

  // Sorted your supplies
  const yourSupplies = useMemo(() => {
    if (!suppliesSortField) return yourSuppliesBase;

    return [...yourSuppliesBase].sort((a, b) => {
      let comparison = 0;

      if (suppliesSortField === "apy") {
        comparison = a.apyValue - b.apyValue;
      } else if (suppliesSortField === "balance") {
        comparison = a.balanceValue - b.balanceValue;
      }

      return suppliesSortDirection === "asc" ? comparison : -comparison;
    });
  }, [yourSuppliesBase, suppliesSortField, suppliesSortDirection]);

  // Assets to Supply - wallet balances
  const assetsToSupplyBase = [
    {
      id: 1,
      name: nativeTokenSymbol, // XDC on XDC chains, XDC on XDC chains
      symbol: "xdc",
      balance: xdcBalance ? formatValue(parseFloat(xdcBalance.formatted)) : "0",
      apy: `${wxdcReserveData.supplyApy}%`,
      img: nativeTokenLogo,
      canBeCollateral: true,
      walletBalance: xdcBalance?.formatted || "0",
      apyValue: parseFloat(wxdcReserveData.supplyApy),
      balanceValue: parseFloat(xdcBalance?.formatted || "0"),
    },
    {
      id: 2,
      name: "USDC",
      symbol: "usdc",
      balance: formatValue(parseFloat(usdcBalance)),
      apy: `${usdcReserveData.supplyApy}%`,
      img: usdcIcon,
      canBeCollateral: true,
      walletBalance: usdcBalance,
      apyValue: parseFloat(usdcReserveData.supplyApy),
      balanceValue: parseFloat(usdcBalance),
    },
    {
      id: 3,
      name: tokens.wrappedNative.symbol, // WXDC
      symbol: "wxdc",
      balance: formatValue(parseFloat(wxdcBalance)),
      apy: `${wxdcReserveData.supplyApy}%`,
      img: wrappedTokenLogo,
      canBeCollateral: true,
      walletBalance: wxdcBalance,
      apyValue: parseFloat(wxdcReserveData.supplyApy),
      balanceValue: parseFloat(wxdcBalance),
    },
    {
      id: 4,
      name: "CGO",
      symbol: "cgo",
      balance: formatValue(parseFloat(cgoBalance)),
      apy: `${cgoReserveData.supplyApy}%`,
      img: getTokenLogo("CGO"),
      canBeCollateral: true,
      walletBalance: cgoBalance,
      apyValue: parseFloat(cgoReserveData.supplyApy),
      balanceValue: parseFloat(cgoBalance),
    },
  ];

  // Sorted assets to supply
  const assetsToSupply = useMemo(() => {
    if (!sortField) return assetsToSupplyBase;

    return [...assetsToSupplyBase].sort((a, b) => {
      let comparison = 0;

      if (sortField === "apy") {
        comparison = a.apyValue - b.apyValue;
      } else if (sortField === "balance") {
        comparison = a.balanceValue - b.balanceValue;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [assetsToSupplyBase, sortField, sortDirection]);

  // Handle column header click for sorting - Your Supplies
  const handleSuppliesSort = (field: "apy" | "balance") => {
    if (suppliesSortField === field) {
      if (suppliesSortDirection === "desc") {
        setSuppliesSortDirection("asc");
      } else {
        setSuppliesSortField(null);
        setSuppliesSortDirection("desc");
      }
    } else {
      setSuppliesSortField(field);
      setSuppliesSortDirection("desc");
    }
  };

  // Handle column header click for sorting - Assets to Supply
  const handleSort = (field: "apy" | "balance") => {
    if (sortField === field) {
      // Toggle direction or clear sort
      if (sortDirection === "desc") {
        setSortDirection("asc");
      } else {
        setSortField(null);
        setSortDirection("desc");
      }
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Get sort icon for column header - Your Supplies
  const getSuppliesSortIcon = (field: "apy" | "balance") => {
    if (suppliesSortField !== field) {
      return <FaSort />;
    }
    return suppliesSortDirection === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  // Get sort icon for column header - Assets to Supply
  const getSortIcon = (field: "apy" | "balance") => {
    if (sortField !== field) {
      return <FaSort />;
    }
    return sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  return (
    <Box width={{ base: "100%", lg: "50%" }}>
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
      {isWithdrawModal && (
        <WithdrawModal
          isOpen={isWithdrawModal}
          onClose={() => {
            setIsWithdrawModal(false);
            setAmount("");
            setUnwrapToNative(true);
            setIsGatewayApproved(false);
          }}
          tokenSymbol={selectedToken}
          amount={amount}
          setAmount={setAmount}
          onClickWithdraw={() => {
            handleWithdraw(unwrapToNative);
          }}
          onClickGatewayApprove={handleGatewayApprove}
          isGatewayApproved={isGatewayApproved}
          gatewayAllowance={gatewayAllowance}
          isPending={withdrawHook.isPending}
          isConfirming={withdrawHook.isConfirming}
          unwrapToNative={unwrapToNative}
          setUnwrapToNative={setUnwrapToNative}
        />
      )}
      {isWithdrawDoneModal && (
        <WithdrawDoneModal
          isOpen={isWithdrawDoneModal}
          onClose={() => {
            setIsWithdrawDoneModal(false);
            setAmount("");
          }}
          amount={amount}
          tokenSymbol={selectedToken.toUpperCase()}
          txHash={withdrawHook.hash as `0x${string}`}
        />
      )}
      {isCollateralModal && (
        <CollateralModal
          isOpen={isCollateralModal}
          onClose={() => setIsCollateralModal(false)}
          tokenSymbol={collateralModalToken}
          currentCollateralStatus={collateralModalStatus}
          onConfirm={handleCollateralConfirm}
          isPending={collateralHook.isPending}
          isConfirming={collateralHook.isConfirming}
        />
      )}
      {/* Your Supplies */}
      <Box
        shadow="rgba(0, 0, 0, 0.05) 0px 2px 1px, rgba(0, 0, 0, 0.25) 0px 0px 1px"
        bg={"#fff"}
        border={"1px solid #eaebef"}
        borderRadius="5px"
        mb="20px"
      >
        <Heading size="xl" p="16px 24px" className="title-text-1">
          Your supplies
        </Heading>
        {yourSupplies.length !== 0 && (
          <Flex gap="2" alignItems="center" px="24px" mb="10px" flexWrap="wrap">
            <Flex
              alignItems={"center"}
              gap={"2px"}
              p="4px 8px"
              borderRadius="4px"
              border="1px solid #eaebef"
              fontSize="sm"
            >
              <Box as={"span"} className="light-text-2">
                Balance
              </Box>
              <FormattedCounter
                prefixColor="#62677b"
                prefix="$"
                value={parseFloat(accountData.totalCollateral)}
                fontSize={14}
                textColor="#000"
                decimalPlaces={2}
              />
            </Flex>
            <Flex
              alignItems={"center"}
              gap={"2px"}
              p="4px 8px"
              borderRadius="4px"
              border="1px solid #eaebef"
              fontSize="sm"
            >
              <Box as={"span"} className="light-text-2" mr={"2px"}>
                APY
              </Box>
              <FormattedCounter
                suffixColor="#62677b"
                value={weightedSupplyApy}
                fontSize={14}
                textColor="#000"
                suffix="%"
                decimalPlaces={2}
                className="title-text-1"
              />
            </Flex>
            <Flex
              alignItems={"center"}
              gap={"2px"}
              p="4px 8px"
              borderRadius="4px"
              border="1px solid #eaebef"
              fontSize="sm"
            >
              <Box as={"span"} className="light-text-2">
                Collateral
              </Box>
              <FormattedCounter
                prefixColor="#62677b"
                prefix="$"
                value={parseFloat(accountData.totalCollateral)}
                fontSize={14}
                textColor="#000"
                decimalPlaces={2}
              />
            </Flex>
          </Flex>
        )}
        {wxdcUserData.isLoading ||
        usdcUserData.isLoading ||
        cgoUserData.isLoading ? (
          <Box p="15px" overflowX="auto">
            <Table.Root size="sm">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader
                    w="25%"
                    minW="100px"
                    className="light-text-2"
                  >
                    Asset
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    w="20%"
                    minW="100px"
                    className="light-text-2"
                  >
                    Balance
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    w="13%"
                    minW="60px"
                    className="light-text-2"
                  >
                    APY
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    w="17%"
                    minW="100px"
                    className="light-text-2"
                  >
                    Collateral
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    w="25%"
                    minW="150px"
                    className="light-text-2"
                  ></Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {[1, 2, 3].map((i) => (
                  <Table.Row key={i}>
                    <Table.Cell>
                      <Skeleton height="20px" width="80px" />
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton height="20px" width="100px" />
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton height="20px" width="60px" />
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton height="20px" width="40px" />
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton height="32px" width="120px" />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        ) : yourSupplies.length !== 0 ? (
          <Box p="15px" overflowX="auto">
            <Table.Root size="sm">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader
                    w="25%"
                    minW="100px"
                    className="light-text-2"
                  >
                    Asset
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    w="20%"
                    minW="100px"
                    cursor="pointer"
                    onClick={() => handleSuppliesSort("balance")}
                    _hover={{ bg: "gray.50" }}
                  >
                    <Flex
                      alignItems="center"
                      gap="5px"
                      className="light-text-2"
                    >
                      Balance
                      <Icon fontSize="xs" color="gray.500">
                        {getSuppliesSortIcon("balance")}
                      </Icon>
                    </Flex>
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    w="13%"
                    minW="60px"
                    cursor="pointer"
                    onClick={() => handleSuppliesSort("apy")}
                    _hover={{ bg: "gray.50" }}
                  >
                    <Flex
                      alignItems="center"
                      gap="5px"
                      className="light-text-2"
                    >
                      APY
                      <Icon fontSize="xs" color="gray.500">
                        {getSuppliesSortIcon("apy")}
                      </Icon>
                    </Flex>
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    w="12%"
                    minW="80px"
                    className="light-text-2"
                  >
                    Collateral
                  </Table.ColumnHeader>
                  <Table.ColumnHeader w="30%" minW="150px"></Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {yourSupplies.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell w="25%">
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
                          className="title-text-1"
                          onClick={() =>
                            navigate(buildAssetDetailsRoute(item.symbol))
                          }
                          _hover={{ textDecoration: "underline" }}
                        >
                          {item.name}
                        </Box>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell w="20%">
                      <Flex direction="column">
                        <FormattedCounter
                          value={item.balance}
                          fontSize={14}
                          textColor="#000"
                          className="title-text-1"
                        />
                        <FormattedCounter
                          prefixColor="#62677b"
                          {...(!item.dollarBalance.startsWith("<") && {
                            prefix: "$",
                          })}
                          value={item.dollarBalance}
                          fontSize={12}
                          textColor="#62677b"
                        />
                      </Flex>
                    </Table.Cell>
                    <Table.Cell w="13%" fontSize="sm" className="title-text-1">
                      <FormattedCounter
                        suffixColor="#6b7280"
                        value={item.apy}
                        fontSize={14}
                        textColor="#000"
                        suffix="%"
                      />
                    </Table.Cell>
                    <Table.Cell w="12%">
                      <Switch.Root
                        colorPalette="green"
                        checked={item.isCollateral}
                        size="sm"
                        onCheckedChange={() =>
                          openCollateralModal(
                            item.symbol as "wxdc" | "usdc" | "cgo",
                            item.isCollateral
                          )
                        }
                        disabled={collateralHook.isPending}
                      >
                        <Switch.HiddenInput />
                        <Switch.Control />
                      </Switch.Root>
                    </Table.Cell>
                    <Table.Cell w="30%">
                      <Flex gap="5px" justify="flex-end">
                        <Button
                          size="sm"
                          variant={"plain"}
                          className="btn-color-dark-1"
                          onClick={() =>
                            openSupplyModal(
                              item.symbol as "wxdc" | "usdc" | "xdc" | "cgo"
                            )
                          }
                        >
                          Supply
                        </Button>
                        <Button
                          size="sm"
                          variant="plain"
                          className="btn-color-light-1"
                          onClick={() => {
                            openWithdrawModal(
                              item.name,
                              item.symbol as "wxdc" | "usdc" | "xdc" | "cgo"
                            );
                          }}
                        >
                          Withdraw
                        </Button>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        ) : (
          <Box p="16px 24px" className="light-text-2">
            Nothing supplied yet
          </Box>
        )}
      </Box>

      {/* Assets to Supply */}
      <Box
        shadow="rgba(0, 0, 0, 0.05) 0px 2px 1px, rgba(0, 0, 0, 0.25) 0px 0px 1px"
        bg={"#fff"}
        border={"1px solid #eaebef"}
        borderRadius="5px"
        mb="20px"
      >
        <Heading size="xl" p="16px 24px" className="title-text-1">
          Assets to supply
        </Heading>
        <Box p="15px" overflowX="auto">
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader
                  w="23%"
                  minW="100px"
                  className="light-text-2"
                >
                  Assets
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  w="23%"
                  minW="100px"
                  cursor="pointer"
                  onClick={() => handleSort("balance")}
                  _hover={{ bg: "gray.50" }}
                >
                  <Flex alignItems="center" gap="5px" className="light-text-2">
                    Wallet Balance
                    <Icon fontSize="xs" color="gray.500">
                      {getSortIcon("balance")}
                    </Icon>
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  w="15%"
                  minW="60px"
                  cursor="pointer"
                  onClick={() => handleSort("apy")}
                  _hover={{ bg: "gray.50" }}
                >
                  <Flex alignItems="center" gap="5px" className="light-text-2">
                    APY
                    <Icon fontSize="xs" color="gray.500">
                      {getSortIcon("apy")}
                    </Icon>
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  w="12%"
                  minW="80px"
                  className="light-text-2"
                >
                  Can be collateral
                </Table.ColumnHeader>
                <Table.ColumnHeader w="27%" minW="150px"></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {assetsToSupply.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell w="23%">
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
                        className="title-text-1"
                        _hover={{ textDecoration: "underline" }}
                      >
                        {item.name}
                      </Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell w="23%">
                    <FormattedCounter
                      value={item.balance}
                      fontSize={14}
                      textColor="#000"
                      className="title-text-1"
                    />
                  </Table.Cell>
                  <Table.Cell w="15%" fontSize="sm" className="title-text-1">
                    <FormattedCounter
                      suffixColor="#6b7280"
                      value={item.apy}
                      fontSize={14}
                      textColor="#000"
                      suffix="%"
                    />
                  </Table.Cell>
                  <Table.Cell w="12%">
                    {item.canBeCollateral && (
                      <Icon size="md" color="green.600">
                        <FaCheck />
                      </Icon>
                    )}
                  </Table.Cell>
                  <Table.Cell w="27%">
                    <Flex justify="flex-end" gap="5px">
                      <Button
                        size="sm"
                        variant={"plain"}
                        className="btn-color-dark-1"
                        onClick={() =>
                          openSupplyModal(
                            item.symbol as "wxdc" | "usdc" | "xdc" | "cgo"
                          )
                        }
                        disabled={parseFloat(item.walletBalance) === 0}
                      >
                        Supply
                      </Button>
                      <Button
                        size="sm"
                        variant={"plain"}
                        className="btn-color-light-1"
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
};

export default SupplyContent;
