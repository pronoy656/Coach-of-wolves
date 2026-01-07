export interface FoodItem {
    foodName: string;
    quantity: number;
}

export interface NutritionPlan {
    _id: string;
    athleteId: string;
    mealName: string;
    food: FoodItem[];
    time: string;
    trainingDay: "training day" | "rest day" | "special day";
    createdAt: string;
    updatedAt: string;
    totalProtein?: number;
    totalFats?: number;
    totalCarbs?: number;
    totalCalories?: number;
}

export interface NutritionTotals {
    totalProtein: number;
    totalFats: number;
    totalCarbs: number;
    totalCalories: number;
}

export interface OneNutritionPlanState {
    plans: NutritionPlan[];
    totals: NutritionTotals;
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}
