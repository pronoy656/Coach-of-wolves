/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";
import { Athlete, CoachAthletesState } from "./coachAthletesType";

const initialState: CoachAthletesState = {
    athletes: [],
    loading: false,
    error: null,
    successMessage: null,
};

// --- Async Thunks ---

export const fetchCoachAthletes = createAsyncThunk(
    "coachAthletes/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/athlete/coachId");
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch athletes"
            );
        }
    }
);

export const addAthlete = createAsyncThunk(
    "coachAthletes/add",
    async (athleteData: Partial<Athlete>, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/athlete?userModel=User", athleteData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add athlete"
            );
        }
    }
);

export const updateAthlete = createAsyncThunk(
    "coachAthletes/update",
    async ({ id, data }: { id: string; data: Partial<Athlete> }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/athlete/${id}`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update athlete"
            );
        }
    }
);

export const deleteAthlete = createAsyncThunk(
    "coachAthletes/delete",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/athlete/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete athlete"
            );
        }
    }
);

// --- Slice ---

const coachAthletesSlice = createSlice({
    name: "coachAthletes",
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
            .addCase(fetchCoachAthletes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCoachAthletes.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.athletes = action.payload || [];
            })
            .addCase(fetchCoachAthletes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add
            .addCase(addAthlete.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addAthlete.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.athletes.push(action.payload.data);
                state.successMessage = action.payload.message || "Athlete added successfully";
            })
            .addCase(addAthlete.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update
            .addCase(updateAthlete.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAthlete.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.successMessage = action.payload.message || "Athlete updated successfully";
                // We might need to handle the update in state, but the user says "data" is null for update response
                // So we might need to re-fetch or just assume it worked if message is success.
            })
            .addCase(updateAthlete.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete
            .addCase(deleteAthlete.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAthlete.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.successMessage = action.payload.message || "Athlete deleted successfully";
                // Filter out the deleted athlete if possible, but we don't have the ID from action.payload necessarily
                // We'll handle this by re-fetching in the component or passing ID in meta.
            })
            .addCase(deleteAthlete.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearMessages } = coachAthletesSlice.actions;
export default coachAthletesSlice.reducer;
