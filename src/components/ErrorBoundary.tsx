import { Box, Button, Container, Heading, Text } from "@chakra-ui/react";
import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    // Navigate to dashboard to reset the app state
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container
          maxW="container.md"
          centerContent
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box textAlign="center" p="8">
            <Heading size="2xl" mb="4" color="red.600">
              Oops! Something went wrong
            </Heading>
            <Text fontSize="lg" mb="6" color="gray.600">
              We encountered an unexpected error. Please try refreshing the page
              or contact support if the problem persists.
            </Text>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <Box
                mt="6"
                p="4"
                bg="red.50"
                borderRadius="md"
                textAlign="left"
                maxW="600px"
                mx="auto"
              >
                <Text fontWeight="bold" mb="2" color="red.700">
                  Error Details (Development Only):
                </Text>
                <Text fontSize="sm" fontFamily="mono" color="red.600" mb="2">
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text
                    fontSize="xs"
                    fontFamily="mono"
                    color="gray.600"
                    whiteSpace="pre-wrap"
                    maxH="200px"
                    overflowY="auto"
                  >
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </Box>
            )}
            <Button
              size="lg"
              colorScheme="blue"
              onClick={this.handleReset}
              mt="6"
            >
              Return to Dashboard
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
