import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// Async Thunks
export const getCustomers = createAsyncThunk(
  "customer/getCustomers",
  async (searchQuery = "", { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/customers?search=${searchQuery}`
      );
      return response.data.data;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const addCustomer = createAsyncThunk(
  "customer/addCustomer",
  async (body, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/customers", body);
      return response.data;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  "customer/deleteCustomer",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/customers/${id}`);
      return id;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const editCustomer = createAsyncThunk(
  "customer/editCustomer",
  async ({ id, body }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/customers/${id}`, body);
      return response.data;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

// Initial State
const initialState = {
  customers: [],
  isLoading: false,
  error: null,
  searchQuery: "", // Add searchQuery to initial state
};

// Slice
const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Read
      .addCase(getCustomers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = action.payload;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(addCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers.push(action.payload);
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = state.customers.filter(
          (customer) => customer._id !== action.payload
        );
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(editCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = state.customers.map((customer) =>
          customer._id === action.payload._id ? action.payload : customer
        );
      })
      .addCase(editCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery } = customerSlice.actions; // Extract the action creator

export default customerSlice.reducer;
