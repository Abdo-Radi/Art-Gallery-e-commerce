import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./slices/user"
import artistReducer from "./slices/artist"
import categoryReducer from "./slices/category"
import artworkReducer from "./slices/artwork"
import exhibitionReducer from "./slices/exhibition"
import orderReducer from "./slices/order"
import ticketReducer from "./slices/ticket"
import admin from "./slices/admin"
import customer from './slices/customer'

export const store = configureStore({
    reducer: {
        user: userReducer,
        customers: customer,
        admin: admin,
        artists: artistReducer,
        category: categoryReducer,
        artworks: artworkReducer,
        exhibitions: exhibitionReducer,
        order: orderReducer,
        tickets: ticketReducer,
    },
})

export default store