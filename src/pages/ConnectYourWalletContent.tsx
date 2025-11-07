import React from "react";
import { Box, Flex, Heading, Image } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import notFoundImg from "../assets/images/not-found.png";

const ConnectYourWalletContent = () => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      p="20px"
      h="60vh"
      bg="bg.muted"
      borderRadius="5px"
    >
      <Image src={notFoundImg} width="143px" height="200px" mb="15px" />
      <Heading mb="15px">Please, connect your wallet</Heading>
      <Box mb="25px">
        Please connect your wallet to see your supplies, borrowings, and open
        positions.
      </Box>
      <ConnectButton
        label="Connect Wallet"
        chainStatus="icon"
        showBalance={false}
        accountStatus="address"
      />
    </Flex>
  );
};

export default ConnectYourWalletContent;
