import React, { useState } from "react";
import axios from "axios";
import "../style/login.css"
import {
  Button,Heading
} from '@chakra-ui/react'
const Login = () => {
  const [formData, setFormData] = useState({
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
        "http://localhost:3001/login",
        formData
      );
      console.log(response.data);
      const userid = response.data.user.user_id;
      console.log(response.data.user)
      localStorage.setItem("userid", userid);
      localStorage.setItem("token", "newtoken");
      window.alert("Login successful!");
    } catch (error) {
      console.error(error.response.data.error); 
    }
  };

  return (
    <div id="login">
      <Heading as='h1' size='lg'>Login</Heading>
      <form onSubmit={handleSubmit}>
        <div>
          
          <input

            type="email"
            placeholder="Enter Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
         
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <Button colorScheme='teal' variant='solid' type="submit">Login</Button>
      </form>
    </div>
  );
};

export default Login;
