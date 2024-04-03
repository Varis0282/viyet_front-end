import { loader } from "./loaderReducer";
import { configureStore } from "@reduxjs/toolkit";
import { user } from "./userReducer";

const store = configureStore({
  reducer: {
    loaders: loader.reducer,
    users: user.reducer
  },
});

export default store;
