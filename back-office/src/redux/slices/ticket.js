import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getTickets = createAsyncThunk(
  "tickets/getTickets",
  async (page = 1, { rejectWithValue }) => {
    return axiosInstance
      .get(`/tickets?page=${page}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

export const addTicket = createAsyncThunk(
  "tickets/addTicket",
  async (body, { rejectWithValue }) => {
    return axiosInstance
      .post("/tickets", body)
      .then((res) => {
        return res.data;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

export const deleteTicket = createAsyncThunk(
  "tickets/deleteTicket",
  async (id, { rejectWithValue }) => {
    return axiosInstance
      .delete(`/tickets/${id}`)
      .then((res) => {
        return id;
      })
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

export const editTicket = createAsyncThunk(
  "tickets/editTicket",
  async ({ id, body }, { rejectWithValue }) => {
    return axiosInstance
      .put(`/tickets/${id}`, body)
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

const ticketSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTickets.fulfilled, (state, action) => {
        state.list = action.payload.docs;
        state.pages = action.payload.totalPages;
      })
      .addCase(getTickets.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(addTicket.fulfilled, (state) => {
        state.reset = !state.reset;
      })
      .addCase(addTicket.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteTicket.fulfilled, (state) => {
        state.reset = !state.reset;
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(editTicket.fulfilled, (state, action) => {
        state.list = state.list.map((ticket) =>
          ticket._id === action.payload._id ? action.payload : ticket
        );
      })
      .addCase(editTicket.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default ticketSlice.reducer;
