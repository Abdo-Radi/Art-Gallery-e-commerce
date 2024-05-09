import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// Async Thunks
export const getArtists = createAsyncThunk(
  "artist/getArtists",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/artists");
      return response.data.data;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const addArtist = createAsyncThunk(
  "artist/addArtist",
  async (body, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/artists", body);
      return response.data;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const deleteArtist = createAsyncThunk(
  "artist/deleteArtist",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/artists/${id}`);
      return id;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const editArtist = createAsyncThunk(
  "artist/editArtist",
  async ({ id, body }, { rejectWithValue }) => {
    try {
      console.log(id,body)
      const response = await axiosInstance.put(`/artists/${id}`, body);
      
      return response.data;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

// Initial State
const initialState = {
  artists: [],
  isLoading: false,
  error: null,
};

// Slice
const artistSlice = createSlice({
  name: "artist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Read
      .addCase(getArtists.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getArtists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.artists = action.payload;
      })
      .addCase(getArtists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(addArtist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addArtist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.artists.push(action.payload);
      })
      .addCase(addArtist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteArtist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteArtist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.artists = state.artists.filter(
          (artist) => artist._id !== action.payload
        );
      })
      .addCase(deleteArtist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(editArtist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editArtist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.artists = state.artists.map((artist) =>
          artist._id === action.payload._id ? action.payload : artist
        );
      })
      .addCase(editArtist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default artistSlice.reducer;
