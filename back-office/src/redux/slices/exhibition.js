import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getExhibitions = createAsyncThunk(
  "exhibitions/getExhibitions",
  async ({ search = "", page = 1 } = {}, { rejectWithValue }) => {
    return axiosInstance
      .get(`/exhibitions?page=${page}&search=${search}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

export const addExhibition = createAsyncThunk(
  "exhibitions/addExhibition",
  async (body, { rejectWithValue }) => {
    return axiosInstance
      .post("/exhibitions", body)
      .then((res) => {
        return res.data;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

export const deleteExhibition = createAsyncThunk(
  "exhibitions/deleteExhibition",
  async (id, { rejectWithValue }) => {
    return axiosInstance
      .delete(`/exhibitions/${id}`)
      .then((res) => {
        return id;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

export const editExhibition = createAsyncThunk(
  "exhibition/editExhibition",
  async ({ id, body }, { rejectWithValue }) => {
    return axiosInstance
      .put(`/exhibitions/${id}`, body)
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

      // Create

      .addCase(addExhibition.fulfilled, (state) => {
        state.reset = !state.reset;
      })
      .addCase(addExhibition.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteExhibition.fulfilled, (state) => {
        state.reset = !state.reset;
      })
      .addCase(deleteExhibition.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update
      .addCase(editExhibition.fulfilled, (state, action) => {
        state.list = state.list.map((exhibition) =>
          exhibition._id === action.payload._id ? action.payload : exhibition
        );
      })
      .addCase(editExhibition.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default exhibitionSlice.reducer;
