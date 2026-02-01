/* eslint-disable @typescript-eslint/no-explicit-any */
// redux/features/trainingPlan/trainingPlanSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";
import { TrainingPlan, TrainingPlanFormData, TrainingPlanState } from "./trainingPlanType";

const initialState: TrainingPlanState = {
    plans: [],
    loading: false,
    error: null,
    successMessage: null,
    searchTerm: "",
};

// Fetch all training plans for an athlete
export const fetchTrainingPlans = createAsyncThunk(
    "trainingPlan/fetch",
    async (athleteId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/training/plan/${athleteId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch training plans");
        }
    }
);

// Add new training plan
export const addTrainingPlan = createAsyncThunk(
    "trainingPlan/add",
    async ({ athleteId, data }: { athleteId: string; data: TrainingPlanFormData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/training/plan/${athleteId}`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to add training plan");
        }
    }
);

// Update training plan
export const updateTrainingPlan = createAsyncThunk(
    "trainingPlan/update",
    async ({
        athleteId,
        planId,
        data
    }: {
        athleteId: string;
        planId: string;
        data: TrainingPlanFormData
    }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/training/plan/${athleteId}/${planId}`, data);
            return { planId, ...response.data };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update training plan");
        }
    }
);

// Delete training plan
export const deleteTrainingPlan = createAsyncThunk(
    "trainingPlan/delete",
    async ({ athleteId, planId }: { athleteId: string; planId: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/training/plan/${athleteId}/${planId}`);
            return { planId, ...response.data };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete training plan");
        }
    }
);

// Search training plans (Frontend filtering for now, or backend if needed)
export const searchTrainingPlans = createAsyncThunk(
    "trainingPlan/search",
    async ({ athleteId, name }: { athleteId: string; name: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/training/plan/${athleteId}?name=${name}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to search training plans");
        }
    }
);

const trainingPlanSlice = createSlice({
    name: "trainingPlan",
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchTrainingPlans.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTrainingPlans.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.plans = action.payload.data || [];
                // Do not set success message for fetch operations to avoid unnecessary toasts
            })
            .addCase(fetchTrainingPlans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add
            .addCase(addTrainingPlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addTrainingPlan.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                if (action.payload.data) {
                    state.plans.unshift(action.payload.data);
                }
                state.successMessage = action.payload.message;
            })
            .addCase(addTrainingPlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update
            .addCase(updateTrainingPlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTrainingPlan.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.successMessage = action.payload.message;
                // The data returned might be null for update, so we update the local state if needed
                // but fetch often handles this. If data is null, we can't update locally easily without the original meta arg.
            })
            .addCase(updateTrainingPlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete
            .addCase(deleteTrainingPlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTrainingPlan.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.plans = state.plans.filter(p => p._id !== action.payload.planId);
                state.successMessage = action.payload.message;
            })
            .addCase(deleteTrainingPlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Search
            .addCase(searchTrainingPlans.fulfilled, (state, action: PayloadAction<any>) => {
                state.plans = action.payload.data || [];
            });
    },
});

export const { clearMessages, setSearchTerm, resetState } = trainingPlanSlice.actions;
export default trainingPlanSlice.reducer;
