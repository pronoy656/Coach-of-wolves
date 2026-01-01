/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

export interface CoachCheckins {
  completed: number;
  pending: number;
}

export interface CoachDailyTracking {
  submittedToday: number;
}

export interface CoachDashboardData {
  totalAthletes: number;
  totalActiveUsers: number;
  checkins: CoachCheckins;
  dailyTracking: CoachDailyTracking;
}

export interface CoachDashboardResponse {
  success: boolean;
  message: string;
  data: CoachDashboardData;
}

export interface CoachDashboardState {
  data: CoachDashboardData | null;
  loading: boolean;
  error: string | null;
}

/* ================= INITIAL STATE ================= */

const initialState: CoachDashboardState = {
  data: null,
  loading: false,
  error: null,
};

/* ================= ASYNC THUNKS ================= */

/* ---------- GET COACH DASHBOARD DATA ---------- */
export const getCoachDashboardData = createAsyncThunk<
  CoachDashboardData,
  void,
  { rejectValue: string }
>("coachDashboard/getData", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<CoachDashboardResponse>("/dashboard/coach");
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch coach dashboard data:", error);
    if (error.response?.data?.message) {
      return rejectWithValue(error.response.data.message);
    }
    if (error.response?.status === 403) {
      return rejectWithValue("Access forbidden. Please check your permissions.");
    }
    if (error.response?.status === 404) {
      return rejectWithValue("Coach dashboard endpoint not found. Check API URL.");
    }
    return rejectWithValue("Failed to fetch dashboard data. Please try again.");
  }
});

/* ================= SLICE ================= */

const coachDashboardSlice = createSlice({
  name: "coachDashboard",
  initialState,
  reducers: {
    clearCoachDashboardError: (state) => {
      state.error = null;
    },
    clearCoachDashboardData: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* GET COACH DASHBOARD DATA */
      .addCase(getCoachDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCoachDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getCoachDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch dashboard data";
      });
  },
});

export const {
  clearCoachDashboardError,
  clearCoachDashboardData,
} = coachDashboardSlice.actions;

export default coachDashboardSlice.reducer;