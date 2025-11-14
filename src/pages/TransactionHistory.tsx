import { useAssetDetails } from "@/hooks/useAssetDetails";
import { useChainConfig } from "@/hooks/useChainConfig";
import Header from "@/pages/Header";
import {
  Box,
  Container,
  createListCollection,
  Flex,
  Heading,
  Image,
  Portal,
  Select,
  Spinner,
} from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";

const TransactionHistory = () => {
  const { network } = useChainConfig();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "xdc";

  const { isLoading } = useAssetDetails(token);

  const transactions = createListCollection({
    items: [
      { label: "All Transactions", value: "all" },
      { label: "Supply", value: "supply" },
      { label: "Withdraw", value: "withdraw" },
      { label: "Borrow", value: "borrow" },
      { label: "Repay", value: "repay" },
    ],
  });

  if (isLoading) {
    return (
      <>
        <Header />
        <Container
          maxW="container.xl"
          px={{ base: 4, md: 6 }}
          py={4}
          pt="80px"
          h="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="xl" />
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Box pt={"60px"} pb={"94px"} bg={"#2b2d3c"}>
        <Container
          maxW={{
            base: "100%",
            lg: "container.lg",
            xl: "container.xl",
          }}
          h="100%"
        >
          <Box className="light-text-1" fontSize={"18px"}>
            Transaction history
          </Box>
          <Flex alignItems="center" gap="10px" mb="15px">
            <Flex gap="2" alignItems="center">
              <Image
                src={network.icon}
                width="32px"
                height="32px"
                objectFit="contain"
                flexShrink={0}
              />

              <Heading
                size="lg"
                className="text-white-1"
                fontSize={"32px"}
                lineHeight={"32px"}
              >
                {network.name} Market
              </Heading>
            </Flex>
          </Flex>
        </Container>
      </Box>
      <Box mt={"-50px"}>
        <Container
          maxW={{
            base: "100%",
            lg: "container.lg",
            xl: "container.xl",
          }}
          h="100%"
        >
          <Box
            shadow="rgba(0, 0, 0, 0.05) 0px 2px 1px, rgba(0, 0, 0, 0.25) 0px 0px 1px"
            bg={"#fff"}
            border={"1px solid #eaebef"}
            borderRadius="5px"
            p="16px 24px"
          >
            <Heading size="xl" className="title-text-1" mb={"30px"}>
              Transactions
            </Heading>
            <Select.Root
              multiple
              defaultValue={["all"]}
              collection={transactions}
              size="sm"
              width="320px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="All Transactions" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {transactions.items.map((framework) => (
                      <Select.Item item={framework} key={framework.value}>
                        {framework.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
            <Box py={"120px"} textAlign={"center"}>
              No transactions yet.
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TransactionHistory;
