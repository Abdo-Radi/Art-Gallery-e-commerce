import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./features/user"
import artistReducer from "./features/artist"
import categoryReducer from "./features/category"
import artworkReducer from "./features/artwork"

export const store = configureStore({
    reducer: {
        user: userReducer,
        artist: artistReducer,
        category: categoryReducer,
        artwork: artworkReducer
    },
})

export default store