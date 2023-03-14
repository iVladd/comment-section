import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async function (_, { rejectWithValue }) {
    try {
      const response = await fetch(
        "https://84e439f4-c6d6-4c73-b119-6988737827e5.mock.pstmn.io/comments"
      );

      if (!response.ok) {
        throw new Error("Server Error");
      }

      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  comments: [],
  status: "loading",
  error: null,
};

export const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    addNewComment: (state, action) => {
      state.comments.push(action.payload);
    },
    deleteComment: (state, action) => {
      state.comments = state.comments.filter(
        (comment) => comment.id !== action.payload
      );
    },
    addReply: (state, action) => {
      highOrderLoop: for (let i = 0; i < state.comments.length; i++) {
        const element = state.comments[i];
        if (element.id === action.payload.replyId) {
          element.replies.push(action.payload.comment);
          break;
        }
        if (element.replies.length > 0) {
          for (let j = 0; j < element.replies.length; j++) {
            const nestedElement = element.replies[j];
            if (nestedElement.id === action.payload.replyId) {
              element.replies.push(action.payload.comment);
              break highOrderLoop;
            }
          }
        }
      }
    },
    deleteReply: (state, action) => {
      highOrderLoop: for (let i = 0; i < state.comments.length; i++) {
        const element = state.comments[i];
        if (element.replies.length > 0) {
          for (let j = 0; j < element.replies.length; j++) {
            const nestedElement = element.replies[j];
            if (nestedElement.id === action.payload) {
              element.replies = element.replies.filter(
                (reply) => reply.id !== action.payload
              );
              break highOrderLoop;
            }
          }
        }
      }
    },
    changeScore: (state, action) => {
      highOrderLoop: for (let i = 0; i < state.comments.length; i++) {
        const element = state.comments[i];
        if (element.id === action.payload.commentId) {
          action.payload.operation === "plus"
            ? element.score++
            : element.score--;
          break;
        }
        if (element.replies.length > 0) {
          for (let j = 0; j < element.replies.length; j++) {
            const nestedElement = element.replies[j];
            if (nestedElement.id === action.payload.commentId) {
              action.payload.operation === "plus"
                ? nestedElement.score++
                : nestedElement.score--;
              break highOrderLoop;
            }
          }
        }
      }
    },
    updateComment: (state, action) => {
      highOrderLoop: for (let i = 0; i < state.comments.length; i++) {
        const element = state.comments[i];
        if (element.id === action.payload.commentId) {
          element.content = action.payload.text;
          break;
        }
        if (element.replies.length > 0) {
          for (let j = 0; j < element.replies.length; j++) {
            const nestedElement = element.replies[j];
            if (nestedElement.id === action.payload.commentId) {
              nestedElement.content = action.payload.text;
              break highOrderLoop;
            }
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchComments.pending, (state) => {
      // console.log("PENDING::: ");
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      // console.log("FULLFILLED::: ", action.payload);
      state.status = "resolved";
      state.comments = action.payload.comments;
    });
    builder.addCase(fetchComments.rejected, (state, action) => {
      // console.log("ERROR::: ", action.payload);
      state.status = "rejected";
      state.error = action.payload;
    });
  },
});

export const {
  addNewComment,
  addReply,
  deleteComment,
  deleteReply,
  changeScore,
  updateComment,
} = commentsSlice.actions;

export default commentsSlice.reducer;
