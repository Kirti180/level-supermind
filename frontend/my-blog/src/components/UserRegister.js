import React, { useState } from "react";
import axios from "axios";

import "../style/register.css"
import {
  Button,Heading
} from '@chakra-ui/react'
const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/register",
        formData
      );
      console.log(response.data); // You can handle the response as needed
      if (response.status === 201) {
        window.alert("Register successful!");
        // Registration successful
        console.log(response.data.message);
        console.log(response.data.user);
      } else {
        // Registration failed
        console.log("Failed to register user.");
      }
    } catch (error) {
      console.error(error); // Log the full error object for debugging purposes
      console.error(error.response?.data?.error); // Display registration error message if available
    }
  };

  return (
    <div id="register">
      <Heading as='h1' size='lg'>Register</Heading>
      <form onSubmit={handleSubmit}>
        <div>
        
          <input
          placeholder="Enter Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          
          <input
          placeholder="Enter Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          
          <input
          placeholder="Enter password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <Button colorScheme='teal' variant='solid' type="submit">Register</Button>
      </form>
    </div>
  );
};

export default Register;
