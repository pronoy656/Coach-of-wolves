// redux/features/weeklyCheckin/weeklyCheckinSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";
import { WeeklyCheckin, WeeklyCheckinState } from "./weeklyCheckinTypes";

const initialState: WeeklyCheckinState = {
    checkins: [],
    loading: false,
    error: null,
    successMessage: null,
    stats: {
        completedCount: 0,
        pendingCount: 0,
        completionRate: 0,
    },
};

// Get all weekly checkins
export const fetchWeeklyCheckins = createAsyncThunk(
    "weeklyCheckin/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/weekly");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch weekly check-ins");
        }
    }
);

// Note: Delete endpoint doesn't exist per your note, but we'll keep it optimistic
// Delete checkin (optimistic - you can remove if not needed)
export const deleteWeeklyCheckin = createAsyncThunk(
    "weeklyCheckin/delete",
    async ({ athleteName, weekNumber }: { athleteName: string; weekNumber: number }, { rejectWithValue }) => {
        try {
            // Since delete endpoint doesn't exist, we'll simulate or you can implement if backend adds it
            // For now, we'll do optimistic delete
            return { athleteName, weekNumber };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete check-in");
        }
    }
);

// Calculate statistics
const calculateStats = (checkins: WeeklyCheckin[]) => {
    const completedCount = checkins.filter(c => c.checkinCompleted === "Completed").length;
    const pendingCount = checkins.filter(c => c.checkinCompleted === "Pending").length;
    const completionRate = checkins.length > 0
        ? Math.round((completedCount / checkins.length) * 100)
        : 0;

    return { completedCount, pendingCount, completionRate };
};

const weeklyCheckinSlice = createSlice({
    name: "weeklyCheckin",
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },
        // Optimistic delete for UI
        deleteCheckinLocally: (state, action: PayloadAction<{ athleteName: string; weekNumber: number }>) => {
            state.checkins = state.checkins.filter(
                c => !(c.athleteName === action.payload.athleteName && c.weekNumber === action.payload.weekNumber)
            );
            state.stats = calculateStats(state.checkins);
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch checkins
            .addCase(fetchWeeklyCheckins.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWeeklyCheckins.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.checkins = action.payload.data || [];
                state.stats = calculateStats(state.checkins);
                state.successMessage = action.payload.message;
            })
            .addCase(fetchWeeklyCheckins.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete checkin (optimistic)
            .addCase(deleteWeeklyCheckin.fulfilled, (state, action) => {
                state.checkins = state.checkins.filter(
                    c => !(c.athleteName === action.payload.athleteName && c.weekNumber === action.payload.weekNumber)
                );
                state.stats = calculateStats(state.checkins);
                state.successMessage = "Check-in deleted successfully";
            })
            .addCase(deleteWeeklyCheckin.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { clearMessages, deleteCheckinLocally } = weeklyCheckinSlice.actions;
export default weeklyCheckinSlice.reducer;