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
import { Box, Button, Flex, Heading, Image, Table } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import usdcIcon from "../assets/images/usdc.svg";
import BorrowDoneModal from "./modal/BorrowDoneModal";
import BorrowModal from "./modal/BorrowModal";
import RepayDoneModal from "./modal/RepayDoneModal";
import RepayModal from "./modal/RepayModal";

function BorrowContent() {
  const { tokens, network } = useChainConfig();
  const [selectedToken, setSelectedToken] = useState<"weth" | "usdc" | "eth">(
    "weth"
  );

  // Get native token symbol (XDC, ETH, etc.)
  const nativeTokenSymbol = network.nativeToken.symbol;

  // Get token logo dynamically
  const wrappedTokenLogo = getTokenLogo(tokens.weth.symbol);
  const [amount, setAmount] = useState("");
  const [isBorrowModal, setIsBorrowModal] = useState<boolean>(false);
  const [isBorrowDoneModal, setIsBorrowDoneModal] = useState<boolean>(false);
  const [isRepayModal, setIsRepayModal] = useState<boolean>(false);
  const [isRepayDoneModal, setIsRepayDoneModal] = useState<boolean>(false);

  const navigate = useNavigate();
  const { address } = useAccount();
  const borrowHook = useBorrow();
  const repayHook = useRepay();
  const accountData = useUserAccountData();

  const { price: ethPrice } = useAssetPrice(tokens.weth.address);
  const { price: usdcPrice } = useAssetPrice(tokens.usdc.address);

  const wethReserveData = useReserveData(tokens.weth.address);
  const usdcReserveData = useReserveData(tokens.usdc.address);

  const wethUserData = useUserReserveData(
    tokens.weth.address,
    wethReserveData.aTokenAddress
  );

  const usdcUserData = useUserReserveData(
    tokens.usdc.address,
    usdcReserveData.aTokenAddress
  );

  const wethBorrowed = formatUnits(
    wethUserData.borrowedAmount as bigint,
    tokens.weth.decimals
  );

  const usdcBorrowed = formatUnits(
    usdcUserData.borrowedAmount as bigint,
    tokens.usdc.decimals
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
    },
    onError: (err) => {
      console.log("error in borrow transaction", err);
      setAmount("");
    },
  });

  const handleRepay = async () => {
    if (!address || !amount) return;
    const token = selectedToken === "eth" ? tokens.weth : tokens[selectedToken];
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

  const openBorrowModal = (tokenSymbol: "weth" | "usdc" | "eth") => {
    setSelectedToken(tokenSymbol);
    setIsBorrowModal(true);
  };

  const openRepayModal = (tokenSymbol: "weth" | "usdc" | "eth") => {
    setSelectedToken(tokenSymbol);
    setIsRepayModal(true);
  };

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
      name: tokens.weth.symbol, // WXDC on XDC, WETH on ETH chains
      symbol: "weth",
      debt: formatValue(parseFloat(wethBorrowed)),
      dollarDebt: `${formatUsdValue(parseFloat(wethBorrowed) * ethPrice)}`,
      apy: `${wethReserveData.borrowApy}%`,
      img: wrappedTokenLogo,
      actualAmount: wethUserData.borrowedAmount,
    },
  ].filter((item) => (item.actualAmount as bigint) > BigInt(0));

  // Assets to Borrow
  const assetsToBorrow = [
    {
      id: 1,
      name: tokens.weth.symbol, // WXDC on XDC, WETH on ETH chains
      symbol: "weth",
      available: formatValue(
        parseFloat(accountData.availableBorrows) / ethPrice
      ),
      dollarAvailable: `${formatUsdValue(
        parseFloat(accountData.availableBorrows)
      )}`,
      apy: `${wethReserveData.borrowApy}%`,
      img: wrappedTokenLogo,
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

  return (
    <Box width={{ base: "100%", lg: "50%" }}>
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
              ? formatValue(parseFloat(accountData.availableBorrows) / ethPrice)
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
          <Box p="15px" overflowX="auto">
            <Table.Root size="sm">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader w="30%" minW="100px">
                    Asset
                  </Table.ColumnHeader>
                  <Table.ColumnHeader w="25%" minW="100px">
                    Debt
                  </Table.ColumnHeader>
                  <Table.ColumnHeader w="15%" minW="60px">
                    APY
                  </Table.ColumnHeader>
                  <Table.ColumnHeader w="30%" minW="150px"></Table.ColumnHeader>
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
        <Box p="15px" overflowX="auto">
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader w="30%" minW="100px">
                  Asset
                </Table.ColumnHeader>
                <Table.ColumnHeader w="25%" minW="100px">
                  Available
                </Table.ColumnHeader>
                <Table.ColumnHeader w="18%" minW="80px">
                  APY, variable
                </Table.ColumnHeader>
                <Table.ColumnHeader w="27%" minW="150px"></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {assetsToBorrow.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell w="30%">
                    <Flex gap="10px" alignItems="center">
                      <Image src={item.img} width="28px" height="28px" />
                      <Box>{item.name}</Box>
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
                            item.symbol as "weth" | "usdc" | "eth"
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
                          navigate(`/asset-details?token=${item.symbol}`)
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
