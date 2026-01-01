/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

export interface DashboardData {
  totalAthlete: number;
  totalEnhancedAthlete: number;
  totalNaturalAthlete: number;
  totalActiveUser: number;
  totalInactiveUser: number;
  totalCoach: number;
  totalDailyTrackingToday: number;
  totalCheckInThisWeek: number;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

export interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

/* ================= INITIAL STATE ================= */

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
};

/* ================= ASYNC THUNKS ================= */

/* ---------- GET DASHBOARD DATA ---------- */
export const getDashboardData = createAsyncThunk<
  DashboardData,
  void,
  { rejectValue: string }
>("dashboard/getData", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<DashboardResponse>("/dashboard/admin");
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch dashboard data:", error);
    if (error.response?.data?.message) {
      return rejectWithValue(error.response.data.message);
    }
    if (error.response?.status === 403) {
      return rejectWithValue("Access forbidden. Please check your permissions.");
    }
    if (error.response?.status === 404) {
      return rejectWithValue("Dashboard endpoint not found. Check API URL.");
    }
    return rejectWithValue("Failed to fetch dashboard data. Please try again.");
  }
});

/* ================= SLICE ================= */

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
    clearDashboardData: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* GET DASHBOARD DATA */
      .addCase(getDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch dashboard data";
      });
  },
});

export const {
  clearDashboardError,
  clearDashboardData,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;