import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Image,
  Switch,
  Table,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useAccount, useBalance } from "wagmi";
import xdcIcon from "../assets/images/xdc-icon.webp";
import usdcIcon from "../assets/images/usdc.svg";
import ethIcon from "../assets/images/eth.svg";
import wethIcon from "../assets/images/weth.svg";
import notFoundImg from "../assets/images/not-found.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import SupplyModal from "./modal/SupplyModal";
import WithdrawModal from "./modal/WithdrawModal";
import { FaCheck } from "react-icons/fa6";
import BorrowModal from "./modal/BorrowModal";
import RepayModal from "./modal/RepayModal";
import SupplyDoneModal from "./modal/SupplyDoneModal";
import BorrowDoneModal from "./modal/BorrowDoneModal";
import { TOKENS } from "@/chains/arbitrum/arbHelper";
import { useUserAccountData } from "@/hooks/useUserAccountData";
import { useSupply } from "@/hooks/useSupply";
import { useBorrow } from "@/hooks/useBorrow";
import { useWithdraw } from "@/hooks/useWithdraw";
import { useRepay } from "@/hooks/useRepay";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useReserveData } from "@/hooks/useReserveData";
import { useUserReserveData } from "@/hooks/useUserReserveData";
import { formatUnits } from "viem";
import { useAssetPrice } from "@/hooks/useAssetPrice";
import { formatUsdValue, formatValue } from "@/helpers/formatValue";
import WithdrawDoneModal from "./modal/WithdrawDoneModal";
import { useTransactionFlow } from "@/hooks/useTransactionFlow";
import { getHealthFactorColor } from "@/helpers/getHealthFactorColor";
import RepayDoneModal from "./modal/RepayDoneModal";

const Dashboard = () => {
  const [isSupplyModal, setIsSupplyModal] = useState<boolean>(false);
  const [isSupplyDoneModal, setIsSupplyDoneModal] = useState<boolean>(false);
  const [isBorrowModal, setIsBorrowModal] = useState<boolean>(false);
  const [isBorrowDoneModal, setIsBorrowDoneModal] = useState<boolean>(false);
  const [isRepayModal, setIsRepayModal] = useState<boolean>(false);
  const [isRepayDoneModal, setIsRepayDoneModal] = useState<boolean>(false);
  const [isWithdrawModal, setIsWithdrawModal] = useState<boolean>(false);
  const [isWithdrawDoneModal, setIsWithdrawDoneModal] =
    useState<boolean>(false);

  const { address, isConnected } = useAccount();
  const [selectedToken, setSelectedToken] = useState<"weth" | "usdc" | "eth">(
    "weth"
  );
  const [amount, setAmount] = useState("");

  // Get native ETH balance
  const { data: ethBalance } = useBalance({
    address: address,
  });
  // console.log("ethBalance", ethBalance);

  // Get balances for both tokens
  const { balance: wethBalance } = useTokenBalance(
    TOKENS.weth.address,
    TOKENS.weth.decimals
  );
  const { balance: usdcBalance } = useTokenBalance(
    TOKENS.usdc.address,
    TOKENS.usdc.decimals
  );

  // Get reserve data (APY, etc.) for each asset
  const wethReserveData = useReserveData(TOKENS.weth.address);
  // console.log("wethReserveData", wethReserveData);
  const usdcReserveData = useReserveData(TOKENS.usdc.address);
  // console.log("usdcReserveData", usdcReserveData);

  const { price: ethPrice } = useAssetPrice(TOKENS.weth.address);
  const { price: usdcPrice } = useAssetPrice(TOKENS.usdc.address);

  // Get user's supplied and borrowed amounts
  const wethUserData = useUserReserveData(
    TOKENS.weth.address,
    wethReserveData.aTokenAddress
  );
  // console.log("wethUserData", wethUserData);
  const usdcUserData = useUserReserveData(
    TOKENS.usdc.address,
    usdcReserveData.aTokenAddress
  );
  // console.log("usdcUserData", usdcUserData);

  const accountData = useUserAccountData();
  const supplyHook = useSupply();
  const borrowHook = useBorrow();
  const withdrawHook = useWithdraw();
  const repayHook = useRepay();

  const wethSupplied = formatUnits(
    wethUserData.suppliedAmount,
    TOKENS.weth.decimals
  );
  // console.log("wethSupplied", wethSupplied);
  const usdcSupplied = formatUnits(
    usdcUserData.suppliedAmount,
    TOKENS.usdc.decimals
  );
  // console.log("usdcSupplied", usdcSupplied);

  // Format borrowed amounts
  const wethBorrowed = formatUnits(
    wethUserData.borrowedAmount,
    TOKENS.weth.decimals
  );
  // console.log("wethBorrowed", wethBorrowed);
  const usdcBorrowed = formatUnits(
    usdcUserData.borrowedAmount,
    TOKENS.usdc.decimals
  );
  // console.log("usdcBorrowed", usdcBorrowed);

  // Your Supplies - based on collateral
  const yourSupplies = [
    {
      id: 1,
      name: "ETH",
      symbol: "weth",
      balance: formatValue(parseFloat(wethSupplied)),
      dollarBalance: `${formatUsdValue(parseFloat(wethSupplied) * ethPrice)}`,
      apy: `${parseFloat(wethReserveData.supplyApy)}%`,
      img: ethIcon,
      isCollateral: true,
      actualAmount: wethUserData.suppliedAmount,
    },
    {
      id: 2,
      name: "USDC",
      symbol: "usdc",
      balance: formatValue(parseFloat(usdcSupplied)),
      dollarBalance: `${formatUsdValue(parseFloat(usdcSupplied) * usdcPrice)}`,
      apy: `${parseFloat(usdcReserveData.supplyApy)}%`,
      img: usdcIcon,
      isCollateral: true,
      actualAmount: usdcUserData.suppliedAmount,
    },
  ].filter((item) => item.actualAmount > BigInt(0));

  // Assets to Supply - wallet balances
  const assetsToSupply = [
    {
      id: 1,
      name: "ETH",
      symbol: "eth",
      balance: ethBalance ? formatValue(parseFloat(ethBalance.formatted)) : "0",
      apy: `${wethReserveData.supplyApy}%`,
      img: ethIcon,
      canBeCollateral: true,
      walletBalance: ethBalance?.formatted || "0",
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
    },
    {
      id: 3,
      name: "WETH",
      symbol: "weth",
      balance: formatValue(parseFloat(wethBalance)),
      apy: `${wethReserveData.supplyApy}%`,
      img: wethIcon,
      canBeCollateral: true,
      walletBalance: wethBalance,
    },
  ];

  // Your Borrows - based on debt
  const yourBorrows = [
    {
      id: 1,
      name: "USDC",
      symbol: "usdc",
      debt: formatValue(parseFloat(usdcBorrowed)),
      dollarDebt: `${formatUsdValue(parseFloat(usdcBorrowed) * usdcPrice)}`,
      apy: `${usdcReserveData.borrowApy}%`,
      img: usdcIcon,
      actualAmount: usdcUserData.borrowedAmount,
    },
    {
      id: 2,
      name: "ETH",
      symbol: "weth",
      debt: formatValue(parseFloat(wethBorrowed)),
      dollarDebt: `${formatUsdValue(parseFloat(wethBorrowed) * ethPrice)}`,
      apy: `${wethReserveData.borrowApy}%`,
      img: ethIcon,
      actualAmount: wethUserData.borrowedAmount,
    },
  ].filter((item) => item.actualAmount > BigInt(0));

  // Assets to Borrow
  const assetsToBorrow = [
    {
      id: 1,
      name: "ETH",
      symbol: "weth",
      available: formatValue(
        parseFloat(accountData.availableBorrows) / ethPrice
      ),
      dollarAvailable: `${formatUsdValue(
        parseFloat(accountData.availableBorrows)
      )}`,
      apy: `${wethReserveData.borrowApy}%`,
      img: ethIcon,
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
    },
  ];

  const handleSupply = async () => {
    if (!address || !amount) return;
    const token = selectedToken === "eth" ? TOKENS.weth : TOKENS[selectedToken];
    try {
      await supplyHook.approve(token.address, amount, token.decimals);
      setTimeout(async () => {
        await supplyHook.supply(token.address, amount, token.decimals, address);
      }, 2000);
    } catch (err) {
      console.error("Supply error:", err);
    }
  };

  useTransactionFlow({
    hash: supplyHook.hash,
    onSuccess: () => {
      setIsSupplyModal(false);
      setIsSupplyDoneModal(true);
    },
    onError: (err) => {
      console.log("error in supply transaction", err);
      setAmount("");
    },
  });

  const handleBorrow = async () => {
    if (!address || !amount) return;
    const token = selectedToken === "eth" ? TOKENS.weth : TOKENS[selectedToken];
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
    },
    onError: (err) => {
      console.log("error in borrow transaction", err);
      setAmount("");
    },
  });

  const handleWithdraw = async () => {
    if (!address || !amount) return;
    const token = selectedToken === "eth" ? TOKENS.weth : TOKENS[selectedToken];
    try {
      await withdrawHook.withdraw(
        token.address,
        amount,
        token.decimals,
        address
      );
    } catch (err) {
      console.error("Withdraw error:", err);
    }
  };

  useTransactionFlow({
    hash: withdrawHook.hash,
    onSuccess: () => {
      setIsWithdrawModal(false);
      setIsWithdrawDoneModal(true);
    },
    onError: (err) => {
      console.log("error in withdraw transaction", err);
      setAmount("");
    },
  });

  const handleRepay = async () => {
    if (!address || !amount) return;
    const token = selectedToken === "eth" ? TOKENS.weth : TOKENS[selectedToken];
    try {
      await repayHook.approve(token.address, amount, token.decimals);
      setTimeout(async () => {
        await repayHook.repay(token.address, amount, token.decimals, address);
      }, 2000);
    } catch (err) {
      console.error("Repay error:", err);
    }
  };

  useTransactionFlow({
    hash: repayHook.hash,
    onSuccess: () => {
      setIsRepayModal(false);
      setIsRepayDoneModal(true);
    },
    onError: (err) => {
      console.log("error in repay transaction", err);
      setAmount("");
    },
  });

  // Open modals with selected token
  const openSupplyModal = (tokenSymbol: "weth" | "usdc" | "eth") => {
    setSelectedToken(tokenSymbol);
    setIsSupplyModal(true);
  };

  const openWithdrawModal = (
    name: string,
    tokenSymbol: "weth" | "usdc" | "eth"
  ) => {
    const finalToken = name === "ETH" ? "eth" : tokenSymbol;
    setSelectedToken(finalToken);
    setIsWithdrawModal(true);
  };

  const openBorrowModal = (tokenSymbol: "weth" | "usdc" | "eth") => {
    setSelectedToken(tokenSymbol);
    setIsBorrowModal(true);
  };

  const openRepayModal = (tokenSymbol: "weth" | "usdc" | "eth") => {
    setSelectedToken(tokenSymbol);
    setIsRepayModal(true);
  };

  // Calculate net worth and health factor color
  const netWorth =
    parseFloat(accountData.totalCollateral) - parseFloat(accountData.totalDebt);
  const healthFactorValue = parseFloat(accountData.healthFactor);
  const healthFactorColor = getHealthFactorColor(healthFactorValue);
  const borrowPowerUsed =
    parseFloat(accountData.totalCollateral) > 0
      ? (
          (parseFloat(accountData.totalDebt) /
            (parseFloat(accountData.totalCollateral) *
              (parseFloat(accountData.ltv) / 100))) *
          100
        ).toFixed(2)
      : "0.00";

  // Calculate average APY
  const totalSuppliedUsd =
    parseFloat(wethSupplied) * ethPrice + parseFloat(usdcSupplied) * usdcPrice;
  const weightedSupplyApy =
    totalSuppliedUsd > 0
      ? (
          (parseFloat(wethSupplied) *
            ethPrice *
            parseFloat(wethReserveData.supplyApy) +
            parseFloat(usdcSupplied) *
              usdcPrice *
              parseFloat(usdcReserveData.supplyApy)) /
          totalSuppliedUsd
        ).toFixed(2)
      : "0.00";

  const totalBorrowedUsd =
    parseFloat(wethBorrowed) * ethPrice + parseFloat(usdcBorrowed) * usdcPrice;
  const weightedBorrowApy =
    totalBorrowedUsd > 0
      ? (
          (parseFloat(wethBorrowed) *
            ethPrice *
            parseFloat(wethReserveData.borrowApy) +
            parseFloat(usdcBorrowed) *
              usdcPrice *
              parseFloat(usdcReserveData.borrowApy)) /
          totalBorrowedUsd
        ).toFixed(2)
      : "0.00";

  return (
    <Container
      maxW={{
        base: "100%",
        md: "container.md",
        lg: "container.lg",
        xl: "container.xl",
      }}
      px={{ base: 4, md: 6 }}
      py={4}
      h="100%"
    >
      <Box h="100%" p="30px 0">
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
            }}
            tokenSymbol={selectedToken}
            amount={amount}
            setAmount={setAmount}
            onClickWithdraw={() => {
              handleWithdraw();
            }}
            suppliedBalance={
              selectedToken === "eth" || selectedToken === "weth"
                ? wethSupplied
                : usdcSupplied
            }
            ethPrice={ethPrice}
            usdcPrice={usdcPrice}
            isPending={withdrawHook.isPending}
            isConfirming={withdrawHook.isConfirming}
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
        {isRepayModal && (
          <RepayModal
            isOpen={isRepayModal}
            onClose={() => {
              setIsRepayModal(false);
              setAmount("");
            }}
            tokenSymbol={selectedToken}
            amount={amount}
            setAmount={setAmount}
            onClickRepay={() => {
              handleRepay();
            }}
            borrowedAmount={
              selectedToken === "eth" || selectedToken === "weth"
                ? wethBorrowed
                : usdcBorrowed
            }
            ethPrice={ethPrice}
            usdcPrice={usdcPrice}
            isPending={repayHook.isPending}
            isConfirming={repayHook.isConfirming}
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

        <Flex gap="2" alignItems="center" mb="15px">
          <Image src={ethIcon} width="32px" height="32px" />
          <Heading size="3xl">Arbitrum Sepolia Market</Heading>
        </Flex>

        <Flex gap="6" alignItems="center" mb="50px" flexWrap="wrap">
          <Flex direction="column">
            <Box>Net worth</Box>
            <Heading size="2xl">${netWorth.toFixed(2)}</Heading>
          </Flex>
          <Flex direction="column">
            <Box>Net APY</Box>
            <Heading size="2xl">{weightedSupplyApy}%</Heading>
          </Flex>
          <Flex direction="column">
            <Box>Health factor</Box>
            <Heading size="2xl" color={healthFactorColor}>
              {healthFactorValue > 1000 ? "∞" : healthFactorValue.toFixed(2)}
            </Heading>
          </Flex>
          <Flex direction="column">
            <Box>Available Rewards</Box>
            <Heading size="2xl">$0</Heading>
          </Flex>
        </Flex>

        {isConnected ? (
          <Flex gap="4" direction={{ base: "column", lg: "row" }}>
            {/* LEFT COLUMN - SUPPLY */}
            <Box width={{ base: "100%", lg: "50%" }}>
              {/* Your Supplies */}
              <Box
                shadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
                borderRadius="5px"
                mb="20px"
              >
                <Heading size="xl" p="16px 24px">
                  Your supplies
                </Heading>
                {yourSupplies.length !== 0 && (
                  <Flex
                    gap="2"
                    alignItems="center"
                    px="24px"
                    mb="10px"
                    flexWrap="wrap"
                  >
                    <Box
                      p="4px 8px"
                      borderRadius="4px"
                      border="1px solid #eaebef"
                      fontSize="sm"
                    >
                      Balance $
                      {parseFloat(accountData.totalCollateral).toFixed(2)}
                    </Box>
                    <Box
                      p="4px 8px"
                      borderRadius="4px"
                      border="1px solid #eaebef"
                      fontSize="sm"
                    >
                      APY {weightedSupplyApy}%
                    </Box>
                    <Box
                      p="4px 8px"
                      borderRadius="4px"
                      border="1px solid #eaebef"
                      fontSize="sm"
                    >
                      Collateral $
                      {parseFloat(accountData.totalCollateral).toFixed(2)}
                    </Box>
                  </Flex>
                )}
                {yourSupplies.length !== 0 ? (
                  <Box p="15px">
                    <Table.Root size="sm">
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeader w="25%">Asset</Table.ColumnHeader>
                          <Table.ColumnHeader w="20%">
                            Balance
                          </Table.ColumnHeader>
                          <Table.ColumnHeader w="13%">APY</Table.ColumnHeader>
                          <Table.ColumnHeader w="12%">
                            Collateral
                          </Table.ColumnHeader>
                          <Table.ColumnHeader w="30%"></Table.ColumnHeader>
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
                                />
                                <Box>{item.name}</Box>
                              </Flex>
                            </Table.Cell>
                            <Table.Cell w="20%">
                              <Flex direction="column">
                                <Box fontSize="sm">{item.balance}</Box>
                                <Box fontSize="xs" color="gray.500">
                                  {item.dollarBalance}
                                </Box>
                              </Flex>
                            </Table.Cell>
                            <Table.Cell w="13%" fontSize="sm">
                              {item.apy}
                            </Table.Cell>
                            <Table.Cell w="12%">
                              <Switch.Root
                                colorPalette="green"
                                defaultChecked={item.isCollateral}
                                size="sm"
                              >
                                <Switch.HiddenInput />
                                <Switch.Control />
                              </Switch.Root>
                            </Table.Cell>
                            <Table.Cell w="30%">
                              <Flex gap="5px" justify="flex-end">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    openSupplyModal(
                                      item.symbol as "weth" | "usdc" | "eth"
                                    )
                                  }
                                >
                                  Supply
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    openWithdrawModal(
                                      item.name,
                                      item.symbol as "weth" | "usdc" | "eth"
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
                  <Box p="16px 24px">Nothing supplied yet</Box>
                )}
              </Box>

              {/* Assets to Supply */}
              <Box
                shadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
                borderRadius="5px"
                mb="20px"
              >
                <Heading size="xl" p="16px 24px">
                  Assets to supply
                </Heading>
                <Box p="15px">
                  <Table.Root size="sm">
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader w="30%">Assets</Table.ColumnHeader>
                        <Table.ColumnHeader w="25%">
                          Wallet Balance
                        </Table.ColumnHeader>
                        <Table.ColumnHeader w="15%">APY</Table.ColumnHeader>
                        <Table.ColumnHeader w="12%">
                          Can be collateral
                        </Table.ColumnHeader>
                        <Table.ColumnHeader w="18%"></Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {assetsToSupply.map((item) => (
                        <Table.Row key={item.id}>
                          <Table.Cell w="30%">
                            <Flex gap="10px" alignItems="center">
                              <Image
                                src={item.img}
                                width="28px"
                                height="28px"
                              />
                              <Box>{item.name}</Box>
                            </Flex>
                          </Table.Cell>
                          <Table.Cell w="25%">
                            <Box fontSize="sm">{item.balance}</Box>
                          </Table.Cell>
                          <Table.Cell w="15%" fontSize="sm">
                            {item.apy}
                          </Table.Cell>
                          <Table.Cell w="12%">
                            {item.canBeCollateral && (
                              <Icon size="md" color="green.600">
                                <FaCheck />
                              </Icon>
                            )}
                          </Table.Cell>
                          <Table.Cell w="18%">
                            <Button
                              size="sm"
                              onClick={() =>
                                openSupplyModal(
                                  item.symbol as "weth" | "usdc" | "eth"
                                )
                              }
                              disabled={parseFloat(item.walletBalance) === 0}
                            >
                              Supply
                            </Button>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                </Box>
              </Box>
            </Box>

            {/* RIGHT COLUMN - BORROW */}
            <Box width={{ base: "100%", lg: "50%" }}>
              {/* Your Borrows */}
              <Box
                shadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
                borderRadius="5px"
                mb="20px"
              >
                <Heading size="xl" p="16px 24px">
                  Your borrows
                </Heading>
                {yourBorrows.length !== 0 && (
                  <Flex
                    gap="2"
                    alignItems="center"
                    px="24px"
                    mb="10px"
                    flexWrap="wrap"
                  >
                    <Box
                      p="4px 8px"
                      borderRadius="4px"
                      border="1px solid #eaebef"
                      fontSize="sm"
                    >
                      Balance ${parseFloat(accountData.totalDebt).toFixed(2)}
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
                  <Box p="15px">
                    <Table.Root size="sm">
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeader w="30%">Asset</Table.ColumnHeader>
                          <Table.ColumnHeader w="25%">Debt</Table.ColumnHeader>
                          <Table.ColumnHeader w="15%">APY</Table.ColumnHeader>
                          <Table.ColumnHeader w="30%"></Table.ColumnHeader>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {yourBorrows.map((item) => (
                          <Table.Row key={item.id}>
                            <Table.Cell w="30%">
                              <Flex gap="10px" alignItems="center">
                                <Image src={item.img} w="28px" h="28px" />
                                <Box>{item.name}</Box>
                              </Flex>
                            </Table.Cell>
                            <Table.Cell w="25%">
                              <Flex direction="column">
                                <Box fontSize="sm">{item.debt}</Box>
                                <Box fontSize="xs" color="gray.500">
                                  {item.dollarDebt}
                                </Box>
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
                                      item.symbol as "weth" | "usdc" | "eth"
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
                                      item.symbol as "weth" | "usdc" | "eth"
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
                <Box p="15px">
                  <Table.Root size="sm">
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader w="30%">Asset</Table.ColumnHeader>
                        <Table.ColumnHeader w="25%">
                          Available
                        </Table.ColumnHeader>
                        <Table.ColumnHeader w="18%">
                          APY, variable
                        </Table.ColumnHeader>
                        <Table.ColumnHeader w="27%"></Table.ColumnHeader>
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
                              />
                              <Box>{item.name}</Box>
                            </Flex>
                          </Table.Cell>
                          <Table.Cell w="25%">
                            <Flex direction="column">
                              <Box fontSize="sm">{item.available}</Box>
                              <Box fontSize="xs" color="gray.500">
                                {item.dollarAvailable}
                              </Box>
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
                                    item.symbol as "weth" | "usdc" | "eth"
                                  )
                                }
                                disabled={
                                  parseFloat(accountData.availableBorrows) === 0
                                }
                              >
                                Borrow
                              </Button>
                              <Button size="sm" variant="outline">
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
          </Flex>
        ) : (
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            p="20px"
            h="60vh"
            bg="bg.muted"
            borderRadius="5px"
          >
            <Image src={notFoundImg} width="143px" height="200px" mb="15px" />
            <Heading mb="15px">Please, connect your wallet</Heading>
            <Box mb="25px">
              Please connect your wallet to see your supplies, borrowings, and
              open positions.
            </Box>
            <ConnectButton
              label="Connect Wallet"
              chainStatus="icon"
              showBalance={false}
              accountStatus="address"
            />
          </Flex>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
