// redux/features/admin/dashboard/alertSlice.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

export interface AlertData {
  elevatedBpAthlete: number;
  totalMissedDailyTracking: number;
}

export interface AlertResponse {
  success: boolean;
  message: string;
  data: AlertData;
}

export interface AlertState {
  data: AlertData | null;
  loading: boolean;
  error: string | null;
}

/* ================= INITIAL STATE ================= */

const initialState: AlertState = {
  data: null,
  loading: false,
  error: null,
};

/* ================= ASYNC THUNKS ================= */

/* ---------- GET ALERT DATA ---------- */
export const getAlertData = createAsyncThunk<
  AlertData,
  void,
  { rejectValue: string }
>("alert/getData", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<AlertResponse>("/dashboard/alert");
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch alert data:", error);
    if (error.response?.data?.message) {
      return rejectWithValue(error.response.data.message);
    }
    if (error.response?.status === 403) {
      return rejectWithValue("Access forbidden. Please check your permissions.");
    }
    if (error.response?.status === 404) {
      return rejectWithValue("Alert endpoint not found. Check API URL.");
    }
    return rejectWithValue("Failed to fetch alert data. Please try again.");
  }
});

/* ================= SLICE ================= */

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    clearAlertError: (state) => {
      state.error = null;
    },
    clearAlertData: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* GET ALERT DATA */
      .addCase(getAlertData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAlertData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAlertData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch alert data";
      });
  },
});

export const {
  clearAlertError,
  clearAlertData,
} = alertSlice.actions;

export default alertSlice.reducer;