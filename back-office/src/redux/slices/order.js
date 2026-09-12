import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// Define async thunks for order-related operations
export const fetchOrders = createAsyncThunk(
  "orders/getOrders",
  async (_, { rejectWithValue }) => {
    try {
      // Large limit: the page paginates client-side over the full list
      const response = await axiosInstance.get("/orders", {
        params: { limit: 1000 },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching orders");
    }
  }
);

export const createOrder = createAsyncThunk(
  "orders/addOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/orders", orderData); // Endpoint to create orders
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error creating order");
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/orders/${orderId}`);
      return orderId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting order");
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/orders/${id}`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ?? "Error updating order"
      );
    }
  }
);

const initialState = {
  orders: [],
  isLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        // The server returns a mongoose-paginate result: { docs, totalPages, ... }
        state.orders = action.payload.docs ?? [];
        state.totalPages = action.payload.totalPages ?? 1;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message ?? action.payload ?? "Error";
      })
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.push(action.payload); // Add the new order to the list
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message ?? action.payload ?? "Error";
      })
      .addCase(deleteOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message ?? action.payload ?? "Error";
      })
      // No isLoading/error here: both swap the whole table out, and the order
      // view shows its own errors. Merging keeps the row's payment details.
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id
            ? { ...order, ...action.payload }
            : order
        );
      });
  },
});

export default orderSlice.reducer;
