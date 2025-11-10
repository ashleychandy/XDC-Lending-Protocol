import React from "react";
import { Accordion, Box, Flex, Heading, Link, Span } from "@chakra-ui/react";
import { BiRightArrowAlt } from "react-icons/bi";

const Faq = () => {
  const accordionItems = [
    { value: "a", title: "What is Creditify?", text: "What is Creditify?" },
    {
      value: "b",
      title: "Where are supplied tokens stored?",
      text: "Where are supplied tokens stored?",
    },
    {
      value: "c",
      title: "What is Creditify token?",
      text: "What is Creditify token?",
    },
    {
      value: "d",
      title: "Does Creditify has risk?",
      text: "Does Creditify has risk?",
    },
  ];

  return (
    <Box as={"section"} py={"150px"}>
      <Box maxW={"1144px"} mx={"auto"}>
        <Flex alignItems={"flex-start"}>
          <Heading fontSize={"64px"} lineHeight={"64px"} w={"30%"}>
            FAQs
          </Heading>
          <Box w={"70%"}>
            <Accordion.Root collapsible>
              {accordionItems.map((item, index) => (
                <Accordion.Item
                  key={index}
                  className="box"
                  border="1px solid #FFFFFF05"
                  value={item.value}
                  borderRadius={"12px"}
                  p={"23px 20px"}
                  mb={"25px"}
                >
                  <Accordion.ItemTrigger>
                    <Span
                      fontWeight={"400"}
                      flex="1"
                      fontSize={"24px"}
                      color="#FFFFFFA6"
                    >
                      {item.title}
                    </Span>
                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent>
                    <Accordion.ItemBody>{item.text}</Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>
              ))}
            </Accordion.Root>
            <Link
              href="#"
              fontSize={"24px"}
              color="#06B6D4"
              textDecoration={"underline"}
            >
              See more <BiRightArrowAlt size={"28px"} />
            </Link>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Faq;
