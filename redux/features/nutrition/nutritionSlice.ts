/* eslint-disable @typescript-eslint/no-explicit-any */





import axiosInstance from "@/lib/axiosInstance";
import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

export interface Nutrition {
  _id: string;
  id?: string; // For frontend compatibility
  name: string;
  brand?: string;
  category: string;
  defaultQuantity: string;
  caloriesQuantity: number;
  proteinQuantity: number;
  fatsQuantity: number;
  carbsQuantity: number;
  sugarQuantity: number;
  fiberQuantity: number;
  saturatedFats: number;
  unsaturatedFats: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateNutritionPayload {
  name: string;
  brand?: string;
  category: string;
  defaultQuantity: string;
  caloriesQuantity: number;
  proteinQuantity: number;
  fatsQuantity: number;
  carbsQuantity: number;
  sugarQuantity: number;
  fiberQuantity: number;
  saturatedFats: number;
  unsaturatedFats: number;
}

interface NutritionState {
  nutritions: Nutrition[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: NutritionState = {
  nutritions: [],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
  successMessage: null,
};

/* ================= ASYNC THUNKS ================= */

// Get All Nutritions (matches your get response)
export const getAllNutritions = createAsyncThunk<
  { items: Nutrition[]; total: number; page: number; limit: number },
  void,
  { rejectValue: string }
>("nutrition/getAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/food/nutrition");
    return response.data.data; // This contains { items, total, page, limit }
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch nutrition database");
  }
});

// Create Nutrition
export const createNutrition = createAsyncThunk<
  Nutrition,
  CreateNutritionPayload,
  { rejectValue: string }
>("nutrition/create", async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/food/nutrition", payload);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to create food item");
  }
});

// Update Nutrition
export const updateNutrition = createAsyncThunk<
  { id: string; data: CreateNutritionPayload },
  { id: string; data: CreateNutritionPayload },
  { rejectValue: string }
>("nutrition/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    // Your backend returns data: null on update, so we return the payload to update state manually
    await axiosInstance.put(`/food/nutrition/${id}`, data);
    return { id, data };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Update failed");
  }
});

// Delete Nutrition
export const deleteNutrition = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("nutrition/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/food/nutrition/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Delete failed");
  }
});

/* ================= SLICE ================= */

const nutritionSlice = createSlice({
  name: "nutrition",
  initialState,
  reducers: {
    clearNutritionError: (state) => {
      state.error = null;
    },
    clearNutritionSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* GET ALL */
      .addCase(getAllNutritions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllNutritions.fulfilled, (state, action) => {
        state.loading = false;
        state.nutritions = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(getAllNutritions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load nutrition data";
      })

      /* CREATE */
      .addCase(createNutrition.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNutrition.fulfilled, (state, action) => {
        state.loading = false;
        state.nutritions.unshift(action.payload); // Add new item to start
        // state.successMessage = "Food item created successfully";
      })
      .addCase(createNutrition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create item";
      })

      /* UPDATE */
      .addCase(updateNutrition.fulfilled, (state, action) => {
        const index = state.nutritions.findIndex((n) => n._id === action.payload.id);
        if (index !== -1) {
          state.nutritions[index] = { ...state.nutritions[index], ...action.payload.data };
        }
        // state.successMessage = "Food item updated successfully";
      })

      /* DELETE */
      .addCase(deleteNutrition.fulfilled, (state, action) => {
        state.nutritions = state.nutritions.filter((n) => n._id !== action.payload);
        // state.successMessage = "Food item deleted successfully";
      });
  },
});

export const { clearNutritionError, clearNutritionSuccess } = nutritionSlice.actions;
export default nutritionSlice.reducer;