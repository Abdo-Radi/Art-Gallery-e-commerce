import { configureStore } from "@reduxjs/toolkit"
import artistReducer from "./features/artist"
import userReducer from "./features/user"
import admin from "./features/admin"
import customer from './features/customer'

export const store = configureStore({
    reducer: {
        customer: customer,
        admin: admin,
        artist: artistReducer,
        user: userReducer
    },
})

export default store