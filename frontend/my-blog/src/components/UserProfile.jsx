import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Flex,
  Heading,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import "../style/profile.css";
import { useParams } from "react-router-dom";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [user_id, setUserId] = useState("");

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const { onOpen, onClose } = useDisclosure();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [hide, setHide] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, [user_id]);

  const fetchUserData = async () => {
    try {
      let user_id = localStorage.getItem("userid");
      const response = await axios.get(
        `http://localhost:3001/users/${user_id}`
      );
      const userData = response.data.user;
      setUser(userData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      let user_id = localStorage.getItem("userid");
      const response = await axios.get(
        `http://localhost:3001/users/${user_id}/posts`
      );
      const postsByUser = response.data.postsbyuser;
      setUserPosts(postsByUser);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePost = async (post_id) => {
    try {
      await axios.delete(`http://localhost:3001/posts/${post_id}`);
      fetchUserPosts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      let userid = localStorage.getItem("userid");
      const response = await axios.post("http://localhost:3001/posts", {
        title,
        content,
        user_id: userid,
      });
      fetchUserPosts();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Flex id="user_detail" justify="space-between" align="center">
        <div>
          <Heading as="h1" size="md">
            Name: {user.username}
          </Heading>
          <Heading as="h1" size="md">
            Email: {user.email}
          </Heading>
        </div>
        <div>
          <Button colorScheme="green" variant="solid" onClick={openModal}>
            Create New Post
          </Button>
        </div>
      </Flex>
      <div id="post">
        {hide && (
          <>
            {userPosts.map((post) => (
              <div key={post.post_id} id="ech_pst">
                <Heading as="h1" size="sm">
                  {post.title}
                </Heading>
                <p>{post.content}</p>
                <Button
                  colorScheme="red"
                  variant="solid"
                  onClick={() => {
                    handleDeletePost(post.post_id);
                  }}
                >
                  Delete Post
                </Button>
              </div>
            ))}
          </>
        )}
        <Button onClick={() => setHide(!hide)}>
          {hide ? "Show" : "Hide"} Posts
        </Button>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              mt={4}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSubmit}>
              Create Post
            </Button>
            <Button colorScheme="gray" variant="solid" onClick={closeModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Profile;
