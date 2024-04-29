import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../api/axiosInstance";

export const getUser = createAsyncThunk("user/getUser", async (payload, { rejectWithValue }) => {
    return axiosInstance.get(`${payload.accountType}s/${payload.userId}`)
        .then((res) => {
            return res.data
        })
        .catch((err) => rejectWithValue(err.response.data.message))
})


const initialState = {
    user: null,
    loggedIn: false,
    check: true
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUser.fulfilled, (state, action) => {
                state.loggedIn = true
                state.user = action.payload
            })
            .addCase(getUser.rejected, (state) => {
                state.loggedIn = false
                state.check = false
            })
    }
})

export default userSlice.reducer