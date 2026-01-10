/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";
import { TimelineItem, TimelineState } from "./timelineType";

const initialState: TimelineState = {
    timeline: [],
    loading: false,
    error: null,
    successMessage: null,
};

// Get timeline for specific athlete
export const fetchTimelineByAthlete = createAsyncThunk(
    "timeline/fetchByAthlete",
    async (athleteId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/timeline/${athleteId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch timeline");
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
            });
    },
});

export const { clearMessages, resetState } = timelineSlice.actions;
export default timelineSlice.reducer;
