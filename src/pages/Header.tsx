import * as Menu from "@/components/ui/menu";
import { ROUTES } from "@/routes/paths";
import { Box, Flex, IconButton, Switch, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { LuSettings } from "react-icons/lu";
import { NavLink } from "react-router";
import creditify from "src/assets/images/CreditifyBold.svg";
import { useAccount, useSwitchChain } from "wagmi";
import { xdc, xdcTestnet } from "wagmi/chains";

const Header = () => {
  const { switchChain } = useSwitchChain();
  const { chain } = useAccount();

  const isTestnet = chain?.id === xdcTestnet.id;

  const handleNetworkToggle = (checked: boolean) => {
    const targetChainId = checked ? xdcTestnet.id : xdc.id;
    switchChain({ chainId: targetChainId });
  };

  return (
    <Box
      as="header"
      p="8px 20px"
      bg="#fff"
      boxShadow={"rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}
      position="sticky"
      top="0"
      zIndex="1000"
    >
      <Flex gap="4" justify="space-between" alignItems="center">
        <NavLink to={ROUTES.HOME}>
          <Box w="120px" cursor="pointer">
            <img src={creditify} alt="Creditify Logo" />
          </Box>
        </NavLink>

        <Flex alignItems="center" gap="10px">
          <ConnectButton
            label="Connect Wallet"
            chainStatus="none"
            showBalance={false}
            accountStatus="address"
          />
          <Menu.MenuRoot>
            <Menu.MenuTrigger asChild>
              <IconButton variant="ghost" size="sm" aria-label="Settings">
                <LuSettings />
              </IconButton>
            </Menu.MenuTrigger>
            <Menu.MenuContent minW="180px">
              <Menu.MenuItem
                value="testnet"
                closeOnSelect={false}
                justifyContent="space-between"
              >
                <Text>Testnet</Text>
                <Switch.Root
                  size="sm"
                  checked={isTestnet}
                  onCheckedChange={(e) => handleNetworkToggle(e.checked)}
                >
                  <Switch.HiddenInput />
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch.Root>
              </Menu.MenuItem>
            </Menu.MenuContent>
          </Menu.MenuRoot>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
