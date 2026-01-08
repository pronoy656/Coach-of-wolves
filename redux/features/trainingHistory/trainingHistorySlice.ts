// redux/features/trainingHistory/trainingHistorySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";
import { TrainingHistoryData, TrainingHistoryState } from "./trainingHistoryTypes";

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
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/training/history");
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
                state.data = action.payload.data || initialState.data;
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