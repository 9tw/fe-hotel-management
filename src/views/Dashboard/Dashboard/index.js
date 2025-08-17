// Chakra imports
import {
  Flex,
  Grid,
  Image,
  SimpleGrid,
  Table,
  Tbody,
  Text,
  Th,
  Td,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
// assets
import peopleImage from "assets/img/people-image.png";
import logoChakra from "assets/svg/logo-white.svg";
// import BarChart from "components/Charts/BarChart";
// import LineChart from "components/Charts/LineChart";
import React, { useState, useEffect } from "react";
import { dashboardTableData, timelineData } from "variables/general";
import ActiveUsers from "./components/ActiveUsers";
import BuiltByDevelopers from "./components/BuiltByDevelopers";
import MiniStatistics from "./components/MiniStatistics";
import OrdersOverview from "./components/OrdersOverview";
import Projects from "./components/Projects";
import SalesOverview from "./components/SalesOverview";
import WorkWithTheRockets from "./components/WorkWithTheRockets";
import { FaBed, FaTools, FaTimes, FaUserAlt } from "react-icons/fa";
import axios from "axios";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";

export default function Dashboard() {
  const iconBoxInside = useColorModeValue("white", "white");
  const textColor = useColorModeValue("gray.700", "white");

  const [captions, setCaptions] = useState([
    "Room",
    "Name",
    "Guest(s)",
    "Night(s)",
    "Notes",
  ]);
  const [data, setData] = useState([]);
  const [checkIn, setCheckIn] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("http://localhost:3005/dashboard", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.data.result;
      setData(result);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setData([]);
        console.log("No Data Found");
      } else {
        console.log("Error:", error);
      }
    }
  };

  const fetchCheckIn = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3005/booking/check-in",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.data.result;
      setCheckIn(data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setCheckIn([]);
        console.log("No Today's Check In Found");
      } else {
        console.log("Error:", error);
      }
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchCheckIn();
  }, []);

  return (
    <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
      <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing="24px">
        <MiniStatistics
          title={"Room Available"}
          amount={data.roomAvailable}
          // percentage={55}
          icon={<FaBed h={"24px"} w={"24px"} color={iconBoxInside} />}
        />
        <MiniStatistics
          title={"Room Unavailable"}
          amount={data.roomUnavailable}
          // percentage={8}
          icon={<FaTimes h={"24px"} w={"24px"} color={iconBoxInside} />}
        />
        <MiniStatistics
          title={"Room Maintenance"}
          amount={data.roomMaintenance}
          // percentage={5}
          icon={<FaTools h={"24px"} w={"24px"} color={iconBoxInside} />}
        />
        <MiniStatistics
          title={"Guests"}
          amount={data.guests}
          // percentage={-14}
          icon={<FaUserAlt h={"24px"} w={"24px"} color={iconBoxInside} />}
        />
      </SimpleGrid>
      {/* <Grid
        templateColumns={{ md: "1fr", lg: "1.8fr 1.2fr" }}
        templateRows={{ md: "1fr auto", lg: "1fr" }}
        my="26px"
        gap="24px"
      >
        <BuiltByDevelopers
          title={"Built by Developers"}
          name={"Purity UI Dashboard"}
          description={
            "From colors, cards, typography to complex elements, you will find the full documentation."
          }
          image={
            <Image
              src={logoChakra}
              alt="chakra image"
              minWidth={{ md: "300px", lg: "auto" }}
            />
          }
        />
        <WorkWithTheRockets
          backgroundImage={peopleImage}
          title={"Work with the rockets"}
          description={
            "Wealth creation is a revolutionary recent positive-sum game. It is all about who takes the opportunity first."
          }
        />
      </Grid> */}
      {/* <Grid
        templateColumns={{ sm: "1fr", lg: "1.3fr 1.7fr" }}
        templateRows={{ sm: "repeat(2, 1fr)", lg: "1fr" }}
        gap="24px"
        mb={{ lg: "26px" }}
      >
        <ActiveUsers
          title={"Active Users"}
          percentage={23}
          chart={<BarChart />}
        />
        <SalesOverview
          title={"Sales Overview"}
          percentage={5}
          chart={<LineChart />}
        />
      </Grid> */}
      <Grid
        templateColumns={{ sm: "1fr", md: "1fr 1fr", lg: "2fr 1fr" }}
        templateRows={{ sm: "1fr auto", md: "1fr", lg: "1fr" }}
        my="26px"
        gap="24px"
      >
        <Card p="16px" overflowX={{ sm: "scroll", xl: "hidden" }}>
          <CardHeader>
            {/* <Flex direction="column"> */}
            <Text fontSize="lg" color={textColor} fontWeight="bold" pb=".5rem">
              Today's Check In
            </Text>
          </CardHeader>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" ps="0px">
                {captions.map((caption, idx) => {
                  return (
                    <Th
                      color="gray.400"
                      key={idx}
                      ps={idx === 0 ? "0px" : null}
                    >
                      {caption}
                    </Th>
                  );
                })}
              </Tr>
            </Thead>
            <Tbody>
              {checkIn.length != 0
                ? checkIn.map((row) => {
                    return (
                      <Tr>
                        <Td>{row?.room?.name}</Td>
                        <Td>{row?.name}</Td>
                        <Td>{row?.guest}</Td>
                        <Td>{row?.night}</Td>
                        <Td>
                          {" "}
                          <Text whiteSpace="normal" wordBreak="break-word">
                            {row?.notes}
                          </Text>
                        </Td>
                      </Tr>
                    );
                  })
                : null}
            </Tbody>
          </Table>
        </Card>
        <OrdersOverview
          title={"Standard Operating Procedure"}
          // amount={30}
          data={timelineData}
        />
      </Grid>
    </Flex>
  );
}
