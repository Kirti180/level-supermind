const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const cors = require("cors");
require('dotenv').config();

const seq = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
});
// user schema
const users = seq.define("users", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  registration_date: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
});
// post schema
const posts = seq.define("posts", {
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: users,
      key: "user_id",
    },
  },
  publication_date: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
});
// comment schema
const comments = seq.define("comments", {
  comment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  comment_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: users,
      key: "user_id",
    },
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: posts,
      key: "post_id",
    },
  },
  comment_date: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
});

const app = express();
app.use(express.json());
app.use(cors());
// Define the registration endpoint
app.post("/register", async (req, res) => {
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
app.post("/login", async (req, res) => {
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

// Endpoint to delete a user by user_id
app.delete("/users/:user_id", async (req, res) => {
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

// Endpoint to create a new post
app.post("/posts", async (req, res) => {
  const { title, content, user_id } = req.body;

  try {
    // Create the new post
    const newPost = await posts.create({
      title,
      content,
      user_id,
    });

    res.status(201).json({
      message: "Post created successfully!",
      post: newPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create post." });
  }
});

// Endpoint to delete a post by post_id
app.delete("/posts/:post_id", async (req, res) => {
  const { post_id } = req.params;

  try {
    const post = await posts.findByPk(post_id);
    console.log("Posting", post);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Delete the post from the database
    await post.destroy();

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete post." });
  }
});

// Endpoint to get a user by user_id
app.get("/users/:user_id", async (req, res) => {
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

// Endpoint to fetch all posts
app.get("/posts", async (req, res) => {
  try {
    const allPosts = await posts.findAll(); // Use a different variable name here

    res.status(200).json({ posts: allPosts }); // Adjust the response object accordingly
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch posts." });
  }
});

// Endpoint to get posts of a specific user by user_id
app.get("/users/:user_id/posts", async (req, res) => {
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

// Endpoint to create a new comment
app.post("/comments", async (req, res) => {
  const { comment_text, user_id, post_id } = req.body;

  try {
    // Check if the user and post exist in the database
    const user = await users.findByPk(user_id);
    const post = await posts.findByPk(post_id);

    if (!user || !post) {
      return res.status(404).json({ error: "User or post not found." });
    }

    // Create the new comment
    const newComment = await comments.create({
      comment_text,
      user_id,
      post_id,
    });

    res.status(201).json({
      message: "Comment created successfully!",
      comment: newComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create comment." });
  }
});

// Endpoint to delete a comment by comment_id
app.delete("/comments/:comment_id", async (req, res) => {
  const { comment_id } = req.params;

  try {
    // Find the comment in the database based on the provided comment_id
    const comment = await comments.findByPk(comment_id);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    // Delete the comment from the database
    await comment.destroy();

    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete comment." });
  }
});

app.get("/comments/:post_id", async (req, res) => {
  const post_id = req.params.post_id;

  try {
    const commentsdata = await comments.findAll({
      where: { post_id },
    });
    res.json({ commentsdata });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch comments." });
  }
});

seq.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server Started");
  });
});
