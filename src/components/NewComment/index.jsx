import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewComment, addReply } from "../../redux/slices/commentsSlice";
import styles from "./newcomment.module.scss";

const NewComment = ({
  buttonText,
  replyingTo = "",
  replyingCommentId,
  closeReplyWindow,
}) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  const [commentText, setCommentText] = useState(
    replyingTo ? `@${replyingTo} ` : ""
  );
  const commentArea = useRef(null);

  const moveCaretAtEnd = (e) => {
    var tempValue = e.target.value;
    e.target.value = "";
    e.target.value = tempValue;
  };

  const onSendClick = (text) => {
    console.log("text", text);
    if (replyingTo) {
      dispatch(
        addReply({
          replyId: replyingCommentId,
          comment: {
            id: Date.now(),
            content: text.split(" ").slice(1).join(""),
            createdAt: "just now",
            score: 0,
            replyingTo: replyingTo,
            user: {
              image: currentUser.image,
              username: currentUser.username,
            },
          },
        })
      );
      closeReplyWindow();
    } else {
      dispatch(
        addNewComment({
          id: Date.now(),
          content: text,
          createdAt: "just now",
          score: 0,
          user: {
            image: currentUser.image,
            username: currentUser.username,
          },
        })
      );
      setCommentText("");
    }
  };

  useEffect(() => {
    const onEnterClick = (e) => {
      if (
        e.key === "Enter" &&
        // allow only on focused element
        commentArea.current === document.activeElement &&
        // disable if comment is only spaces
        !!commentText.trim().length &&
        // allow newline if shift is pressed
        !e.shiftKey
      ) {
        e.preventDefault();
        onSendClick(commentText);
        setCommentText("");
      }
    };
    window.addEventListener("keydown", onEnterClick);

    return () => {
      window.removeEventListener("keydown", onEnterClick);
    };
    // eslint-disable-next-line
  }, [commentText]);

  useEffect(() => {
    const onEscClick = (e) => {
      if (e.key === "Escape" && replyingTo) {
        closeReplyWindow();
      }
    };

    window.addEventListener("keydown", onEscClick);

    return () => {
      window.removeEventListener("keydown", onEscClick);
    };
    // eslint-disable-next-line
  }, []);

  return (
    currentUser.image && (
      <div className={styles.container}>
        <img
          src={currentUser.image}
          alt="Current user avatar"
          className={styles.image}
        />
        <textarea
          name="newComment"
          className={styles.commentArea}
          placeholder="Add a comment..."
          value={commentText}
          autoFocus
          onFocus={moveCaretAtEnd}
          onChange={(e) => {
            setCommentText(e.target.value);
          }}
          ref={commentArea}
        ></textarea>
        <button
          className={styles.sendBtn}
          onClick={() => onSendClick(commentText)}
          disabled={!commentText.trim()}
        >
          {buttonText}
        </button>
      </div>
    )
  );
};

export default NewComment;
