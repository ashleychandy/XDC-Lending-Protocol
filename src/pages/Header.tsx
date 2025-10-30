import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import xdcDarkLogo from "../assets/images/xdc-network-logo.svg";
import xdcLightLogo from "../assets/images/xdc-network-logo-white.svg";
import { NavLink } from "react-router";
import { Box, Flex } from "@chakra-ui/react";
import { ColorModeButton, useColorMode } from "@/components/ui/color-mode";

const Header = () => {
  const { colorMode } = useColorMode();
  return (
    <Box
      as="header"
      p="8px 20px"
      shadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
      bg="bg.panel"
      borderBottomWidth="1px"
    >
      <Flex gap="4" justify="space-between" alignItems="center">
        <Flex gap="10" justify="space-between" alignItems="center">
          <Box w="80px">
            {colorMode === "dark" ? (
              <img src={xdcLightLogo} alt="XDC-Logo-Light" />
            ) : (
              <img src={xdcDarkLogo} alt="XDC-Logo-Dark" />
            )}
          </Box>
          <Flex gap="4" justify="space-between" alignItems="center">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/market">Markets</NavLink>
            <NavLink to="/governance">Governance</NavLink>
            <NavLink to="/savings">Savings</NavLink>
          </Flex>
        </Flex>
        <Flex alignItems="center" gap="10px">
          <ColorModeButton />
          <ConnectButton
            label="Connect Wallet"
            chainStatus="icon"
            showBalance={false}
            accountStatus="address"
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
