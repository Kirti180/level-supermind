const express = require("express");
const { userRouter } = require("./Routes/user");
const { commenttRouter } = require("./Routes/comment");
const { postRouter } = require("./Routes/post");
const cors = require("cors");
const { seq } = require("./db");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/", userRouter);
app.use("/", postRouter);
app.use("/", commenttRouter);

seq.sync().then(() => {
  app.listen(3006, () => {
    console.log("Server Started");
  });
});
