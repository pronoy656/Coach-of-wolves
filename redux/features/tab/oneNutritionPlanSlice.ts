
// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import axiosInstance from "@/lib/axiosInstance";
// import { OneNutritionPlanState, NutritionPlan } from "./oneNutritionPlanType";

// const initialState: OneNutritionPlanState = {
//     plans: [],
//     totals: {
//         totalProtein: 0,
//         totalFats: 0,
//         totalCarbs: 0,
//         totalCalories: 0,
//     },
//     loading: false,
//     error: null,
//     successMessage: null,
// };

// export const fetchNutritionPlans = createAsyncThunk(
//     "oneNutritionPlan/fetch",
//     async (athleteId: string, { rejectWithValue }) => {
//         try {
//             const response = await axiosInstance.get(`/coach/nutrition/${athleteId}`);
//             return response.data;
//         } catch (error: any) {
//             return rejectWithValue(error.response?.data?.message || "Failed to fetch nutrition plans");
//         }
//     }
// );

// export const addNutritionPlan = createAsyncThunk(
//     "oneNutritionPlan/add",
//     async ({ athleteId, data }: { athleteId: string; data: any }, { rejectWithValue }) => {
//         try {
//             const response = await axiosInstance.post(`/coach/nutrition/${athleteId}`, data);
//             return response.data;
//         } catch (error: any) {
//             return rejectWithValue(error.response?.data?.message || "Failed to add nutrition plan");
//         }
//     }
// );

// export const updateNutritionPlan = createAsyncThunk(
//     "oneNutritionPlan/update",
//     async ({ planId, athleteId, data }: { planId: string; athleteId: string; data: any }, { rejectWithValue }) => {
//         try {
//             const response = await axiosInstance.put(`/coach/nutrition/${planId}/${athleteId}`, data);
//             return response.data;
//         } catch (error: any) {
//             return rejectWithValue(error.response?.data?.message || "Failed to update nutrition plan");
//         }
//     }
// );

// export const deleteNutritionPlan = createAsyncThunk(
//     "oneNutritionPlan/delete",
//     async ({ planId, athleteId }: { planId: string; athleteId: string }, { rejectWithValue }) => {
//         try {
//             const response = await axiosInstance.delete(`/coach/nutrition/${planId}/${athleteId}`);
//             return { planId, ...response.data };
//         } catch (error: any) {
//             return rejectWithValue(error.response?.data?.message || "Failed to delete nutrition plan");
//         }
//     }
// );

// const oneNutritionPlanSlice = createSlice({
//     name: "oneNutritionPlan",
//     initialState,
//     reducers: {
//         clearMessages: (state) => {
//             state.error = null;
//             state.successMessage = null;
//         },
//         resetState: () => initialState,
//     },
//     extraReducers: (builder) => {
//         builder
//             // Fetch
//             .addCase(fetchNutritionPlans.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchNutritionPlans.fulfilled, (state, action: PayloadAction<any>) => {
//                 state.loading = false;
//                 state.plans = action.payload.data.plans || [];
//                 state.totals = action.payload.data.totals || {
//                     totalProtein: 0,
//                     totalFats: 0,
//                     totalCarbs: 0,
//                     totalCalories: 0,
//                 };
//             })
//             .addCase(fetchNutritionPlans.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as string;
//             })
//             // Add
//             .addCase(addNutritionPlan.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//                 state.successMessage = null;
//             })
//             .addCase(addNutritionPlan.fulfilled, (state, action: PayloadAction<any>) => {
//                 state.loading = false;
//                 if (action.payload.data) {
//                     state.plans.unshift(action.payload.data);
//                 }
//                 state.successMessage = action.payload.message;
//                 // Refresh totals by refetching
//                 // state.totals will be updated on next fetch
//             })
//             .addCase(addNutritionPlan.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as string;
//             })
//             // Update
//             .addCase(updateNutritionPlan.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//                 state.successMessage = null;
//             })
//             .addCase(updateNutritionPlan.fulfilled, (state, action: PayloadAction<any>) => {
//                 state.loading = false;
//                 state.successMessage = action.payload.message;
//                 // Instead of updating locally, we'll refetch to get updated totals
//             })
//             .addCase(updateNutritionPlan.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as string;
//             })
//             // Delete
//             .addCase(deleteNutritionPlan.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//                 state.successMessage = null;
//             })
//             .addCase(deleteNutritionPlan.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.plans = state.plans.filter((p) => p._id !== action.payload.planId);
//                 state.successMessage = action.payload.message;
//                 // Recalculate totals locally or refetch
//                 // For simplicity, we'll refetch to get accurate totals
//             })
//             .addCase(deleteNutritionPlan.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as string;
//             });
//     },
// });

// export const { clearMessages, resetState } = oneNutritionPlanSlice.actions;
// export default oneNutritionPlanSlice.reducer;










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
    async ({ planId, athleteId, data }: { planId: string; athleteId: string; data: any }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.put(`/coach/nutrition/${athleteId}/${planId}`, data);
            // Refetch plans after successful update
            dispatch(fetchNutritionPlans(athleteId));
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update nutrition plan");
        }
    }
);

export const deleteNutritionPlan = createAsyncThunk(
    "oneNutritionPlan/delete",
    async ({ planId, athleteId }: { planId: string; athleteId: string }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.delete(`/coach/nutrition/${athleteId}/${planId}`);
            // Refetch plans after successful deletion
            dispatch(fetchNutritionPlans(athleteId));
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
        resetState: () => initialState,
        // Manually update plan in state (for optimistic updates if needed)
        updatePlanInState: (state, action: PayloadAction<NutritionPlan>) => {
            const index = state.plans.findIndex(p => p._id === action.payload._id);
            if (index !== -1) {
                state.plans[index] = action.payload;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchNutritionPlans.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNutritionPlans.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.plans = action.payload.data.plans || [];
                state.totals = action.payload.data.totals || {
                    totalProtein: 0,
                    totalFats: 0,
                    totalCarbs: 0,
                    totalCalories: 0,
                };
            })
            .addCase(fetchNutritionPlans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add
            .addCase(addNutritionPlan.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(addNutritionPlan.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                if (action.payload.data) {
                    state.plans.unshift(action.payload.data);
                    // Recalculate totals locally (optional)
                    // Or wait for the fetch from update/delete thunks
                }
                state.successMessage = action.payload.message;
            })
            .addCase(addNutritionPlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update
            .addCase(updateNutritionPlan.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateNutritionPlan.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.successMessage = action.payload.message;
                // The data will be refreshed by the fetch call in the thunk
            })
            .addCase(updateNutritionPlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete
            .addCase(deleteNutritionPlan.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(deleteNutritionPlan.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
                // Remove from state immediately for better UX
                state.plans = state.plans.filter((p) => p._id !== action.payload.planId);
                // The data will be refreshed by the fetch call in the thunk
            })
            .addCase(deleteNutritionPlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearMessages, resetState, updatePlanInState } = oneNutritionPlanSlice.actions;
export default oneNutritionPlanSlice.reducer;