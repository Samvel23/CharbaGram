import { IComment, IPost } from "../helpers/types";
import { BASE } from "../helpers/default";
import { handlePostReaction } from "../helpers/api";
import { Preview } from "./Preview";
import { useState } from "react";

interface Props {
  comments: IComment[];
  posts: IPost[];
  onUpdate?: (id: number) => void;
}

export function Gallery({ posts, onUpdate }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentPost, setCurrentPost] = useState<number>(-1);
  const handleReact = (id: number) => {
    handlePostReaction(id).then(() => {
      if (onUpdate) {
        onUpdate(id);
      }
    });
  };
  return (
    <div className="list">
      {posts.map((post) => {
        return (
          <div key={post.id}>
            <div className="post">
              <img src={BASE + post.picture} />
              <div
                className="cover"
                onClick={() => {
                  setCurrentPost(post.id), setIsOpen(true);
                }}
              ></div>
              <img
                className="like-button"
                onClick={() => handleReact(post.id)}
                src={
                  !post.isLiked
                    ? "https://cdn0.iconfinder.com/data/icons/blank-stickers/144/blank-sticker-1030-128.png"
                    : "https://cdn0.iconfinder.com/data/icons/universal-signs-symbols/128/heart-512.png"
                }
              />
            </div>
            <p>
              {post.title} <small>({post.likes.length} likes</small>)
            </p>
          </div>
        );
      })}
      {currentPost != -1 && (
        <Preview
          isOpen={isOpen}
          close={() => setIsOpen(false)}
          post={currentPost}
          posts={posts}
        />
      )}
    </div>
  );
}
