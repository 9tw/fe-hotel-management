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
import { FaEllipsisV, FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import axios from "axios";

function Rooms() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const textColor = useColorModeValue("gray.700", "white");
  const [captions, setCaptions] = useState(["Name", "Status", ""]);
  const [mode, setMode] = useState();
  const [id, setId] = useState();
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    status: 0,
  });

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

  const handleSubmit = async (mode) => {
    try {
      console.log(formData);
      if (mode === "create") {
        const response = await axios.post(
          "http://localhost:3005/room",
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
          "http://localhost:3005/room/" + id,
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
          "http://localhost:3005/room/" + id,
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
        name: "",
        status: 0,
      });
      onClose();
      fetchRooms();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error.response?.data?.message || "Something went wrong");
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

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card
        my="22px"
        overflowX={{ sm: "scroll", xl: "hidden" }}
        w="50%"
        mx="auto"
      >
        <CardHeader p="6px 0px 22px 0px">
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
                    <Td minWidth={{ sm: "250px" }} pl="0px">
                      <Flex
                        alignItems="center"
                        py=".8rem"
                        minWidth="100%"
                        flexWrap="nowrap"
                      >
                        {/* <Icon as={row.logo} h={"24px"} w={"24px"} me="18px" /> */}
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
                      <Text
                        fontSize="md"
                        color={textColor}
                        fontWeight="bold"
                        pb=".5rem"
                      >
                        {row.status === 1
                          ? `🟢`
                          : row.status === 2
                          ? `❌`
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
      </Card>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
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
                  placeholder="Enter room name"
                  size="lg"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Status
                </FormLabel>
                <Select
                  borderRadius="15px"
                  mb="24px"
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

export default Rooms;
