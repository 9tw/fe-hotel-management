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
  Tooltip,
  Textarea,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

function Bookings() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const textColor = useColorModeValue("gray.700", "white");
  const [mode, setMode] = useState();
  const [id, setId] = useState();
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    guest: null,
    from: null,
    to: null,
    room: null,
  });

  const fetchRoomName = async () => {
    try {
      const response = await axios.get("http://localhost:3005/room/names", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.data.result;
      setRooms(data.map((r) => r.name));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setRooms([]);
        console.log("No Room Found");
      } else {
        console.log("Error:", error);
      }
    }
  };

  const handleModal = (id, mode) => {
    if (mode !== "create") {
      setId(id);
    }
    setMode(mode);
    onOpen();
  };

  useEffect(() => {
    fetchRoomName();
  }, []);

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Button
        p="0px"
        bg="teal.300"
        w="5%"
        onClick={() => handleModal(null, "create")}
      >
        <Text color="white">Add</Text>
      </Button>
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
                {rooms.map((caption, idx) => {
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
                <Td>Thursday, 14 Aug 2025</Td>
                <Td onClick={() => handleModal(1, "detail")}>
                  <Tooltip label="Mr Jose (2 Guests)" hasArrow placement="top">
                    ❌
                  </Tooltip>
                </Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
                <Td>🟢</Td>
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
              <Text textAlign="center">Check Data</Text>
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
                  placeholder="Enter guest number"
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
                  value={formData.from}
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
                  value={formData.to}
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
                  value={formData.room}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      room: parseInt(e.target.value),
                    })
                  }
                >
                  <option value="1">Room 1</option>
                  <option value="2">Room 2</option>
                  <option value="3">Room 3</option>
                </Select>
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Notes
                </FormLabel>
                <Textarea
                  borderRadius="15px"
                  mb="24px"
                  fontSize="sm"
                  placeholder="Enter notes"
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
