/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Exact backend interface - only what comes from backend
export interface Athlete {
  _id: string;
  name: string;
  coachId: string;
  userModel?: string;
  role: string;
  email: string;
  gender: string;
  category: string;
  phase: string;
  weight: number;
  height: number;
  image: string;
  notifiedThisWeek: boolean;
  age: number;
  waterQuantity: number;
  status: "Natural" | "Enhanced";
  trainingDaySteps: number;
  restDaySteps: number;
  checkInDay: string;
  goal: string;
  verified: boolean;
  isActive: "Active" | "In-Active";
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastActive?: string;
}

// Separate interface for form data (with Files)
export interface AthleteFormData {
  name: string;
  email: string;
  gender: string;
  category: string;
  phase: string;
  weight: number;
  height: number;
  status: "Natural" | "Enhanced";
  age: number;
  waterQuantity: number;
  trainingDaySteps: number;
  restDaySteps: number;
  checkInDay: string;
  goal: string;
  image?: File | null;
  password?: string; // For create only
}

// Create payload - uses form data
export interface CreateAthletePayload {
  data: AthleteFormData;
}

// Update payload - uses form data
export interface UpdateAthletePayload {
  id: string;
  data: Partial<AthleteFormData>;
}

// Filter parameters interface
export interface AthleteFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  phase?: string;
  gender?: string;
}

// Backend response structure for list
export interface AthleteListMeta {
  total: number;
  page: number;
  limit: number;
}

export interface AthleteListResponse {
  success: boolean;
  message: string;
  data: Athlete[];
}

export interface SingleAthleteResponse {
  success: boolean;
  message: string;
  data: Athlete;
}

export interface AthleteState {
  athletes: Athlete[];
  currentAthlete: Athlete | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  total: number;
  page: number;
  limit: number;
  searchQuery: string;
  selectedStatus: string;
  selectedCategory: string;
  selectedPhase: string;
  selectedGender: string;
  filters: {
    status?: string;
    category?: string;
    phase?: string;
    gender?: string;
  };
}

/* ================= INITIAL STATE ================= */

const initialState: AthleteState = {
  athletes: [],
  currentAthlete: null,
  loading: false,
  error: null,
  successMessage: null,
  total: 0,
  page: 1,
  limit: 10,
  searchQuery: "",
  selectedStatus: "All Status",
  selectedCategory: "Category",
  selectedPhase: "All Phases",
  selectedGender: "All Genders",
  filters: {},
};

/* ================= ASYNC THUNKS ================= */

/* ---------- GET ALL ATHLETES ---------- */
export const getAllAthletes = createAsyncThunk<
  Athlete[],
  AthleteFilterParams,
  { rejectValue: string }
>("athlete/getAll", async (params: AthleteFilterParams = {}, { rejectWithValue }) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = "",
      status,
      category,
      phase,
      gender 
    } = params;

    let url = `/athlete?page=${page}&limit=${limit}`;
    
    // Add search parameter
    if (search && search.trim() !== "") {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    
    // Add status filter
    if (status && status !== "All Status") {
      url += `&status=${encodeURIComponent(status)}`;
    }
    
    // Add category filter
    if (category && category !== "Category") {
      url += `&category=${encodeURIComponent(category)}`;
    }
    
    // Add phase filter
    if (phase && phase !== "All Phases") {
      url += `&phase=${encodeURIComponent(phase)}`;
    }
    
    // Add gender filter
    if (gender && gender !== "All Genders") {
      url += `&gender=${encodeURIComponent(gender)}`;
    }

    console.log("Fetching athletes with URL:", url); // Debug log

    const response = await axiosInstance.get<AthleteListResponse>(url);
    
    if (response.data.success) {
      return response.data.data;
    } else {
      return rejectWithValue(response.data.message || "Failed to fetch athletes");
    }
  } catch (error: any) {
    console.error("Error fetching athletes:", error);
    if (error.response?.data?.message)
      return rejectWithValue(error.response.data.message);
    return rejectWithValue("Failed to fetch athletes");
  }
});

/* ---------- CREATE ATHLETE ---------- */
export const createAthlete = createAsyncThunk<
  Athlete,
  CreateAthletePayload,
  { rejectValue: string }
>("athlete/create", async ({ data }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    
    // Append all text fields
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("gender", data.gender);
    formData.append("category", data.category);
    formData.append("phase", data.phase);
    formData.append("weight", data.weight.toString());
    formData.append("height", data.height.toString());
    formData.append("status", data.status);
    formData.append("age", data.age.toString());
    formData.append("waterQuantity", data.waterQuantity.toString());
    formData.append("trainingDaySteps", data.trainingDaySteps.toString());
    formData.append("restDaySteps", data.restDaySteps.toString());
    formData.append("checkInDay", data.checkInDay);
    formData.append("goal", data.goal);
    
    // Append password if provided (for create)
    if (data.password) {
      formData.append("password", data.password);
    }
    
    // Append image file if it exists
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await axiosInstance.post<SingleAthleteResponse>(
      "/athlete?userModel=User",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      return rejectWithValue(response.data.message || "Failed to create athlete");
    }
  } catch (error: any) {
    console.error("Error creating athlete:", error);
    if (error.response?.data?.message)
      return rejectWithValue(error.response.data.message);
    return rejectWithValue("Failed to create athlete");
  }
});

/* ---------- UPDATE ATHLETE ---------- */
export const updateAthlete = createAsyncThunk<
  { id: string; message: string; updatedAthlete?: Athlete },
  UpdateAthletePayload,
  { rejectValue: string }
>("athlete/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    
    // Append all text fields that exist
    if (data.name !== undefined) formData.append("name", data.name);
    if (data.email !== undefined) formData.append("email", data.email);
    if (data.gender !== undefined) formData.append("gender", data.gender);
    if (data.category !== undefined) formData.append("category", data.category);
    if (data.phase !== undefined) formData.append("phase", data.phase);
    if (data.weight !== undefined) formData.append("weight", data.weight.toString());
    if (data.height !== undefined) formData.append("height", data.height.toString());
    if (data.status !== undefined) formData.append("status", data.status);
    if (data.age !== undefined) formData.append("age", data.age.toString());
    if (data.waterQuantity !== undefined) formData.append("waterQuantity", data.waterQuantity.toString());
    if (data.trainingDaySteps !== undefined) formData.append("trainingDaySteps", data.trainingDaySteps.toString());
    if (data.restDaySteps !== undefined) formData.append("restDaySteps", data.restDaySteps.toString());
    if (data.checkInDay !== undefined) formData.append("checkInDay", data.checkInDay);
    if (data.goal !== undefined) formData.append("goal", data.goal);
    
    // Append image file if it exists
    if (data.image) {
      formData.append("image", data.image);
    } else if (data.image === null) {
      // If image is explicitly null, send empty string to clear image
      formData.append("image", "");
    }

    const response = await axiosInstance.put<SingleAthleteResponse>(
      `/athlete/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    
    if (response.data.success) {
      return { 
        id, 
        message: response.data.message,
        updatedAthlete: response.data.data
      };
    } else {
      return rejectWithValue(response.data.message || "Failed to update athlete");
    }
  } catch (error: any) {
    console.error("Error updating athlete:", error);
    if (error.response?.data?.message)
      return rejectWithValue(error.response.data.message);
    return rejectWithValue("Failed to update athlete");
  }
});

/* ---------- DELETE ATHLETE ---------- */
export const deleteAthlete = createAsyncThunk<
  { id: string; message: string },
  string,
  { rejectValue: string }
>("athlete/delete", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete<SingleAthleteResponse>(
      `/athlete/${id}`
    );
    
    if (response.data.success) {
      return { id, message: response.data.message };
    } else {
      return rejectWithValue(response.data.message || "Failed to delete athlete");
    }
  } catch (error: any) {
    console.error("Error deleting athlete:", error);
    if (error.response?.data?.message)
      return rejectWithValue(error.response.data.message);
    return rejectWithValue("Failed to delete athlete");
  }
});

/* ---------- GET SINGLE ATHLETE ---------- */
export const getAthleteById = createAsyncThunk<
  Athlete | null,
  string,
  { rejectValue: string }
>("athlete/getById", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<SingleAthleteResponse>(`/athlete/${id}`);
    
    if (response.data.success) {
      return response.data.data;
    } else {
      return null;
    }
  } catch (error: any) {
    console.error("Error fetching athlete:", error);
    if (error.response?.data?.message)
      return rejectWithValue(error.response.data.message);
    return rejectWithValue("Failed to fetch athlete");
  }
});

/* ================= SLICE ================= */

const athleteSlice = createSlice({
  name: "athlete",
  initialState,
  reducers: {
    clearAthleteError: (state) => {
      state.error = null;
    },
    clearAthleteSuccess: (state) => {
      state.successMessage = null;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedStatus: (state, action: PayloadAction<string>) => {
      state.selectedStatus = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedPhase: (state, action: PayloadAction<string>) => {
      state.selectedPhase = action.payload;
    },
    setSelectedGender: (state, action: PayloadAction<string>) => {
      state.selectedGender = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<AthleteState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentAthlete: (state) => {
      state.currentAthlete = null;
    },
    addAthlete: (state, action: PayloadAction<Athlete>) => {
      state.athletes.unshift(action.payload);
    },
    updateAthleteInList: (state, action: PayloadAction<Athlete>) => {
      const index = state.athletes.findIndex(
        (item) => item._id === action.payload._id
      );
      if (index !== -1) {
        state.athletes[index] = action.payload;
      }
    },
    removeAthleteFromList: (state, action: PayloadAction<string>) => {
      state.athletes = state.athletes.filter(
        (item) => item._id !== action.payload
      );
    },
    resetFilters: (state) => {
      state.searchQuery = "";
      state.selectedStatus = "All Status";
      state.selectedCategory = "Category";
      state.selectedPhase = "All Phases";
      state.selectedGender = "All Genders";
      state.page = 1;
      state.limit = 10;
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      /* GET ALL ATHLETES */
      .addCase(getAllAthletes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAthletes.fulfilled, (state, action) => {
        state.loading = false;
        state.athletes = action.payload;
        state.total = action.payload.length;
      })
      .addCase(getAllAthletes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch athletes";
      })

      /* CREATE ATHLETE */
      .addCase(createAthlete.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createAthlete.fulfilled, (state, action) => {
        state.loading = false;
        state.athletes.unshift(action.payload);
        state.successMessage = "Athlete created successfully";
      })
      .addCase(createAthlete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create athlete";
      })

      /* UPDATE ATHLETE */
      .addCase(updateAthlete.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateAthlete.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        
        // If we have updated athlete data, update in list
        if (action.payload.updatedAthlete) {
          const index = state.athletes.findIndex(
            (item) => item._id === action.payload.id
          );
          if (index !== -1) {
            state.athletes[index] = action.payload.updatedAthlete;
          }
        }
      })
      .addCase(updateAthlete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update athlete";
      })

      /* DELETE ATHLETE */
      .addCase(deleteAthlete.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteAthlete.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.athletes = state.athletes.filter(
          (athlete) => athlete._id !== action.payload.id
        );
      })
      .addCase(deleteAthlete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete athlete";
      })

      /* GET ATHLETE BY ID */
      .addCase(getAthleteById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAthleteById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAthlete = action.payload;
      })
      .addCase(getAthleteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch athlete";
      });
  },
});

export const {
  clearAthleteError,
  clearAthleteSuccess,
  setSearchQuery,
  setSelectedStatus,
  setSelectedCategory,
  setSelectedPhase,
  setSelectedGender,
  setPage,
  setLimit,
  setFilters,
  clearCurrentAthlete,
  addAthlete,
  updateAthleteInList,
  removeAthleteFromList,
  resetFilters,
} = athleteSlice.actions;

export default athleteSlice.reducer;