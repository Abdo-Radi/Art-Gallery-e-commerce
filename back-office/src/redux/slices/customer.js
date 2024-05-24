import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getCustomers = createAsyncThunk(
  "customers/getCustomers",
  async ({ search = "", page = 1 } = {}, { rejectWithValue }) => {
    return axiosInstance
      .get(`/customers?page=${page}&search=${search}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

export const addCustomer = createAsyncThunk(
  "customers/addCustomer",
  async (body, { rejectWithValue }) => {
    return axiosInstance
      .post("/customers", body)
      .then((res) => {
        return res.data;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

export const deleteCustomer = createAsyncThunk(
  "customers/deleteCustomer",
  async (id, { rejectWithValue }) => {
    return axiosInstance
      .delete(`/customers/${id}`)
      .then((res) => {
        return id;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

export const editCustomer = createAsyncThunk(
  "customers/editCustomer",
  async ({ id, body }, { rejectWithValue }) => {
    return axiosInstance
      .put(`/customers/${id}`, body)
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

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Read
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.list = action.payload.docs;
        state.pages = action.payload.totalPages;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Create
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.reset = !state.reset;
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.reset = !state.reset;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update
      .addCase(editCustomer.fulfilled, (state, action) => {
        state.list = state.customers.map((customer) =>
          customer._id === action.payload._id ? action.payload : customer
        );
      })
      .addCase(editCustomer.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default customerSlice.reducer;
