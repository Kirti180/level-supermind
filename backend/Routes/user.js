const { comments } = require("../models/comment")
const { posts } = require("../models/post")
const { users } = require("../models/user")
const { Sequelize, DataTypes } = require("sequelize");
const userRouter=require("express").Router()
userRouter.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Create the user in the database
      const newUser = await users.create({
        username,
        email,
        password,
      });
  
      res.status(201).json({
        message: "User registered successfully!",
        user: {
          user_id: newUser.user_id,
          username: newUser.username,
          email: newUser.email,
          registration_date: newUser.registration_date,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to register user." });
    }
  });
  // Define the login endpoint
userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user in the database based on the provided username
      const user = await users.findOne({ where: { email } });
  
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      // Compare the provided password with the password stored in the database
      if (user.password !== password) {
        return res.status(401).json({ error: "Invalid password." });
      }
  
      // User is authenticated
      res.status(200).json({
        message: "Login successful!",
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          registration_date: user.registration_date,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Login failed." });
    }
  });

  userRouter.delete("/users/:user_id", async (req, res) => {
    const { user_id } = req.params;
  
    try {
      const user = await users.findByPk(user_id);
  
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      // Delete the user from the database
      await user.destroy();
  
      res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete user." });
    }
  });
  
  userRouter.get("/users/:user_id/posts", async (req, res) => {
    const { user_id } = req.params;
  
    try {
      const user = await users.findByPk(user_id);
  
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      // Find all posts associated with the user_id
      const postsbyuser = await posts.findAll({ where: { user_id } });
  
      res.status(200).json({ postsbyuser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch user posts." });
    }
  });

  userRouter.get("/users/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    // Find the user in the database based on the provided user_id
    const user = await users.findByPk(user_id);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user." });
  }
});
  module.exports={userRouter}