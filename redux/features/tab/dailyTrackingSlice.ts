import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Averages, WeekApiResponse, WeekItem } from "./dailyTrackingType";
import axiosInstance from "@/lib/axiosInstance";

interface WeekState {
  weekData: WeekItem[];
  averages: Averages | null;
  loading: boolean;
  error: string | null;
}

const initialState: WeekState = {
  weekData: [],
  averages: null,
  loading: false,
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
      });
  },
});

export const { clearWeekData } = weekSlice.actions;
export default weekSlice.reducer;
