import { useChainConfig } from "@/hooks/useChainConfig";
import { Box, Container, Flex, Heading, Image } from "@chakra-ui/react";

const Home = () => {
  const { network } = useChainConfig();

  return (
    <Container maxW="container.xl" h="100%">
      <Box h="100%" p="30px 0">
        <Flex gap="2" alignItems="center" mb="15px">
          <Image src={network.icon} width="32px" height="32px" />
          <Heading size="3xl">{network.name} Market</Heading>
        </Flex>
        <Flex gap="6" alignItems="center">
          <Flex direction="column">
            <Box>Total market size</Box>
            <Heading size="xl">$NaN</Heading>
          </Flex>
          <Flex direction="column">
            <Box>Total available</Box>
            <Heading size="xl">$NaN</Heading>
          </Flex>
          <Flex direction="column">
            <Box>Total borrows</Box>
            <Heading size="xl">$NaN</Heading>
          </Flex>
        </Flex>
      </Box>
    </Container>
  );
};

export default Home;
