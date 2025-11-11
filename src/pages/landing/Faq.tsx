import { Accordion, Box, Flex, Heading, Link, Span } from "@chakra-ui/react";
import { BiRightArrowAlt } from "react-icons/bi";

const Faq = () => {
  const accordionItems = [
    {
      value: "a",
      title: "What is Creditify?",
      text: "Creditify is a decentralised non-custodial liquidity protocol where users can participate as suppliers or borrowers. Suppliers provide liquidity to the market while earning interest, and borrowers can access liquidity by providing collateral that exceeds the borrowed amount.",
    },
    {
      value: "b",
      title: "Where are supplied tokens stored?",
      text: "Supplied tokens are stored in publicly accessible smart contracts that enable overcollateralised borrowing according to governance-approved parameters. The Creditify Protocol smart contracts have been audited and formally verified by third parties.",
    },
    {
      value: "c",
      title: "What is Creditify token?",
      text: "Creditify is used as the centre of gravity of Creditify Protocol governance. Creditify is used to vote and decide on the outcome of Creditify Improvement Proposals (AIPs). Apart from this, Creditify can be staked within the protocol Safety Module to provide a backstop in the case of a shortfall event, and earn incentives for doing so.",
    },
    {
      value: "d",
      title: "Does Creditify has risk?",
      text: "No protocol can be considered entirely risk free, but extensive steps have been taken to minimize these risks as much as possible – the Creditify Protocol code is publicly available and auditable by anyone, and has been audited by multiple smart contract auditors. Any code changes must be executed through the onchain governance processes. Additionally, there is an ongoing bug bounty campaign and service providers specializing in technical reviews and risk mitigation.",
    },
  ];

  return (
    <Box as={"section"} py={{ base: "60px", md: "80px", lg: "150px" }}>
      <Box maxW={"1140px"} mx={"auto"}>
        <Flex
          alignItems={{ lg: "flex-start" }}
          direction={{ base: "column", lg: "row" }}
          gap={{ base: "20px", lg: "0" }}
        >
          <Heading
            fontSize={{ base: "30px", sm: "40px", md: "48px", lg: "64px" }}
            lineHeight={{ base: "30px", sm: "40px", md: "48px", lg: "64px" }}
            w={{ base: "100%", lg: "30%" }}
            textAlign={{ base: "center", lg: "left" }}
          >
            FAQs
          </Heading>
          <Box w={{ base: "100%", lg: "70%" }}>
            <Accordion.Root collapsible>
              {accordionItems.map((item, index) => (
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
                      fontSize={{ base: "16px", md: "20px", lg: "24px" }}
                      className="faq-title"
                    >
                      {item.title}
                    </Span>
                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent>
                    <Accordion.ItemBody className="faq-body">
                      {item.text}
                    </Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>
              ))}
            </Accordion.Root>
            <Box textAlign={{ base: "center", lg: "left" }}>
              <Link
                href="#"
                fontSize={"24px"}
                color="#06B6D4"
                textDecoration={"underline"}
              >
                See more <BiRightArrowAlt size={"28px"} />
              </Link>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Faq;
