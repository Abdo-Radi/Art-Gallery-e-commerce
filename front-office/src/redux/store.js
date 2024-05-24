import { configureStore } from "@reduxjs/toolkit";
import artworkReducer from "./slices/artwork";
import exhibitionReducer from "./slices/exhibition";
import categoryReducer from "./slices/category";
import userReducer from "./slices/user";

export const store = configureStore({
  reducer: {
    artworks: artworkReducer,
    exhibitions: exhibitionReducer,
    categories: categoryReducer,
    currentUser: userReducer,
  },
});

export default store;
