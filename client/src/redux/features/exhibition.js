import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// Async action to fetch exhibitions
export const getExhibitions = createAsyncThunk(
  "exhibition/getExhibitions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/exhibitions");
      return response.data.data;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

// Async action to add an exhibition
export const addExhibition = createAsyncThunk(
  "exhibition/addExhibition",
  async (body, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/exhibitions", body);
      return response.data;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

// Async action to delete an exhibition by ID
export const deleteExhibition = createAsyncThunk(
  "exhibition/deleteExhibition",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/exhibitions/${id}`);
      return id;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

// Async action to edit an exhibition
export const editExhibition = createAsyncThunk(
  "exhibition/editExhibition",
  async ({ id, body }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/exhibitions/${id}`, body);
      return response.data;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

const initialState = {
  exhibitions: [],
  isLoading: false,
  error: null,
};

const exhibitionSlice = createSlice({
  name: "exhibition",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Read
      .addCase(getExhibitions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getExhibitions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exhibitions = action.payload;
      })
      .addCase(getExhibitions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(addExhibition.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addExhibition.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exhibitions.push(action.payload);
      })
      .addCase(addExhibition.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteExhibition.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteExhibition.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exhibitions = state.exhibitions.filter(
          (exhibition) => exhibition._id !== action.payload
        );
      })
      .addCase(deleteExhibition.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(editExhibition.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editExhibition.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exhibitions = state.exhibitions.map((exhibition) =>
          exhibition._id === action.payload._id ? action.payload : exhibition
        );
      })
      .addCase(editExhibition.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default exhibitionSlice.reducer;
