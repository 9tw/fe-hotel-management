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
import {
  FaEllipsisV,
  FaRegEdit,
  FaRegTrashAlt,
  FaTable,
  FaListAlt,
  FaCarSide,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import moment from "moment";

function Bookings() {
  const user = localStorage.getItem("name");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const textColor = useColorModeValue("gray.700", "white");
  const iconOrange = useColorModeValue("orange", "orange.200");
  const iconBoxInside = useColorModeValue("white", "white");
  const iconBoxInsideAlt = useColorModeValue("lightgrey", "lightgrey");

  const [view, setView] = useState("list");
  const [mode, setMode] = useState();
  const [captions] = useState([
    "Room",
    "Name",
    "Guest(s)",
    "From",
    "To",
    "Night(s)",
    "Price",
    "Total",
    "Notes",
    "Status",
    "Created By",
    "Updated By",
    "",
  ]);
  const [bookings, setBookings] = useState([]);
  const [tableBookings, setTableBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState([]);
  const [search, setSearch] = useState("");
  const [filterFrom, setFilterFrom] = useState(null);
  const [filterTo, setFilterTo] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: null,
    guest: null,
    from: null,
    to: null,
    room_id: null,
    notes: null,
    status: null,
    created_by: null,
    updated_by: null,
    room: {
      id: null,
      name: null,
    },
  });
  const [isNameError, setIsNameError] = useState(true);
  const [isGuestError, setIsGuestError] = useState(true);
  const [isFromError, setIsFromError] = useState(true);
  const [isToError, setIsToError] = useState(true);
  const [isRoomError, setIsRoomError] = useState(true);
  const [isStatusError, setIsStatusError] = useState(true);
  const [isPriceError, setIsPriceError] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = async () => {
    try {
      var url;
      if (search !== "" || (filterFrom && filterTo)) {
        url =
          process.env.REACT_APP_API_URL +
          "/booking/today?view=" +
          view +
          "&page=" +
          page +
          "&limit=" +
          limit +
          "&search=" +
          search +
          "&from=" +
          filterFrom +
          "&to=" +
          filterTo;
      } else {
        url =
          process.env.REACT_APP_API_URL +
          "/booking/today?view=" +
          view +
          "&page=" +
          page +
          "&limit=" +
          limit;
      }

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.data.result;

      if (view === "list") {
        setBookings(data);

        const pagination = await response.data.pagination.totalPages;
        setTotalPages(pagination);
      } else {
        setTableBookings(data);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setBookings([]);
        console.log("No Bookings Found");
      } else {
        console.log("Error:", error);
      }
    }
  };

  const fetchBookingById = async (bookingId) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/booking/get/" + bookingId,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.data.result[0];
      setFormData({
        id: data.id,
        name: data.name,
        guest: data.guest,
        from: data.from,
        to: data.to,
        room_id: data.room_id,
        price: data.price,
        notes: data.notes,
        status: data.status,
        created_by: data.created_by,
        updated_by: data.updated_by,
        room: {
          id: data.room.id,
          name: data.room.name,
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setFormData({
          id: null,
          name: null,
          guest: null,
          from: null,
          to: null,
          room_id: null,
          notes: null,
          price: null,
          status: null,
          created_by: null,
          updated_by: null,
          room: {
            id: null,
            name: null,
          },
        });
        console.log("No Booking Found");
      } else {
        console.log("Error:", error);
      }
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL +
          "/room/filter?from=" +
          formData.from +
          "&to=" +
          formData.to,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

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
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/room/names",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

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
      fetchBookingById(id);
    }
    setMode(mode);
    onOpen();
  };

  const handleReset = () => {
    setSearch("");
    setFilterFrom(null);
    setFilterTo(null);
    setBookings([]);
    setTableBookings([]);
  };

  const handleClose = () => {
    setFormData({
      id: null,
      name: null,
      guest: null,
      from: null,
      to: null,
      room_id: null,
      notes: null,
      price: null,
      status: null,
      created_by: null,
      updated_by: null,
      room: {
        id: null,
        name: null,
      },
    });
    onClose();
  };

  const handleSubmit = async (mode, bookingId) => {
    if (
      (!formData.name ||
        !formData.guest ||
        !formData.from ||
        !formData.to ||
        !formData.room_id ||
        !formData.price ||
        !formData.status) &&
      mode !== "delete"
    ) {
      setIsNameError(!formData.name ? false : true);
      setIsGuestError(!formData.guest ? false : true);
      setIsFromError(!formData.from ? false : true);
      setIsToError(!formData.to ? false : true);
      setIsRoomError(!formData.room_id ? false : true);
      setIsStatusError(!formData.status ? false : true);
      setIsPriceError(!formData.price ? false : true);
    } else {
      try {
        if (mode === "create") {
          const response = await axios.post(
            process.env.REACT_APP_API_URL + "/booking",
            {
              name: formData.name,
              guest: formData.guest,
              from: formData.from,
              to: formData.to,
              room_id: formData.room_id,
              notes: formData.notes,
              price: formData.price,
              status: formData.status,
              created_by: user,
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
            process.env.REACT_APP_API_URL + "/booking/" + bookingId,
            {
              name: formData.name,
              guest: formData.guest,
              from: formData.from,
              to: formData.to,
              room_id: formData.room_id,
              notes: formData.notes,
              price: formData.price,
              status: formData.status,
              updated_by: user,
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
            process.env.REACT_APP_API_URL + "/booking/" + bookingId,
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
          id: null,
          name: null,
          guest: null,
          from: null,
          to: null,
          room_id: null,
          notes: null,
          status: null,
          price: null,
          created_by: null,
          updated_by: null,
          room: {
            id: null,
            name: null,
          },
        });
        setIsNameError(true);
        setIsGuestError(true);
        setIsFromError(true);
        setIsToError(true);
        setIsRoomError(true);
        setIsStatusError(true);
        setIsPriceError(true);
        onClose();
        fetchBookings(page);
      } catch (error) {
        console.error("Error submitting form:", error);
        alert(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  const handlePrint = async (id, mode) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL +
          `/booking/print?id=${id}&format=${mode}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type:
          mode === "invoice"
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${
        mode === "invoice" ? "invoice.xlsx" : "pickup-docs.pdf"
      }`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log("No Booking Found");
      } else {
        console.log("Error:", error);
      }
    }
  };

  useEffect(() => {
    fetchRoomName();
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [formData.from, formData.to]);

  useEffect(() => {
    fetchBookings(page);
  }, [view, page, search, filterFrom, filterTo]);

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Flex flexDirection="row" align="center" justify="space-between" w="100%">
        <Button
          p="0px"
          bg="orange"
          w="5%"
          onClick={() => handleModal(null, "create")}
        >
          <Text color="white">Add</Text>
        </Button>

        <Card w="auto" h="auto" p="2">
          <CardBody p="0">
            <Flex gap="0" align="center" justify="center">
              {view === "table" ? null : (
                <>
                  <Text mx="2" fontSize="sm" fontWeight="normal">
                    Search
                  </Text>
                  <Input
                    borderRadius="15px"
                    fontSize="sm"
                    type="text"
                    placeholder="Search guest name"
                    size="lg"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </>
              )}
              <Text ml="4" mr="2" fontSize="sm" fontWeight="normal">
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
              <Button
                ml="4"
                mr="2"
                p="0px"
                bg="orange"
                w="50%"
                onClick={() => handleReset()}
                isDisabled={!filterFrom && !filterTo}
              >
                <Text color="white">Reset</Text>
              </Button>
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
                bg={view === "table" ? iconBoxInside : iconOrange}
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
                bg={view === "table" ? iconOrange : iconBoxInside}
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
                {filterFrom && filterTo ? (
                  tableBookings &&
                  tableBookings.map((item) => {
                    return (
                      <Tr>
                        <Td>{moment(item.date).format("ddd, DD MMM YYYY")}</Td>
                        {item.rooms?.map((room) => {
                          return room?.bookings?.length != 0 ? (
                            <Td
                              onClick={() =>
                                handleModal(room?.bookings[0]?.id, "detail")
                              }
                            >
                              <Tooltip
                                label={room?.bookings[0]?.name}
                                hasArrow
                                placement="top"
                              >
                                ❌
                              </Tooltip>
                            </Td>
                          ) : room?.status != 1 ? (
                            <Td>
                              <Tooltip
                                label={
                                  room?.status === 2
                                    ? "Unavailable"
                                    : "Maintenance"
                                }
                                hasArrow
                                placement="top"
                              >
                                ❌
                              </Tooltip>
                            </Td>
                          ) : (
                            <Td>🟢</Td>
                          );
                        })}
                      </Tr>
                    );
                  })
                ) : (
                  <Tr>
                    <Td>{moment(new Date()).format("ddd, DD MMM YYYY")}</Td>
                    {tableBookings &&
                      tableBookings.map((item) => {
                        return (
                          <>
                            {item?.bookings?.length != 0 ? (
                              <Td
                                onClick={() =>
                                  handleModal(item?.bookings[0]?.id, "detail")
                                }
                                cursor="pointer"
                              >
                                <Tooltip
                                  label={item?.bookings[0]?.name}
                                  hasArrow
                                  placement="top"
                                >
                                  ❌
                                </Tooltip>
                              </Td>
                            ) : item?.status != 1 ? (
                              <Td>
                                <Tooltip
                                  label={
                                    item?.status === 2
                                      ? "Unavailable"
                                      : "Maintenance"
                                  }
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
                )}
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
                      <Td>{row.room?.name}</Td>
                      <Td>{row.name}</Td>
                      <Td>{row.guest}</Td>
                      <Td>{moment(row.from).format("MMM, DD YYYY")}</Td>
                      <Td>{moment(row.to).format("MMM, DD YYYY")}</Td>
                      <Td>{row.night}</Td>
                      <Td>${row.price}</Td>
                      <Td>${row.night * row.price}</Td>
                      <Td>
                        <Text whiteSpace="normal" wordBreak="break-word">
                          {row.notes}
                        </Text>
                      </Td>
                      <Td>
                        {row.status === 1 ? (
                          <Text color="red.500" fontWeight="bold">
                            Not Paid Yet
                          </Text>
                        ) : row.status === 2 ? (
                          <Text color="green.500" fontWeight="bold">
                            Paid
                          </Text>
                        ) : (
                          <Text color="blue.500" fontWeight="bold">
                            None
                          </Text>
                        )}
                      </Td>
                      <Td>{row.created_by}</Td>
                      <Td>{row.updated_by}</Td>
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
                          <MenuList minW="110px">
                            <MenuItem
                              onClick={() => handlePrint(row.id, "pick-up")}
                            >
                              <Icon
                                as={FaCarSide}
                                color="blue.400"
                                cursor="pointer"
                                style={{ marginRight: "10%" }}
                              />
                              Pick Up
                            </MenuItem>
                            <MenuItem
                              onClick={() => handlePrint(row.id, "invoice")}
                            >
                              <Icon
                                as={FaFileInvoiceDollar}
                                color="orange.400"
                                cursor="pointer"
                                style={{ marginRight: "10%" }}
                              />
                              Invoice
                            </MenuItem>
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

          {/* Pagination Controls */}
          <Flex justify="center" align="center" mt={4} gap={2}>
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              isDisabled={page === 1}
            >
              Prev
            </Button>
            <Text>
              Page {page} of {totalPages}
            </Text>
            <Button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              isDisabled={page === totalPages}
            >
              Next
            </Button>
          </Flex>
        </Card>
      )}
      <Modal isOpen={isOpen} onClose={() => handleClose()} isCentered>
        <ModalOverlay />
        <ModalContent>
          {mode === "create" ? (
            <ModalHeader>Create</ModalHeader>
          ) : mode === "update" ? (
            <ModalHeader>Update</ModalHeader>
          ) : mode === "delete" ? (
            <ModalHeader>Delete</ModalHeader>
          ) : (
            <ModalHeader>
              Detail
              <Tooltip
                label="Download pick up document"
                placement="top"
                hasArrow
                bg="blue.400"
                color="white"
              >
                <Button
                  onClick={() => handlePrint(formData.id, "pick-up")}
                  variant="outline"
                  borderColor="blue.400"
                  color="blue.400"
                  w="10%"
                  h="19"
                  ml="2"
                  _hover={{
                    bg: "blue.100",
                  }}
                >
                  <Icon as={FaCarSide} color="blue.400" cursor="pointer" />
                </Button>
              </Tooltip>
              <Tooltip
                label="Download invoice"
                placement="top"
                hasArrow
                bg="green.400"
                color="white"
              >
                <Button
                  onClick={() => handlePrint(formData.id, "invoice")}
                  variant="outline"
                  borderColor="green.400"
                  color="green.400"
                  w="10%"
                  h="19"
                  ml="2"
                  _hover={{
                    bg: "green.100",
                  }}
                >
                  <Icon
                    as={FaFileInvoiceDollar}
                    color="green.400"
                    cursor="pointer"
                  />
                </Button>
              </Tooltip>
            </ModalHeader>
          )}
          <ModalCloseButton />
          {mode === "detail" ? (
            <ModalBody>
              <Text>{formData.room?.name}</Text>
              <Text>Guest Name: {formData.name}</Text>
              <Text>Guest(s): {formData.guest}</Text>
              <Text>
                From: {moment(formData.from).format("dddd, DD MMM YYYY")}
              </Text>
              <Text>To: {moment(formData.to).format("dddd, DD MMM YYYY")}</Text>
              <Text>Price: ${formData.price}</Text>
              <Text>Notes: {formData.notes}</Text>
              <Text>
                Status:{" "}
                {formData.status === 1 ? (
                  <Text as="span" color="red.500" fontWeight="bold">
                    Not Paid Yet
                  </Text>
                ) : formData.status === 2 ? (
                  <Text as="span" color="green.500" fontWeight="bold">
                    Paid
                  </Text>
                ) : (
                  <Text as="span" color="blue.500" fontWeight="bold">
                    None
                  </Text>
                )}
              </Text>
              <Button
                onClick={() => setMode("update")}
                fontSize="10px"
                // type="submit"
                variant="outline"
                borderColor="orange"
                color="orange"
                w="50%"
                h="45"
                mb="20px"
                mt="20px"
                _hover={{
                  bg: "orange.100",
                }}
                // _active={{
                //   bg: "teal.100",
                // }}
              >
                Update
              </Button>
              <Button
                onClick={() => setMode("delete")}
                fontSize="10px"
                // type="submit"
                bg="orange"
                w="50%"
                h="45"
                mb="20px"
                color="white"
                mt="20px"
                _hover={{
                  bg: "orange.200",
                }}
                // _active={{
                //   bg: "teal.400",
                // }}
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
                onClick={() => handleClose()}
                fontSize="10px"
                // type="submit"
                variant="outline"
                borderColor="orange"
                color="orange"
                w="50%"
                h="45"
                mb="20px"
                mt="20px"
                _hover={{
                  bg: "orange.100",
                }}
                // _active={{
                //   bg: "teal.100",
                // }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleSubmit(mode, formData.id)}
                fontSize="10px"
                type="submit"
                bg="orange"
                w="50%"
                h="45"
                mb="20px"
                color="white"
                mt="20px"
                _hover={{
                  bg: "orange.200",
                }}
                // _active={{
                //   bg: "teal.400",
                // }}
              >
                Delete
              </Button>
            </ModalBody>
          ) : (
            <ModalBody>
              <FormControl>
                <div style={{ marginBottom: 24 }}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Name
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    fontSize="sm"
                    type="text"
                    placeholder="Enter guest name"
                    size="lg"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  {!isNameError ? (
                    <Text color="red">Booking Name is Empty</Text>
                  ) : null}
                </div>
                <div style={{ marginBottom: 24 }}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Guests
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    fontSize="sm"
                    type="number"
                    placeholder="Enter number of guest(s)"
                    size="lg"
                    value={formData.guest}
                    onChange={(e) =>
                      setFormData({ ...formData, guest: e.target.value })
                    }
                  />
                  {!isGuestError ? (
                    <Text color="red">Booking Guest(s) is Empty</Text>
                  ) : null}
                </div>
                <div style={{ marginBottom: 24 }}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    From
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    fontSize="sm"
                    type="date"
                    placeholder="Enter guest arrival"
                    size="lg"
                    value={moment(formData.from).format("YYYY-MM-DD")}
                    onChange={(e) =>
                      setFormData({ ...formData, from: e.target.value })
                    }
                  />
                  {!isFromError ? (
                    <Text color="red">Booking From Date is Empty</Text>
                  ) : null}
                </div>
                <div style={{ marginBottom: 24 }}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    To
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    fontSize="sm"
                    type="date"
                    placeholder="Enter guest leaving"
                    size="lg"
                    value={moment(formData.to).format("YYYY-MM-DD")}
                    onChange={(e) =>
                      setFormData({ ...formData, to: e.target.value })
                    }
                  />
                  {!isToError ? (
                    <Text color="red">Booking To Date is Empty</Text>
                  ) : null}
                </div>
                <div style={{ marginBottom: 24 }}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Room
                  </FormLabel>
                  <Select
                    borderRadius="15px"
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
                    {mode === "update" ? (
                      <option key={formData.room?.id} value={formData.room?.id}>
                        {formData.room?.name}
                      </option>
                    ) : null}
                    {rooms.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                    {/* <option value="1">Room 1</option>
                  <option value="2">Room 2</option>
                  <option value="3">Room 3</option> */}
                  </Select>
                  {!isRoomError ? (
                    <Text color="red">Booking Room is Empty</Text>
                  ) : null}
                </div>
                <div style={{ marginBottom: 24 }}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Price
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    fontSize="sm"
                    type="float"
                    placeholder="Enter number of price"
                    size="lg"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                  {!isPriceError ? (
                    <Text color="red">Price is Empty</Text>
                  ) : null}
                </div>
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
                <div style={{ marginBottom: 24 }}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Status
                  </FormLabel>
                  <Select
                    borderRadius="15px"
                    fontSize="sm"
                    placeholder="Select status"
                    size="lg"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value="1">Not Paid Yet</option>
                    <option value="2">Paid</option>
                  </Select>
                  {!isStatusError ? (
                    <Text color="red">Status is Empty</Text>
                  ) : null}
                </div>
                <Button
                  onClick={() => handleClose()}
                  fontSize="10px"
                  // type="submit"
                  variant="outline"
                  borderColor="orange"
                  color="orange"
                  w="50%"
                  h="45"
                  mb="20px"
                  mt="20px"
                  _hover={{
                    bg: "orange.100",
                  }}
                  // _active={{
                  //   bg: "teal.100",
                  // }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSubmit(mode, formData.id)}
                  fontSize="10px"
                  type="submit"
                  bg="orange"
                  w="50%"
                  h="45"
                  mb="20px"
                  color="white"
                  mt="20px"
                  _hover={{
                    bg: "orange.200",
                  }}
                  // _active={{
                  //   bg: "teal.400",
                  // }}
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
