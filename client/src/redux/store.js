import { configureStore } from "@reduxjs/toolkit"
import artistReducer from "./features/artist"
import userReducer from "./features/user"

export const store = configureStore({
    reducer: {
        artist: artistReducer,
        user: userReducer
    },
})

export default store