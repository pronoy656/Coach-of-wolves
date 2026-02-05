import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";

// --- Types based on Backend Response ---

export interface PedSubCategoryItem {
  name: string;
  dosage: string;
  frequency: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  sun: string;
}

export interface PedCategory {
  name: string;
  subCategory: PedSubCategoryItem[];
}

export interface PedData {
  _id: string;
  athleteId: string;
  coachId: string;
  week: string;
  categories: PedCategory[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PedResponse {
  success: boolean;
  message: string;
  data: PedData;
}

export interface AddPedPayload {
  category: string;
  subCategory: { name: string }[];
}

interface PedState {
  data: PedData | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: PedState = {
  data: null,
  loading: false,
  error: null,
  successMessage: null,
};

// --- Async Thunks ---

export const fetchPedData = createAsyncThunk<
  PedData,
  void,
  { rejectValue: string }
>("ped/fetchPedData", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<PedResponse>("/ped");
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch PED data"
    );
  }
});

export const addPedData = createAsyncThunk<
  PedData,
  AddPedPayload,
  { rejectValue: string }
>("ped/addPedData", async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<PedResponse>("/ped", payload);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to add PED data"
    );
  }
});

// --- Slice ---

const pedSlice = createSlice({
  name: "ped",
  initialState,
  reducers: {
    clearPedError: (state) => {
      state.error = null;
    },
    clearPedSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch PED Data
      .addCase(fetchPedData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPedData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      // Add PED Data
      .addCase(addPedData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(addPedData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // Update with the new data returned from backend
        state.successMessage = "PED data added successfully";
      })
      .addCase(addPedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add PED data";
      });
  },
});

export const { clearPedError, clearPedSuccess } = pedSlice.actions;
export default pedSlice.reducer;
