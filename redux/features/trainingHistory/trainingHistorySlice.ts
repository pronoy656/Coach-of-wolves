/* eslint-disable @typescript-eslint/no-explicit-any */
// redux/features/trainingHistory/trainingHistorySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";
import { TrainingHistoryState } from "./trainingHistoryTypes";

const initialState: TrainingHistoryState = {
    data: {
        histories: [],
        pr: {
            volumePR: false,
        },
    },
    loading: false,
    error: null,
    successMessage: null,
};

// Get training history
export const fetchTrainingHistory = createAsyncThunk(
    "trainingHistory/fetch",
    async (athleteId: string | undefined, { rejectWithValue }) => {
        try {
            // Updated URL: `/training/history/${athleteId}`
            const url = athleteId ? `/training/history/${athleteId}` : "/training/history";
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch training history");
        }
    }
);

const trainingHistorySlice = createSlice({
    name: "trainingHistory",
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
            // Fetch training history
            .addCase(fetchTrainingHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTrainingHistory.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                
                // Backend returns histires array directly in `data`
                const rawData = action.payload.data;
                if (Array.isArray(rawData)) {
                    state.data = {
                        histories: rawData,
                        pr: { volumePR: false } // No PR object provided in the latest response example
                    };
                } else if (rawData && typeof rawData === 'object') {
                    // Fallback for previous object-based response
                    state.data = {
                        histories: rawData.histories || [],
                        pr: rawData.pr || { volumePR: false }
                    };
                } else {
                    state.data = initialState.data;
                }
                
                state.successMessage = action.payload.message;
            })
            .addCase(fetchTrainingHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearMessages, resetState } = trainingHistorySlice.actions;
export default trainingHistorySlice.reducer;