import React from "react";
import { Box, Button, Flex, Heading, Image } from "@chakra-ui/react";
import securityImg from "../../assets/images/landing/security.png";

const GovernanceSecurity = () => {
  const details = [
    {
      title: "Audits",
      desc: "Third-party security audits and bug bounty program. Proofs and reports are available in the documentation.",
      points: [
        "Smart contract audits (2025)",
        "Ongoing formal verification",
        "Bug bounty program",
      ],
      btnName: "View Documentation",
    },
    {
      title: "Governance",
      desc: "Token holders vote on parameters and upgrades. Transparent proposals and on-chain voting UI planned.",
      btnName: "View Governance",
    },
  ];

  return (
    <Box as={"section"} mb={"150px"}>
      <Heading fontSize={"60px"} lineHeight={"60px"} mb={"20px"}>
        Governance & Security
      </Heading>
      <Box as={"p"} mb={"40px"}>
        xVault is governed by a DAO and uses audited smart contracts.
        Non-custodial design ensures users keep control of private keys.
      </Box>
      <Flex gap={"20px"} alignItems={"center"}>
        <Flex direction={"column"} gap={"40px"} w={"62%"}>
          {details.map((x, i) => {
            return (
              <Box className="box" key={i} p={"20px"} borderRadius={"15px"}>
                <Box fontWeight={"700"} fontSize={"22px"} mb={"20px"}>
                  {x.title}
                </Box>
                <Box as={"p"} mb={"15px"} fontSize={"22px"}>
                  {x.desc}
                </Box>
                {x.points?.length! > 0 && (
                  <Box
                    as="ul"
                    listStyleType="circle"
                    fill={"white"}
                    listStylePosition="inside"
                    ps={"30px"}
                    mb={"15px"}
                  >
                    {x.points?.map((a, index) => {
                      return (
                        <li
                          className="p"
                          key={index}
                          style={{ fontSize: "22px" }}
                        >
                          {a}
                        </li>
                      );
                    })}{" "}
                  </Box>
                )}
                <Button className="primary-btn">{x.btnName}</Button>
              </Box>
            );
          })}
        </Flex>
        <Box w={"38%"}>
          <Image
            src={securityImg}
            mx={"auto"}
            w={"400px"}
            h={"auto"}
            alt="security-img"
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default GovernanceSecurity;
