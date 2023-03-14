import React, { useCallback, useState } from "react";
import styles from "./comment.module.scss";
import { BsFillTrashFill, BsPencilFill, BsReplyFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import NewComment from "../NewComment";
import {
  changeScore,
  deleteComment,
  deleteReply,
  updateComment,
} from "../../redux/slices/commentsSlice";

const Comment = ({ comment, nested = false }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser.username);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editInput, setEditInput] = useState(comment.content);

  const moveCaretAtEnd = (e) => {
    var tempValue = e.target.value;
    e.target.value = "";
    e.target.value = tempValue;
  };

  const closeReplyWindow = useCallback(() => {
    setIsReplying(false);
  }, []);

  const onCommentDelete = (id) => {
    if (nested) {
      dispatch(deleteReply(id));
    } else {
      dispatch(deleteComment(id));
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const onUpdateClick = () => {
    dispatch(updateComment({ commentId: comment.id, text: editInput }));
    setIsEditing(false);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.rating}>
          <button
            className={styles.ratingPlus}
            onClick={() =>
              dispatch(
                changeScore({ commentId: comment.id, operation: "plus" })
              )
            }
          >
            +
          </button>
          <div className={styles.scoreContainer}>
            <span className={styles.score}>{comment.score}</span>
          </div>
          <button
            className={styles.ratingMinus}
            onClick={() =>
              dispatch(
                changeScore({ commentId: comment.id, operation: "minus" })
              )
            }
          >
            -
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.header}>
            <img
              src={comment.user.image}
              alt="User avatar"
              className={styles.userImage}
            />
            <span className={styles.username}>{comment.user.username}</span>
            {currentUser === comment.user.username && (
              <div className={styles.currentUserLabel}>you</div>
            )}
            <span className={styles.created}>{comment.createdAt}</span>
            <div className={styles.buttons}>
              {currentUser === comment.user.username ? (
                <div className={styles.currentUserButtons}>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => onCommentDelete(comment.id)}
                    disabled={isEditing}
                  >
                    <BsFillTrashFill />
                    <span className={styles.btnText}>Delete</span>
                  </button>
                  <button
                    className={styles.editBtn}
                    disabled={isEditing}
                    onClick={() => handleEditClick()}
                  >
                    <BsPencilFill />
                    <span className={styles.btnText}>Edit</span>
                  </button>
                </div>
              ) : (
                <button
                  className={styles.replyBtn}
                  onClick={() => setIsReplying((prev) => !prev)}
                >
                  <BsReplyFill />
                  <span className={styles.btnText}>Reply</span>
                </button>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className={styles.editContainer}>
              <textarea
                className={styles.editArea}
                value={editInput}
                onChange={(e) => setEditInput(e.target.value)}
                autoFocus
                onFocus={moveCaretAtEnd}
              ></textarea>
              <div className={styles.updateBtn}>
                <button onClick={() => onUpdateClick()}>Update</button>
              </div>
            </div>
          ) : (
            <p className={styles.text}>
              {comment.replyingTo && (
                <span className={styles.replyingTo}>
                  @{comment.replyingTo}{" "}
                </span>
              )}
              {comment.content}
            </p>
          )}
        </div>
      </div>

      {isReplying && (
        <NewComment
          buttonText={"reply"}
          replyingTo={comment.user.username}
          replyingCommentId={comment.id}
          closeReplyWindow={closeReplyWindow}
        />
      )}

      {comment.replies?.length > 0 && (
        <div className={styles.nestedCommentsWrapper}>
          {comment.replies.map((reply) => (
            <Comment comment={reply} nested={true} key={reply.id} />
          ))}
        </div>
      )}
    </>
  );
};

export default Comment;
