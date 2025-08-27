// Chakra imports
import { Flex, Grid, Image, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import Authors from "./components/Authors";
import Projects from "./components/Projects";
import { tablesTableData, dashboardTableData } from "variables/general";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import maintenance from "assets/img/undraw_maintenances.png";

function Tables() {
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      {/* <Authors
        title={"Authors Table"}
        captions={["Author", "Function", "Status", "Employed", ""]}
        data={tablesTableData}
      />
      <Projects
        title={"Projects Table"}
        captions={["Companies", "Budget", "Status", "Completion", ""]}
        data={dashboardTableData}
      /> */}
      <Card p="16px" overflowX={{ sm: "scroll", xl: "hidden" }}>
        <Image src={maintenance} alt="maintenance" w="50%" mx="auto" />
        <Text
          fontSize="lg"
          color={textColor}
          // fontWeight="bold"
          pb=".5rem"
          mx="auto"
        >
          This page still under maintenance
        </Text>
      </Card>
    </Flex>
  );
}

export default Tables;
