import { getTokenLogo } from "@/config/tokenLogos";
import { formatUsdValue, formatValue } from "@/helpers/formatValue";
import { useAssetPrice } from "@/hooks/useAssetPrice";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useCollateral } from "@/hooks/useCollateral";
import { useReserveData } from "@/hooks/useReserveData";
import { useSupply } from "@/hooks/useSupply";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useTransactionFlow } from "@/hooks/useTransactionFlow";
import { useUserAccountData } from "@/hooks/useUserAccountData";
import { useUserReserveData } from "@/hooks/useUserReserveData";
import { useWithdraw } from "@/hooks/useWithdraw";
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Image,
  Switch,
  Table,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { formatUnits } from "viem";
import { useAccount, useBalance } from "wagmi";
import usdcIcon from "../assets/images/usdc.svg";
import SupplyDoneModal from "./modal/SupplyDoneModal";
import SupplyModal from "./modal/SupplyModal";
import WithdrawDoneModal from "./modal/WithdrawDoneModal";
import WithdrawModal from "./modal/WithdrawModal";

const SupplyContent = () => {
  const { tokens, network } = useChainConfig();
  const [selectedToken, setSelectedToken] = useState<"weth" | "usdc" | "eth">(
    "weth"
  );

  // Get native token symbol (XDC, ETH, etc.)
  const nativeTokenSymbol = network.nativeToken.symbol;

  // Get token logos dynamically
  const nativeTokenLogo = getTokenLogo(nativeTokenSymbol);
  const wrappedTokenLogo = getTokenLogo(tokens.weth.symbol);
  const [amount, setAmount] = useState("");
  const [isSupplyModal, setIsSupplyModal] = useState<boolean>(false);
  const [isSupplyDoneModal, setIsSupplyDoneModal] = useState<boolean>(false);
  const [isWithdrawModal, setIsWithdrawModal] = useState<boolean>(false);
  const [isWithdrawDoneModal, setIsWithdrawDoneModal] =
    useState<boolean>(false);

  const navigate = useNavigate();
  const supplyHook = useSupply();
  const withdrawHook = useWithdraw();
  const collateralHook = useCollateral();
  const { address } = useAccount();
  const accountData = useUserAccountData();

  const wethReserveData = useReserveData(tokens.weth.address);
  const usdcReserveData = useReserveData(tokens.usdc.address);

  const { data: ethBalance } = useBalance({
    address: address,
  });

  const { balance: wethBalance } = useTokenBalance(
    tokens.weth.address,
    tokens.weth.decimals
  );
  const { balance: usdcBalance } = useTokenBalance(
    tokens.usdc.address,
    tokens.usdc.decimals
  );

  const wethUserData = useUserReserveData(
    tokens.weth.address,
    wethReserveData.aTokenAddress
  );

  const usdcUserData = useUserReserveData(
    tokens.usdc.address,
    usdcReserveData.aTokenAddress
  );

  const wethSupplied = formatUnits(
    wethUserData.suppliedAmount as bigint,
    tokens.weth.decimals
  );

  const usdcSupplied = formatUnits(
    usdcUserData.suppliedAmount as bigint,
    tokens.usdc.decimals
  );

  const { price: ethPrice } = useAssetPrice(tokens.weth.address);
  const { price: usdcPrice } = useAssetPrice(tokens.usdc.address);

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

  const handleSupply = async () => {
    if (!address || !amount) return;
    const token = selectedToken === "eth" ? tokens.weth : tokens[selectedToken];
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

  const handleWithdraw = async () => {
    if (!address || !amount) return;
    const token = selectedToken === "eth" ? tokens.weth : tokens[selectedToken];
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

  const handleCollateralToggle = async (
    assetAddress: `0x${string}`,
    useAsCollateral: boolean
  ) => {
    try {
      await collateralHook.setCollateral(assetAddress, useAsCollateral);
    } catch (err) {
      console.error("Collateral toggle error:", err);
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

  useTransactionFlow({
    hash: collateralHook.hash,
    onSuccess: () => {
      console.log("Collateral setting updated successfully");
      // Data will automatically refresh due to wagmi's query invalidation
    },
    onError: (err) => {
      console.error("Error updating collateral setting:", err);
    },
  });

  const openSupplyModal = (tokenSymbol: "weth" | "usdc" | "eth") => {
    setSelectedToken(tokenSymbol);
    setIsSupplyModal(true);
  };

  const openWithdrawModal = (
    name: string,
    tokenSymbol: "weth" | "usdc" | "eth"
  ) => {
    // Check if it's the native token (XDC, ETH, etc.)
    const finalToken = name === nativeTokenSymbol ? "eth" : tokenSymbol;
    setSelectedToken(finalToken);
    setIsWithdrawModal(true);
  };

  const yourSupplies = [
    {
      id: 1,
      name: tokens.weth.symbol, // WXDC on XDC, WETH on ETH chains
      symbol: "weth",
      balance: formatValue(parseFloat(wethSupplied)),
      dollarBalance: `${formatUsdValue(parseFloat(wethSupplied) * ethPrice)}`,
      apy: `${parseFloat(wethReserveData.supplyApy)}%`,
      img: wrappedTokenLogo,
      isCollateral: wethUserData.isUsingAsCollateral,
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
      isCollateral: usdcUserData.isUsingAsCollateral,
      actualAmount: usdcUserData.suppliedAmount,
    },
  ].filter((item) => (item.actualAmount as bigint) > BigInt(0));

  // Assets to Supply - wallet balances
  const assetsToSupply = [
    {
      id: 1,
      name: nativeTokenSymbol, // XDC on XDC chains, ETH on ETH chains
      symbol: "eth",
      balance: ethBalance ? formatValue(parseFloat(ethBalance.formatted)) : "0",
      apy: `${wethReserveData.supplyApy}%`,
      img: nativeTokenLogo,
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
      name: tokens.weth.symbol, // WXDC on XDC, WETH on ETH chains
      symbol: "weth",
      balance: formatValue(parseFloat(wethBalance)),
      apy: `${wethReserveData.supplyApy}%`,
      img: wrappedTokenLogo,
      canBeCollateral: true,
      walletBalance: wethBalance,
    },
  ];

  return (
    <Box width={{ base: "100%", lg: "50%" }}>
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
          <Flex gap="2" alignItems="center" px="24px" mb="10px" flexWrap="wrap">
            <Box
              p="4px 8px"
              borderRadius="4px"
              border="1px solid #eaebef"
              fontSize="sm"
            >
              Balance ${parseFloat(accountData.totalCollateral).toFixed(2)}
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
              Collateral ${parseFloat(accountData.totalCollateral).toFixed(2)}
            </Box>
          </Flex>
        )}
        {yourSupplies.length !== 0 ? (
          <Box p="15px" overflowX="auto">
            <Table.Root size="sm">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader w="25%" minW="100px">
                    Asset
                  </Table.ColumnHeader>
                  <Table.ColumnHeader w="20%" minW="100px">
                    Balance
                  </Table.ColumnHeader>
                  <Table.ColumnHeader w="13%" minW="60px">
                    APY
                  </Table.ColumnHeader>
                  <Table.ColumnHeader w="12%" minW="80px">
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
                        <Image src={item.img} width="28px" height="28px" />
                        <Box>{item.name}</Box>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell w="20%">
                      <Flex direction="column">
                        <Box fontSize="sm">{item.balance}</Box>
                        <Box fontSize="xs">{item.dollarBalance}</Box>
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
                        onCheckedChange={(e) =>
                          handleCollateralToggle(
                            item.symbol === "weth"
                              ? tokens.weth.address
                              : tokens.usdc.address,
                            e.checked
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
        <Box p="15px" overflowX="auto">
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader w="23%" minW="100px">
                  Assets
                </Table.ColumnHeader>
                <Table.ColumnHeader w="23%" minW="100px">
                  Wallet Balance
                </Table.ColumnHeader>
                <Table.ColumnHeader w="15%" minW="60px">
                  APY
                </Table.ColumnHeader>
                <Table.ColumnHeader w="12%" minW="80px">
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
                      <Image src={item.img} width="28px" height="28px" />
                      <Box>{item.name}</Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell w="23%">
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
                  <Table.Cell w="27%">
                    <Flex justify="flex-end" gap="5px">
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
};

export default SupplyContent;
