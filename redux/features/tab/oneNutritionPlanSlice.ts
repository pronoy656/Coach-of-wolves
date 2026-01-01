import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";
import { OneNutritionPlanState, NutritionPlan } from "./oneNutritionPlanType";

const initialState: OneNutritionPlanState = {
    plans: [],
    totals: {
        totalProtein: 0,
        totalFats: 0,
        totalCarbs: 0,
        totalCalories: 0,
    },
    loading: false,
    error: null,
    successMessage: null,
};

export const fetchNutritionPlans = createAsyncThunk(
    "oneNutritionPlan/fetch",
    async (athleteId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/coach/nutrition/${athleteId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch nutrition plans");
        }
    }
);

export const addNutritionPlan = createAsyncThunk(
    "oneNutritionPlan/add",
    async ({ athleteId, data }: { athleteId: string; data: any }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/coach/nutrition/${athleteId}`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to add nutrition plan");
        }
    }
);

export const updateNutritionPlan = createAsyncThunk(
    "oneNutritionPlan/update",
    async ({ planId, athleteId, data }: { planId: string; athleteId: string; data: any }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/coach/nutrition/${planId}/${athleteId}`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update nutrition plan");
        }
    }
);

export const deleteNutritionPlan = createAsyncThunk(
    "oneNutritionPlan/delete",
    async ({ planId, athleteId }: { planId: string; athleteId: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/coach/nutrition/${planId}/${athleteId}`);
            return { planId, ...response.data };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete nutrition plan");
        }
    }
);

const oneNutritionPlanSlice = createSlice({
    name: "oneNutritionPlan",
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchNutritionPlans.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNutritionPlans.fulfilled, (state, action) => {
                state.loading = false;
                state.plans = action.payload.data.plans;
                state.totals = action.payload.data.totals;
            })
            .addCase(fetchNutritionPlans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add
            .addCase(addNutritionPlan.pending, (state) => {
                state.loading = true;
            })
            .addCase(addNutritionPlan.fulfilled, (state, action) => {
                state.loading = false;
                state.plans.push(action.payload.data);
                state.successMessage = action.payload.message;
            })
            .addCase(addNutritionPlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update
            .addCase(updateNutritionPlan.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateNutritionPlan.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;

                // Update the plan in the state locally
                const index = state.plans.findIndex((p) => p._id === action.meta.arg.planId);
                if (index !== -1) {
                    state.plans[index] = {
                        ...state.plans[index],
                        ...action.meta.arg.data,
                    };
                }
            })

            .addCase(updateNutritionPlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete
            .addCase(deleteNutritionPlan.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteNutritionPlan.fulfilled, (state, action) => {
                state.loading = false;
                state.plans = state.plans.filter((p) => p._id !== action.payload.planId);
                state.successMessage = action.payload.message;
            })
            .addCase(deleteNutritionPlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearMessages } = oneNutritionPlanSlice.actions;
export default oneNutritionPlanSlice.reducer;
