import { configureStore } from "@reduxjs/toolkit"
import artistReducer from "./features/artist"
import userReducer from "./features/user"
import exhibitionReducer from "./features/exhibition"
import orderReducer from "./features/order"
import ticketReducer from "./features/ticket"
export const store = configureStore({
    reducer: {
        artist: artistReducer,
        user: userReducer,
        exhibition: exhibitionReducer,
        order: orderReducer,
        ticket: ticketReducer,
    },
})

export default store