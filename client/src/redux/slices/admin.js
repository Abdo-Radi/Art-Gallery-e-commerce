import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// Async Thunks
export const getAdmins = createAsyncThunk(
  "admin/getAdmins",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admins");
      return response.data;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const addAdmin = createAsyncThunk(
  "admin/addAdmin",
  async (body, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/admins", body);
      return response.data;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const deleteAdmin = createAsyncThunk(
  "admin/deleteAdmin",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/admins/${id}`);
      return id;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const editAdmin = createAsyncThunk(
  "admin/editAdmin",
  async ({ id, body }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/admins/${id}`, body);
      return response.data;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

// Initial State
const initialState = {
  admins: [],
  isLoading: false,
  error: null,
};

// Slice
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Read
      .addCase(getAdmins.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAdmins.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admins = action.payload;
      })
      .addCase(getAdmins.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(addAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admins.push(action.payload);
      })
      .addCase(addAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admins = state.admins.filter(
          (admin) => admin._id !== action.payload
        );
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(editAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admins = state.admins.map((admin) =>
          admin._id === action.payload._id ? action.payload : admin
        );
      })
      .addCase(editAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
