/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";
import { TimelineItem, TimelineState } from "./timelineType";

const initialState: TimelineState = {
    timeline: [],
    availableYears: [],
    loading: false,
    error: null,
    successMessage: null,
};

// Get timeline for specific athlete
export const fetchTimelineByAthlete = createAsyncThunk(
    "timeline/fetchByAthlete",
    async ({ athleteId, year }: { athleteId: string; year?: number }, { rejectWithValue }) => {
        try {
            const url = year ? `/timeline/${athleteId}?year=${year}` : `/timeline/${athleteId}`;
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch timeline");
        }
    }
);

// Get available years for athlete timeline
export const fetchAvailableYears = createAsyncThunk(
    "timeline/fetchAvailableYears",
    async (athleteId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/timeline/years/${athleteId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch available years");
        }
    }
);

// Bulk update phase
export const updateTimelinePhases = createAsyncThunk(
    "timeline/updatePhases",
    async (
        { athleteId, timelineIds, newPhase }: { athleteId: string; timelineIds: string[]; newPhase: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axiosInstance.patch(`/timeline/bulk-update-phase/${athleteId}`, {
                timelineIds,
                newPhase,
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update timeline phases");
        }
    }
);

const timelineSlice = createSlice({
    name: "timeline",
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
            .addCase(fetchTimelineByAthlete.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTimelineByAthlete.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.timeline = action.payload.data || [];
                state.successMessage = action.payload.message || null;
            })
            .addCase(fetchTimelineByAthlete.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch Available Years
            .addCase(fetchAvailableYears.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAvailableYears.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.availableYears = action.payload.data || [];
            })
            .addCase(fetchAvailableYears.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Phases
            .addCase(updateTimelinePhases.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTimelinePhases.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.successMessage = action.payload.message || "Timeline phases updated successfully";
            })
            .addCase(updateTimelinePhases.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearMessages, resetState } = timelineSlice.actions;
export default timelineSlice.reducer;
