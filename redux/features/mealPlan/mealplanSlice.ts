/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

// Food item interface from backend
export interface FoodItem {
  foodName: string;
  quantity: number;
}

// Meal plan interface from backend
export interface MealPlan {
  _id: string;
  athleteId: string;
  mealName: string;
  food: FoodItem[];
  time: string;
  trainingDay: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalProtein?: number;
  totalFats?: number;
  totalCarbs?: number;
  totalCalories?: number;
}

// Meal plan with calculated totals (for GET response)
export interface MealPlanWithTotals extends MealPlan {
  totalProtein: number;
  totalFats: number;
  totalCarbs: number;
  totalCalories: number;
}

// Create payload for POST
export interface CreateMealPlanPayload {
  mealName: string;
  food: FoodItem[];
  time: string;
  trainingDay: string;
}

// Update payload for PUT
export interface UpdateMealPlanPayload {
  id: string;
  data: Partial<CreateMealPlanPayload>;
}

// Backend response for single meal plan
export interface MealPlanResponse {
  success: boolean;
  message: string;
  data: MealPlan;
}

// Backend response for list of meal plans with totals
export interface MealPlanListResponse {
  success: boolean;
  message: string;
  data: {
    plans: MealPlanWithTotals[];
    totals: {
      totalProtein: number;
      totalFats: number;
      totalCarbs: number;
      totalCalories: number;
    };
  };
}

// State interface
export interface MealPlanState {
  mealPlans: MealPlanWithTotals[];
  currentMealPlan: MealPlan | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  totals: {
    totalProtein: number;
    totalFats: number;
    totalCarbs: number;
    totalCalories: number;
  };
  currentAthleteId: string | null;
  searchQuery: string;
  filterDay: string;
}

/* ================= INITIAL STATE ================= */

const initialState: MealPlanState = {
  mealPlans: [],
  currentMealPlan: null,
  loading: false,
  error: null,
  successMessage: null,
  totals: {
    totalProtein: 0,
    totalFats: 0,
    totalCarbs: 0,
    totalCalories: 0,
  },
  currentAthleteId: null,
  searchQuery: "",
  filterDay: "All",
};

/* ================= ASYNC THUNKS ================= */

/* ---------- GET MEAL PLANS FOR ATHLETE ---------- */
export const getMealPlansByAthleteId = createAsyncThunk<
  {
    plans: MealPlanWithTotals[];
    totals: {
      totalProtein: number;
      totalFats: number;
      totalCarbs: number;
      totalCalories: number;
    };
  },
  string,
  { rejectValue: string }
>("mealPlan/getByAthleteId", async (athleteId, { rejectWithValue }) => {
  try {
    console.log(athleteId)
    const response = await axiosInstance.get<MealPlanListResponse>(
      `/coach/nutrition/${athleteId}`
    );
    console.log("Meal plans response:", response.data.data);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message)
      return rejectWithValue(error.response.data.message);
    return rejectWithValue("Failed to fetch meal plans");
  }
});

/* ---------- CREATE MEAL PLAN ---------- */
export const createMealPlan = createAsyncThunk<
  MealPlan,
  { athleteId: string; data: CreateMealPlanPayload },
  { rejectValue: string }
>("mealPlan/create", async ({ athleteId, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<MealPlanResponse>(
      `/coach/nutrition/${athleteId}`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message)
      return rejectWithValue(error.response.data.message);
    return rejectWithValue("Failed to create meal plan");
  }
});

/* ---------- UPDATE MEAL PLAN ---------- */
export const updateMealPlan = createAsyncThunk<
  MealPlan,
  { athleteId: string; planId: string; data: Partial<CreateMealPlanPayload> },
  { rejectValue: string }
>("mealPlan/update", async ({ athleteId, planId, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put<MealPlanResponse>(
      `/coach/nutrition/${athleteId}/${planId}`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message)
      return rejectWithValue(error.response.data.message);
    return rejectWithValue("Failed to update meal plan");
  }
});

/* ---------- DELETE MEAL PLAN ---------- */
export const deleteMealPlan = createAsyncThunk<
  { id: string; message: string },
  { athleteId: string; planId: string },
  { rejectValue: string }
>("mealPlan/delete", async ({ athleteId, planId }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete<{
      success: boolean;
      message: string;
    }>(`/coach/nutrition/${athleteId}/${planId}`);
    return { id: planId, message: response.data.message };
  } catch (error: any) {
    if (error.response?.data?.message)
      return rejectWithValue(error.response.data.message);
    return rejectWithValue("Failed to delete meal plan");
  }
});

/* ---------- GET SINGLE MEAL PLAN ---------- */
export const getMealPlanById = createAsyncThunk<
  MealPlan,
  { athleteId: string; planId: string },
  { rejectValue: string }
>("mealPlan/getById", async ({ athleteId, planId }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<MealPlanResponse>(
      `/coach/nutrition/${athleteId}/${planId}`
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message)
      return rejectWithValue(error.response.data.message);
    return rejectWithValue("Failed to fetch meal plan");
  }
});

/* ================= SLICE ================= */

const mealPlanSlice = createSlice({
  name: "mealPlan",
  initialState,
  reducers: {
    clearMealPlanError: (state) => {
      state.error = null;
    },
    clearMealPlanSuccess: (state) => {
      state.successMessage = null;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilterDay: (state, action: PayloadAction<string>) => {
      state.filterDay = action.payload;
    },
    setCurrentAthleteId: (state, action: PayloadAction<string>) => {
      state.currentAthleteId = action.payload;
    },
    clearCurrentMealPlan: (state) => {
      state.currentMealPlan = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* GET MEAL PLANS BY ATHLETE ID */
      .addCase(getMealPlansByAthleteId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMealPlansByAthleteId.fulfilled, (state, action) => {
        state.loading = false;
        state.mealPlans = action.payload.plans;
        state.totals = action.payload.totals;
        state.currentAthleteId = action.meta.arg;
      })
      .addCase(getMealPlansByAthleteId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch meal plans";
      })

      /* CREATE MEAL PLAN */
      .addCase(createMealPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createMealPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Meal plan created successfully";
        
        // Add the new plan to the list if it belongs to current athlete
        if (action.payload.athleteId === state.currentAthleteId) {
          // Calculate totals for the new plan (you might want to add this logic)
          const newPlanWithTotals = {
            ...action.payload,
            totalProtein: 0,
            totalFats: 0,
            totalCarbs: 0,
            totalCalories: 0,
          };
          state.mealPlans.unshift(newPlanWithTotals);
        }
      })
      .addCase(createMealPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create meal plan";
      })

      /* UPDATE MEAL PLAN */
      .addCase(updateMealPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateMealPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Meal plan updated successfully";
        
        // Update in the list
        const index = state.mealPlans.findIndex(
          (plan) => plan._id === action.payload._id
        );
        if (index !== -1) {
          // Keep the existing totals
          const existingPlan = state.mealPlans[index];
          state.mealPlans[index] = {
            ...action.payload,
            totalProtein: existingPlan.totalProtein || 0,
            totalFats: existingPlan.totalFats || 0,
            totalCarbs: existingPlan.totalCarbs || 0,
            totalCalories: existingPlan.totalCalories || 0,
          };
        }
      })
      .addCase(updateMealPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update meal plan";
      })

      /* DELETE MEAL PLAN */
      .addCase(deleteMealPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteMealPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.mealPlans = state.mealPlans.filter(
          (plan) => plan._id !== action.payload.id
        );
      })
      .addCase(deleteMealPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete meal plan";
      })

      /* GET SINGLE MEAL PLAN */
      .addCase(getMealPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMealPlanById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMealPlan = action.payload;
      })
      .addCase(getMealPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch meal plan";
      });
  },
});

export const {
  clearMealPlanError,
  clearMealPlanSuccess,
  setSearchQuery,
  setFilterDay,
  setCurrentAthleteId,
  clearCurrentMealPlan,
} = mealPlanSlice.actions;

// Export a utility function for normalizing training day
export const normalizeTrainingDay = (day: string): string => {
  const dayLower = day.toLowerCase();
  if (dayLower.includes("training")) return "training day";
  if (dayLower.includes("rest")) return "rest day";
  if (dayLower.includes("special")) return "special day";
  return day;
};

export default mealPlanSlice.reducer;