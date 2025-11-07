import { Box, Button, Container, Flex } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const LandingHeader = () => {
  return (
    <Box as={"header"} p="40px 20px">
      <Flex justifyContent={"flex-end"} alignItems={"center"} gap={"15px"}>
        <Button className="secondary-btn">View Markets</Button>
        <Button className="secondary-btn">Read Docs</Button>
        <Box className="landing-btn">
          <ConnectButton />
        </Box>
      </Flex>
    </Box>
  );
};

export default LandingHeader;
