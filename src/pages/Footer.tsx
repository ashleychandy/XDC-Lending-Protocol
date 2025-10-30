import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <Box
      as="footer"
      shadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
      p="15px"
      bg="bg.panel"
    >
      <Flex gap="4" justify="center" alignItems="center">
        <NavLink target="_blank" to="https://xinfin.org/about">
          About us
        </NavLink>
        <NavLink target="_blank" to="https://docs.xdc.network/">
          Documentation
        </NavLink>
        <NavLink target="_blank" to="https://xinfin.org/contact">
          Contact us
        </NavLink>
        <NavLink target="_blank" to="https://faucet.apothem.network/">
          Xdc Faucet
        </NavLink>
      </Flex>
    </Box>
  );
}

export default Footer;
