import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { getPost, handleComment, handleCommentDelete } from "../helpers/api";
import { IComment, IPost } from "../helpers/types";
import { BASE, DEF } from "../helpers/default";
import { Link } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface IProps {
  open: boolean;
  post: number;
  onClose: () => void;
}

export function Preview({ open, onClose, post }: IProps) {
  const [comment, setComment] = useState<string>("");
  const [postInfo, setPostInfo] = useState<IPost | null>(null);

  useEffect(() => {
    getPost(post).then((response) => {
      setPostInfo(response.payload as IPost);
    });
  }, [post]);

  const sendComment = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    if (!postInfo) {
      return;
    }
    handleComment(comment, postInfo.id).then((response) => {
      const payload = response.payload as IComment;
      if (payload) {
        setPostInfo({ ...postInfo, comments: [...postInfo.comments, payload] });
      }
      setComment("");
    });
  };
  const commentsId = postInfo?.comments.map((com) => {
    return com.id
  })
  console.log(commentsId)
  const deleteComment = (commentId: number) => {
    if (!postInfo) return;
    handleCommentDelete(commentId).then((response) => {
      console.log('------', response)
      if (response.status == 'ok') {
        setPostInfo({
          ...postInfo,
          comments: postInfo.comments.filter((com) => com.id !== commentId),
        });
      }
    });
  };
  

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="parts">
          <div>
            {postInfo && (
              <>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  {postInfo.title}
                </Typography>
                <img
                  className="show-pic"
                  src={BASE + postInfo.picture}
                  alt={postInfo.title}
                />
              </>
            )}
          </div>
          <div>
            <strong>{postInfo?.likes.length} likes</strong>,
            <strong> {postInfo?.comments.length} comments</strong>
            <div>
              <div>
                Likes:
                <div className="list-2">
                  {postInfo?.likes.map((e) => (
                    <div key={e.id}>
                      <img
                        className="small-pic"
                        src={e.picture ? BASE + e.picture : DEF}
                        alt={e.name}
                      />
                      <Link to={`/profile/${e.id}`}>
                        {e.name} {e.surname}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                Comments:
                <div className="list-2 grid">
                  {postInfo?.comments.map((com) => (
                    <div style={{ marginTop: 10 }} key={com.id}>
                      <strong>{com.user.name} says:</strong>
                      <br />
                      <small>{com.content}</small>
                      <button
                        className="del-btn"
                        onClick={() => deleteComment(com.id)}
                      >
                        x
                      </button>
                    </div>
                  ))}
                  <textarea
                    onKeyDown={(e) => e.key === "Enter" && sendComment(e)}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What do you think?"
                    rows={1}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
