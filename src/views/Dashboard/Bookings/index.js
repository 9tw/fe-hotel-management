// Chakra imports
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  Td,
  Icon,
  Progress,
  Button,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Tooltip,
  Textarea,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import IconBox from "components/Icons/IconBox";
import { useLocation } from "react-router-dom";
import {
  FaEllipsisV,
  FaRegEdit,
  FaRegTrashAlt,
  FaTable,
  FaListAlt,
} from "react-icons/fa";
import moment from "moment";
import { ViewOffIcon } from "@chakra-ui/icons";

function Bookings() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const { search } = useLocation();
  // const params = new URLSearchParams(search);
  // const view = params.get("view");

  const textColor = useColorModeValue("gray.700", "white");
  const iconTeal = useColorModeValue("teal.300", "teal.300");
  const iconBoxInside = useColorModeValue("white", "white");
  const iconBoxInsideAlt = useColorModeValue("lightgrey", "lightgrey");

  const [view, setView] = useState("list");
  const [mode, setMode] = useState();
  const [captions, setCaptions] = useState([
    "Room",
    "Name",
    "Guest(s)",
    "From",
    "To",
    "Night(s)",
    "Notes",
    "",
  ]);
  const [id, setId] = useState();
  const [bookings, setBookings] = useState([]);
  const [tableBookings, setTableBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState([]);
  const [filterFrom, setFilterFrom] = useState(null);
  const [filterTo, setFilterTo] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    guest: null,
    from: null,
    to: null,
    room_id: null,
    notes: "",
  });

  const fetchBookings = async () => {
    try {
      var url;
      if (filterFrom && filterTo) {
        url =
          "http://localhost:3005/booking/today?view=" +
          view +
          "&from=" +
          filterFrom +
          "&to=" +
          filterTo;
      } else {
        url = "http://localhost:3005/booking/today?view=" + view;
      }

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.data.result;
      view === "list" ? setBookings(data) : setTableBookings(data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setBookings([]);
        console.log("No Bookings Found");
      } else {
        console.log("Error:", error);
      }
    }
  };

  // const fetchFilterBookings = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:3005/booking/today?from=" +
  //         filterFrom +
  //         "&to=" +
  //         filterTo,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );

  //     const data = await response.data.result;
  //     setBookings(data);
  //   } catch (error) {
  //     if (axios.isAxiosError(error) && error.response?.status === 404) {
  //       setBookings([]);
  //       console.log("No Bookings Found");
  //     } else {
  //       console.log("Error:", error);
  //     }
  //   }
  // };

  const fetchBookingById = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3005/booking/get/" + id,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.data.result;
      setFormData({
        name: data[0].name,
        guest: data[0].guest,
        from: data[0].from,
        to: data[0].to,
        room_id: data[0].room_id,
        notes: data[0].notes,
      });
      console.log(formData);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setFormData({
          name: "",
          guest: null,
          from: null,
          to: null,
          room_id: null,
          notes: "",
        });
        console.log("No Booking Found");
      } else {
        console.log("Error:", error);
      }
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:3005/room", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.data.result;
      setRooms(data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setRooms([]);
        console.log("No Room Found");
      } else {
        console.log("Error:", error);
      }
    }
  };

  const fetchRoomName = async () => {
    try {
      const response = await axios.get("http://localhost:3005/room/names", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.data.result;
      setRoomName(data.map((r) => r.name));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setRoomName([]);
        console.log("No Room Found");
      } else {
        console.log("Error:", error);
      }
    }
  };

  const handleModal = (id, mode) => {
    if (mode !== "create") {
      setId(id);
      fetchBookingById();
    }
    setMode(mode);
    onOpen();
  };

  const handleSubmit = async (mode) => {
    try {
      if (mode === "create") {
        const response = await axios.post(
          "http://localhost:3005/booking",
          {
            name: formData.name,
            guest: formData.guest,
            from: formData.from,
            to: formData.to,
            room_id: formData.room_id,
            notes: formData.notes,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Server response:", response.data);
        alert("Booking created!");
      } else if (mode === "update") {
        const response = await axios.put(
          "http://localhost:3005/booking/" + id,
          {
            name: formData.name,
            guest: formData.guest,
            from: formData.from,
            to: formData.to,
            room_id: formData.room_id,
            notes: formData.notes,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Server response:", response.data);
        alert("Booking updated!");
      } else {
        const response = await axios.delete(
          "http://localhost:3005/booking/" + id,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Server response:", response.data);
        alert("Booking deleted!");
      }

      setFormData({
        name: "",
        guest: null,
        from: null,
        to: null,
        room_id: null,
        notes: "",
      });
      onClose();
      fetchBookings();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchRoomName();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [view, filterFrom, filterTo]);

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Flex flexDirection="row" align="center" justify="space-between" w="100%">
        <Button
          p="0px"
          bg="teal.300"
          w="5%"
          onClick={() => handleModal(null, "create")}
        >
          <Text color="white">Add</Text>
        </Button>

        <Card w="auto" h="auto" p="2">
          <CardBody p="0">
            <Flex gap="0" align="center" justify="center">
              <Text mx="2" fontSize="sm" fontWeight="normal">
                From
              </Text>
              <Input
                borderRadius="15px"
                fontSize="sm"
                type="date"
                size="lg"
                value={moment(filterFrom).format("YYYY-MM-DD")}
                onChange={(e) => setFilterFrom(e.target.value)}
              />
              <Text ml="4" mr="2" fontSize="sm" fontWeight="normal">
                To
              </Text>
              <Input
                borderRadius="15px"
                fontSize="sm"
                type="date"
                size="lg"
                value={moment(filterTo).format("YYYY-MM-DD")}
                onChange={(e) => setFilterTo(e.target.value)}
              />
            </Flex>
          </CardBody>
        </Card>

        <Card w="auto" h="auto" p="2">
          <CardBody p="0">
            <Flex gap="0" align="center" justify="center">
              <IconBox
                as="box"
                h="45px"
                w="45px"
                bg={view === "table" ? iconBoxInside : iconTeal}
                onClick={() => setView("list")}
              >
                <FaListAlt
                  size="24px"
                  color={view === "table" ? iconBoxInsideAlt : iconBoxInside}
                />
              </IconBox>
              <IconBox
                as="box"
                h="45px"
                w="45px"
                bg={view === "table" ? iconTeal : iconBoxInside}
                onClick={() => setView("table")}
              >
                <FaTable
                  size="24px"
                  color={view === "table" ? iconBoxInside : iconBoxInsideAlt}
                />
              </IconBox>
            </Flex>
          </CardBody>
        </Card>
      </Flex>
      {view === "table" ? (
        <Card my="22px" overflowX={{ sm: "scroll", xl: "hidden" }}>
          {/* <CardHeader p="6px 0px 22px 0px">
          <Flex direction="column">
            <Button
              p="0px"
              bg="teal.300"
              w="200%"
              onClick={() => handleModal(null, null, null, "create")}
            >
              <Text color="white">Add</Text>
            </Button>
          </Flex>
        </CardHeader> */}
          <CardBody>
            <Table variant="simple" color={textColor} size="sm">
              <Thead>
                <Tr my=".8rem" pl="0px">
                  <Th></Th>
                  {roomName.map((caption, idx) => {
                    return (
                      <Th
                        // color="gray.400"
                        key={idx}
                        ps={idx === 0 ? "0px" : null}
                        style={{
                          writingMode: "vertical-rl", // rotate writing direction
                          transform: "rotate(360deg)", // make text upright
                          whiteSpace: "nowrap",
                          textAlign: "center",
                        }}
                      >
                        {caption}
                      </Th>
                    );
                  })}
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>{moment(new Date()).format("ddd, DD MMM YYYY")}</Td>
                  {tableBookings &&
                    tableBookings.map((item) => {
                      return (
                        <>
                          {item.bookings.length != 0 ? (
                            <Td
                              onClick={() =>
                                handleModal(item.bookings[0].id, "detail")
                              }
                            >
                              <Tooltip
                                label={item.bookings[0].name}
                                hasArrow
                                placement="top"
                              >
                                ❌
                              </Tooltip>
                            </Td>
                          ) : (
                            <Td>🟢</Td>
                          )}
                        </>
                      );
                    })}
                </Tr>
                {/* {rooms.map((row) => {
                return (
                  <Tr>
                    <Td minWidth={{ sm: "250px" }} pl="0px">
                      <Flex
                        alignItems="center"
                        py=".8rem"
                        minWidth="100%"
                        flexWrap="nowrap"
                      >
                        <Text
                          fontSize="md"
                          color={textColor}
                          fontWeight="bold"
                          minWidth="100%"
                        >
                          {row.name}
                        </Text>
                      </Flex>
                    </Td>
                  </Tr>
                );
              })} */}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      ) : (
        <Card my="22px" overflowX={{ sm: "scroll", xl: "hidden" }} mx="auto">
          <CardBody>
            <Table variant="simple" color={textColor}>
              <Thead>
                <Tr my=".8rem" pl="0px">
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
                {bookings.map((row) => {
                  return (
                    <Tr>
                      {/* <Td minWidth={{ sm: "250px" }} pl="0px">
                        <Flex
                          alignItems="center"
                          py=".8rem"
                          minWidth="100%"
                          flexWrap="nowrap"
                        >
                          <Text
                            fontSize="md"
                            color={textColor}
                            fontWeight="bold"
                            minWidth="100%"
                          >
                            {row.name}
                          </Text>
                        </Flex>
                      </Td> */}
                      <Td>{row.room.name}</Td>
                      <Td>{row.name}</Td>
                      <Td>{row.guest}</Td>
                      <Td>{moment(row.from).format("MMM, DD YYYY")}</Td>
                      <Td>{moment(row.to).format("MMM, DD YYYY")}</Td>
                      <Td>{row.night}</Td>
                      <Td>
                        <Text whiteSpace="normal" wordBreak="break-word">
                          {row.notes}
                        </Text>
                      </Td>
                      {/* <Td>
                              <Flex direction="column">
                                <Text
                                  fontSize="md"
                                  color="teal.300"
                                  fontWeight="bold"
                                  pb=".2rem"
                                >{`${row.progression}%`}</Text>
                                <Progress
                                  colorScheme={
                                    row.progression === 100 ? "teal" : "cyan"
                                  }
                                  size="xs"
                                  value={row.progression}
                                  borderRadius="15px"
                                />
                              </Flex>
                            </Td> */}
                      <Td>
                        {/* <Button p="0px" bg="transparent">
                                <Icon
                                  as={FaEllipsisV}
                                  color="gray.400"
                                  cursor="pointer"
                                />
                              </Button> */}
                        <Menu>
                          <MenuButton
                            as={Button}
                            p="0px"
                            bg="transparent"
                            _hover={{ bg: "transparent" }}
                            _active={{ bg: "transparent" }}
                          >
                            <Icon
                              as={FaEllipsisV}
                              color="gray.400"
                              cursor="pointer"
                            />
                          </MenuButton>
                          <MenuList minW="100px">
                            <MenuItem
                              onClick={() => handleModal(row.id, "update")}
                            >
                              <Icon
                                as={FaRegEdit}
                                color="green.400"
                                cursor="pointer"
                                style={{ marginRight: "10%" }}
                              />
                              Edit
                            </MenuItem>
                            <MenuItem
                              onClick={() => handleModal(row.id, "delete")}
                            >
                              <Icon
                                as={FaRegTrashAlt}
                                color="red.400"
                                cursor="pointer"
                                style={{ marginRight: "10%" }}
                              />
                              Delete
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {mode === "create"
              ? `Create`
              : mode === "update"
              ? `Update`
              : mode === "update"
              ? `Delete`
              : `Detail`}
          </ModalHeader>
          <ModalCloseButton />
          {mode === "detail" ? (
            <ModalBody>
              <Text>Room: {formData.room_id}</Text>
              <Text>Guest Name: {formData.name}</Text>
              <Text>Guest(s): {formData.guest}</Text>
              <Text>
                From: {moment(formData.from).format("dddd, DD MMM YYYY")}
              </Text>
              <Text>To: {moment(formData.to).format("dddd, DD MMM YYYY")}</Text>
              <Text>Notes: {formData.notes}</Text>
              <Button
                onClick={() => setMode("update")}
                fontSize="10px"
                // type="submit"
                variant="outline"
                borderColor="teal.300"
                color="teal.300"
                w="50%"
                h="45"
                mb="20px"
                mt="20px"
                _hover={{
                  bg: "teal.50", // light background on hover
                }}
                _active={{
                  bg: "teal.100", // slightly darker when active
                }}
              >
                Update
              </Button>
              <Button
                onClick={() => setMode("delete")}
                fontSize="10px"
                // type="submit"
                bg="teal.300"
                w="50%"
                h="45"
                mb="20px"
                color="white"
                mt="20px"
                _hover={{
                  bg: "teal.200",
                }}
                _active={{
                  bg: "teal.400",
                }}
              >
                Delete
              </Button>
            </ModalBody>
          ) : mode === "delete" ? (
            <ModalBody>
              <Text textAlign="center">
                You sure to delete booking by {formData.name} ?
              </Text>
              <Button
                onClick={onClose}
                fontSize="10px"
                // type="submit"
                variant="outline"
                borderColor="teal.300"
                color="teal.300"
                w="50%"
                h="45"
                mb="20px"
                mt="20px"
                _hover={{
                  bg: "teal.50", // light background on hover
                }}
                _active={{
                  bg: "teal.100", // slightly darker when active
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleSubmit(mode)}
                fontSize="10px"
                type="submit"
                bg="teal.300"
                w="50%"
                h="45"
                mb="20px"
                color="white"
                mt="20px"
                _hover={{
                  bg: "teal.200",
                }}
                _active={{
                  bg: "teal.400",
                }}
              >
                Delete
              </Button>
            </ModalBody>
          ) : (
            <ModalBody>
              <FormControl>
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Name
                </FormLabel>
                <Input
                  borderRadius="15px"
                  mb="24px"
                  fontSize="sm"
                  type="text"
                  placeholder="Enter guest name"
                  size="lg"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Guests
                </FormLabel>
                <Input
                  borderRadius="15px"
                  mb="24px"
                  fontSize="sm"
                  type="number"
                  placeholder="Enter number of guest(s)"
                  size="lg"
                  value={formData.guest}
                  onChange={(e) =>
                    setFormData({ ...formData, guest: e.target.value })
                  }
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  From
                </FormLabel>
                <Input
                  borderRadius="15px"
                  mb="24px"
                  fontSize="sm"
                  type="date"
                  placeholder="Enter guest arrival"
                  size="lg"
                  value={moment(formData.from).format("YYYY-MM-DD")}
                  onChange={(e) =>
                    setFormData({ ...formData, from: e.target.value })
                  }
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  To
                </FormLabel>
                <Input
                  borderRadius="15px"
                  mb="24px"
                  fontSize="sm"
                  type="date"
                  placeholder="Enter guest leaving"
                  size="lg"
                  value={moment(formData.to).format("YYYY-MM-DD")}
                  onChange={(e) =>
                    setFormData({ ...formData, to: e.target.value })
                  }
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Room
                </FormLabel>
                <Select
                  borderRadius="15px"
                  mb="24px"
                  fontSize="sm"
                  placeholder="Select room number"
                  size="lg"
                  value={formData.room_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      room_id: parseInt(e.target.value),
                    })
                  }
                >
                  {rooms.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                  {/* <option value="1">Room 1</option>
                  <option value="2">Room 2</option>
                  <option value="3">Room 3</option> */}
                </Select>
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Notes
                </FormLabel>
                <Textarea
                  borderRadius="15px"
                  mb="24px"
                  fontSize="sm"
                  placeholder="Enter additional notes"
                  size="lg"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
                <Button
                  onClick={onClose}
                  fontSize="10px"
                  // type="submit"
                  variant="outline"
                  borderColor="teal.300"
                  color="teal.300"
                  w="50%"
                  h="45"
                  mb="20px"
                  mt="20px"
                  _hover={{
                    bg: "teal.50", // light background on hover
                  }}
                  _active={{
                    bg: "teal.100", // slightly darker when active
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSubmit(mode)}
                  fontSize="10px"
                  type="submit"
                  bg="teal.300"
                  w="50%"
                  h="45"
                  mb="20px"
                  color="white"
                  mt="20px"
                  _hover={{
                    bg: "teal.200",
                  }}
                  _active={{
                    bg: "teal.400",
                  }}
                >
                  Submit
                </Button>
              </FormControl>
            </ModalBody>
          )}

          {/* <ModalFooter>
                  <Button variant="ghost" mr={3} onClick={onClose}>
                    Close
                  </Button>
                  <Button colorScheme="blue">Save</Button>
                </ModalFooter> */}
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default Bookings;
