import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import nutritionReducer from "./features/nutrition/nutritionSlice";
import supplementReducer from "./features/supplement/supplementSlice"; 
import exerciseReducer from "./features/exercise/exerciseSlice"; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    nutrition: nutritionReducer,
    supplement: supplementReducer,
    exercise: exerciseReducer,
  },
});

// Infer types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
