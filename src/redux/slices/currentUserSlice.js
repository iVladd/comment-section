import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchCurrentUser = createAsyncThunk(
  "currentUser/fetchCurrentUser",
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
  username: "",
  image: "",
  status: "loading",
  error: null,
};

export const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.pending, (state) => {
      // console.log("PENDING::: ");
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      // console.log("FULLFILLED::: ", action.payload);
      state.status = "resolved";
      state.username = action.payload.currentUser.username;
      state.image = action.payload.currentUser.image;
    });
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      // console.log("ERROR::: ", action.payload);
      state.status = "rejected";
      state.error = action.payload;
    });
  },
});

export default currentUserSlice.reducer;
