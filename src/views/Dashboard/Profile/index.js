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
} from "@chakra-ui/react";
import avatar4 from "assets/img/avatars/avatar4.png";
import ProfileBgImage from "assets/img/ProfileBackground.png";
import { FaCube, FaPenFancy } from "react-icons/fa";
import { IoDocumentsSharp } from "react-icons/io5";
import Conversations from "./components/Conversations";
import Header from "./components/Header";
import PlatformSettings from "./components/PlatformSettings";
import ProfileInformation from "./components/ProfileInformation";
import Projects from "./components/Projects";
import maintenance from "assets/img/undraw_maintenances.png";
import React, { useState, useEffect } from "react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import {
  FaEllipsisV,
  FaRegEdit,
  FaRegTrashAlt,
  FaStarOfLife,
} from "react-icons/fa";
import axios from "axios";

function Profile() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const textColor = useColorModeValue("gray.700", "white");
  const bgProfile = useColorModeValue(
    "hsla(0,0%,100%,.8)",
    "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
  );

  const [captions, setCaptions] = useState(["Name", "Email", ""]);
  const [mode, setMode] = useState();
  const [id, setId] = useState();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: null,
    email: null,
  });
  const [isNameError, setIsNameError] = useState(true);
  const [isEmailError, setIsEmailError] = useState(true);
  const [password, setPassword] = useState();
  const [password2, setPassword2] = useState();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async (page) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `/user/all?page=${page}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.data.result;
      const pagination = await response.data.pagination.totalPages;

      setUsers(data);
      setTotalPages(pagination);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setUsers([]);
        console.log("No User Found");
      } else {
        console.log("Error:", error);
      }
    }
  };

  const handleSubmit = async (mode) => {
    if (mode === "create") {
      if (!formData.name || !formData.email || !password || !password2) {
        setIsNameError(!formData.name ? false : true);
        setIsEmailError(!formData.email ? false : true);
        setPassword(!password ? null : password);
        setPassword2(!password2 ? null : password2);
      } else if (password !== password2) {
        alert("Password didnt match!");
      } else {
        try {
          const response = await axios.post(
            process.env.REACT_APP_API_URL + "/user",
            {
              name: formData.name,
              email: formData.email,
              password: password,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Server response:", response.data);
          alert("User created!");
        } catch (error) {
          console.error("Error submitting form:", error);
          alert(error.response?.data?.message || "Something went wrong");
        }

        setFormData({
          name: null,
          email: null,
        });
        setIsNameError(true);
        setIsEmailError(true);
        setPassword();
        setPassword2();
        onClose();
        fetchUsers(page);
      }
    } else if (mode === "update") {
      if (!formData.name || !formData.email) {
        setIsNameError(!formData.name ? false : true);
        setIsEmailError(!formData.email ? false : true);
      } else {
        try {
          const response = await axios.put(
            process.env.REACT_APP_API_URL + "/user/" + id,
            {
              name: formData.name,
              email: formData.email,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Server response:", response.data);
          alert("User updated!");
        } catch (error) {
          console.error("Error submitting form:", error);
          alert(error.response?.data?.message || "Something went wrong");
        }

        setFormData({
          name: null,
          email: null,
        });
        setIsNameError(true);
        setIsEmailError(true);
        setPassword();
        setPassword2();
        onClose();
        fetchUsers(page);
      }
    } else if (mode === "change") {
      if (!password || !password2) {
        setPassword(!password ? null : password);
        setPassword2(!password2 ? null : password2);
      } else if (password !== password2) {
        alert("Password didnt match!");
      } else {
        try {
          const response = await axios.put(
            process.env.REACT_APP_API_URL + "/user/" + id,
            {
              password: password,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Server response:", response.data);
          alert("User password updated!");
        } catch (error) {
          console.error("Error submitting form:", error);
          alert(error.response?.data?.message || "Something went wrong");
        }

        setFormData({
          name: null,
          email: null,
        });
        setIsNameError(true);
        setIsEmailError(true);
        setPassword();
        setPassword2();
        onClose();
        fetchUsers(page);
      }
    } else if (mode === "delete") {
      try {
        const response = await axios.delete(
          process.env.REACT_APP_API_URL + "/user/" + id,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Server response:", response.data);
        alert("User deleted!");
      } catch (error) {
        console.error("Error submitting form:", error);
        alert(error.response?.data?.message || "Something went wrong");
      }

      setFormData({
        name: null,
        email: null,
      });
      setIsNameError(true);
      setIsEmailError(true);
      setPassword();
      setPassword2();
      onClose();
      fetchUsers(page);
    }
  };

  const handleModal = (id, name, email, mode) => {
    if (mode !== "create") {
      setId(id);
      setFormData({
        name: name,
        email: email,
      });
    }
    setMode(mode);
    onOpen();
  };

  const handleClose = () => {
    setFormData({
      name: null,
      email: null,
    });
    setPassword();
    setPassword2();
    onClose();
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  return (
    // <Flex direction='column'>
    //   <Header
    //     backgroundHeader={ProfileBgImage}
    //     backgroundProfile={bgProfile}
    //     avatarImage={avatar4}
    //     name={"Esthera Jackson"}
    //     email={"esthera@simmmple.com"}
    //     tabs={[
    //       {
    //         name: "OVERVIEW",
    //         icon: <FaCube w='100%' h='100%' />,
    //       },
    //       {
    //         name: "TEAMS",
    //         icon: <IoDocumentsSharp w='100%' h='100%' />,
    //       },
    //       {
    //         name: "PROJECTS",
    //         icon: <FaPenFancy w='100%' h='100%' />,
    //       },
    //     ]}
    //   />
    //   <Grid templateColumns={{ sm: "1fr", xl: "repeat(3, 1fr)" }} gap='22px'>
    //     <PlatformSettings
    //       title={"Platform Settings"}
    //       subtitle1={"ACCOUNT"}
    //       subtitle2={"APPLICATION"}
    //     />
    //     <ProfileInformation
    //       title={"Profile Information"}
    //       description={
    //         "Hi, I’m Esthera Jackson, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
    //       }
    //       name={"Esthera Jackson"}
    //       mobile={"(44) 123 1234 123"}
    //       email={"esthera@simmmple.com"}
    //       location={"United States"}
    //     />
    //     <Conversations title={"Conversations"} />
    //   </Grid>
    //   <Projects title={"Projects"} description={"Architects design houses"} />
    // </Flex>
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
              {users.map((row) => {
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
                        <Text fontSize="md" color={textColor} minWidth="100%">
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
                      <Text fontSize="md" color={textColor} pb=".5rem">
                        {row.email}
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
                              handleModal(row.id, null, null, "change")
                            }
                          >
                            <Icon
                              as={FaStarOfLife}
                              color="blue.400"
                              cursor="pointer"
                              style={{ marginRight: "10%" }}
                            />
                            Password
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              handleModal(row.id, row.name, row.email, "update")
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
                              handleModal(row.id, row.name, row.email, "delete")
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
              : mode === "change"
              ? `Change Password`
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
          ) : mode === "create" ? (
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
                    placeholder="Enter name"
                    size="lg"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  {!isNameError ? <Text color="red">Name is Empty</Text> : null}
                </div>
                <div style={{ marginBottom: 24 }}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Email
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    // mb="24px"
                    fontSize="sm"
                    type="text"
                    placeholder="Enter email"
                    size="lg"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  {!isEmailError ? (
                    <Text color="red">Email is Empty</Text>
                  ) : null}
                </div>
                <div style={{ marginBottom: 24 }}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Password
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    // mb="24px"
                    fontSize="sm"
                    type="text"
                    placeholder="Enter password"
                    size="lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password === null ? (
                    <Text color="red">Password is Empty</Text>
                  ) : null}
                </div>
                <div style={{ marginBottom: 24 }}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Re-enter Password
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    // mb="24px"
                    fontSize="sm"
                    type="text"
                    placeholder="Re-enter password"
                    size="lg"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                  />
                  {password2 === null ? (
                    <Text color="red">Password is Empty</Text>
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
          ) : mode === "update" ? (
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
                    placeholder="Enter name"
                    size="lg"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  {!isNameError ? <Text color="red">Name is Empty</Text> : null}
                </div>
                <div style={{ marginBottom: 24 }}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Email
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    // mb="24px"
                    fontSize="sm"
                    type="text"
                    placeholder="Enter email"
                    size="lg"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  {!isEmailError ? (
                    <Text color="red">Email is Empty</Text>
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
                    Password
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    // mb="24px"
                    fontSize="sm"
                    type="text"
                    placeholder="Enter password"
                    size="lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password === null ? (
                    <Text color="red">Password is Empty</Text>
                  ) : null}
                </div>
                <div style={{ marginBottom: 24 }}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Re-enter Password
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    // mb="24px"
                    fontSize="sm"
                    type="text"
                    placeholder="Re-enter password"
                    size="lg"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                  />
                  {password2 === null ? (
                    <Text color="red">Password is Empty</Text>
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
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default Profile;
