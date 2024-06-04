import axiosInstance from "@/api/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getArtworks = createAsyncThunk(
  "artworks/getArtworks",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/artworks", { params });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Unknown error");
    }
  }
);

export const getArtworkById = createAsyncThunk(
  "artworks/getArtworkById",
  async (id, { rejectWithValue }) => {
    return axiosInstance
      .get(`/artworks/${id}`)
      .then((res) => res.data)
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

const initialState = {
  list: [],
  pages: 0,
  reset: false,
  error: null,
  artworkDetail: null,
};

const artworkSlice = createSlice({
  name: "artworks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getArtworks.fulfilled, (state, action) => {
        state.list = action.payload.docs;
        state.pages = action.payload.totalPages;
      })
      .addCase(getArtworks.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(getArtworkById.fulfilled, (state, action) => {
        state.artworkDetail = action.payload;
      })
      .addCase(getArtworkById.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default artworkSlice.reducer;
