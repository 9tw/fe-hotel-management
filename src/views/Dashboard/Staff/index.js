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
  Box,
  Image,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import {
  FaEllipsisV,
  FaRegEdit,
  FaRegTrashAlt,
  FaSearch,
  FaRegCalendarCheck,
} from "react-icons/fa";
import axios from "axios";
import moment from "moment";

function Staff() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const textColor = useColorModeValue("gray.700", "white");
  const [captions, setCaptions] = useState([
    "Name",
    "Position",
    "Annual Leave",
    "Salary",
    "Seguranca",
    "Total",
    "",
  ]);
  const [mode, setMode] = useState();
  const [id, setId] = useState();
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({
    name: null,
    position: null,
    ttl: null,
    phone: null,
    address: null,
    start: null,
    salary: null,
    photo: null,
    leave: null,
    cut: null,
  });
  const [isNameError, setIsNameError] = useState(true);
  const [isPositionError, setIsPositionError] = useState(true);
  const [isTTLError, setIsTTLError] = useState(true);
  const [isPhoneError, setIsPhoneError] = useState(true);
  const [isAddressError, setIsAddressError] = useState(true);
  const [isStartError, setIsStartError] = useState(true);
  const [isSalaryError, setIsSalaryError] = useState(true);
  const [isPhotoError, setIsPhotoError] = useState(true);
  const [isPhotoData, setIsPhotoData] = useState();
  const [isLeaveError, setIsLeaveError] = useState(true);
  const [isCutError, setIsCutError] = useState(true);
  const [salary, setSalary] = useState(0);
  const [seguranca, setSeguranca] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchStaffs = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `/staff`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.data.result;
      setStaff(data);

      const totals = data.reduce(
        (acc, row) => {
          acc.salary += row.salary;
          acc.seguranca += Math.floor(row.salary / 26);
          acc.total += row.salary - Math.floor(row.salary / 26);
          return acc;
        },
        { salary: 0, seguranca: 0, total: 0 } // initial values
      );
      setSalary(totals.salary);
      setSeguranca(totals.seguranca);
      setTotal(totals.total);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setStaff([]);
        console.log("No Staff Found");
      } else {
        console.log("Error:", error);
      }
    }
  };

  const fetchStaffById = async (staffId) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/staff/get/" + staffId,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.data.result[0];
      setIsPhotoData(data.photo != null ? true : false);
      setFormData({
        name: data.name,
        position: data.position,
        ttl: data.ttl,
        phone: data.phone_number,
        address: data.address,
        start: data.start_date,
        salary: data.salary,
        photo: data.photo,
        leave: data.leave,
        cut: data.cut,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setFormData({
          name: null,
          position: null,
          ttl: null,
          phone: null,
          address: null,
          start: null,
          salary: null,
          photo: null,
          leave: null,
          cut: null,
        });
        console.log("No Staff Found");
      } else {
        console.log("Error:", error);
      }
    }
  };

  const handleSubmit = async (mode) => {
    if (!formData.cut && mode === "leave") {
      setIsCutError(false);
    } else if (
      (!formData.name ||
        !formData.position ||
        !formData.ttl ||
        !formData.phone ||
        !formData.address ||
        !formData.start ||
        !formData.salary ||
        !formData.photo ||
        !formData.leave) &&
      mode != "delete" &&
      mode != "leave"
    ) {
      setIsNameError(!formData.name ? false : true);
      setIsPositionError(!formData.position ? false : true);
      setIsTTLError(!formData.ttl ? false : true);
      setIsPhoneError(!formData.phone ? false : true);
      setIsAddressError(!formData.address ? false : true);
      setIsStartError(!formData.start ? false : true);
      setIsSalaryError(!formData.salary ? false : true);
      setIsPhotoError(!formData.photo ? false : true);
      setIsLeaveError(!formData.leave ? false : true);
    } else {
      try {
        if (mode === "create") {
          const response = await axios.post(
            process.env.REACT_APP_API_URL + "/staff",
            {
              name: formData.name,
              position: formData.position,
              ttl: formData.ttl,
              phone_number: formData.phone,
              address: formData.address,
              start_date: formData.start,
              salary: formData.salary,
              photo: formData.photo,
              leave: formData.leave,
            },
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Server response:", response.data);
          alert("Staff created!");
        } else if (mode === "update") {
          const response = await axios.put(
            process.env.REACT_APP_API_URL + "/staff/" + id,
            {
              name: formData.name,
              position: formData.position,
              ttl: formData.ttl,
              phone_number: formData.phone,
              address: formData.address,
              start_date: formData.start,
              salary: formData.salary,
              photo: formData.photo,
              leave: formData.leave,
            },
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Server response:", response.data);
          alert("Staff updated!");
        } else if (mode === "leave") {
          const response = await axios.put(
            process.env.REACT_APP_API_URL + "/staff/" + id,
            {
              cut: formData.cut,
            },
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Server response:", response.data);
          alert("Annual Leave updated!");
        } else {
          const response = await axios.delete(
            process.env.REACT_APP_API_URL + "/staff/" + id,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Server response:", response.data);
          alert("Staff deleted!");
        }

        setFormData({
          name: null,
          position: null,
          ttl: null,
          phone: null,
          address: null,
          start: null,
          salary: null,
          photo: null,
          leave: null,
          cut: null,
        });
        setIsNameError(true);
        setIsPositionError(true);
        setIsTTLError(true);
        setIsPhoneError(true);
        setIsAddressError(true);
        setIsStartError(true);
        setIsSalaryError(true);
        setIsPhotoError(true);
        setIsLeaveError(true);
        setIsCutError(true);
        onClose();
        fetchStaffs();
      } catch (error) {
        console.error("Error submitting form:", error);
        alert(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  const handleModal = (id, name, mode) => {
    setId(id);
    if (mode === "update" || mode === "detail") {
      fetchStaffById(id);
    } else if (mode === "delete") {
      setFormData({
        name: name,
      });
    }
    setMode(mode);
    onOpen();
  };

  const handleClose = () => {
    setFormData({
      name: null,
      position: null,
      ttl: null,
      phone: null,
      address: null,
      start: null,
      salary: null,
      photo: null,
      leave: null,
      cut: null,
    });
    setIsPhotoData();
    onClose();
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card
        my="22px"
        overflowX={{ sm: "scroll", xl: "hidden" }}
        w="75%"
        mx="auto"
      >
        <CardHeader p="6px 0px 22px 0px">
          <Flex direction="column">
            <Button
              p="0px"
              bg="orange"
              w="200%"
              onClick={() => handleModal(null, null, "create")}
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
              {staff.map((row) => {
                return (
                  <Tr>
                    <Td pl="0px">
                      {/* <Flex
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
                      <Text fontSize="md" color={textColor} minWidth="100%">
                        {row.position}
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
                      <Text fontSize="md" color={textColor} minWidth="100%">
                        {row.leave - row.cut}
                      </Text>
                    </Td>
                    <Td>
                      <Text fontSize="md" color={textColor} minWidth="100%">
                        ${row.salary}
                      </Text>
                    </Td>
                    <Td>
                      <Text fontSize="md" color={textColor} minWidth="100%">
                        ${Math.floor(row.salary / 26)}
                      </Text>
                    </Td>
                    <Td>
                      <Text fontSize="md" color={textColor} minWidth="100%">
                        ${row.salary - Math.floor(row.salary / 26)}
                      </Text>
                    </Td>
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
                              handleModal(row.id, row.name, "detail")
                            }
                          >
                            <Icon
                              as={FaSearch}
                              color="blue.400"
                              cursor="pointer"
                              style={{ marginRight: "10%" }}
                            />
                            Detail
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleModal(row.id, null, "leave")}
                          >
                            <Icon
                              as={FaRegCalendarCheck}
                              color="orange.400"
                              cursor="pointer"
                              style={{ marginRight: "10%" }}
                            />
                            Leave
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              handleModal(row.id, row.name, "update")
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
                              handleModal(row.id, row.name, "delete")
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
              <Tr>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td>${salary}</Td>
                <Td>${seguranca}</Td>
                <Td>${total}</Td>
              </Tr>
            </Tbody>
          </Table>
        </CardBody>
      </Card>
      <Modal isOpen={isOpen} onClose={() => handleClose()} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {mode === "create"
              ? `Create`
              : mode === "update"
              ? `Update`
              : mode === "delete"
              ? `Delete`
              : mode === "leave"
              ? `Leave`
              : `Detail`}
          </ModalHeader>
          <ModalCloseButton />
          {mode === "detail" ? (
            <ModalBody>
              <Box mt={4} justify="center" align="center">
                <Image
                  src={process.env.REACT_APP_API_URL + formData.photo}
                  alt="Photo"
                  boxSize="200px"
                  objectFit="cover"
                />
              </Box>
              <Text>Name: {formData.name}</Text>
              <Text>Position: {formData.position}</Text>
              <Text>Annual Leave: {formData.leave - formData.cut} Days</Text>
              <Text>Place & Date of Birth: {formData.ttl}</Text>
              <Text>Address: {formData.address}</Text>
              <Text>Phone Number: {formData.phone}</Text>
              <Text>Salary: ${formData.salary}</Text>
              <Text>Seguranca: ${Math.floor(formData.salary / 26)}</Text>
              <Text>
                Total: ${formData.salary - Math.floor(formData.salary / 26)}
              </Text>
              <Text>
                Start Working:{" "}
                {moment(formData.start).format("dddd, DD MMM YYYY")}
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
          ) : mode === "leave" ? (
            <ModalBody>
              <FormControl>
                <Text textAlign="center">How many days?</Text>
                <Input
                  borderRadius="15px"
                  mt="10px"
                  fontSize="sm"
                  type="number"
                  placeholder="Enter leave days"
                  size="lg"
                  value={formData.cut}
                  onChange={(e) =>
                    setFormData({ ...formData, cut: e.target.value })
                  }
                />
                {!isCutError ? (
                  <Text color="red">Leave days is Empty</Text>
                ) : null}
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
                  Submit
                </Button>
              </FormControl>
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
                    placeholder="Enter Staff name"
                    size="lg"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  {!isNameError ? (
                    <Text color="red">Staff Name is Empty</Text>
                  ) : null}
                </div>
                <div style={{ marginBottom: 24 }}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Position
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    // mb="24px"
                    fontSize="sm"
                    type="text"
                    placeholder="Enter staff position"
                    size="lg"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                  />
                  {!isPositionError ? (
                    <Text color="red">Staff Position is Empty</Text>
                  ) : null}
                </div>
                <div style={{ marginBottom: 24 }}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Place & Date of Birth
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    // mb="24px"
                    fontSize="sm"
                    type="text"
                    placeholder="Enter staff place & date birth"
                    size="lg"
                    value={formData.ttl}
                    onChange={(e) =>
                      setFormData({ ...formData, ttl: e.target.value })
                    }
                  />
                  {!isTTLError ? (
                    <Text color="red">Staff Place & Date Birth is Empty</Text>
                  ) : null}
                </div>
                <div style={{ marginBottom: 24 }}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Phone Number
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    // mb="24px"
                    fontSize="sm"
                    type="text"
                    placeholder="Enter staff phone number"
                    size="lg"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                  {!isPhoneError ? (
                    <Text color="red">Staff Phone Number is Empty</Text>
                  ) : null}
                </div>
                <div style={{ marginBottom: 24 }}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Address
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    // mb="24px"
                    fontSize="sm"
                    type="text"
                    placeholder="Enter staff address"
                    size="lg"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                  {!isAddressError ? (
                    <Text color="red">Staff Address is Empty</Text>
                  ) : null}
                </div>
                <div style={{ marginBottom: 24 }}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Start Date
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    fontSize="sm"
                    type="date"
                    placeholder="Enter staff start date"
                    size="lg"
                    value={moment(formData.start).format("YYYY-MM-DD")}
                    onChange={(e) =>
                      setFormData({ ...formData, start: e.target.value })
                    }
                  />
                  {!isStartError ? (
                    <Text color="red">Staff Start Date is Empty</Text>
                  ) : null}
                </div>
                <div style={{ marginBottom: 24 }}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Salary
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    // mb="24px"
                    fontSize="sm"
                    type="text"
                    placeholder="Enter staff salary"
                    size="lg"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData({ ...formData, salary: e.target.value })
                    }
                  />
                  {!isSalaryError ? (
                    <Text color="red">Staff Salary is Empty</Text>
                  ) : null}
                </div>
                <div style={{ marginBottom: 24 }}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Annual Leave
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    // mb="24px"
                    fontSize="sm"
                    type="text"
                    placeholder="Enter staff annual leave"
                    size="lg"
                    value={formData.leave}
                    onChange={(e) =>
                      setFormData({ ...formData, leave: e.target.value })
                    }
                  />
                  {!isLeaveError ? (
                    <Text color="red">Staff Annual Leave is Empty</Text>
                  ) : null}
                </div>
                <div style={{ marginBottom: 24 }}>
                  <FormLabel>Photo</FormLabel>
                  <Input
                    type="file"
                    border="0"
                    borderRadius="0"
                    padding="0"
                    accept="image/*"
                    onChange={(e) => {
                      setFormData({ ...formData, photo: e.target.files[0] });
                      setIsPhotoData(false);
                    }}
                  />
                  {formData.photo && (
                    <Box mt={4}>
                      <Image
                        src={
                          mode === "update" && isPhotoData
                            ? process.env.REACT_APP_API_URL + formData.photo
                            : URL.createObjectURL(formData.photo)
                        }
                        alt="Preview"
                        boxSize="200px"
                        objectFit="cover"
                      />
                    </Box>
                  )}
                  {!isPhotoError ? (
                    <Text color="red">Staff Photo is Empty</Text>
                  ) : null}
                </div>

                {/* <div style={{ marginBottom: 24 }}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Photo
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    fontSize="sm"
                    type="text"
                    placeholder="Enter staff photo"
                    size="lg"
                    value={formData.photo}
                    onChange={(e) =>
                      setFormData({ ...formData, photo: e.target.value })
                    }
                  />
                  {!isPhotoError ? (
                    <Text color="red">Staff Photo is Empty</Text>
                  ) : null}
                </div> */}
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

export default Staff;
