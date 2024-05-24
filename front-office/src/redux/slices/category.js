import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getCategories = createAsyncThunk(
  "category/getCategories",
  async (_, { rejectWithValue }) => {
    return axiosInstance
      .get("/categories")
      .then((res) => {
        return res.data;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

export const addCategory = createAsyncThunk(
  "category/addCategory",
  async (body, { rejectWithValue }) => {
    return axiosInstance
      .post("/categories", body)
      .then((res) => {
        return res.data;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id, { rejectWithValue }) => {
    return axiosInstance
      .delete(`/categories/${id}`)
      .then(() => {
        return id;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

export const editCategory = createAsyncThunk(
  "category/editCategory",
  async ({ id, body }, { rejectWithValue }) => {
    return axiosInstance
      .put(`/categories/${id}`, body)
      .then((res) => {
        return res.data;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

const initialState = {
  list: [],
  reset: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Read
      .addCase(getCategories.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Create
      .addCase(addCategory.fulfilled, (state) => {
        state.reset = !state.reset;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteCategory.fulfilled, (state) => {
        state.reset = !state.reset;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update
      .addCase(editCategory.fulfilled, (state, action) => {
        state.categories = state.categories.map((category) =>
          category._id === action.payload._id ? action.payload : category
        );
      })
      .addCase(editCategory.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
