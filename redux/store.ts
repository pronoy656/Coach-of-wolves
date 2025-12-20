import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import nutritionReducer from "./features/nutrition/nutritionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    nutrition: nutritionReducer,
  },
});

// Infer types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
