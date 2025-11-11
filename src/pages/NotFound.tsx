import { ROUTES } from "@/routes/paths";
import { Box, Button, Container, Flex, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxW="container.md" h="100vh">
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        h="100%"
        gap={6}
      >
        <Heading size="2xl" textAlign="center">
          Page Not Found
        </Heading>
        <Box fontSize="lg" textAlign="center" color="gray.600">
          The page you're looking for doesn't exist or has been moved.
        </Box>
        <Button
          size="lg"
          colorPalette="blue"
          onClick={() => navigate(ROUTES.HOME)}
        >
          Go to Home
        </Button>
      </Flex>
    </Container>
  );
};

export default NotFound;
