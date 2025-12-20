/* eslint-disable @typescript-eslint/no-explicit-any */
// store/authSlice.ts
import axiosInstance from "@/lib/axiosInstance";
import { admin_email } from "@/lib/config";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

/* ================= TYPES ================= */

interface User {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  isEmailVerified?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  role: string | null;
  loading: boolean;
  error: string | null;
  forgotPasswordSuccess: boolean;
  resetPasswordSuccess: boolean;
  emailVerified: boolean;
}

/* ================= INITIAL STATE ================= */

const initialState: AuthState = {
  user: null,
  token: null,
  role: null,
  loading: false,
  error: null,
  forgotPasswordSuccess: false,
  resetPasswordSuccess: false,
  emailVerified: false,
};

/* ================= ASYNC THUNKS ================= */

/* ---------- LOGIN ---------- */
export const loginUser = createAsyncThunk<
  { token: string; role: string }, // return type
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    let token: string;
    let role: string;

    if (payload.email === admin_email) {
      const response = await axiosInstance.post("/auth/login", payload);
      token = response.data.data; // string token
      role = response.data.role; // SUPER_ADMIN
    } else {
      const response = await axiosInstance.post("/auth/coach/login", payload);
      token = response.data.data.token;
      role = response.data.data.role; // COACH
    }

    return { token, role };
  } catch (error: any) {
    if (error.response?.data?.message)
      return rejectWithValue(error.response.data.message);
    return rejectWithValue("Login failed");
  }
});

/* ---------- FORGOT PASSWORD ---------- */
export const forgotPassword = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>("auth/forgot-password", async (data, { rejectWithValue }) => {
  try {
    if (data.email === admin_email) {
      const response = await axiosInstance.post("/auth/forget-password", data);
      console.log(response.data.success);
    } else {
      const response = await axiosInstance.post(
        "/auth/coach/forget-password",
        data
      );
      console.log(response.data.success);
    }
  } catch (error: any) {
    if (error.response?.data?.message)
      return rejectWithValue(error.response.data.message);
    return rejectWithValue("Request failed");
  }
});

/* ---------- RESET PASSWORD ---------- */
export const resetPassword = createAsyncThunk<
  void,
  {
    email: string;
    token: string;
    newPassword: string;
    confirmPassword: string;
  },
  { rejectValue: string }
>(
  "auth/reset-password",
  async (
    { email, token, newPassword, confirmPassword },
    { rejectWithValue }
  ) => {
    console.log(email, token, newPassword, confirmPassword);
    try {
      if (email === admin_email) {
        await axiosInstance.post(
          "/auth/reset-password",
          { newPassword, confirmPassword },
          { headers: { authorization: `${token}` } }
        );
      } else {
        await axiosInstance.post(
          "/auth/coach/reset-password",
          { newPassword, confirmPassword },
          { headers: { authorization: `${token}` } }
        );
      }
    } catch (error: any) {
      if (error.response?.data?.message)
        return rejectWithValue(error.response.data.message);
      return rejectWithValue("Reset failed");
    }
  }
);

/* ---------- VERIFY EMAIL ---------- */
export const verifyEmail = createAsyncThunk<
  string, // <- the token as a string
  { email: string; oneTimeCode: string },
  { rejectValue: string }
>("auth/verify-email", async ({ email, oneTimeCode }, { rejectWithValue }) => {
  try {
    if (email === admin_email) {
      const response = await axiosInstance.post("/auth/verify-email", {
        email,
        oneTimeCode: Number(oneTimeCode),
      });
      return response.data.data;
    } else {
      const response = await axiosInstance.post("/auth/coach/verify-email", {
        email,
        oneTimeCode,
      });
      return response.data.data;
    }
  } catch (error: any) {
    if (error.response?.data?.message)
      return rejectWithValue(error.response.data.message);
    return rejectWithValue("Verification failed");
  }
});

/* ---------- LOGOUT ---------- */
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await axiosInstance.post("/athlete/status"); // optional backend logout
      return true;
    } catch (error: any) {
      if (error.response?.data?.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue("Logout failed");
    }
  }
);

/* ================= SLICE ================= */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    removeToken: (state) => {
      state.token = null;
      state.role = null;
      state.user = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      /* LOGIN */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ token: string; role: string }>) => {
          state.loading = false;
          state.token = action.payload.token;
          state.role = action.payload.role;

          if (typeof window !== "undefined") {
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("role", action.payload.role);
          }
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      /* FORGOT PASSWORD */
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.forgotPasswordSuccess = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.forgotPasswordSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Request failed";
      })

      /* RESET PASSWORD */
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.resetPasswordSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetPasswordSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Reset failed";
      })

      /* VERIFY EMAIL */
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        state.emailVerified = true;
        if (state.user) state.user.isEmailVerified = true;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Verification failed";
      })

      /* LOGOUT */
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
        }
        return initialState;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Logout failed";
      });
  },
});

export const { removeToken } = authSlice.actions;
export default authSlice.reducer;
