import React from "react";
import { Box, Heading, Image, SimpleGrid } from "@chakra-ui/react";
import earnImg from "../../assets/images/landing/earn.png";
import swapImg from "../../assets/images/landing/swap.png";
import saveImg from "../../assets/images/landing/save.png";
import healthImg from "../../assets/images/landing/health.png";

const YourAssets = () => {
  const assetsDetails = [
    {
      img: earnImg,
      title: "Earn",
      desc: "Earn interests lending out assets.",
    },
    {
      img: swapImg,
      title: "Swap",
      desc: "Swap assets, even those Borrowed or Supplied",
    },
    {
      img: saveImg,
      title: "Save",
      desc: "Save and earn with creditify",
    },
    {
      img: healthImg,
      title: "Health",
      desc: "Easily track your loans.",
    },
  ];

  return (
    <Box as={"section"} mb={"80px"}>
      <Heading fontSize={"60px"} lineHeight={"60px"} mb={"50px"}>
        Your assets, your control.
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap="20px">
        {assetsDetails.map((x, i) => {
          return (
            <Box p={"30px 50px"} key={i}>
              <Image
                src={x.img}
                maxW={"350px"}
                w={"100%"}
                alt={`${x.title}-img`}
              />
              <Heading fontSize={"32px"} mb={"15px"}>
                {x.title}
              </Heading>
              <Box as={"p"}>{x.desc}</Box>
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default YourAssets;
