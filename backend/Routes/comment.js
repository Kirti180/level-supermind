const { comments } = require("../models/comment");
const { posts } = require("../models/post");
const { users } = require("../models/user");
const commenttRouter = require("express").Router();
commenttRouter.post("/comments", async (req, res) => {
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
commenttRouter.delete("/comments/:comment_id", async (req, res) => {
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

commenttRouter.get("/comments/:post_id", async (req, res) => {
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
module.exports = { commenttRouter };
