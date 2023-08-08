import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Flex } from '@chakra-ui/react';

const Home = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleViewProfileClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile");
    } else {
      alert("Please log in first");
      navigate("/login");
    }
  };

  const isLoggedIn = localStorage.getItem("token");

  return (
    <Flex
      id="navbar"
      align="center"
      padding="1rem"
      bg="gray.100" // Light shade background color
      marginBottom="3rem"
    >
      <Button colorScheme='teal' variant='ghost' onClick={handleHomeClick} mr="1rem">
        Logo
      </Button>
      <Button colorScheme='teal' variant='ghost' onClick={handleHomeClick} mr="1rem">
        Contact
      </Button>
      <Button colorScheme='teal' variant='ghost' onClick={handleHomeClick} mr="1rem">
        Home
      </Button>
      <Button colorScheme='teal' variant='ghost' onClick={handleRegisterClick} mr="1rem">
        Register
      </Button>
      <Button colorScheme='teal' variant='ghost' onClick={handleLoginClick} mr="1rem">
        Login
      </Button>
      {isLoggedIn ? (
        <Button
          colorScheme='teal'
          variant='ghost'
          onClick={handleViewProfileClick}
          bg="teal"
          color="white"
          _hover={{ bg: "white", color: "teal" }}
          ml="auto" // Pushes the button to the right
        >
          View Profile
        </Button>
      ) : null}
    </Flex>
  );
};

export default Home;
