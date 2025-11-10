import Footer from "@/pages/Footer";
import Header from "@/pages/Header";
import { ROUTES } from "@/routes/paths";
import { routes } from "@/routes/routes";
import { Box, Flex } from "@chakra-ui/react";
import { Routes, useLocation, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

const Layout = () => {
  const { isConnected } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();
  const noLayoutRoutes = [ROUTES.HOME];
  const isNoLayout = noLayoutRoutes.includes(location.pathname);

  // Remove auto-redirect - let users navigate freely
  // Users can click "Get Started" button to go to dashboard

  return (
    <Box className="page-content-wrapper">
      <Flex>
        <Box bg="white" flex="1">
          <Flex direction="column" h="100vh">
            {!isNoLayout && <Header />}
            <Box as="main" id="main-content" flex="1" bg="bg.panel">
              <Routes>{routes}</Routes>
            </Box>
            {!isNoLayout && <Footer />}
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default Layout;
