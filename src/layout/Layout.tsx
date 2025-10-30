import { Box, Flex, Container } from "@chakra-ui/react";
import Header from "@/pages/Header";
import Footer from "@/pages/Footer";
import { Routes } from "react-router-dom";
import { routes } from "@/routes/routes";

const Layout = () => {
  return (
    <Box className="page-content-wrapper">
      <Flex>
        <Box bg="white" flex="1">
          <Flex direction="column" h="100vh">
            <Header />
            <Box as="main" id="main-content" flex="1" bg="bg.panel">
              {/* <Container maxW="container.xl" h="100%"> */}
              <Routes>{routes}</Routes>
              {/* </Container> */}
            </Box>
            <Footer />
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default Layout;
