import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getStats = createAsyncThunk(
  "stats/getStats",
  async (_, { rejectWithValue }) => {
    return axiosInstance
      .get("/stats")
      .then((res) => {
        return res.data;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

const initialState = {
  totalArtists: 0,
  totalArtworks: 0,
  artworkStats: [],
  orderStats: {},
};

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStats.fulfilled, (state, action) => {
        state.totalArtists = action.payload.totalArtists;
        state.totalArtworks = action.payload.totalArtworks;
        state.artworkStats = action.payload.artworkStats;
        state.orderStats = action.payload.orderStats;
      })
      .addCase(getStats.rejected, () => initialState);
  },
});

export default statsSlice.reducer;
