import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getArtworks = createAsyncThunk(
  "artworks/getArtworks",
  async ({ search = "", page = 1 } = {}, { rejectWithValue }) => {
    return axiosInstance
      .get(`/artworks?page=${page}&search=${search}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

export const addArtwork = createAsyncThunk(
  "artworks/addArtwork",
  async (body, { rejectWithValue }) => {
    console.log(body);
    console.log(typeof body.price);
    return axiosInstance
      .post("/artworks", body)
      .then((res) => {
        return res.data;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

export const editArtwork = createAsyncThunk(
  "artworks/editArtwork",
  async ({ id, body }, { rejectWithValue }) => {
    return axiosInstance
      .put(`/artworks/${id}`, body)
      .then((res) => {
        return res.data;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

export const deleteArtwork = createAsyncThunk(
  "artworks/deleteArtwork",
  async (id, { rejectWithValue }) => {
    return axiosInstance
      .delete(`/artworks/${id}`)
      .then(() => {
        return id;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

const initialState = {
  list: [],
  total: 0,
  pages: 0,
  reset: false,
  error: null,
};

const artworkSlice = createSlice({
  name: "artworks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Read
      .addCase(getArtworks.fulfilled, (state, action) => {
        state.list = action.payload.docs;
        state.total = action.payload.totalDocs;
        state.pages = action.payload.totalPages;
      })
      .addCase(getArtworks.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Create
      .addCase(addArtwork.fulfilled, (state) => {
        state.reset = !state.reset;
      })
      .addCase(addArtwork.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteArtwork.fulfilled, (state) => {
        state.reset = !state.reset;
      })
      .addCase(deleteArtwork.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update
      .addCase(editArtwork.fulfilled, (state, action) => {
        state.artworks = state.artworks.map((artwork) =>
          artwork._id === action.payload._id ? action.payload : artwork
        );
      })
      .addCase(editArtwork.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default artworkSlice.reducer;
