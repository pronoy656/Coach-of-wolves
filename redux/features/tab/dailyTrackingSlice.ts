import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Averages, WeekApiResponse, WeekItem, GraphData } from "./dailyTrackingType";
import axiosInstance from "@/lib/axiosInstance";

interface WeekState {
  weekData: WeekItem[];
  averages: Averages | null;
  graphData: GraphData | null;
  loading: boolean;
  graphLoading: boolean;
  error: string | null;
}

const initialState: WeekState = {
  weekData: [],
  averages: null,
  graphData: null,
  loading: false,
  graphLoading: false,
  error: null,
};

// ✅ Updated to support optional date query parameter
export const fetchDailyWeekData = createAsyncThunk<
  WeekApiResponse,
  { userId: string; date?: string },
  { rejectValue: string }
>("week/fetchWeekData", async ({ userId, date }, { rejectWithValue }) => {
  try {
    const url = date
      ? `/daily/tracking/${userId}?date=${date}`
      : `/daily/tracking/${userId}`;
    const res = await axiosInstance.get(url);
    console.log("Fetched week data:", res.data.data);
    return res.data.data as WeekApiResponse;
  } catch (error) {
    return rejectWithValue("Failed to fetch week data");
  }
});

export const fetchDailyGraphData = createAsyncThunk<
  GraphData,
  { userId: string; date?: string },
  { rejectValue: string }
>("week/fetchGraphData", async ({ userId, date }, { rejectWithValue }) => {
  try {
    const url = date
      ? `/daily/tracking/graph/${userId}?date=${date}`
      : `/daily/tracking/graph/${userId}`;
    const res = await axiosInstance.get(url);
    return res.data.data as GraphData;
  } catch (error) {
    return rejectWithValue("Failed to fetch graph data");
  }
});



const weekSlice = createSlice({
  name: "week",
  initialState,
  reducers: {
    clearWeekData: (state) => {
      state.weekData = [];
      state.averages = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyWeekData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDailyWeekData.fulfilled,
        (state, action: PayloadAction<WeekApiResponse>) => {
          state.loading = false;
          state.weekData = action.payload.weekData;
          state.averages = action.payload.averages;
        }
      )
      .addCase(fetchDailyWeekData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })
      .addCase(fetchDailyGraphData.pending, (state) => {
        state.graphLoading = true;
      })
      .addCase(fetchDailyGraphData.fulfilled, (state, action: PayloadAction<GraphData>) => {
        state.graphLoading = false;
        state.graphData = action.payload;
      })
      .addCase(fetchDailyGraphData.rejected, (state) => {
        state.graphLoading = false;
      });
  },
});

export const { clearWeekData } = weekSlice.actions;
export default weekSlice.reducer;
