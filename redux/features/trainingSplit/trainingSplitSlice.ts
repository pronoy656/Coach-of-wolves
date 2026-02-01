/* eslint-disable @typescript-eslint/no-explicit-any */
// redux/features/trainingSplit/trainingSplitSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";
import { TrainingSplit, TrainingSplitFormData, TrainingSplitState } from "./trainingSplitTypes";

const initialState: TrainingSplitState = {
    splits: [],
    loading: false,
    error: null,
    successMessage: null,
    currentAthleteId: null,
};

// Get training splits for a specific athlete
export const fetchTrainingSplits = createAsyncThunk(
    "trainingSplit/fetch",
    async (athleteId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/training/splite/${athleteId}`);
            return { data: response.data, athleteId };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch training splits");
        }
    }
);

// Add new training split for an athlete
export const addTrainingSplit = createAsyncThunk(
    "trainingSplit/add",
    async ({ athleteId, data }: { athleteId: string; data: TrainingSplitFormData }, { rejectWithValue }) => {
        try {
            // Add userId to the data as per backend expectation
            const splitData = {
                ...data,
                userId: athleteId,
            };

            const response = await axiosInstance.post(`/training/splite/${athleteId}`, splitData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to add training split");
        }
    }
);

// Update training split
export const updateTrainingSplit = createAsyncThunk(
    "trainingSplit/update",
    async ({
        athleteId,
        splitId,
        data
    }: {
        athleteId: string;
        splitId: string;
        data: TrainingSplitFormData
    }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/training/splite/${athleteId}/${splitId}`, data);
            return { splitId, ...response.data };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update training split");
        }
    }
);

// Delete training split
export const deleteTrainingSplit = createAsyncThunk(
    "trainingSplit/delete",
    async ({ athleteId, splitId }: { athleteId: string; splitId: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/training/splite/${athleteId}/${splitId}`);
            return { splitId, ...response.data };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete training split");
        }
    }
);

const trainingSplitSlice = createSlice({
    name: "trainingSplit",
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },
        resetState: () => initialState,
        setCurrentAthlete: (state, action: PayloadAction<string>) => {
            state.currentAthleteId = action.payload;
        },
        addSplitLocally: (state, action: PayloadAction<TrainingSplit>) => {
            state.splits.unshift(action.payload);
        },
        updateSplitLocally: (state, action: PayloadAction<TrainingSplit>) => {
            const index = state.splits.findIndex(s => s._id === action.payload._id);
            if (index !== -1) {
                state.splits[index] = action.payload;
            }
        },
        removeSplitLocally: (state, action: PayloadAction<string>) => {
            state.splits = state.splits.filter(s => s._id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch training splits
            .addCase(fetchTrainingSplits.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTrainingSplits.fulfilled, (state, action) => {
                state.loading = false;
                state.splits = action.payload.data.data || [];
                state.currentAthleteId = action.payload.athleteId;
                // Do not set success message for fetch operations
            })
            .addCase(fetchTrainingSplits.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add training split
            .addCase(addTrainingSplit.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(addTrainingSplit.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.data) {
                    state.splits.unshift(action.payload.data);
                }
                state.successMessage = action.payload.message;
            })
            .addCase(addTrainingSplit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update training split
            .addCase(updateTrainingSplit.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateTrainingSplit.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
                // Update the split in the state
                const index = state.splits.findIndex(s => s._id === action.payload.splitId);
                if (index !== -1 && action.meta.arg.data) {
                    state.splits[index] = {
                        ...state.splits[index],
                        splite: action.meta.arg.data.splite,
                        updatedAt: new Date().toISOString()
                    };
                }
            })
            .addCase(updateTrainingSplit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete training split
            .addCase(deleteTrainingSplit.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(deleteTrainingSplit.fulfilled, (state, action) => {
                state.loading = false;
                state.splits = state.splits.filter(s => s._id !== action.payload.splitId);
                state.successMessage = action.payload.message;
            })
            .addCase(deleteTrainingSplit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    clearMessages,
    resetState,
    setCurrentAthlete,
    addSplitLocally,
    updateSplitLocally,
    removeSplitLocally
} = trainingSplitSlice.actions;
export default trainingSplitSlice.reducer;