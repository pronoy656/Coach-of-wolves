/* eslint-disable @typescript-eslint/no-explicit-any */
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

// Calculate statistics
const calculateStats = (checkins: WeeklyCheckin[]) => {
    const completedCount = checkins.filter(c => c.checkinCompleted === "Completed").length;
    const pendingCount = checkins.filter(c => c.checkinCompleted !== "Completed").length;
    const completionRate = checkins.length > 0
        ? Math.round((completedCount / checkins.length) * 100)
        : 0;

    return { completedCount, pendingCount, completionRate };
};

// Get all check-ins
export const fetchWeeklyCheckins = createAsyncThunk(
    "weeklyCheckin/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/check-in");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch check-ins");
        }
    }
);

// Update check-in (Coach updates question and coachNote)
export const updateWeeklyCheckin = createAsyncThunk(
    "weeklyCheckin/update",
    async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`/check-in/${id}`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update check-in");
        }
    }
);

// Update check-in status
export const updateCheckinStatus = createAsyncThunk(
    "weeklyCheckin/updateStatus",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`/check-in/status/${userId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update check-in status");
        }
    }
);

// Delete check-in
export const deleteWeeklyCheckin = createAsyncThunk(
    "weeklyCheckin/delete",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/check-in/${id}`);
            return { id, message: response.data.message || "Check-in deleted successfully" };
        } catch (error: any) {
            // If the endpoint doesn't exist yet, we still return the ID so the UI can update
            // and log the error for future implementation.
            console.error("Delete endpoint failed or not found:", error);
            return rejectWithValue(error.response?.data?.message || "Failed to delete check-in");
        }
    }
);

const weeklyCheckinSlice = createSlice({
    name: "weeklyCheckin",
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Fetch check-ins
            .addCase(fetchWeeklyCheckins.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWeeklyCheckins.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.checkins = action.payload.data || [];
                state.stats = calculateStats(state.checkins);
            })
            .addCase(fetchWeeklyCheckins.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update check-in
            .addCase(updateWeeklyCheckin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateWeeklyCheckin.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedCheckin = action.payload.data;
                if (updatedCheckin) {
                    state.checkins = state.checkins.map(c =>
                        c._id === updatedCheckin._id ? updatedCheckin : c
                    );
                }
                state.successMessage = action.payload.message;
            })
            .addCase(updateWeeklyCheckin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Status
            .addCase(updateCheckinStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCheckinStatus.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedCheckin = action.payload.data;
                if (updatedCheckin) {
                    state.checkins = state.checkins.map(c =>
                        c._id === updatedCheckin._id ? updatedCheckin : c
                    );
                }
                state.stats = calculateStats(state.checkins);
                state.successMessage = action.payload.message;
            })
            .addCase(updateCheckinStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete check-in
            .addCase(deleteWeeklyCheckin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteWeeklyCheckin.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.checkins = state.checkins.filter(c => c._id !== action.payload.id);
                state.stats = calculateStats(state.checkins);
                state.successMessage = action.payload.message;
            })
            .addCase(deleteWeeklyCheckin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearMessages, resetState } = weeklyCheckinSlice.actions;
export default weeklyCheckinSlice.reducer;