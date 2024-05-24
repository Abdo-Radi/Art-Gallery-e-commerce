import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getArtworks = createAsyncThunk(
  "artworks/getArtworks",
  async ({ search = "", page = 1 } = {}, { rejectWithValue }) => {
    return axiosInstance
      .get(`/artworks?page=${page}&search=${search}`)
      .then((res) => res.data)
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

export const addArtwork = createAsyncThunk(
  "artworks/addArtwork",
  async (body, { rejectWithValue }) => {
    return axiosInstance
      .post("/artworks", body)
      .then((res) => res.data)
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

export const editArtwork = createAsyncThunk(
  "artworks/editArtwork",
  async ({ id, body }, { rejectWithValue }) => {
    return axiosInstance
      .put(`/artworks/${id}`, body)
      .then((res) => res.data)
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

export const deleteArtwork = createAsyncThunk(
  "artworks/deleteArtwork",
  async (id, { rejectWithValue }) => {
    return axiosInstance
      .delete(`/artworks/${id}`)
      .then(() => id)
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);

export const getArtworkById = createAsyncThunk(
  "artworks/getArtworkById",
  async (id, { rejectWithValue }) => {
    return axiosInstance
      .get(`/artworks/${id}`)
      .then((res) => res.data)
      .catch((err) => rejectWithValue(err.response.data.message));
  }
);
export const addProductToCart = createAsyncThunk(
  "product/addProductToCart",
  async (artwork, { rejectWithValue }) => {
    return axiosInstance
      .post(`/artworks/add/to/cart/${artwork._id}`)
      .then((response) => response)
      .catch((error) => rejectWithValue(error.response.data.message));
  }
); 
const initialState = {
  list: [],
  pages: 0,
  reset: false,
  error: null,
  singleArtwork: null,
};

const artworkSlice = createSlice({
  name: "artworks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Read
      .addCase(getArtworks.fulfilled, (state, action) => {
        state.list = action.payload.docs;
        state.pages = action.payload.totalPages;
      })
      .addCase(getArtworks.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Create
      .addCase(addArtwork.fulfilled, (state) => {
        state.reset = !state.reset;
      })
      .addCase(addArtwork.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteArtwork.fulfilled, (state) => {
        state.reset = !state.reset;
      })
      .addCase(deleteArtwork.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update
      .addCase(editArtwork.fulfilled, (state, action) => {
        state.list = state.list.map((artwork) =>
          artwork._id === action.payload._id ? action.payload : artwork
        );
      })
      .addCase(editArtwork.rejected, (state, action) => {
        state.error = action.payload;
      })
      //! Add product to cart
      .addCase(addProductToCart.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(addProductToCart.rejected, (state, action) => {
        state.error = action.payload;
      })


      // Get single artwork by ID
      .addCase(getArtworkById.fulfilled, (state, action) => {
        state.singleArtwork = action.payload;
      })
      .addCase(getArtworkById.rejected, (state, action) => {
        state.error = action.payload;
      });
    
  },
});

export default artworkSlice.reducer;
