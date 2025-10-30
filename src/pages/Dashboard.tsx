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
import React, { useState } from "react";
import { useAccount } from "wagmi";
import xdcIcon from "../assets/images/xdc-icon.webp";
import usdcIcon from "../assets/images/usdc.svg";
import notFoundImg from "../assets/images/not-found.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import SupplyModal from "./modal/SupplyModal";
import WithdrawModal from "./modal/WithdrawModal";
import { FaCheck } from "react-icons/fa6";
import BorrowModal from "./modal/BorrowModal";
import RepayModal from "./modal/RepayModal";
import SupplyDoneModal from "./modal/SupplyDoneModal";
import BorrowDoneModal from "./modal/BorrowDoneModal";

const Dashboard = () => {
  const yourSupplies = [
    {
      id: 1,
      name: "XDC",
      balance: 0.5,
      dollarBalance: "$2,000.00",
      apy: 0,
      img: xdcIcon,
    },
  ];

  const assetsToSupply = [
    {
      id: 1,
      name: "XDC",
      balance: 0.5,
      dollarBalance: "$2,000.00",
      apy: 0,
      img: xdcIcon,
    },
  ];

  const yourBorrows = [
    {
      id: 1,
      name: "USDC",
      debt: 0.5,
      dollarDebt: "$0.50",
      apy: "89.65%",
      img: usdcIcon,
    },
  ];

  const assetsToBorrow = [
    {
      id: 1,
      name: "USDC",
      available: 0.5,
      dollarAvailable: "$1,583.50",
      apy: 0,
      img: usdcIcon,
    },
  ];

  const [isSupplyModal, setIsSupplyModal] = useState<boolean>(false);
  const [isSupplyDoneModal, setIsSupplyDoneModal] = useState<boolean>(false);
  const [isBorrowModal, setIsBorrowModal] = useState<boolean>(false);
  const [isBorrowDoneModal, setIsBorrowDoneModal] = useState<boolean>(false);
  const [isRepayModal, setIsRepayModal] = useState<boolean>(false);
  const [isWithdrawModal, setIsWithdrawModal] = useState<boolean>(false);
  const { isConnected } = useAccount();
  return (
    <Container maxW="container.xl" h="100%">
      <Box h="100%" p="30px 0">
        {isSupplyModal && (
          <SupplyModal
            isOpen={isSupplyModal}
            onClose={() => setIsSupplyModal(false)}
            onClickSupply={() => {
              setIsSupplyModal(false);
              setIsSupplyDoneModal(true);
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
          />
        )}
        {isBorrowModal && (
          <BorrowModal
            isOpen={isBorrowModal}
            onClose={() => setIsBorrowModal(false)}
            onClickBorrow={() => {
              setIsBorrowModal(false);
              setIsBorrowDoneModal(true);
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
          />
        )}
        <Flex gap="2" alignItems="center" mb="15px">
          <Image src={xdcIcon} width="32px" height="32px" />
          <Heading size="3xl">XDC Market</Heading>
        </Flex>
        <Flex gap="6" alignItems="center" mb="50px">
          <Flex direction="column">
            <Box>Net worth</Box>
            <Heading size="2xl">$0</Heading>
          </Flex>
          <Flex direction="column">
            <Box>Net APY</Box>
            <Box fontSize="21px" fontWeight="700">
              —
            </Box>
          </Flex>
          <Flex direction="column">
            <Box>Health factor</Box>
            <Heading size="2xl" color="green.600">
              3.30K
            </Heading>
          </Flex>
          <Flex direction="column">
            <Box>Available rewards</Box>
            <Heading size="2xl">$0</Heading>
          </Flex>
        </Flex>
        {isConnected ? (
          <Flex gap="4">
            <Box width="50%">
              <Box
                shadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
                borderRadius="5px"
                mb="20px"
              >
                <Heading size="xl" p="16px 24px">
                  Your supplies
                </Heading>
                {yourSupplies.length === 0 && (
                  <Flex gap="2" alignItems="center" px="24px">
                    <Flex direction="column">
                      <Box
                        p="2px 4px"
                        borderRadius="4px"
                        border="1px solid #eaebef"
                      >
                        Balance $ 2,000.00
                      </Box>
                    </Flex>
                    <Flex direction="column">
                      <Box
                        p="2px 4px"
                        borderRadius="4px"
                        border="1px solid #eaebef"
                      >
                        APY 0 %
                      </Box>
                    </Flex>
                    <Flex direction="column">
                      <Box
                        p="2px 4px"
                        borderRadius="4px"
                        border="1px solid #eaebef"
                      >
                        Collateral $ 2,000.00
                      </Box>
                    </Flex>
                  </Flex>
                )}
                {yourSupplies.length === 0 ? (
                  <Box p="15px">
                    <Table.Root size="sm">
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeader w="20%">Asset</Table.ColumnHeader>
                          <Table.ColumnHeader w="20%">
                            Balance
                          </Table.ColumnHeader>
                          <Table.ColumnHeader w="13%">APY</Table.ColumnHeader>
                          <Table.ColumnHeader w="14%">
                            Collateral
                          </Table.ColumnHeader>
                          <Table.ColumnHeader w="33%"></Table.ColumnHeader>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {yourSupplies.map((item) => (
                          <Table.Row key={item.id}>
                            <Table.Cell w="20%" border="none" gap="10px">
                              <Flex gap="15px" alignItems="center">
                                <Image
                                  src={item.img}
                                  width="32px"
                                  height="32px"
                                ></Image>
                                <Box>{item.name}</Box>
                              </Flex>
                            </Table.Cell>
                            <Table.Cell w="20%" border="none">
                              <Flex direction="column">
                                <Box>{item.balance}</Box>
                                <Box>{item.dollarBalance}</Box>
                              </Flex>
                            </Table.Cell>
                            <Table.Cell w="13%" border="none">
                              {item.apy}
                            </Table.Cell>
                            <Table.Cell w="14%" border="none">
                              <Switch.Root colorPalette="green" defaultChecked>
                                <Switch.HiddenInput />
                                <Switch.Control />
                                <Switch.Label />
                              </Switch.Root>
                            </Table.Cell>
                            <Table.Cell w="33%" border="none">
                              <Button
                                size="sm"
                                mr="5px"
                                onClick={() => setIsSupplyModal(true)}
                              >
                                Supply
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setIsWithdrawModal(true)}
                              >
                                Withdraw
                              </Button>
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
              <Box
                shadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
                borderRadius="5px"
                mb="20px"
              >
                <Heading size="xl" p="16px 24px">
                  Assets to supply
                </Heading>
                {assetsToSupply.length !== 0 ? (
                  <Box p="15px">
                    <Table.Root size="sm">
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeader>Assets</Table.ColumnHeader>
                          <Table.ColumnHeader>
                            Wallet Balance
                          </Table.ColumnHeader>
                          <Table.ColumnHeader>APY</Table.ColumnHeader>
                          <Table.ColumnHeader>
                            Can be collateral
                          </Table.ColumnHeader>
                          <Table.ColumnHeader></Table.ColumnHeader>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {assetsToSupply.map((item) => (
                          <Table.Row key={item.id}>
                            <Table.Cell border="none" gap="10px">
                              <Flex gap="15px" alignItems="center">
                                <Image
                                  src={item.img}
                                  width="32px"
                                  height="32px"
                                ></Image>
                                <Box>{item.name}</Box>
                              </Flex>
                            </Table.Cell>
                            <Table.Cell border="none">
                              {item.balance}
                            </Table.Cell>
                            <Table.Cell border="none">{item.apy}</Table.Cell>
                            <Table.Cell border="none">
                              <Icon size="md" color="green.600">
                                <FaCheck />
                              </Icon>
                            </Table.Cell>
                            <Table.Cell border="none">
                              <Button
                                size="sm"
                                mr="5px"
                                onClick={() => setIsSupplyModal(true)}
                              >
                                Supply
                              </Button>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Root>
                  </Box>
                ) : (
                  <Box p="16px 24px">No assets have been supplied yet</Box>
                )}
              </Box>
            </Box>
            <Box width="50%">
              <Box
                shadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
                borderRadius="5px"
                mb="20px"
              >
                <Heading size="xl" p="16px 24px">
                  Your borrows
                </Heading>
                {yourBorrows.length !== 0 && (
                  <Flex gap="2" alignItems="center" px="24px">
                    <Flex direction="column">
                      <Box
                        p="2px 4px"
                        borderRadius="4px"
                        border="1px solid #eaebef"
                      >
                        Balance $ 0.50
                      </Box>
                    </Flex>
                    <Flex direction="column">
                      <Box
                        p="2px 4px"
                        borderRadius="4px"
                        border="1px solid #eaebef"
                      >
                        APY 89.65 %
                      </Box>
                    </Flex>
                    <Flex direction="column">
                      <Box
                        p="2px 4px"
                        borderRadius="4px"
                        border="1px solid #eaebef"
                      >
                        Borrow power used 0.03 %
                      </Box>
                    </Flex>
                  </Flex>
                )}
                {yourBorrows.length !== 0 ? (
                  <Box p="15px">
                    <Table.Root size="sm" width="100%">
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeader w="30%">Asset</Table.ColumnHeader>
                          <Table.ColumnHeader w="20%">Debt</Table.ColumnHeader>
                          <Table.ColumnHeader w="20%">APY</Table.ColumnHeader>
                          <Table.ColumnHeader w="30%"></Table.ColumnHeader>
                        </Table.Row>
                      </Table.Header>

                      <Table.Body>
                        {yourBorrows.map((item) => (
                          <Table.Row key={item.id}>
                            <Table.Cell w="30%" border="none">
                              <Flex gap="15px" alignItems="center">
                                <Image src={item.img} w="32px" h="32px" />
                                <Box>{item.name}</Box>
                              </Flex>
                            </Table.Cell>
                            <Table.Cell w="20%" border="none">
                              <Flex direction="column">
                                <Box>{item.debt}</Box>
                                <Box>{item.dollarDebt}</Box>
                              </Flex>
                            </Table.Cell>
                            <Table.Cell w="20%" border="none">
                              {item.apy}
                            </Table.Cell>
                            <Table.Cell w="30%" border="none">
                              <Flex justify="flex-end" gap="2">
                                <Button
                                  size="sm"
                                  onClick={() => setIsBorrowModal(true)}
                                >
                                  Borrow
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setIsRepayModal(true)}
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
              <Box
                shadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
                borderRadius="5px"
                mb="20px"
              >
                <Heading size="xl" p="16px 24px">
                  Assets to borrow
                </Heading>
                {assetsToBorrow.length !== 0 ? (
                  <Box p="15px">
                    <Table.Root size="sm">
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeader w="30%">Asset</Table.ColumnHeader>
                          <Table.ColumnHeader w="20%">
                            Available
                          </Table.ColumnHeader>
                          <Table.ColumnHeader w="20%">
                            APY, variable
                          </Table.ColumnHeader>
                          <Table.ColumnHeader w="30%"></Table.ColumnHeader>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {assetsToBorrow.map((item) => (
                          <Table.Row key={item.id}>
                            <Table.Cell w="30%" border="none" gap="10px">
                              <Flex gap="15px" alignItems="center">
                                <Image
                                  src={item.img}
                                  width="32px"
                                  height="32px"
                                ></Image>
                                <Box>{item.name}</Box>
                              </Flex>
                            </Table.Cell>
                            <Table.Cell w="20%" border="none">
                              <Flex direction="column">
                                <Box>{item.available}</Box>
                                <Box>{item.dollarAvailable}</Box>
                              </Flex>
                            </Table.Cell>
                            <Table.Cell w="20%" border="none">
                              {item.apy}
                            </Table.Cell>
                            <Table.Cell w="30%" border="none">
                              <Flex justify="flex-end" gap="2">
                                <Button
                                  size="sm"
                                  onClick={() => setIsBorrowModal(true)}
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
                ) : (
                  <Box p="16px 24px">No assets have been borrowed yet</Box>
                )}
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
