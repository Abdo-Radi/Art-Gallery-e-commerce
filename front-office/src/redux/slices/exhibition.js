import axiosInstance from "@/api/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getExhibitions = createAsyncThunk(
  "exhibitions/getExhibitions",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/exhibitions", { params });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const getExhibitionById = createAsyncThunk(
  "exhibitions/getExhibitionById",
  async (id, { rejectWithValue }) => {
    return axiosInstance
      .get(`/exhibitions/${id}`)
      .then((res) => res.data)
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

const initialState = {
  list: [],
  pages: 0,
  reset: false,
  error: null,
  exhibitionDetail: null,
};

const exhibitionSlice = createSlice({
  name: "exhibitions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Read
      .addCase(getExhibitions.fulfilled, (state, action) => {
        state.list = action.payload.docs;
        state.pages = action.payload.totalPages;
      })
      .addCase(getExhibitions.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(getExhibitionById.fulfilled, (state, action) => {
        state.exhibitionDetail = action.payload;
      })
      .addCase(getExhibitionById.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default exhibitionSlice.reducer;
