import React from "react";
import { Container, Box, Flex, Heading, Image } from "@chakra-ui/react";
import xdcIcon from "../assets/images/xdc-icon.webp";

const Home = () => {
  return (
    <Container maxW="container.xl" h="100%">
      <Box h="100%" p="30px 0">
        <Flex gap="2" alignItems="center" mb="15px">
          <Image src={xdcIcon} width="32px" height="32px" />
          <Heading size="3xl">XDC Market</Heading>
        </Flex>
        <Flex gap="6" alignItems="center">
          <Flex direction="column">
            <Box>Total market size</Box>
            <Heading size="xl">$NaN</Heading>
          </Flex>
          <Flex direction="column">
            <Box>Total available</Box>
            <Heading size="xl">$NaN</Heading>
          </Flex>
          <Flex direction="column">
            <Box>Total borrows</Box>
            <Heading size="xl">$NaN</Heading>
          </Flex>
        </Flex>
      </Box>
    </Container>
  );
};

export default Home;
