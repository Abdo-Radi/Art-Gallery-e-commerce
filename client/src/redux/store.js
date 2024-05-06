import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./features/user"
import artistReducer from "./features/artist"
import categoryReducer from "./features/category"
import artworkReducer from "./features/artwork"
import exhibitionReducer from "./features/exhibition"
import orderReducer from "./features/order"
import ticketReducer from "./features/ticket"
import admin from "./features/admin"
import customer from './features/customer'

export const store = configureStore({
    reducer: {
        user: userReducer,
        customer: customer,
        admin: admin,
        artist: artistReducer,
        category: categoryReducer,
        artwork: artworkReducer,
        exhibition: exhibitionReducer,
        order: orderReducer,
        ticket: ticketReducer,
    },
})

export default store