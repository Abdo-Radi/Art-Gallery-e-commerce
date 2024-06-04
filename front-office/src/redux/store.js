import { configureStore } from "@reduxjs/toolkit";
import artworkReducer from "./slices/artwork";
import exhibitionReducer from "./slices/exhibition";
import categoryReducer from "./slices/category";
import userReducer from "./slices/user";
import ticketReducer from "./slices/ticket";
import cartReducer from "./slices/cart";

export const store = configureStore({
  reducer: {
    artworks: artworkReducer,
    exhibitions: exhibitionReducer,
    categories: categoryReducer,
    currentUser: userReducer,
    tickets: ticketReducer,
    cart: cartReducer,
  },
});

export default store;
