import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faTag } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "../style/posts.css";
import Cardpost from "./Cardpost";
const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/posts");
      const allPosts = response.data.posts.map((post) => ({
        ...post,
        isHeartRed: false,
      }));
      setPosts(allPosts);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div id="main">
      {posts.map((post) => (
        <Cardpost post={post} />
      ))}
    </div>
  );
};

export default PostList;
