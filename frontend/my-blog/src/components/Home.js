import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, ButtonGroup, Heading } from '@chakra-ui/react'
import "../style/home.css"

const Home = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };
  const handleHomeClick = () => {
    navigate("/");
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

  return (
    <div id="home">
      <Heading as='h1' size='md'>Welcome to our Blogging Application!</Heading>
      <Button colorScheme='teal' variant='solid' onClick={handleHomeClick}>Home</Button>
     <Button colorScheme='teal' variant='solid' onClick={handleRegisterClick}>Register</Button>
      <Button colorScheme='teal' variant='solid' onClick={handleLoginClick}>Login</Button>
      <Button colorScheme='teal' variant='solid' onClick={handleViewProfileClick}>View Profile</Button>
    </div>
  );
};

export default Home;
