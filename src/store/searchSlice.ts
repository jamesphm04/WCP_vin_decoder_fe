import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Vehicle, SearchParams } from "../types/vehicle";
import { searchVehiclesApi } from "../services/api";

interface SearchState {
  results: Vehicle[];
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  results: [],
  loading: false,
  error: null,
};

export const searchVehicles = createAsyncThunk(
  "search/searchVehicles",
  async (params: SearchParams, { rejectWithValue }) => {
    try {
      const response = await searchVehiclesApi(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Search failed");
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearResults: (state) => {
      state.results = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        searchVehicles.fulfilled,
        (state, action: PayloadAction<Vehicle[]>) => {
          state.loading = false;
          state.results = action.payload;
          state.error = null;
        }
      )
      .addCase(searchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.results = [];
        state.error = action.payload as string;
      });
  },
});

export const { clearResults, clearError } = searchSlice.actions;
export default searchSlice.reducer;
