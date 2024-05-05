import { createSlice } from "@reduxjs/toolkit"
import { createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../api/axiosInstance"

export const getArtworks = createAsyncThunk("artwork/getArtworks", async (_, { rejectWithValue }) => {
    return axiosInstance.get("/artworks")
        .then((res) => {
            return res.data.data
        })
        .catch((err) => rejectWithValue(err.response.data.message))
})

export const addArtwork = createAsyncThunk("artwork/addArtwork", async (body, { rejectWithValue }) => {
    return axiosInstance.post("/artworks", body)
        .then((res) => {
            return res.data
        })
        .catch((err) => rejectWithValue(err.response.data.message))
})

export const editArtwork = createAsyncThunk("artwork/editArtwork", async ({ id, body }, { rejectWithValue }) => {
    return axiosInstance.put(`/artworks/${id}`, body)
        .then((res) => {
            return res.data
        })
        .catch((err) => rejectWithValue(err.response.data.message))
})

export const deleteArtwork = createAsyncThunk("artwork/deleteArtwork", async (id, { rejectWithValue }) => {
    return axiosInstance.delete(`/artworks/${id}`)
        .then(() => {
            return id
        })
        .catch((err) => rejectWithValue(err.response.data.message))
})


const initialState = {
    artworks: [],
    isLoading: false,
    error: null
}

const artworkSlice = createSlice({
    name: "artwork",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Read
            .addCase(getArtworks.pending, (state) => { state.isLoading = true })
            .addCase(getArtworks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.artworks = action.payload
            })
            .addCase(getArtworks.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload
            })

            // Create
            .addCase(addArtwork.pending, (state) => { state.isLoading = true })
            .addCase(addArtwork.fulfilled, (state, action) => {
                state.isLoading = false;
                state.artworks.push(action.payload)
            })
            .addCase(addArtwork.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload
            })

            // Delete
            .addCase(deleteArtwork.pending, (state) => { state.isLoading = true })
            .addCase(deleteArtwork.fulfilled, (state, action) => {
                state.isLoading = false;
                state.artworks = state.artworks.filter(artwork => artwork._id != action.payload)
            })
            .addCase(deleteArtwork.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload
            })

            // Update
            .addCase(editArtwork.pending, (state) => { state.isLoading = true })
            .addCase(editArtwork.fulfilled, (state, action) => {
                state.isLoading = false;
                state.artworks = state.artworks.map(artwork => artwork._id === action.payload._id ? action.payload : artwork)
            })
            .addCase(editArtwork.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload
            })
    }
})

export default artworkSlice.reducer