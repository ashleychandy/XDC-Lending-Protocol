import { ROUTES } from "@/routes/paths";
import { Box, Button, Flex } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link, useNavigate } from "react-router-dom";

const LandingHeader = () => {
  const navigate = useNavigate();

  return (
    <Box as={"header"} p={{ base: "20px 0", lg: "40px 20px" }}>
      <Flex
        justifyContent={{ base: "center", lg: "flex-end" }}
        alignItems={"center"}
        gap={"25px"}
      >
        <Link
          target="_blank"
          to={"https://docs.xdc.network/"}
          className="nav-link"
        >
          How it Works
        </Link>
        <Link to={ROUTES.MARKET} className="nav-link">
          Markets
        </Link>
        <Box className="landing-btn">
          <ConnectButton label="Open App" />
        </Box>
      </Flex>
    </Box>
  );
};

export default LandingHeader;
