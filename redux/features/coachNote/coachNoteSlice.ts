import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";
import { CoachNotePayload, CoachNoteResponse, CoachNoteState } from "./coachNoteType";

const initialState: CoachNoteState = {
  notes: [],
  loading: false,
  error: null,
  successMessage: null,
};

// Async thunk to create a coach note
export const createCoachNote = createAsyncThunk<
  CoachNoteResponse,
  CoachNotePayload,
  { rejectValue: string }
>("coachNote/create", async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<CoachNoteResponse>("/notes/", payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create note"
    );
  }
});

const coachNoteSlice = createSlice({
  name: "coachNote",
  initialState,
  reducers: {
    clearNoteMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCoachNote.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createCoachNote.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Note submitted successfully";
        state.notes.unshift(action.payload.data);
      })
      .addCase(createCoachNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearNoteMessages } = coachNoteSlice.actions;
export default coachNoteSlice.reducer;
