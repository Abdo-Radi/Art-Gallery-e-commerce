import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getUser = createAsyncThunk(
  "user/getUser",
  async ({ accountType, userId }, { rejectWithValue }) => {
    return axiosInstance
      .get(`${accountType}s/${userId}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

const initialState = {
  user: null,
  loggedIn: false,
  isLoading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loggedIn = true;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state) => {
        state.isLoading = false;
        state.loggedIn = false;
      });
  },
});

export default userSlice.reducer;
