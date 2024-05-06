import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchTickets = createAsyncThunk(
  "tickets/getTickets",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/tickets");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching tickets");
    }
  }
);

export const createTicket = createAsyncThunk(
  "tickets/addTicket",
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/tickets", ticketData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error creating ticket");
    }
  }
);

export const deleteTicket = createAsyncThunk(
  "tickets/deleteTicket",
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting ticket");
    }
  }
);

export const editTicket = createAsyncThunk(
  "tickets/editTicket",
  async ({ id, body }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/tickets/${id}`, body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error editing ticket");
    }
  }
);

const initialState = {
  tickets: [],
  isLoading: false,
  error: null,
};

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = action.payload.data;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      .addCase(createTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets.push(action.payload);
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = state.tickets.filter(
          (ticket) => ticket._id !== action.payload._id
        );
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      .addCase(editTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = state.tickets.map((ticket) =>
          ticket._id === action.payload._id ? action.payload : ticket
        );
      })
      .addCase(editTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      });
  },
});

export default ticketSlice.reducer;
