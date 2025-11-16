import { Accordion, Box, Button, Flex, Heading, Span } from "@chakra-ui/react";
import { useState } from "react";

const Faq = () => {
  const [showMore, setShowMore] = useState(false);

  const allAccordionItems = [
    {
      value: "a",
      title: "What is Creditify?",
      text: "A decentralized, non-custodial lending protocol on the XDC Network where users can supply assets to earn yield and borrow against their collateral.",
    },
    {
      value: "b",
      title: "How does Creditify work?",
      text: "Users deposit assets into liquidity pools, earn yield, and can borrow other assets using their deposits as collateral. Interest rates adjust algorithmically based on supply and demand.",
    },
    {
      value: "c",
      title: "Which assets are supported?",
      text: "Currently USDC, XDC, CGO (gold-backed token). More assets may be added based on demand, liquidity, and risk assessments.",
    },
    {
      value: "d",
      title: "Where are my supplied tokens stored?",
      text: "All assets are stored in smart contracts on the XDC blockchain, not with Creditify. You retain full ownership and control at all times.",
    },
    {
      value: "e",
      title: "What wallets can I use with Creditify?",
      text: "Creditify supports: XDC Pay, MetaMask (with XDC network added), Any Web3 wallet compatible with EVM chains",
    },
    {
      value: "f",
      title: "Is Creditify audited?",
      text: "Yes. Smart contracts undergo third-party audits, formal verification, and continuous security monitoring. Audit reports and proofs are publicly available.",
    },
    {
      value: "g",
      title: "What are the risks?",
      text: "Using Creditify involves: Liquidation risk, Token volatility",
    },
    {
      value: "h",
      title: "How do interest rates work?",
      text: "APYs are algorithmically determined by the lending market. When demand to borrow increases, APYs rise; when demand drops, APYs fall.",
    },
    {
      value: "i",
      title: "What is liquidation?",
      text: "If your collateral value drops below the required threshold, your position may be partially liquidated to maintain solvency. Liquidation protects the protocol and lenders.",
    },
    {
      value: "j",
      title: "How do I borrow?",
      text: "Supply assets → enable them as collateral → choose a borrow asset → confirm transaction. Borrowing is instant.",
    },
  ];

  const displayedItems = showMore
    ? allAccordionItems
    : allAccordionItems.slice(0, 4);

  return (
    <Box
      as={"section"}
      pt={{ base: "60px", md: "80px", lg: "200px" }}
      pb={{ base: "60px", md: "80px", lg: "150px" }}
    >
      <Box maxW={"1140px"} mx={"auto"}>
        <Flex
          alignItems={{ lg: "flex-start" }}
          direction={{ base: "column", lg: "row" }}
          gap={{ base: "20px", lg: "0" }}
        >
          <Heading
            fontSize={{ base: "30px", sm: "40px", md: "48px", lg: "70px" }}
            lineHeight={{ base: "30px", sm: "40px", md: "48px", lg: "70px" }}
            w={{ base: "100%", lg: "30%" }}
            textAlign={{ base: "center", lg: "left" }}
          >
            FAQs
          </Heading>
          <Box w={{ base: "100%", lg: "70%" }}>
            <Accordion.Root collapsible>
              {displayedItems.map((item, index) => (
                <Accordion.Item
                  key={index}
                  className="box faq-item"
                  value={item.value}
                  borderRadius={"12px"}
                  p={"23px 20px"}
                  mb={"25px"}
                >
                  <Accordion.ItemTrigger>
                    <Span
                      fontWeight={"400"}
                      flex="1"
                      fontSize={{ base: "14px", md: "16px", lg: "18px" }}
                      className="faq-title"
                    >
                      {item.title}
                    </Span>
                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent>
                    <Accordion.ItemBody
                      className="faq-body"
                      fontSize={{ base: "12px", md: "14px", lg: "16px" }}
                    >
                      {item.text}
                    </Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>
              ))}
            </Accordion.Root>
            <Box textAlign={{ base: "center", lg: "left" }}>
              <Button
                onClick={() => setShowMore(!showMore)}
                variant="plain"
                fontSize={{ base: "14px", md: "16px", lg: "18px" }}
                color="#000"
                textDecoration={"underline"}
                cursor="pointer"
                _hover={{ opacity: 0.7 }}
              >
                {showMore ? "See less" : "See more"}
              </Button>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Faq;
