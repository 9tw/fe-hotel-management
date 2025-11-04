// Chakra imports
import {
  Button,
  Box,
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
  useDisclosure,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
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
import {
  FaBed,
  FaTools,
  FaTimes,
  FaUserAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import axios from "axios";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import moment from "moment";

export default function Dashboard() {
  const today = new Date();
  const iconBoxInside = useColorModeValue("white", "white");
  const textColor = useColorModeValue("gray.700", "white");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [captions, setCaptions] = useState([
    "Room",
    "Name",
    "Guest(s)",
    "Night(s)",
    "Notes",
  ]);
  const [data, setData] = useState([]);
  const [checkIn, setCheckIn] = useState([]);
  const [checkInTomorrow, setCheckInTomorrow] = useState([]);
  const [notPaid, setNotPaid] = useState([]);
  const [checkOut, setCheckOut] = useState([]);
  const [checkOutTomorrow, setCheckOutTomorrow] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/dashboard",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

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

  const fetchNotPayYetData = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/dashboard/not-paid",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const result = await response.data.result;
      setNotPaid(result);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setData([]);
        console.log("No Data Found");
      } else {
        console.log("Error:", error);
      }
    }
  };

  const fetchCheckInToday = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/booking/check-in-today",
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

  const fetchCheckOutToday = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/booking/check-out-today",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.data.result;
      setCheckOut(data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setCheckOut([]);
        console.log("No Today's Check Out Found");
      } else {
        console.log("Error:", error);
      }
    }
  };

  const fetchCheckInTomorrow = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/booking/check-in-tomorrow",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.data.result;
      setCheckInTomorrow(data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setCheckInTomorrow([]);
        console.log("No Tomorrow's Check In Found");
      } else {
        console.log("Error:", error);
      }
    }
  };

  const handleClick = () => {
    fetchNotPayYetData();
    onOpen();
  };

  const handleClose = () => {
    onClose();
  };
    
  const fetchCheckOutTomorrow = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/booking/check-out-tomorrow",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.data.result;
      setCheckOutTomorrow(data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setCheckOutTomorrow([]);
        console.log("No Tomorrow's Check Out Found");
      } else {
        console.log("Error:", error);
      }
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchCheckInToday();
    fetchCheckInTomorrow();
    fetchCheckOutToday();
    fetchCheckOutTomorrow();
  }, []);

  return (
    <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
      <SimpleGrid columns={{ sm: 1, md: 2, xl: 5 }} spacing="24px">
        <Tooltip
          label="View booking not pay yet"
          placement="top"
          hasArrow
          bg="orange.300"
          color="white"
        >
          <Box
            cursor="pointer"
            _hover={{ transform: "scale(1.03)", transition: "0.2s" }}
            onClick={() => handleClick()}
          >
            <MiniStatistics
              title={"Room Paid"}
              amount={data.roomPaid}
              // percentage={55}
              icon={
                <FaMoneyBillWave h={"24px"} w={"24px"} color={iconBoxInside} />
              }
            />
          </Box>
        </Tooltip>
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
        templateColumns={{ sm: "1fr", md: "1fr 1fr", lg: "1fr 1fr" }}
        templateRows={{ sm: "1fr auto", md: "1fr", lg: "1fr" }}
        my="26px"
        gap="24px"
      >
        <Card p="16px" overflowX={{ sm: "scroll", xl: "hidden" }}>
          <CardHeader>
            <Flex justify="space-between" w="100%">
              <Text
                fontSize="lg"
                color={textColor}
                fontWeight="bold"
                pb=".5rem"
              >
                Today's Check Out
              </Text>
              <Text
                fontSize="lg"
                color={textColor}
                fontWeight="bold"
                pb=".5rem"
              >
                {moment(today).format("ddd, DD MMM YYYY")}
              </Text>
            </Flex>
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
              {checkOut.length != 0
                ? checkOut.map((row) => {
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

        <Card p="16px" overflowX={{ sm: "scroll", xl: "hidden" }}>
          <CardHeader>
            <Flex justify="space-between" w="100%">
              <Text
                fontSize="lg"
                color={textColor}
                fontWeight="bold"
                pb=".5rem"
              >
                Today's Check In
              </Text>
              <Text
                fontSize="lg"
                color={textColor}
                fontWeight="bold"
                pb=".5rem"
              >
                {moment(today).format("ddd, DD MMM YYYY")}
              </Text>
            </Flex>
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
                        <Td my=".8rem" pl="0px">
                          {row?.room?.name}
                        </Td>
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

        <Card p="16px" overflowX={{ sm: "scroll", xl: "hidden" }}>
          <CardHeader>
            <Flex justify="space-between" w="100%">
              <Text
                fontSize="lg"
                color={textColor}
                fontWeight="bold"
                pb=".5rem"
              >
                Tomorrow's Check Out
              </Text>
              <Text
                fontSize="lg"
                color={textColor}
                fontWeight="bold"
                pb=".5rem"
              >
                {moment(today).add(1, "days").format("ddd, DD MMM YYYY")}
              </Text>
            </Flex>
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
              {checkOutTomorrow.length != 0
                ? checkOutTomorrow.map((row) => {
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

        <Card p="16px" overflowX={{ sm: "scroll", xl: "hidden" }}>
          <CardHeader>
            <Flex justify="space-between" w="100%">
              <Text
                fontSize="lg"
                color={textColor}
                fontWeight="bold"
                pb=".5rem"
              >
                Tomorrow's Check In
              </Text>
              <Text
                fontSize="lg"
                color={textColor}
                fontWeight="bold"
                pb=".5rem"
              >
                {moment(today).add(1, "days").format("ddd, DD MMM YYYY")}
              </Text>
            </Flex>
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
              {checkInTomorrow.length != 0
                ? checkInTomorrow.map((row) => {
                    return (
                      <Tr>
                        <Td my=".8rem" pl="0px">
                          {row?.room?.name}
                        </Td>
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

        <Modal isOpen={isOpen} onClose={() => handleClose()} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Booking Not Pay Yet</ModalHeader>
            <ModalCloseButton />
            <ModalBody align="center">
              {notPaid &&
                notPaid.map((item) => {
                  return <Text fontWeight="bold">{item.name}</Text>;
                })}
              {/* <Text>Room: {formData.room_id}</Text>
              <Text>Guest Name: {formData.name}</Text>
              <Text>Guest(s): {formData.guest}</Text>
              <Text>
                From: {moment(formData.from).format("dddd, DD MMM YYYY")}
              </Text>
              <Text>To: {moment(formData.to).format("dddd, DD MMM YYYY")}</Text>
              <Text>Notes: {formData.notes}</Text>
              <Text>
                Status:{" "}
                {formData.status === 1 ? (
                  <Text as="span" color="red.500" fontWeight="bold">
                    Not Paid Yet
                  </Text>
                ) : (
                  <Text as="span" color="green.500" fontWeight="bold">
                    Paid
                  </Text>
                )}
              </Text> */}
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* <OrdersOverview
          title={"Standard Operating Procedure"}
          // amount={30}
          data={timelineData}
        /> */}
      </Grid>
    </Flex>
  );
}
