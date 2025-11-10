import { ROUTES } from "@/routes/paths";
import { Box, Button, Flex } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useNavigate } from "react-router-dom";

const LandingHeader = () => {
  const navigate = useNavigate();

  return (
    <Box as={"header"} p="40px 20px">
      <Flex justifyContent={"flex-end"} alignItems={"center"} gap={"15px"}>
        <Button
          className="secondary-btn"
          onClick={() => navigate(ROUTES.MARKET)}
        >
          View Markets
        </Button>
        <Button
          className="secondary-btn"
          onClick={() => window.open("https://docs.xdc.network/", "_blank")}
        >
          Read Docs
        </Button>
        <Box className="landing-btn">
          <ConnectButton />
        </Box>
      </Flex>
    </Box>
  );
};

export default LandingHeader;
