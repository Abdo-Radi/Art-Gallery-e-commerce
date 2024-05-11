import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getCategories = createAsyncThunk(
  "category/getCategories",
  async (_, { rejectWithValue }) => {
    return axiosInstance
      .get("/categories")
      .then((res) => {
        return res.data.data;
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
  categories: [],
  isLoading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Read
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(addCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(editCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = state.categories.map((category) =>
          category._id === action.payload._id ? action.payload : category
        );
      })
      .addCase(editCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
