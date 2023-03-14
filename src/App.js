import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchComments } from "./redux/slices/commentsSlice";
import { fetchCurrentUser } from "./redux/slices/currentUserSlice";
import "./app.scss";
import Container from "./components/Container";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(fetchComments());
    //eslint-disable-next-line
  }, []);

  return <Container />;
}

export default App;
