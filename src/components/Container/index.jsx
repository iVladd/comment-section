import React from "react";
import { useSelector } from "react-redux";
import Comment from "../Comment";
import NewComment from "../NewComment";
import styles from "./container.module.scss";

const Container = () => {
  const comments = useSelector((state) => state.comments.comments);

  return (
    <div className={styles.container}>
      {comments &&
        comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      <NewComment buttonText={"send"} />
    </div>
  );
};

export default Container;
