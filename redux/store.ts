
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import nutritionReducer from "./features/nutrition/nutritionSlice";
import supplementReducer from "./features/supplement/supplementSlice";
import coachSupplementReducer from "./features/supplement/coachSupplementSlice";
import exerciseReducer from "./features/exercise/exerciseSlice";
import mealPlanReducer from "./features/mealPlan/mealplanSlice";
import coachReducer from "./features/coach/coachSlice";
import athleteReducer from "./features/athlete/athleteSlice";
import dailyTrackingReducer from "./features/tab/dailyTrackingSlice";
import dashboardReducer from "./features/admin/dashboard/dashboardSlice";
import alertReducer from "./features/admin/dashboard/alertSlice";
import coachProfileReducer from "./features/coachProfile/coachProfileSlice";
import coachDashboardReducer from "./features/coachDashboard/coachDashBoardSlice";
import oneNutritionPlanReducer from "./features/tab/oneNutritionPlanSlice";
import showReducer from "./features/show/showSlice";
import weeklyCheckinReducer from "./features/weeklyCheckin/weeklyCheckinSlice";
import trainingHistoryReducer from "./features/trainingHistory/trainingHistorySlice";
import trainingSplitReducer from "./features/trainingSplit/trainingSplitSlice";
import trainingPlanReducer from "./features/trainingPlan/trainingPlanSlice";
import timelineReducer from "./features/timeline/timelineSlice";
import coachAthletesReducer from "./features/coachAthletes/coachAthletesSlice";
import pedReducer from "./features/ped/pedSlice";

import languageReducer from "./features/language/languageSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    nutrition: nutritionReducer,
    supplement: supplementReducer,
    coachSupplement: coachSupplementReducer,
    exercise: exerciseReducer,
    mealPlan: mealPlanReducer,
    coach: coachReducer,
    athlete: athleteReducer,
    dailyTracking: dailyTrackingReducer,
    dashboard: dashboardReducer,
    alert: alertReducer,
    coachProfile: coachProfileReducer,
    coachDashboard: coachDashboardReducer,
    oneNutritionPlan: oneNutritionPlanReducer,
    show: showReducer, // Add this line
    weeklyCheckin: weeklyCheckinReducer,
    trainingHistory: trainingHistoryReducer,
    trainingSplit: trainingSplitReducer,
    trainingPlan: trainingPlanReducer,
    timeline: timelineReducer,
    coachAthletes: coachAthletesReducer,
    ped: pedReducer,
    language: languageReducer,
  },
});


// Infer types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
