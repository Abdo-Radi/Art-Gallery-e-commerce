import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getArtists = createAsyncThunk(
  "artists/getArtists",
  async ({ search = "", page = 1 } = {}, { rejectWithValue }) => {
    return axiosInstance
      .get(`/artists?page=${page}&search=${search}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

export const addArtist = createAsyncThunk(
  "artists/addArtist",
  async (body, { rejectWithValue }) => {
    return axiosInstance
      .post("/artists", body)
      .then((res) => {
        return res.data;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

export const deleteArtist = createAsyncThunk(
  "artists/deleteArtist",
  async (id, { rejectWithValue }) => {
    return axiosInstance
      .delete(`/artists/${id}`)
      .then((res) => {
        return id;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

export const editArtist = createAsyncThunk(
  "artists/editArtist",
  async ({ id, body }, { rejectWithValue }) => {
    return axiosInstance
      .put(`/artists/${id}`, body)
      .then((res) => {
        return res.data;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

const initialState = {
  list: [],
  pages: 0,
  reset: false,
  error: null,
};

const artistSlice = createSlice({
  name: "artists",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Read
      .addCase(getArtists.fulfilled, (state, action) => {
        state.list = action.payload.docs;
        state.pages = action.payload.totalPages;
      })
      .addCase(getArtists.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Create
      .addCase(addArtist.fulfilled, (state) => {
        state.reset = !state.reset;
      })
      .addCase(addArtist.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteArtist.fulfilled, (state) => {
        state.reset = !state.reset;
      })
      .addCase(deleteArtist.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update
      .addCase(editArtist.fulfilled, (state, action) => {
        state.list = state.list.map((artist) =>
          artist._id === action.payload._id ? action.payload : artist
        );
      })
      .addCase(editArtist.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default artistSlice.reducer;
