import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { IPost } from "../helpers/types";
import { BASE } from "../helpers/default";
import { handlePostComment } from "../helpers/api";
import { Button, Input } from "@mui/material";
import { Link } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1100,
  height: 850,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface Props {
  isOpen: boolean;
  close: () => void;
  post: number;
  posts: IPost[];
}


export function Preview({ isOpen, close, post: postId, posts }: Props) {
  const post = posts.find((x) => x.id === postId);
  const [comment, setComment] = React.useState("");
  const [comments, setComments] = React.useState<string[]>([]);

  const handleComment = (id: number, text: string) => {
    if (post && comment) {
      handlePostComment(id, text).then(() => {
        setComments([...comments, text]);
        setComment("");
      });
    }
  };
//   const handleCommentDelete = (id:number) => {
//     handleCommentDelete(id).then(() => {
//       setComments(comments.filter((comment) => comment.id !== id))
//     })
//   }

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box className="cont">
            <Box className="comments-likes">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Likes: {post ? post?.likes.length : 0} Comments: {comments.length}
              </Typography>
            </Box>
            <Box className="likes">
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <Link to={`/profile/${post?.likes.map((user) => user.id)}`}>
                  {post?.likes.map((user) => user.name)}{" "}
                  {post?.likes.map((user) => user.surname)}
                </Link>
              </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              {comments.map((comment, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    <strong>{post?.likes[0].name} says:</strong>
                  </Typography>
                  <Typography variant="body2">{comment}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ mt: 4 }}>
            <img
              src={BASE + (post?.picture || "")}
              alt={post?.title || "Preview"}
              className="preview-img"
            />
          </Box>

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {post?.title ||
              "Duis mollis, est non commodo luctus, nisi erat porttitor ligula."}
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Input
              placeholder="Add a comment..."
              fullWidth
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              disabled={!comment.trim()}
              onClick={() => handleComment(postId, comment)}
            >
              Submit Comment
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
