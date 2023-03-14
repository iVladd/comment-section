import { combineReducers, configureStore } from "@reduxjs/toolkit";
import currentUserReducer from "./slices/currentUserSlice";
import commentsReducer from "./slices/commentsSlice";

const rootReducer = combineReducers({
  currentUser: currentUserReducer,
  comments: commentsReducer,
});

const store = configureStore({ reducer: rootReducer });

export default store;
