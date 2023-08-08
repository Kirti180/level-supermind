const { posts } = require("../models/post");
const postRouter = require("express").Router();
postRouter.post("/posts", async (req, res) => {
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
postRouter.delete("/posts/:post_id", async (req, res) => {
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
postRouter.get("/posts", async (req, res) => {
  try {
    const allPosts = await posts.findAll();

    res.status(200).json({ posts: allPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch posts." });
  }
});

module.exports = { postRouter };
