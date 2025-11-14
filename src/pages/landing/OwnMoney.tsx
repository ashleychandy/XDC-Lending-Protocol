import { Box, Heading, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import creditiFyImg from "../../assets/images/landing/Creditify.svg";

const OwnMoney = () => {
  const navigate = useNavigate();
  return (
    <Box
      as={"section"}
      pt={{ base: "40px", md: "60px", lg: "60px" }}
      pb={{ base: "40px", md: "40px", lg: "40px" }}
      mb={{ base: "60px", md: "80px", lg: "120px" }}
      maxW={"1000px"}
      mx={"auto"}
      borderBottom={"2px solid #00000024"}
    >
      <Box pos={"relative"} maxW={"856px"} mx={"auto"}>
        <Box>
          <Image src={creditiFyImg} alt="creditify-img" />
        </Box>
        <Box
          pos={"absolute"}
          top={{ base: "15px", md: "20px", lg: "40px" }}
          left={"0"}
          right={"0"}
          bottom={"0"}
          my={"auto"}
          textAlign={"center"}
        >
          <Heading
            fontSize={{ base: "30px", md: "45px", lg: "40px" }}
            lineHeight={{ base: "30px", md: "45px", lg: "40px" }}
            mb={{ base: "5px", md: "10px", lg: "10px" }}
          >
            Own your money,
          </Heading>
          <Heading
            fontSize={{ base: "35px", md: "50px", lg: "50px" }}
            lineHeight={{ base: "35px", md: "50px", lg: "50px" }}
          >
            Shape your future.
          </Heading>
        </Box>
      </Box>
    </Box>
  );
};

export default OwnMoney;
