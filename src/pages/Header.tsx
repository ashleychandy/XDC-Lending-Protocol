import { ColorModeButton, useColorMode } from "@/components/ui/color-mode";
import { ROUTES } from "@/routes/paths";
import { Box, Flex } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NavLink } from "react-router";
import creditify from "src/assets/images/CreditifyBold.svg";

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
      <Flex
        gap="4"
        justify="space-between"
        alignItems="center"
        direction={{ base: "column", lg: "row" }}
      >
        <Flex gap="10" justify="space-between" alignItems="center">
          <NavLink to={ROUTES.HOME}>
            <Box w="120px" cursor="pointer">
              {colorMode === "dark" ? (
                <img src={creditify} alt="XDC-Logo-Light" />
              ) : (
                <img src={creditify} alt="XDC-Logo-Dark" />
              )}
            </Box>
          </NavLink>
          <Flex gap="4" justify="space-between" alignItems="center">
            <NavLink to={ROUTES.HOME}>Home</NavLink>
            <NavLink to={ROUTES.DASHBOARD}>Dashboard</NavLink>
            <NavLink to={ROUTES.MARKET}>Markets</NavLink>
            <NavLink to={ROUTES.GOVERNANCE}>Governance</NavLink>
            <NavLink to={ROUTES.SAVINGS}>Savings</NavLink>
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
