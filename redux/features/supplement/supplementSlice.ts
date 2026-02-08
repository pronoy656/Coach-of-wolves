/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

// Exact backend interface
export interface Supplement {
  _id: string;
  name: string;
  brand?: string;
  dosage?: string;
  frequency?: string;
  time: string;
  purpose: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Create payload - exact backend fields
export interface CreateSupplementPayload {
  name: string;
  brand?: string;
  dosage?: string;
  frequency?: string;
  time: string;
  purpose: string;
  note?: string;
}

// Update payload - exact backend fields
export interface UpdateSupplementPayload {
  id: string;
  data: Partial<CreateSupplementPayload>;
}

// Exact backend response structure for list
export interface SupplementListResponse {
  total: number;
  page: number;
  limit: number;
  items: Supplement[];
}

// Exact backend response structure for single item
export interface SupplementResponse {
  success: boolean;
  message: string;
  data: Supplement;
}

// Exact backend response structure for list with success
export interface SupplementListResponseWrapper {
  success: boolean;
  message: string;
  data: SupplementListResponse;
}

export interface SupplementState {
  supplements: Supplement[];
  currentSupplement: Supplement | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  total: number;
  page: number;
  limit: number;
  searchQuery: string;
}

/* ================= INITIAL STATE ================= */

const initialState: SupplementState = {
  supplements: [],
  currentSupplement: null,
  loading: false,
  error: null,
  successMessage: null,
  total: 0,
  page: 1,
  limit: 10,
  searchQuery: "",
};

/* ================= ASYNC THUNKS ================= */

/* ---------- GET ALL SUPPLEMENTS ---------- */
export const getAllSupplements = createAsyncThunk<
  SupplementListResponse,
  { page?: number; limit?: number; search?: string } | void,
  { rejectValue: string }
>("supplement/getAll", async (params = {}, { rejectWithValue }) => {
  try {
    const { page = 1, limit = 10, search = "" } = params as {
      page?: number;
      limit?: number;
      search?: string;
    };

    let url = `/supplement/nutrition?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    const response = await axiosInstance.get<SupplementListResponseWrapper>(url);
    console.log("Supplements response:", response.data.data);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message)
      return rejectWithValue(error.response.data.message);
    return rejectWithValue("Failed to fetch supplements");
  }
});

/* ---------- CREATE SUPPLEMENT ---------- */
export const createSupplement = createAsyncThunk<
  Supplement,
  CreateSupplementPayload,
  { rejectValue: string }
>("supplement/create", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<SupplementResponse>("/supplement/nutrition", data);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message)
      return rejectWithValue(error.response.data.message);
    return rejectWithValue("Failed to create supplement");
  }
});

/* ---------- UPDATE SUPPLEMENT ---------- */
export const updateSupplement = createAsyncThunk<
  { id: string; message: string },
  UpdateSupplementPayload,
  { rejectValue: string }
>("supplement/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put<{ success: boolean; message: string }>(
      `/supplement/nutrition/${id}`,
      data
    );
    return { id, message: response.data.message };
  } catch (error: any) {
    if (error.response?.data?.message)
      return rejectWithValue(error.response.data.message);
    return rejectWithValue("Failed to update supplement");
  }
});

/* ---------- DELETE SUPPLEMENT ---------- */
export const deleteSupplement = createAsyncThunk<
  { id: string; message: string },
  string,
  { rejectValue: string }
>("supplement/delete", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete<{ success: boolean; message: string }>(
      `/supplement/nutrition/${id}`
    );
    return { id, message: response.data.message };
  } catch (error: any) {
    if (error.response?.data?.message)
      return rejectWithValue(error.response.data.message);
    return rejectWithValue("Failed to delete supplement");
  }
});

/* ---------- GET SINGLE SUPPLEMENT ---------- */
export const getSupplementById = createAsyncThunk<
  Supplement,
  string,
  { rejectValue: string }
>("supplement/getById", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<SupplementResponse>(`/supplement/nutrition/${id}`);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message)
      return rejectWithValue(error.response.data.message);
    return rejectWithValue("Failed to fetch supplement");
  }
});

/* ---------- SEARCH SUPPLEMENTS ---------- */
export const searchSupplements = createAsyncThunk<
  SupplementListResponse,
  { query: string; page?: number; limit?: number },
  { rejectValue: string }
>("supplement/search", async ({ query, page = 1, limit = 10 }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<SupplementListResponseWrapper>(
      `/supplement/nutrition?search=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message)
      return rejectWithValue(error.response.data.message);
    return rejectWithValue("Failed to search supplements");
  }
});

/* ================= SLICE ================= */

const supplementSlice = createSlice({
  name: "supplement",
  initialState,
  reducers: {
    clearSupplementError: (state) => {
      state.error = null;
    },
    clearSupplementSuccess: (state) => {
      state.successMessage = null;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    clearCurrentSupplement: (state) => {
      state.currentSupplement = null;
    },
    addSupplement: (state, action: PayloadAction<Supplement>) => {
      state.supplements.unshift(action.payload);
    },
    updateSupplementInList: (state, action: PayloadAction<Supplement>) => {
      const index = state.supplements.findIndex(
        (item) => item._id === action.payload._id
      );
      if (index !== -1) {
        state.supplements[index] = action.payload;
      }
    },
    removeSupplementFromList: (state, action: PayloadAction<string>) => {
      state.supplements = state.supplements.filter(
        (item) => item._id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      /* GET ALL SUPPLEMENTS */
      .addCase(getAllSupplements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSupplements.fulfilled, (state, action) => {
        state.loading = false;
        state.supplements = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(getAllSupplements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch supplements";
      })

      /* CREATE SUPPLEMENT */
      .addCase(createSupplement.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createSupplement.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Supplement created successfully";
        state.supplements.unshift(action.payload);
      })
      .addCase(createSupplement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create supplement";
      })

      /* UPDATE SUPPLEMENT */
      .addCase(updateSupplement.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateSupplement.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        // Update supplement in list
        const index = state.supplements.findIndex(
          (item) => item._id === action.payload.id
        );
        if (index !== -1) {
          // We need to refetch since backend returns null for data
          state.supplements = [];
        }
      })
      .addCase(updateSupplement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update supplement";
      })

      /* DELETE SUPPLEMENT */
      .addCase(deleteSupplement.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteSupplement.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.supplements = state.supplements.filter(
          (supplement) => supplement._id !== action.payload.id
        );
      })
      .addCase(deleteSupplement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete supplement";
      })

      /* GET SUPPLEMENT BY ID */
      .addCase(getSupplementById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSupplementById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSupplement = action.payload;
      })
      .addCase(getSupplementById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch supplement";
      })

      /* SEARCH SUPPLEMENTS */
      .addCase(searchSupplements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchSupplements.fulfilled, (state, action) => {
        state.loading = false;
        state.supplements = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(searchSupplements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to search supplements";
      });
  },
});

export const {
  clearSupplementError,
  clearSupplementSuccess,
  setSearchQuery,
  setPage,
  setLimit,
  clearCurrentSupplement,
  addSupplement,
  updateSupplementInList,
  removeSupplementFromList,
} = supplementSlice.actions;

export default supplementSlice.reducer;