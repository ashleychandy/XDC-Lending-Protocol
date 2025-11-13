import { routes } from "@/routes/routes";
import { Box, Flex } from "@chakra-ui/react";
import { Routes } from "react-router-dom";

const Layout = () => {
  return (
    <Box className="page-content-wrapper">
      <Flex>
        <Box bg="bg.panel" flex="1">
          <Flex direction="column">
            <Box
              as="main"
              id="main-content"
              flex="1"
              bg="#f1f1f3
"
            >
              <Routes>{routes}</Routes>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default Layout;
