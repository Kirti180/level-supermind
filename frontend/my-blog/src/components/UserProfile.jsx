import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/profile.css";
import { useParams } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [user_id, setUserId] = useState("");

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const { onOpen, onClose } = useDisclosure();
  // const { user_id } = useParams();
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
      // Handle error state here if needed
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
      // Handle error state here if needed
    }
  };
  const handleDeletePost = async (post_id) => {
    try {
      await axios.delete(`http://localhost:3001/posts/${post_id}`);
      fetchUserPosts();
      // Update the userPosts state after deleting the post
    } catch (error) {
      console.error(error);
      // Handle error state here if needed
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
      console.log(response.data); // You can handle the response data here if needed
      closeModal();
    } catch (error) {
      console.error(error);
      // Handle error if needed
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div id="user_detail">
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
      </div>
      <div id="post">
        {hide ? (
          <>
            {userPosts.map((post) => {
              return (
                <div key={post.post_id} id="ech_pst">
                  <Heading as="h1" size="sm">
                    {post.title}
                  </Heading>
                  <Heading as="h1" size="sm">
                    {post.content}
                  </Heading>
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
              );
            })}
          </>
        ) : null}
        <Button
          onClick={() => {
            setHide(!hide);
          }}
        >
          hide
        </Button>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Add form fields for post data */}
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSubmit}>
              Create Post
            </Button>
            <Button colorScheme="red" variant="solid" onClick={closeModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Profile;
