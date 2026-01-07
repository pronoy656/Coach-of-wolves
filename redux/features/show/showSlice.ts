// redux/features/show/showSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";
import { Show, ShowState, ShowFormData } from "./showTypes";

const initialState: ShowState = {
    shows: [],
    loading: false,
    error: null,
    successMessage: null,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
};

// Get all shows
export const fetchShows = createAsyncThunk(
    "show/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/show/management");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch shows");
        }
    }
);

// Add new show
export const addShow = createAsyncThunk(
    "show/add",
    async (data: ShowFormData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/show/management", data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to add show");
        }
    }
);

// Update show
export const updateShow = createAsyncThunk(
    "show/update",
    async ({ id, data }: { id: string; data: ShowFormData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/show/management/${id}`, data);
            return { id, ...response.data };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update show");
        }
    }
);

// Delete show
export const deleteShow = createAsyncThunk(
    "show/delete",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/show/management/${id}`);
            return { id, ...response.data };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete show");
        }
    }
);

const showSlice = createSlice({
    name: "show",
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },
        resetState: () => initialState,
        // Local updates for optimistic UI
        addShowLocally: (state, action: PayloadAction<Show>) => {
            state.shows.unshift(action.payload);
        },
        updateShowLocally: (state, action: PayloadAction<Show>) => {
            const index = state.shows.findIndex(s => s._id === action.payload._id);
            if (index !== -1) {
                state.shows[index] = action.payload;
            }
        },
        removeShowLocally: (state, action: PayloadAction<string>) => {
            state.shows = state.shows.filter(s => s._id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch shows
            .addCase(fetchShows.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchShows.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.shows = action.payload.data || [];
                state.successMessage = action.payload.message;
            })
            .addCase(fetchShows.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add show
            .addCase(addShow.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(addShow.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                if (action.payload.data) {
                    state.shows.unshift(action.payload.data);
                }
                state.successMessage = action.payload.message;
            })
            .addCase(addShow.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update show
            .addCase(updateShow.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateShow.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.successMessage = action.payload.message;
                // Update the show in the state
                const index = state.shows.findIndex(s => s._id === action.payload.id);
                if (index !== -1 && action.payload.data) {
                    state.shows[index] = {
                        ...state.shows[index],
                        ...action.payload.data,
                        updatedAt: new Date().toISOString()
                    };
                }
            })
            .addCase(updateShow.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete show
            .addCase(deleteShow.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(deleteShow.fulfilled, (state, action) => {
                state.loading = false;
                state.shows = state.shows.filter(s => s._id !== action.payload.id);
                state.successMessage = action.payload.message;
            })
            .addCase(deleteShow.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    clearMessages,
    resetState,
    addShowLocally,
    updateShowLocally,
    removeShowLocally
} = showSlice.actions;
export default showSlice.reducer;