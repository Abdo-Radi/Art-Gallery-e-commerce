import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axiosInstance";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (customer, { rejectWithValue }) => {
    return axiosInstance
      .get(`/cart/${customer}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async (body, { rejectWithValue }) => {
    return axiosInstance
      .post("/cart/add", body)
      .then((res) => {
        return res.data;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItem",
  async (body, { rejectWithValue }) => {
    return axiosInstance
      .post("/cart/remove", body)
      .then((res) => {
        return res.data;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

const initialState = {
  items: [],
  reset: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(addItemToCart.fulfilled, (state) => {
        state.reset = !state.reset;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(removeItemFromCart.fulfilled, (state) => {
        state.reset = !state.reset;
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
