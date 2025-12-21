
/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

// Exact backend interface - only what comes from backend
export interface Exercise {
  _id: string;
  name: string;
  musal: string;
  difficulty: string;
  equipment: string;
  description: string;
  subCategory: string[];
  image?: string; // Backend returns string (URL)
  vedio?: string; // Backend returns string (URL)
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Separate interface for form data (with Files)
export interface ExerciseFormData {
  name: string;
  musal: string;
  difficulty: string;
  equipment: string;
  description: string;
  subCategory: string[];
  image?: File | null;
  vedio?: File | null;
}

// Create payload - uses form data
export interface CreateExercisePayload {
  data: ExerciseFormData;
}

// Update payload - uses form data
export interface UpdateExercisePayload {
  id: string;
  data: Partial<ExerciseFormData>;
}

// Filter parameters interface - MATCH BACKEND PARAMETER NAMES
export interface ExerciseFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  musalCategory?: string; // Backend uses "musalCategory" for filtering by muscle group
  difficulty?: string;
  equipment?: string;
}

// Exact backend response structure for list
export interface ExerciseListMeta {
  total: number;
  page: number;
  limit: number;
}

export interface ExerciseListResponse {
  meta: ExerciseListMeta;
  exercises: Exercise[];
}

export interface ExerciseResponseWrapper {
  success: boolean;
  message: string;
  data: ExerciseListResponse | Exercise | null;
}

export interface ExerciseState {
  exercises: Exercise[];
  currentExercise: Exercise | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  total: number;
  page: number;
  limit: number;
  searchQuery: string;
  selectedMuscleGroup: string;
  selectedDifficulty: string;
  selectedEquipment: string;
  filters: {
    musalCategory?: string;
    difficulty?: string;
    equipment?: string;
  };
}

/* ================= INITIAL STATE ================= */

const initialState: ExerciseState = {
  exercises: [],
  currentExercise: null,
  loading: false,
  error: null,
  successMessage: null,
  total: 0,
  page: 1,
  limit: 10,
  searchQuery: "",
  selectedMuscleGroup: "All Muscle Groups",
  selectedDifficulty: "All Difficulties",
  selectedEquipment: "All Equipment",
  filters: {},
};

/* ================= ASYNC THUNKS ================= */

/* ---------- GET ALL EXERCISES ---------- */
export const getAllExercises = createAsyncThunk<
  ExerciseListResponse,
  ExerciseFilterParams,
  { rejectValue: string }
>("exercise/getAll", async (params: ExerciseFilterParams = {}, { rejectWithValue }) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = "",
      musalCategory,
      difficulty,
      equipment 
    } = params;

    let url = `/exercise?page=${page}&limit=${limit}`;
    
    // Add search parameter
    if (search && search.trim() !== "") {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    
    // Add muscle group filter - backend expects "musalCategory"
    if (musalCategory && musalCategory !== "All Muscle Groups") {
      url += `&musalCategory=${encodeURIComponent(musalCategory)}`;
    }
    
    // Add difficulty filter
    if (difficulty && difficulty !== "All Difficulties") {
      url += `&difficulty=${encodeURIComponent(difficulty)}`;
    }
    
    // Add equipment filter
    if (equipment && equipment !== "All Equipment") {
      url += `&equipment=${encodeURIComponent(equipment)}`;
    }

    console.log("Fetching exercises with URL:", url); // Debug log

    const response = await axiosInstance.get<ExerciseResponseWrapper>(url);
    if (response.data.success) {
      return response.data.data as ExerciseListResponse;
    } else {
      return rejectWithValue(response.data.message || "Failed to fetch exercises");
    }
  } catch (error: any) {
    console.error("Error fetching exercises:", error);
    if (error.response?.data?.message)
      return rejectWithValue(error.response.data.message);
    return rejectWithValue("Failed to fetch exercises");
  }
});

/* ---------- CREATE EXERCISE ---------- */
export const createExercise = createAsyncThunk<
  Exercise,
  CreateExercisePayload,
  { rejectValue: string }
>("exercise/create", async ({ data }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    
    // Append all text fields
    formData.append("name", data.name);
    formData.append("musal", data.musal);
    formData.append("difficulty", data.difficulty);
    formData.append("equipment", data.equipment);
    formData.append("description", data.description);
    
    // Append subCategory
    data.subCategory.forEach((category, index) => {
      formData.append(`subCategory[${index}]`, category);
    });
    
    // Append files if they exist
    if (data.image) {
      formData.append("image", data.image);
    }
    if (data.vedio) {
      formData.append("vedio", data.vedio);
    }

    const response = await axiosInstance.post<ExerciseResponseWrapper>("/exercise", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    if (response.data.success && response.data.data) {
      return response.data.data as Exercise;
    } else {
      return rejectWithValue(response.data.message || "Failed to create exercise");
    }
  } catch (error: any) {
    if (error.response?.data?.message)
      return rejectWithValue(error.response.data.message);
    return rejectWithValue("Failed to create exercise");
  }
});

/* ---------- UPDATE EXERCISE ---------- */
export const updateExercise = createAsyncThunk<
  { id: string; message: string; updatedExercise?: Exercise },
  UpdateExercisePayload,
  { rejectValue: string }
>("exercise/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    
    // Append all text fields that exist
    if (data.name) formData.append("name", data.name);
    if (data.musal) formData.append("musal", data.musal);
    if (data.difficulty) formData.append("difficulty", data.difficulty);
    if (data.equipment) formData.append("equipment", data.equipment);
    if (data.description) formData.append("description", data.description);
    
    // Append subCategory if it exists
    if (data.subCategory) {
      data.subCategory.forEach((category, index) => {
        formData.append(`subCategory[${index}]`, category);
      });
    }
    
    // Append files if they exist
    if (data.image) {
      formData.append("image", data.image);
    }
    if (data.vedio) {
      formData.append("vedio", data.vedio);
    }

    const response = await axiosInstance.put<ExerciseResponseWrapper>(
      `/exercise/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    
    if (response.data.success) {
      // Since backend returns null for data, we need to refetch or handle differently
      return { 
        id, 
        message: response.data.message,
        updatedExercise: response.data.data as Exercise || undefined
      };
    } else {
      return rejectWithValue(response.data.message || "Failed to update exercise");
    }
  } catch (error: any) {
    if (error.response?.data?.message)
      return rejectWithValue(error.response.data.message);
    return rejectWithValue("Failed to update exercise");
  }
});

/* ---------- DELETE EXERCISE ---------- */
export const deleteExercise = createAsyncThunk<
  { id: string; message: string },
  string,
  { rejectValue: string }
>("exercise/delete", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete<ExerciseResponseWrapper>(
      `/exercise/${id}`
    );
    
    if (response.data.success) {
      return { id, message: response.data.message };
    } else {
      return rejectWithValue(response.data.message || "Failed to delete exercise");
    }
  } catch (error: any) {
    if (error.response?.data?.message)
      return rejectWithValue(error.response.data.message);
    return rejectWithValue("Failed to delete exercise");
  }
});

/* ---------- GET SINGLE EXERCISE ---------- */
export const getExerciseById = createAsyncThunk<
  Exercise | null,
  string,
  { rejectValue: string }
>("exercise/getById", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ExerciseResponseWrapper>(`/exercise/${id}`);
    
    if (response.data.success) {
      return response.data.data as Exercise;
    } else {
      return null; // Backend returns null for data
    }
  } catch (error: any) {
    if (error.response?.data?.message)
      return rejectWithValue(error.response.data.message);
    return rejectWithValue("Failed to fetch exercise");
  }
});

/* ================= SLICE ================= */

const exerciseSlice = createSlice({
  name: "exercise",
  initialState,
  reducers: {
    clearExerciseError: (state) => {
      state.error = null;
    },
    clearExerciseSuccess: (state) => {
      state.successMessage = null;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedMuscleGroup: (state, action: PayloadAction<string>) => {
      state.selectedMuscleGroup = action.payload;
    },
    setSelectedDifficulty: (state, action: PayloadAction<string>) => {
      state.selectedDifficulty = action.payload;
    },
    setSelectedEquipment: (state, action: PayloadAction<string>) => {
      state.selectedEquipment = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ExerciseState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentExercise: (state) => {
      state.currentExercise = null;
    },
    addExercise: (state, action: PayloadAction<Exercise>) => {
      state.exercises.unshift(action.payload);
    },
    updateExerciseInList: (state, action: PayloadAction<Exercise>) => {
      const index = state.exercises.findIndex(
        (item) => item._id === action.payload._id
      );
      if (index !== -1) {
        state.exercises[index] = action.payload;
      }
    },
    removeExerciseFromList: (state, action: PayloadAction<string>) => {
      state.exercises = state.exercises.filter(
        (item) => item._id !== action.payload
      );
    },
    resetFilters: (state) => {
      state.searchQuery = "";
      state.selectedMuscleGroup = "All Muscle Groups";
      state.selectedDifficulty = "All Difficulties";
      state.selectedEquipment = "All Equipment";
      state.page = 1;
      state.limit = 10;
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      /* GET ALL EXERCISES */
      .addCase(getAllExercises.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllExercises.fulfilled, (state, action) => {
        state.loading = false;
        state.exercises = action.payload.exercises;
        state.total = action.payload.meta.total;
        state.page = action.payload.meta.page;
        state.limit = action.payload.meta.limit;
      })
      .addCase(getAllExercises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch exercises";
      })

      /* CREATE EXERCISE */
      .addCase(createExercise.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createExercise.fulfilled, (state, action) => {
        state.loading = false;
        // state.successMessage = "Exercise created successfully";
        state.exercises.unshift(action.payload);
      })
      .addCase(createExercise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create exercise";
      })

      /* UPDATE EXERCISE */
      .addCase(updateExercise.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateExercise.fulfilled, (state, action) => {
        state.loading = false;
        // state.successMessage = action.payload.message;
        
        // If we have updated exercise data, update in list
        if (action.payload.updatedExercise) {
          const index = state.exercises.findIndex(
            (item) => item._id === action.payload.id
          );
          if (index !== -1) {
            state.exercises[index] = action.payload.updatedExercise;
          }
        }
      })
      .addCase(updateExercise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update exercise";
      })

      /* DELETE EXERCISE */
      .addCase(deleteExercise.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteExercise.fulfilled, (state, action) => {
        state.loading = false;
        // state.successMessage = action.payload.message;
        state.exercises = state.exercises.filter(
          (exercise) => exercise._id !== action.payload.id
        );
      })
      .addCase(deleteExercise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete exercise";
      })

      /* GET EXERCISE BY ID */
      .addCase(getExerciseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getExerciseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExercise = action.payload;
      })
      .addCase(getExerciseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch exercise";
      });
  },
});

export const {
  clearExerciseError,
  clearExerciseSuccess,
  setSearchQuery,
  setSelectedMuscleGroup,
  setSelectedDifficulty,
  setSelectedEquipment,
  setPage,
  setLimit,
  setFilters,
  clearCurrentExercise,
  addExercise,
  updateExerciseInList,
  removeExerciseFromList,
  resetFilters,
} = exerciseSlice.actions;

export default exerciseSlice.reducer;