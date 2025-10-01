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
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { FaEllipsisV, FaRegEdit, FaRegTrashAlt, FaBoxes } from "react-icons/fa";
import axios from "axios";
import { useHistory } from "react-router-dom";

function Rooms() {
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const textColor = useColorModeValue("gray.700", "white");
  const [captions, setCaptions] = useState(["Name", "Status", ""]);
  const [mode, setMode] = useState();
  const [id, setId] = useState();
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    name: null,
    status: null,
  });
  const [isNameError, setIsNameError] = useState(true);
  const [isStatusError, setIsStatusError] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRooms = async (page) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `/room/all?page=${page}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.data.result;
      const pagination = await response.data.pagination.totalPages;

      setRooms(data);
      setTotalPages(pagination);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setRooms([]);
        console.log("No Room Found");
      } else {
        console.log("Error:", error);
      }
    }
  };

  const handleSubmit = async (mode) => {
    if (!formData.name || !formData.status) {
      setIsNameError(!formData.name ? false : true);
      setIsStatusError(!formData.status ? false : true);
    } else {
      try {
        if (mode === "create") {
          const response = await axios.post(
            process.env.REACT_APP_API_URL + "/room",
            {
              name: formData.name,
              status: formData.status,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Server response:", response.data);
          alert("Room created!");
        } else if (mode === "update") {
          const response = await axios.put(
            process.env.REACT_APP_API_URL + "/room/" + id,
            {
              name: formData.name,
              status: formData.status,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Server response:", response.data);
          alert("Room updated!");
        } else {
          const response = await axios.delete(
            process.env.REACT_APP_API_URL + "/room/" + id,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Server response:", response.data);
          alert("Room deleted!");
        }

        setFormData({
          name: null,
          status: null,
        });
        setIsNameError(true);
        setIsStatusError(true);
        onClose();
        fetchRooms(page);
      } catch (error) {
        console.error("Error submitting form:", error);
        alert(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  const handleModal = (id, name, status, mode) => {
    if (mode !== "create") {
      setId(id);
      setFormData({
        name: name,
        status: status,
      });
    }
    setMode(mode);
    onOpen();
  };

  const handleClose = () => {
    setFormData({
      name: null,
      status: null,
    });
    setIsNameError(true);
    setIsStatusError(true);
    onClose();
  };

  useEffect(() => {
    fetchRooms(page);
  }, [page]);

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card
        my="22px"
        overflowX={{ sm: "scroll", xl: "hidden" }}
        w="35%"
        mx="auto"
      >
        <CardHeader p="6px 0px 22px 0px">
          <Flex direction="column">
            <Button
              p="0px"
              bg="orange"
              w="200%"
              onClick={() => handleModal(null, null, null, "create")}
            >
              <Text color="white">Add</Text>
            </Button>
          </Flex>
        </CardHeader>
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
              {rooms.map((row) => {
                return (
                  <Tr>
                    <Td my=".8rem" pl="0px">
                      {/* <Td minWidth={{ sm: "250px" }} pl="0px">
                      <Flex
                        alignItems="center"
                        py=".8rem"
                        minWidth="100%"
                        flexWrap="nowrap"
                      > */}
                      {/* <Icon as={row.logo} h={"24px"} w={"24px"} me="18px" /> */}
                      <Text fontSize="md" color={textColor} minWidth="100%">
                        {row.name}
                      </Text>
                      {/* </Flex> */}
                    </Td>
                    {/* <Td>
                      <Text
                        fontSize="md"
                        color={textColor}
                        fontWeight="bold"
                        pb=".5rem"
                      >
                        {row.budget}
                      </Text>
                    </Td> */}
                    <Td>
                      <Text fontSize="md" color={textColor} pb=".5rem">
                        {row.status === 1
                          ? `✅`
                          : row.status === 2
                          ? `🚫`
                          : `🛠️`}
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
                            onClick={() =>
                              history.push(`/admin/room-inventory?id=` + row.id)
                            }
                          >
                            <Icon
                              as={FaBoxes}
                              color="blue.400"
                              cursor="pointer"
                              style={{ marginRight: "10%" }}
                            />
                            Inventory
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              handleModal(
                                row.id,
                                row.name,
                                row.status,
                                "update"
                              )
                            }
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
                            onClick={() =>
                              handleModal(
                                row.id,
                                row.name,
                                row.status,
                                "delete"
                              )
                            }
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
      <Modal isOpen={isOpen} onClose={() => handleClose()} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {mode === "create"
              ? `Create`
              : mode === "update"
              ? `Update`
              : `Delete`}
          </ModalHeader>
          <ModalCloseButton />
          {mode === "delete" ? (
            <ModalBody>
              <Text textAlign="center">
                You sure to delete {formData.name} ?
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
                //   bg: "teal.100"
                // }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleSubmit(mode)}
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
                    // mb="24px"
                    fontSize="sm"
                    type="text"
                    placeholder="Enter room name"
                    size="lg"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  {!isNameError ? (
                    <Text color="red">Room Name is Empty</Text>
                  ) : null}
                </div>
                <div style={{ marginBottom: 24 }}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Status
                  </FormLabel>
                  <Select
                    borderRadius="15px"
                    // mb="24px"
                    fontSize="sm"
                    placeholder="Select room status"
                    size="lg"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value="1">Available</option>
                    <option value="2">Unavailable</option>
                    <option value="3">Maintenance</option>
                  </Select>
                  {!isStatusError ? (
                    <Text color="red">Room Status is Empty</Text>
                  ) : null}
                </div>
                {/* <Input
                  borderRadius="15px"
                  mb="24px"
                  fontSize="sm"
                  type="text"
                  placeholder="Enter room status"
                  size="lg"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                /> */}
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
                  onClick={() => handleSubmit(mode)}
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

export default Rooms;
