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
import { formatValue } from "@/helpers/formatValue";

const Dashboard = () => {
  const [isSupplyModal, setIsSupplyModal] = useState<boolean>(false);
  const [isSupplyDoneModal, setIsSupplyDoneModal] = useState<boolean>(false);
  const [isBorrowModal, setIsBorrowModal] = useState<boolean>(false);
  const [isBorrowDoneModal, setIsBorrowDoneModal] = useState<boolean>(false);
  const [isRepayModal, setIsRepayModal] = useState<boolean>(false);
  const [isWithdrawModal, setIsWithdrawModal] = useState<boolean>(false);

  const { address, isConnected } = useAccount();
  const [selectedToken, setSelectedToken] = useState<"weth" | "usdc">("weth");
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
      dollarBalance: `$${formatValue(parseFloat(wethSupplied) * ethPrice)}`,
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
      dollarBalance: `$${formatValue(parseFloat(usdcSupplied) * usdcPrice)}`,
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
      name: "WETH",
      symbol: "weth",
      balance: formatValue(parseFloat(wethBalance)),
      apy: `${wethReserveData.supplyApy}%`,
      img: wethIcon,
      canBeCollateral: true,
      walletBalance: wethBalance,
    },
    {
      id: 3,
      name: "USDC",
      symbol: "usdc",
      balance: formatValue(parseFloat(usdcBalance)),
      apy: `${usdcReserveData.supplyApy}%`,
      img: usdcIcon,
      canBeCollateral: true,
      walletBalance: usdcBalance,
    },
  ];

  // Your Borrows - based on debt
  const yourBorrows = [
    {
      id: 1,
      name: "ETH",
      symbol: "weth",
      debt: formatValue(parseFloat(wethBorrowed)),
      dollarDebt: `$${formatValue(parseFloat(wethBorrowed) * ethPrice)}`,
      apy: `${wethReserveData.borrowApy}%`,
      img: ethIcon,
      actualAmount: wethUserData.borrowedAmount,
    },
    {
      id: 2,
      name: "USDC",
      symbol: "usdc",
      debt: formatValue(parseFloat(usdcBorrowed)),
      dollarDebt: `$${formatValue(parseFloat(usdcBorrowed) * usdcPrice)}`,
      apy: `${usdcReserveData.borrowApy}%`,
      img: usdcIcon,
      actualAmount: usdcUserData.borrowedAmount,
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
      dollarAvailable: `$${formatValue(
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
      dollarAvailable: `$${formatValue(
        parseFloat(accountData.availableBorrows)
      )}`,
      apy: `${usdcReserveData.borrowApy}%`,
      img: usdcIcon,
    },
  ];

  const handleSupply = async () => {
    if (!address || !amount) return;
    const token = TOKENS[selectedToken];
    try {
      await supplyHook.approve(token.address, amount, token.decimals);
      setTimeout(async () => {
        await supplyHook.supply(token.address, amount, token.decimals, address);
        setIsSupplyDoneModal(true);
        setAmount("");
      }, 2000);
    } catch (err) {
      console.error("Supply error:", err);
    }
  };

  const handleBorrow = async () => {
    if (!address || !amount) return;
    const token = TOKENS[selectedToken];
    try {
      await borrowHook.borrow(token.address, amount, token.decimals, address);
      setIsBorrowDoneModal(true);
      setAmount("");
    } catch (err) {
      console.error("Borrow error:", err);
    }
  };

  const handleWithdraw = async () => {
    if (!address || !amount) return;
    const token = TOKENS[selectedToken];
    try {
      await withdrawHook.withdraw(
        token.address,
        amount,
        token.decimals,
        address
      );
      setAmount("");
    } catch (err) {
      console.error("Withdraw error:", err);
    }
  };

  const handleRepay = async () => {
    if (!address || !amount) return;
    const token = TOKENS[selectedToken];
    try {
      await repayHook.approve(token.address, amount, token.decimals);
      setTimeout(async () => {
        await repayHook.repay(token.address, amount, token.decimals, address);
        setAmount("");
      }, 2000);
    } catch (err) {
      console.error("Repay error:", err);
    }
  };

  // Open modals with selected token
  const openSupplyModal = (tokenSymbol: "weth" | "usdc" | "eth") => {
    // Convert ETH to WETH for contract interaction
    setSelectedToken(tokenSymbol === "eth" ? "weth" : tokenSymbol);
    setIsSupplyModal(true);
  };

  const openWithdrawModal = (tokenSymbol: "weth" | "usdc") => {
    setSelectedToken(tokenSymbol);
    setIsWithdrawModal(true);
  };

  const openBorrowModal = (tokenSymbol: "weth" | "usdc") => {
    setSelectedToken(tokenSymbol);
    setIsBorrowModal(true);
  };

  const openRepayModal = (tokenSymbol: "weth" | "usdc") => {
    setSelectedToken(tokenSymbol);
    setIsRepayModal(true);
  };

  // Calculate net worth and health factor color
  const netWorth =
    parseFloat(accountData.totalCollateral) - parseFloat(accountData.totalDebt);
  const healthFactorValue = parseFloat(accountData.healthFactor);
  const healthFactorColor =
    healthFactorValue < 1.5
      ? "red.600"
      : healthFactorValue < 2
      ? "orange.500"
      : "green.600";
  const borrowPowerUsed =
    parseFloat(accountData.totalCollateral) > 0
      ? (
          (parseFloat(accountData.totalDebt) /
            parseFloat(accountData.totalCollateral)) *
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
            onClose={() => setIsSupplyModal(false)}
            tokenSymbol={selectedToken}
            amount={amount}
            setAmount={setAmount}
            onClickSupply={() => {
              handleSupply();
              setIsSupplyModal(false);
            }}
          />
        )}
        {isSupplyDoneModal && (
          <SupplyDoneModal
            isOpen={isSupplyDoneModal}
            onClose={() => setIsSupplyDoneModal(false)}
          />
        )}
        {isWithdrawModal && (
          <WithdrawModal
            isOpen={isWithdrawModal}
            onClose={() => setIsWithdrawModal(false)}
            tokenSymbol={selectedToken}
            amount={amount}
            setAmount={setAmount}
            onClickWithdraw={() => {
              handleWithdraw();
              setIsWithdrawModal(false);
            }}
          />
        )}
        {isBorrowModal && (
          <BorrowModal
            isOpen={isBorrowModal}
            onClose={() => setIsBorrowModal(false)}
            tokenSymbol={selectedToken}
            amount={amount}
            setAmount={setAmount}
            onClickBorrow={() => {
              handleBorrow();
              setIsBorrowModal(false);
            }}
          />
        )}
        {isBorrowDoneModal && (
          <BorrowDoneModal
            isOpen={isBorrowDoneModal}
            onClose={() => setIsBorrowDoneModal(false)}
          />
        )}
        {isRepayModal && (
          <RepayModal
            isOpen={isRepayModal}
            onClose={() => setIsRepayModal(false)}
            tokenSymbol={selectedToken}
            amount={amount}
            setAmount={setAmount}
            onClickRepay={() => {
              handleRepay();
              setIsRepayModal(false);
            }}
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
            <Box>LTV</Box>
            <Heading size="2xl">{accountData.ltv}%</Heading>
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
                            <Table.Cell w="25%" border="none">
                              <Flex gap="10px" alignItems="center">
                                <Image
                                  src={item.img}
                                  width="28px"
                                  height="28px"
                                />
                                <Box>{item.name}</Box>
                              </Flex>
                            </Table.Cell>
                            <Table.Cell w="20%" border="none">
                              <Flex direction="column">
                                <Box fontSize="sm">{item.balance}</Box>
                                <Box fontSize="xs" color="gray.500">
                                  {item.dollarBalance}
                                </Box>
                              </Flex>
                            </Table.Cell>
                            <Table.Cell w="13%" border="none" fontSize="sm">
                              {item.apy}
                            </Table.Cell>
                            <Table.Cell w="12%" border="none">
                              <Switch.Root
                                colorPalette="green"
                                defaultChecked={item.isCollateral}
                                size="sm"
                              >
                                <Switch.HiddenInput />
                                <Switch.Control />
                              </Switch.Root>
                            </Table.Cell>
                            <Table.Cell w="30%" border="none">
                              <Flex gap="5px" justify="flex-end">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    openSupplyModal(
                                      item.symbol as "weth" | "usdc"
                                    )
                                  }
                                >
                                  Supply
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    openWithdrawModal(
                                      item.symbol as "weth" | "usdc"
                                    )
                                  }
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
                          <Table.Cell w="30%" border="none">
                            <Flex gap="10px" alignItems="center">
                              <Image
                                src={item.img}
                                width="28px"
                                height="28px"
                              />
                              <Box>{item.name}</Box>
                            </Flex>
                          </Table.Cell>
                          <Table.Cell w="25%" border="none">
                            <Box fontSize="sm">{item.balance}</Box>
                          </Table.Cell>
                          <Table.Cell w="15%" border="none" fontSize="sm">
                            {item.apy}
                          </Table.Cell>
                          <Table.Cell w="12%" border="none">
                            {item.canBeCollateral && (
                              <Icon size="md" color="green.600">
                                <FaCheck />
                              </Icon>
                            )}
                          </Table.Cell>
                          <Table.Cell w="18%" border="none">
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
                            <Table.Cell w="30%" border="none">
                              <Flex gap="10px" alignItems="center">
                                <Image src={item.img} w="28px" h="28px" />
                                <Box>{item.name}</Box>
                              </Flex>
                            </Table.Cell>
                            <Table.Cell w="25%" border="none">
                              <Flex direction="column">
                                <Box fontSize="sm">{item.debt}</Box>
                                <Box fontSize="xs" color="gray.500">
                                  {item.dollarDebt}
                                </Box>
                              </Flex>
                            </Table.Cell>
                            <Table.Cell w="15%" border="none" fontSize="sm">
                              {item.apy}
                            </Table.Cell>
                            <Table.Cell w="30%" border="none">
                              <Flex justify="flex-end" gap="5px">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    openBorrowModal(
                                      item.symbol as "weth" | "usdc"
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
                                      item.symbol as "weth" | "usdc"
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
                          <Table.Cell w="30%" border="none">
                            <Flex gap="10px" alignItems="center">
                              <Image
                                src={item.img}
                                width="28px"
                                height="28px"
                              />
                              <Box>{item.name}</Box>
                            </Flex>
                          </Table.Cell>
                          <Table.Cell w="25%" border="none">
                            <Flex direction="column">
                              <Box fontSize="sm">{item.available}</Box>
                              <Box fontSize="xs" color="gray.500">
                                {item.dollarAvailable}
                              </Box>
                            </Flex>
                          </Table.Cell>
                          <Table.Cell w="18%" border="none" fontSize="sm">
                            {item.apy}
                          </Table.Cell>
                          <Table.Cell w="27%" border="none">
                            <Flex justify="flex-end" gap="5px">
                              <Button
                                size="sm"
                                onClick={() =>
                                  openBorrowModal(
                                    item.symbol as "weth" | "usdc"
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
            h="62vh"
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
