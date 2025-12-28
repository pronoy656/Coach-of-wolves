// /* eslint-disable @typescript-eslint/no-explicit-any */
// import axiosInstance from "@/lib/axiosInstance";
// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// /* ================= TYPES ================= */

// export interface Coach {
//   _id: string;
//   name: string;
//   role: string;
//   email: string;
//   image: string;
//   verified: boolean;
//   isActive: string;
//   lastActive: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// export interface CreateCoachPayload {
//   name: string;
//   email: string;
//   image?: File | string;
// }

// export interface UpdateCoachPayload {
//   id: string;
//   data: Partial<{
//     name: string;
//     email: string;
//     image?: File | string;
//   }>;
// }

// export interface CoachResponse {
//   success: boolean;
//   message: string;
//   data: Coach;
// }

// export interface CoachesListResponse {
//   success: boolean;
//   message: string;
//   data: Coach[];
// }

// export interface CoachState {
//   coaches: Coach[];
//   currentCoach: Coach | null;
//   loading: boolean;
//   error: string | null;
//   successMessage: string | null;
//   total: number;
// }

// /* ================= INITIAL STATE ================= */

// const initialState: CoachState = {
//   coaches: [],
//   currentCoach: null,
//   loading: false,
//   error: null,
//   successMessage: null,
//   total: 0,
// };

// /* ================= ASYNC THUNKS ================= */

// /* ---------- GET ALL COACHES ---------- */
// export const getAllCoaches = createAsyncThunk<
//   Coach[],
//   void,
//   { rejectValue: string }
// >("coach/getAll", async (_, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.get<CoachesListResponse>("/coach");
//     console.log("Coaches response:", response.data.data);
//     return response.data.data;
//   } catch (error: any) {
//     if (error.response?.data?.message)
//       return rejectWithValue(error.response.data.message);
//     return rejectWithValue("Failed to fetch coaches");
//   }
// });

// /* ---------- CREATE COACH ---------- */
// export const createCoach = createAsyncThunk<
//   Coach,
//   CreateCoachPayload,
//   { rejectValue: string }
// >("coach/create", async (data, { rejectWithValue }) => {
//   try {
//     const formData = new FormData();
//     formData.append("name", data.name);
//     formData.append("email", data.email);
    
//     if (data.image instanceof File) {
//       formData.append("image", data.image);
//     } else if (data.image) {
//       formData.append("image", data.image);
//     }

//     const response = await axiosInstance.post<CoachResponse>(
//       "/coach",
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//     return response.data.data;
//   } catch (error: any) {
//     if (error.response?.data?.message)
//       return rejectWithValue(error.response.data.message);
//     return rejectWithValue("Failed to create coach");
//   }
// });

// /* ---------- UPDATE COACH ---------- */
// export const updateCoach = createAsyncThunk<
//   Coach,
//   UpdateCoachPayload,
//   { rejectValue: string }
// >("coach/update", async ({ id, data }, { rejectWithValue }) => {
//   try {
//     const formData = new FormData();
    
//     if (data.name) formData.append("name", data.name);
//     if (data.email) formData.append("email", data.email);
    
//     if (data.image instanceof File) {
//       formData.append("image", data.image);
//     } else if (data.image) {
//       formData.append("image", data.image);
//     }

//     const response = await axiosInstance.patch<CoachResponse>(
//       `/coach/${id}`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//     return response.data.data;
//   } catch (error: any) {
//     if (error.response?.data?.message)
//       return rejectWithValue(error.response.data.message);
//     return rejectWithValue("Failed to update coach");
//   }
// });

// /* ---------- DELETE COACH ---------- */
// export const deleteCoach = createAsyncThunk<
//   { id: string; message: string },
//   string,
//   { rejectValue: string }
// >("coach/delete", async (id, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.delete<CoachResponse>(`/coach/${id}`);
//     return { id, message: response.data.message };
//   } catch (error: any) {
//     if (error.response?.data?.message)
//       return rejectWithValue(error.response.data.message);
//     return rejectWithValue("Failed to delete coach");
//   }
// });

// /* ---------- GET SINGLE COACH ---------- */
// export const getCoachById = createAsyncThunk<
//   Coach,
//   string,
//   { rejectValue: string }
// >("coach/getById", async (id, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.get<CoachResponse>(`/coach/${id}`);
//     return response.data.data;
//   } catch (error: any) {
//     if (error.response?.data?.message)
//       return rejectWithValue(error.response.data.message);
//     return rejectWithValue("Failed to fetch coach");
//   }
// });

// /* ================= SLICE ================= */

// const coachSlice = createSlice({
//   name: "coach",
//   initialState,
//   reducers: {
//     clearCoachError: (state) => {
//       state.error = null;
//     },
//     clearCoachSuccess: (state) => {
//       state.successMessage = null;
//     },
//     clearCurrentCoach: (state) => {
//       state.currentCoach = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       /* GET ALL COACHES */
//       .addCase(getAllCoaches.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getAllCoaches.fulfilled, (state, action) => {
//         state.loading = false;
//         state.coaches = action.payload;
//         state.total = action.payload.length;
//       })
//       .addCase(getAllCoaches.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to fetch coaches";
//       })

//       /* CREATE COACH */
//       .addCase(createCoach.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(createCoach.fulfilled, (state, action) => {
//         state.loading = false;
//         state.successMessage = "Coach created successfully";
//         state.coaches.unshift(action.payload);
//         state.total += 1;
//       })
//       .addCase(createCoach.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to create coach";
//       })

//       /* UPDATE COACH */
//       .addCase(updateCoach.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(updateCoach.fulfilled, (state, action) => {
//         state.loading = false;
//         state.successMessage = "Coach updated successfully";
        
//         // Update in the list
//         const index = state.coaches.findIndex(
//           (coach) => coach._id === action.payload._id
//         );
//         if (index !== -1) {
//           state.coaches[index] = action.payload;
//         }
        
//         // Update current coach if it's the same
//         if (state.currentCoach?._id === action.payload._id) {
//           state.currentCoach = action.payload;
//         }
//       })
//       .addCase(updateCoach.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to update coach";
//       })

//       /* DELETE COACH */
//       .addCase(deleteCoach.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(deleteCoach.fulfilled, (state, action) => {
//         state.loading = false;
//         state.successMessage = action.payload.message;
//         state.coaches = state.coaches.filter(
//           (coach) => coach._id !== action.payload.id
//         );
//         state.total -= 1;
//       })
//       .addCase(deleteCoach.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to delete coach";
//       })

//       /* GET COACH BY ID */
//       .addCase(getCoachById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getCoachById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentCoach = action.payload;
//       })
//       .addCase(getCoachById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to fetch coach";
//       });
//   },
// });

// export const {
//   clearCoachError,
//   clearCoachSuccess,
//   clearCurrentCoach,
// } = coachSlice.actions;

// export default coachSlice.reducer;




/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

export interface Coach {
  _id: string;
  name: string;
  role: string;
  email: string;
  image: string;
  verified: boolean;
  isActive: string;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateCoachPayload {
  name: string;
  email: string;
  image?: File | string;
}

export interface UpdateCoachPayload {
  id: string;
  data: Partial<{
    name: string;
    email: string;
    image?: File | string;
  }>;
}

export interface CoachResponse {
  success: boolean;
  message: string;
  data: Coach;
}

export interface CoachesListResponse {
  success: boolean;
  message: string;
  data: Coach[];
}

export interface CoachState {
  coaches: Coach[];
  currentCoach: Coach | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  total: number;
}

/* ================= INITIAL STATE ================= */

const initialState: CoachState = {
  coaches: [],
  currentCoach: null,
  loading: false,
  error: null,
  successMessage: null,
  total: 0,
};

/* ================= ASYNC THUNKS ================= */

/* ---------- GET ALL COACHES ---------- */
export const getAllCoaches = createAsyncThunk<
  Coach[],
  void,
  { rejectValue: string }
>("coach/getAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<CoachesListResponse>("/coach");
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch coaches:", error);
    if (error.response?.data?.message) {
      return rejectWithValue(error.response.data.message);
    }
    if (error.response?.status === 403) {
      return rejectWithValue("Access forbidden. Please check your permissions.");
    }
    if (error.response?.status === 404) {
      return rejectWithValue("Coaches endpoint not found. Check API URL.");
    }
    return rejectWithValue("Failed to fetch coaches. Please try again.");
  }
});

/* ---------- CREATE COACH ---------- */
export const createCoach = createAsyncThunk<
  Coach,
  CreateCoachPayload,
  { rejectValue: string }
>("coach/create", async (data, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name.trim());
    formData.append("email", data.email.trim());
    
    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    const response = await axiosInstance.post<CoachResponse>(
      "/coach",
      formData
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to create coach:", error);
    if (error.response?.data?.message) {
      return rejectWithValue(error.response.data.message);
    }
    if (error.response?.status === 403) {
      return rejectWithValue("Access forbidden. Please check your permissions.");
    }
    if (error.response?.status === 404) {
      return rejectWithValue("Create coach endpoint not found.");
    }
    return rejectWithValue("Failed to create coach. Please try again.");
  }
});

/* ---------- UPDATE COACH ---------- */
export const updateCoach = createAsyncThunk<
  Coach,
  UpdateCoachPayload,
  { rejectValue: string }
>("coach/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    
    if (data.name) formData.append("name", data.name.trim());
    if (data.email) formData.append("email", data.email.trim());
    
    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    const response = await axiosInstance.patch<CoachResponse>(
      `/coach/${id}`,
      formData
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to update coach:", error);
    if (error.response?.data?.message) {
      return rejectWithValue(error.response.data.message);
    }
    if (error.response?.status === 403) {
      return rejectWithValue("Access forbidden. Please check your permissions.");
    }
    if (error.response?.status === 404) {
      return rejectWithValue(`Coach with ID ${id} not found.`);
    }
    return rejectWithValue("Failed to update coach. Please try again.");
  }
});

/* ---------- DELETE COACH ---------- */
export const deleteCoach = createAsyncThunk<
  { id: string; message: string },
  string,
  { rejectValue: string }
>("coach/delete", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete<CoachResponse>(`/coach/${id}`);
    return { id, message: response.data.message };
  } catch (error: any) {
    console.error("Failed to delete coach:", error);
    if (error.response?.data?.message) {
      return rejectWithValue(error.response.data.message);
    }
    if (error.response?.status === 403) {
      return rejectWithValue("Access forbidden. Please check your permissions.");
    }
    if (error.response?.status === 404) {
      return rejectWithValue(`Coach with ID ${id} not found.`);
    }
    return rejectWithValue("Failed to delete coach. Please try again.");
  }
});

/* ================= SLICE ================= */

const coachSlice = createSlice({
  name: "coach",
  initialState,
  reducers: {
    clearCoachError: (state) => {
      state.error = null;
    },
    clearCoachSuccess: (state) => {
      state.successMessage = null;
    },
    clearCurrentCoach: (state) => {
      state.currentCoach = null;
    },
    updateCoachInList: (state, action: PayloadAction<Coach>) => {
      const index = state.coaches.findIndex(
        (coach) => coach._id === action.payload._id
      );
      if (index !== -1) {
        state.coaches[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      /* GET ALL COACHES */
      .addCase(getAllCoaches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCoaches.fulfilled, (state, action) => {
        state.loading = false;
        state.coaches = action.payload;
        state.total = action.payload.length;
      })
      .addCase(getAllCoaches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch coaches";
      })

      /* CREATE COACH */
      .addCase(createCoach.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createCoach.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Coach created successfully";
        state.coaches.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createCoach.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create coach";
      })

      /* UPDATE COACH */
      .addCase(updateCoach.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateCoach.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Coach updated successfully";
        
        const index = state.coaches.findIndex(
          (coach) => coach._id === action.payload._id
        );
        if (index !== -1) {
          state.coaches[index] = action.payload;
        }
        
        if (state.currentCoach?._id === action.payload._id) {
          state.currentCoach = action.payload;
        }
      })
      .addCase(updateCoach.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update coach";
      })

      /* DELETE COACH */
      .addCase(deleteCoach.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteCoach.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.coaches = state.coaches.filter(
          (coach) => coach._id !== action.payload.id
        );
        state.total -= 1;
      })
      .addCase(deleteCoach.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete coach";
      });
  },
});

export const {
  clearCoachError,
  clearCoachSuccess,
  clearCurrentCoach,
  updateCoachInList,
} = coachSlice.actions;

export default coachSlice.reducer;