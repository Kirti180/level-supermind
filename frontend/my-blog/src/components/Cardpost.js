import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faTag, faPaperPlane, faTrash  } from "@fortawesome/free-solid-svg-icons";
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverCloseButton, InputGroup, Input, InputRightElement, Button, useToast } from "@chakra-ui/react";
import "../style/comments.css"
const Cardpost = (props) => {
  const [like, setLike] = useState(false);
  const [show, setShow] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  const toast = useToast();
  const handleDelete = async (comment_id) => {
    try {
      const response = await fetch(`http://localhost:3001/comments/${comment_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        // Comment deleted successfully
        console.log("Comment deleted successfully.");
        fetchComments();
      } else if (response.status === 404) {
        console.log("Comment not found.");
      } else {
        console.log("Failed to delete comment.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  
  const fetchComments = async () => {
    try {
      console.log(props.post.post_id);
      const response = await axios.get(`http://localhost:3001/comments/${props.post.post_id}`);
      
      setComments(response.data.commentsdata);
    } catch (error) {
      console.error(error);
      // Handle error state here if needed
    }
  };

  useEffect(() => {
    fetchComments();
  }, [props.post.post_id]);

  const handleClick = () => setShow(!show);

  const handleLikeClick = () => setLike(!like);

  const handleCommentPost = async () => {
    let userid = localStorage.getItem("userid");
    try {
      const response = await fetch("http://localhost:3001/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        
        body: JSON.stringify({
          comment_text: commentText,
          user_id: userid, // Replace with the actual user ID
          post_id: props.post.post_id,
        }),
      });

      if (response.ok) {
        // Comment posted successfully
        toast({
          title: "Comment Posted",
          description: "Your comment has been posted successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setCommentText(''); // Clear the comment text input after posting
        fetchComments(); // Fetch comments again to refresh the comments list
      } else {
        // Comment posting failed
        toast({
          title: "Error",
          description: "Failed to post comment. Please try again later.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <div key={props.post.post_id} id="every_post">
      <h3>{props.post.title}</h3>
      <p>{props.post.content}</p>
      <FontAwesomeIcon
        icon={faHeart}
        size="lg"
        style={{ color: like ? "red" : "black", marginRight: "10px" }}
        onClick={handleLikeClick}
      />
      <Popover>
        <PopoverTrigger>
          <FontAwesomeIcon icon={faComment} size="lg" style={{ marginRight: "10px" }} />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverCloseButton />
          <PopoverHeader>Comments</PopoverHeader>
          <PopoverBody>
            <InputGroup size="md">
              <Input
                variant="flushed"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <InputRightElement width="4rem">
                <Button size="sm" onClick={handleCommentPost}>
                  <FontAwesomeIcon icon={faPaperPlane} />
                </Button>
              </InputRightElement>
            </InputGroup>
            <div id="comments">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.comment_id} id="comment_detail">
                <p>{comment.comment_text}</p>
                <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(comment.comment_id)} />
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <FontAwesomeIcon icon={faTag} size="lg" />
    </div>
  );
};

export default Cardpost;
