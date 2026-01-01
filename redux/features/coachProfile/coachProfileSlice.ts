// // redux/features/coach/coachProfileSlice.ts
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import axiosInstance from "@/lib/axiosInstance";
// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// /* ================= TYPES ================= */

// export interface CoachProfile {
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
//   authentication?: {
//     isResetPassword: boolean;
//     oneTimeCode: number;
//     expireAt: string;
//   };
// }

// export interface UpdateProfilePayload {
//   name?: string;
//   image?: File;
// }

// export interface UpdateProfileResponse {
//   success: boolean;
//   message: string;
//   data: CoachProfile;
// }

// export interface CoachProfileState {
//   profile: CoachProfile | null;
//   loading: boolean;
//   error: string | null;
//   updateLoading: boolean;
//   updateError: string | null;
// }

// /* ================= INITIAL STATE ================= */

// const initialState: CoachProfileState = {
//   profile: null,
//   loading: false,
//   error: null,
//   updateLoading: false,
//   updateError: null,
// };

// /* ================= ASYNC THUNKS ================= */

// /* ---------- GET COACH PROFILE ---------- */
// export const getCoachProfile = createAsyncThunk<
//   CoachProfile,
//   void,
//   { rejectValue: string }
// >("coachProfile/getProfile", async (_, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.get("/auth/coach/profile");
//     return response.data.data;
//   } catch (error: any) {
//     console.error("Failed to fetch coach profile:", error);
//     if (error.response?.data?.message) {
//       return rejectWithValue(error.response.data.message);
//     }
//     return rejectWithValue("Failed to fetch coach profile. Please try again.");
//   }
// });

// /* ---------- UPDATE COACH PROFILE ---------- */
// export const updateCoachProfile = createAsyncThunk<
//   any, // return type
//   { formData: FormData; id: string }, // argument type
//   { rejectValue: string }
// >(
//   "coach/updateProfile",
//   async ({ formData, id }, { rejectWithValue }) => {
//     try {
//       // Proper FormData logging
//       for (const [key, value] of formData.entries()) {
//         if (value instanceof File) {
//           console.log(`FormData -> ${key}:`, {
//             name: value.name,
//             size: value.size,
//             type: value.type,
//           });
//         } else {
//           console.log(`FormData -> ${key}:`, value);
//         }
//       }

//       // PATCH request with coach id in URL
//       const res = await axiosInstance.patch(`/coach/profile/${id}`, formData);
//       return res.data;
//     } catch (err: any) {
//       console.error("Update profile error:", err.response?.data);
//       return rejectWithValue(
//         err.response?.data?.message || "Profile update failed"
//       );
//     }
//   }
// );





// /* ================= SLICE ================= */

// const coachProfileSlice = createSlice({
//   name: "coachProfile",
//   initialState,
//   reducers: {
//     clearCoachProfileError: (state) => {
//       state.error = null;
//       state.updateError = null;
//     },
//     clearCoachProfile: (state) => {
//       state.profile = null;
//     },
//     setCoachProfileImage: (state, action: PayloadAction<string>) => {
//       if (state.profile) {
//         state.profile.image = action.payload;
//       }
//     },
//     setCoachProfileName: (state, action: PayloadAction<string>) => {
//       if (state.profile) {
//         state.profile.name = action.payload;
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       /* GET COACH PROFILE */
//       .addCase(getCoachProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getCoachProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.profile = action.payload;
//       })
//       .addCase(getCoachProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to fetch coach profile";
//       })

//       /* UPDATE COACH PROFILE */
//         .addCase(updateCoachProfile.pending, (state) => {
//         state.updateLoading = true;
//         state.updateError = null;
//         })
//         .addCase(updateCoachProfile.fulfilled, (state, action) => {
//         state.updateLoading = false;
//         state.profile = action.payload;
//         })
//         .addCase(updateCoachProfile.rejected, (state) => {
//         state.updateLoading = false;
//         state.updateError =
//             "Failed to update coach profile";
//         });

//   },
// });

// export const {
//   clearCoachProfileError,
//   clearCoachProfile,
//   setCoachProfileImage,
//   setCoachProfileName,
// } = coachProfileSlice.actions;

// export default coachProfileSlice.reducer;






/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

export interface CoachProfile {
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
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: string;
  };
}

export interface CoachProfileState {
  profile: CoachProfile | null;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  updateError: string | null;
}

/* ================= INITIAL STATE ================= */

const initialState: CoachProfileState = {
  profile: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
};

/* ================= ASYNC THUNKS ================= */

/* ---------- GET COACH PROFILE ---------- */
export const getCoachProfile = createAsyncThunk<
  CoachProfile,
  void,
  { rejectValue: string }
>("coachProfile/getProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/auth/coach/profile");
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch coach profile:", error);
    return rejectWithValue(
      error.response?.data?.message ||
        "Failed to fetch coach profile. Please try again."
    );
  }
});

/* ---------- UPDATE COACH PROFILE ---------- */
export const updateCoachProfile = createAsyncThunk<
  CoachProfile, // return updated profile
  FormData,    // only FormData as argument
  { rejectValue: string }
>(
  "coachProfile/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      // ✅ Log FormData properly
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`FormData -> ${key}:`, {
            name: value.name,
            size: value.size,
            type: value.type,
          });
        } else {
          console.log(`FormData -> ${key}:`, value);
        }
      }

      // PATCH request without ID
      const res = await axiosInstance.patch("/auth/coach/profile", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

      return res.data.data; // assuming backend returns { data: profile }
    } catch (err: any) {
      console.error("Update profile error:", err.response?.data);
      return rejectWithValue(
        err.response?.data?.message || "Profile update failed"
      );
    }
  }
);


/* ================= SLICE ================= */

const coachProfileSlice = createSlice({
  name: "coachProfile",
  initialState,
  reducers: {
    clearCoachProfileError: (state) => {
      state.error = null;
      state.updateError = null;
    },
    clearCoachProfile: (state) => {
      state.profile = null;
    },
    setCoachProfileImage: (state, action: PayloadAction<string>) => {
      if (state.profile) state.profile.image = action.payload;
    },
    setCoachProfileName: (state, action: PayloadAction<string>) => {
      if (state.profile) state.profile.name = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET PROFILE
      .addCase(getCoachProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCoachProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getCoachProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch coach profile";
      })
      // UPDATE PROFILE
      .addCase(updateCoachProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateCoachProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateCoachProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError =
          action.payload || "Failed to update coach profile";
      });
  },
});

export const {
  clearCoachProfileError,
  clearCoachProfile,
  setCoachProfileImage,
  setCoachProfileName,
} = coachProfileSlice.actions;

export default coachProfileSlice.reducer;
