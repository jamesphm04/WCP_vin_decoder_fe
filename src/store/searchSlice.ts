import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Vehicle } from "../types/vehicle";
import { searchByVINApi, searchByPlateAndStateApi } from "../services/api";

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

export const searchByVIN = createAsyncThunk(
  "search/searchByVIN",
  async (vin: string, { rejectWithValue }) => {
    try {
      const response = await searchByVINApi(vin);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Search failed");
    }
  }
);

export const searchByPlateAndState = createAsyncThunk(
  "search/searchByPlateAndState",
  async (
    { plate, state }: { plate: string; state: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await searchByPlateAndStateApi(plate, state);
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
    //
    builder
      .addCase(searchByVIN.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        searchByVIN.fulfilled,
        (state, action: PayloadAction<Vehicle[]>) => {
          state.loading = false;
          state.results = action.payload;
          state.error = null;
        }
      )
      .addCase(searchByVIN.rejected, (state, action) => {
        state.loading = false;
        state.results = [];
        state.error = action.payload as string;
      });

    // search by plate and state
    builder
      .addCase(searchByPlateAndState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        searchByPlateAndState.fulfilled,
        (state, action: PayloadAction<Vehicle[]>) => {
          state.loading = false;
          state.results = action.payload;
          state.error = null;
        }
      )
      .addCase(searchByPlateAndState.rejected, (state, action) => {
        state.loading = false;
        state.results = [];
        state.error = action.payload as string;
      });
  },
});

export const { clearResults, clearError } = searchSlice.actions;
export default searchSlice.reducer;
