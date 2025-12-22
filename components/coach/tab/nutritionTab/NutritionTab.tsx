// "use client";

// import { useState } from "react";
// import { Search, Pencil, Trash2 } from "lucide-react";
// import AddModal from "./AddModal";
// import DeleteModal from "../../exerciseDatabase/deleteModal/DeleteModal";

// type DayType = "Training Day" | "Rest Day" | "Special Day";

// interface MealData {
//   id: string;
//   mealsName: string;
//   foodNames: string[];
//   time: string;
//   day: DayType;
//   calories: number;
//   protein: number;
//   carbs: number;
//   fats: number;
//   foodItems: string[];
// }

// export default function NutritionTab() {
//   const [activeDay, setActiveDay] = useState<DayType>("Training Day");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showMealModal, setShowMealModal] = useState(false);
//   const [editingMeal, setEditingMeal] = useState<MealData | null>(null);

//   const [deleteModal, setDeleteModal] = useState<{
//     isOpen: boolean;
//     id: string | null;
//   }>({
//     isOpen: false,
//     id: null,
//   });

//   const [meals, setMeals] = useState<MealData[]>([
//     {
//       id: "1",
//       mealsName: "BREAKFAST",
//       foodNames: ["Oats", "Whey Protein", "Banana", "Almonds"],
//       time: "7:00",
//       day: "Training Day",
//       calories: 550,
//       protein: 35,
//       carbs: 75,
//       fats: 5,
//       foodItems: [
//         "Oats (30g)",
//         "Whey Protein (30g)",
//         "Banana (1 Piece)",
//         "Almonds (20g)",
//       ],
//     },
//     {
//       id: "2",
//       mealsName: "SNACK 1",
//       foodNames: ["Protein Shake", "Apple"],
//       time: "10:30",
//       day: "Training Day",
//       calories: 550,
//       protein: 35,
//       carbs: 75,
//       fats: 5,
//       foodItems: ["Protein (40g)", "Apple (1 Piece)"],
//     },
//     {
//       id: "3",
//       mealsName: "LUNCH",
//       foodNames: ["Chicken Breast", "Mixed Vegetables", "Rice", "Olive Oil"],
//       time: "13:00",
//       day: "Training Day",
//       calories: 550,
//       protein: 35,
//       carbs: 75,
//       fats: 5,
//       foodItems: [
//         "Chicken breast (200g)",
//         "Mixed Vegetables (200g)",
//         "Rice (150g)",
//         "Olive oil (10ml)",
//       ],
//     },
//   ]);

//   const activeDayMeals = meals.filter((meal) => meal.day === activeDay);

//   // Calculate macro summary
//   const macroSummary = {
//     calories: activeDayMeals.reduce((sum, meal) => sum + meal.calories, 0),
//     protein: activeDayMeals.reduce((sum, meal) => sum + meal.protein, 0),
//     carbs: activeDayMeals.reduce((sum, meal) => sum + meal.carbs, 0),
//     fats: activeDayMeals.reduce((sum, meal) => sum + meal.fats, 0),
//     mealCount: activeDayMeals.length,
//   };

//   const handleDeleteClick = (id: string) => {
//     setDeleteModal({ isOpen: true, id });
//   };

//   const handleDeleteConfirm = () => {
//     if (deleteModal.id) {
//       setMeals(meals.filter((meal) => meal.id !== deleteModal.id));
//     }
//     setDeleteModal({ isOpen: false, id: null });
//   };

//   const handleEditMeal = (meal: MealData) => {
//     setEditingMeal(meal);
//     setShowMealModal(true);
//   };

//   const handleSaveMeal = (mealData: MealData) => {
//     if (editingMeal) {
//       setMeals(meals.map((m) => (m.id === editingMeal.id ? mealData : m)));
//       setEditingMeal(null);
//     } else {
//       const newMeal = { ...mealData, id: Date.now().toString() };
//       setMeals([...meals, newMeal]);
//     }
//   };

//   const dayTypes: DayType[] = ["Training Day", "Rest Day", "Special Day"];
//   const dayColors: Record<DayType, string> = {
//     "Training Day": "bg-emerald-600 hover:bg-emerald-700",
//     "Rest Day": "bg-gray-600 hover:bg-gray-700",
//     "Special Day": "bg-purple-600 hover:bg-purple-700",
//   };

//   const getDayBadgeColor = (day: DayType) => {
//     if (day === "Training Day") return "bg-emerald-500";
//     if (day === "Rest Day") return "bg-gray-500";
//     return "bg-purple-500";
//   };

//   return (
//     <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
//       <div className="space-y-8">
//         {/* Search Bar */}
//         <div className="relative">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
//           <input
//             type="text"
//             placeholder="Search Here..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-12 bg-[#111111] border border-[#2a2a2a] rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
//           />
//         </div>

//         {/* Day Type Tabs */}
//         <div className="flex gap-3">
//           {dayTypes.map((dayType) => (
//             <button
//               key={dayType}
//               onClick={() => setActiveDay(dayType)}
//               className={`px-6 py-3 rounded-full font-medium transition-all text-sm ${
//                 activeDay === dayType
//                   ? "bg-[#4f961f] hover:bg-[#3c7913]"
//                   : "bg-transparent border border-gray-600 hover:bg-gray-800"
//               }`}
//             >
//               {dayType}
//             </button>
//           ))}
//         </div>

//         {/* Add More Button */}
//         <div className="flex justify-end">
//           <button
//             onClick={() => {
//               setEditingMeal(null);
//               setShowMealModal(true);
//             }}
//             className="bg-transparent border border-green-500 text-green-500 text-base hover:bg-emerald-500/10 rounded-full px-6 h-10 font-medium transition-colors"
//           >
//             + Add More
//           </button>
//         </div>

//         {/* Macro Summary */}
//         <div className="space-y-4">
//           <h2 className="text-3xl font-bold">Macro Summary</h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[#2d2d45] rounded-lg p-6">
//               <h3 className="mb-2 text-emerald-400">Calories</h3>
//               <p className="text-xl">
//                 Total: {macroSummary.calories.toLocaleString()} kcal
//               </p>
//             </div>

//             <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[#2d2d45] rounded-lg p-6">
//               <h3 className=" mb-2 text-blue-400">Protein</h3>
//               <p className="text-xl ">
//                 Total: {macroSummary.protein}g (
//                 {macroSummary.mealCount > 0
//                   ? Math.round(macroSummary.protein / macroSummary.mealCount)
//                   : 0}{" "}
//                 x {macroSummary.mealCount})
//               </p>
//             </div>

//             <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[#2d2d45] rounded-lg p-6">
//               <h3 className="text-gray-400  mb-2 text-yellow-400">Carbs</h3>
//               <p className="text-xl">
//                 Total: {macroSummary.carbs}g (
//                 {macroSummary.mealCount > 0
//                   ? Math.round(macroSummary.carbs / macroSummary.mealCount)
//                   : 0}{" "}
//                 x {macroSummary.mealCount})
//               </p>
//             </div>

//             <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[#2d2d45] rounded-lg p-6">
//               <h3 className="text-orange-400 mb-2">Fats</h3>
//               <p className="text-xl">
//                 Total: {macroSummary.fats}g (
//                 {macroSummary.mealCount > 0
//                   ? Math.round(macroSummary.fats / macroSummary.mealCount)
//                   : 0}{" "}
//                 x {macroSummary.mealCount})
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Meal Cards */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {activeDayMeals.map((meal) => (
//             <div
//               key={meal.id}
//               className="bg-gradient-to-br from-[#141424] to-[#0f0f1e] border border-[#222233] rounded-lg overflow-hidden"
//             >
//               <div className="p-6 space-y-4">
//                 {/* Meal Header */}
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-2">
//                       <span className="bg-emerald-600/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-medium">
//                         {meal.time}
//                       </span>
//                       <h3 className="text-xl font-bold flex items-center gap-2">
//                         {meal.mealsName}
//                         <span
//                           className={`px-3 py-1 rounded-full text-xs font-medium ${
//                             meal.day === "Training Day"
//                               ? "bg-emerald-900/30 text-emerald-300 border border-emerald-700/50"
//                               : meal.day === "Rest Day"
//                               ? "bg-gray-800/30 text-gray-300 border border-gray-700/50"
//                               : "bg-purple-900/30 text-purple-300 border border-purple-700/50"
//                           }`}
//                         >
//                           {meal.day}
//                         </span>
//                       </h3>
//                     </div>
//                     <p className="text-sm text-emerald-400">
//                       {meal.calories} kcal
//                     </p>
//                   </div>
//                   <div className="flex gap-2 flex-shrink-0">
//                     <button
//                       onClick={() => handleEditMeal(meal)}
//                       className="w-10 h-10 rounded-full bg-blue-600/20 border-2 border-blue-600 hover:bg-blue-600/30 flex items-center justify-center transition-all"
//                     >
//                       <Pencil className="w-4 h-4 text-blue-400" />
//                     </button>
//                     <button
//                       onClick={() => handleDeleteClick(meal.id)}
//                       className="w-10 h-10 rounded-full bg-red-600/20 border-2 border-red-600 hover:bg-red-600/30 flex items-center justify-center transition-all"
//                     >
//                       <Trash2 className="w-4 h-4 text-red-400" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Macros */}
//                 <div className="flex gap-2">
//                   <span className="bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full">
//                     P: {meal.protein}g
//                   </span>
//                   <span className="bg-yellow-600/20 text-yellow-400 text-xs px-3 py-1 rounded-full">
//                     C: {meal.carbs}g
//                   </span>
//                   <span className="bg-orange-600/20 text-orange-400 text-xs px-3 py-1 rounded-full">
//                     F: {meal.fats}g
//                   </span>
//                 </div>

//                 {/* Food Items */}
//                 <div className="pt-4 border-t border-[#2a2a2a]">
//                   <div className="space-y-2">
//                     {meal.foodItems.map((item, index) => (
//                       <div key={index} className="flex items-center gap-2">
//                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
//                         <span className="text-sm text-gray-300">{item}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {activeDayMeals.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg">
//               No meals added for {activeDay} yet.
//             </p>
//             <button
//               onClick={() => {
//                 setEditingMeal(null);
//                 setShowMealModal(true);
//               }}
//               className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
//             >
//               Add Your First Meal
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       <AddModal
//         open={showMealModal}
//         onOpenChange={(open) => {
//           setShowMealModal(open);
//           if (!open) setEditingMeal(null);
//         }}
//         onSave={handleSaveMeal}
//         editingMeal={editingMeal}
//         currentDay={activeDay}
//       />

//       <DeleteModal
//         isOpen={deleteModal.isOpen}
//         title="Delete Meal"
//         message="Are you sure you want to delete this meal? This action cannot be undone."
//         onConfirm={handleDeleteConfirm}
//         onCancel={() => setDeleteModal({ isOpen: false, id: null })}
//       />
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Search, Pencil, Trash2 } from "lucide-react";
import AddModal from "./AddModal";
import DeleteModal from "../../exerciseDatabase/deleteModal/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

import {
  getMealPlansByAthleteId,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
  clearMealPlanError,
  clearMealPlanSuccess,
  setFilterDay,
  normalizeTrainingDay,
  MealPlanWithTotals,
} from "@/redux/features/mealPlan/mealplanSlice";

// Types
type DayType = "training day" | "rest day" | "special day" | "All";

interface FoodItem {
  foodName: string;
  quantity: number;
}

interface MealData {
  id: string;
  mealName: string;
  food: FoodItem[];
  time: string;
  day: DayType;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  foodItems: string[];
}

export default function NutritionTab({ athleteId }: { athleteId: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { mealPlans, loading, error, successMessage, totals, filterDay } =
    useSelector((state: RootState) => state.mealPlan);

  const [activeDay, setActiveDay] = useState<DayType>("training day");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMealModal, setShowMealModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealData | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  // Fetch meal plans on component mount and when athleteId changes
  useEffect(() => {
    if (athleteId) {
      dispatch(getMealPlansByAthleteId(athleteId));
    }
  }, [dispatch, athleteId]);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        if (error) dispatch(clearMealPlanError());
        if (successMessage) dispatch(clearMealPlanSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage, dispatch]);

  // Filter meal plans based on active day
  const filteredMealPlans = mealPlans.filter((plan) => {
    if (filterDay === "All") return true;
    return normalizeTrainingDay(plan.trainingDay) === filterDay;
  });

  // Convert backend data to frontend format
  const convertToMealData = (plan: MealPlanWithTotals): MealData => {
    return {
      id: plan._id,
      mealName: plan.mealName,
      food: plan.food,
      time: plan.time,
      day: normalizeTrainingDay(plan.trainingDay) as DayType,
      calories: plan.totalCalories || 0,
      protein: plan.totalProtein || 0,
      carbs: plan.totalCarbs || 0,
      fats: plan.totalFats || 0,
      foodItems: plan.food.map(
        (item: FoodItem) => `${item.foodName} (${item.quantity}g)`
      ),
    };
  };

  // Convert filtered backend plans to MealData format
  const activeDayMeals = filteredMealPlans.map(convertToMealData);

  const handleDeleteClick = (id: string) => {
    setDeleteModal({ isOpen: true, id });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.id && athleteId) {
      try {
        await dispatch(
          deleteMealPlan({
            athleteId,
            planId: deleteModal.id,
          })
        ).unwrap();
      } catch (err) {
        console.error("Failed to delete meal plan:", err);
      }
    }
    setDeleteModal({ isOpen: false, id: null });
  };

  const handleEditMeal = (meal: MealData) => {
    setEditingMeal(meal);
    setShowMealModal(true);
  };

  const handleSaveMeal = async (mealData: MealData) => {
    if (!athleteId) return;

    const mealPlanData = {
      mealName: mealData.mealName,
      food: mealData.food.map((item) => ({
        foodName: item.foodName,
        quantity:
          typeof item.quantity === "string"
            ? parseInt(item.quantity) || 0
            : item.quantity,
      })),
      time: mealData.time,
      trainingDay: mealData.day,
    };

    try {
      if (editingMeal) {
        // Update existing meal
        await dispatch(
          updateMealPlan({
            athleteId,
            planId: editingMeal.id,
            data: mealPlanData,
          })
        ).unwrap();
      } else {
        // Create new meal
        await dispatch(
          createMealPlan({
            athleteId,
            data: mealPlanData,
          })
        ).unwrap();
      }
      setShowMealModal(false);
      setEditingMeal(null);
    } catch (err) {
      console.error("Failed to save meal plan:", err);
    }
  };

  const handleDayChange = (dayType: DayType) => {
    setActiveDay(dayType);
    dispatch(setFilterDay(dayType === "All" ? "All" : dayType));
  };

  const dayTypes: DayType[] = [
    "training day",
    "rest day",
    "special day",
    "All",
  ];

  const dayDisplayNames: Record<DayType, string> = {
    "training day": "Training Day",
    "rest day": "Rest Day",
    "special day": "Special Day",
    All: "All Days",
  };

  const getDayBadgeColor = (day: DayType) => {
    if (day === "training day") return "bg-emerald-500";
    if (day === "rest day") return "bg-gray-500";
    if (day === "special day") return "bg-purple-500";
    return "bg-blue-500";
  };

  // Calculate macro summary from filtered plans
  const macroSummary = {
    calories: activeDayMeals.reduce((sum, meal) => sum + meal.calories, 0),
    protein: activeDayMeals.reduce((sum, meal) => sum + meal.protein, 0),
    carbs: activeDayMeals.reduce((sum, meal) => sum + meal.carbs, 0),
    fats: activeDayMeals.reduce((sum, meal) => sum + meal.fats, 0),
    mealCount: activeDayMeals.length,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      {/* Error and Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500 rounded-lg text-emerald-300">
          {successMessage}
        </div>
      )}

      <div className="space-y-8">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search Here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 bg-[#111111] border border-[#2a2a2a] rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Day Type Tabs */}
        <div className="flex gap-3 flex-wrap">
          {dayTypes.map((dayType) => (
            <button
              key={dayType}
              onClick={() => handleDayChange(dayType)}
              className={`px-6 py-3 rounded-full font-medium transition-all text-sm ${
                activeDay === dayType
                  ? "bg-[#4f961f] hover:bg-[#3c7913]"
                  : "bg-transparent border border-gray-600 hover:bg-gray-800"
              }`}
            >
              {dayDisplayNames[dayType]}
            </button>
          ))}
        </div>

        {/* Add More Button */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              setEditingMeal(null);
              setShowMealModal(true);
            }}
            className="bg-transparent border border-green-500 text-green-500 text-base hover:bg-emerald-500/10 rounded-full px-6 h-10 font-medium transition-colors"
            disabled={loading}
          >
            {loading ? "Loading..." : "+ Add More"}
          </button>
        </div>

        {/* Macro Summary */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Macro Summary</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[#2d2d45] rounded-lg p-6">
              <h3 className="mb-2 text-emerald-400">Calories</h3>
              <p className="text-xl">
                Total: {macroSummary.calories.toLocaleString()} kcal
              </p>
              <p className="text-sm text-gray-400">
                Daily: {totals.totalCalories.toLocaleString()} kcal
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[#2d2d45] rounded-lg p-6">
              <h3 className="mb-2 text-blue-400">Protein</h3>
              <p className="text-xl">Total: {macroSummary.protein}g</p>
              <p className="text-sm text-gray-400">
                Daily: {totals.totalProtein}g
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[#2d2d45] rounded-lg p-6">
              <h3 className="mb-2 text-yellow-400">Carbs</h3>
              <p className="text-xl">Total: {macroSummary.carbs}g</p>
              <p className="text-sm text-gray-400">
                Daily: {totals.totalCarbs}g
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[#2d2d45] rounded-lg p-6">
              <h3 className="text-orange-400 mb-2">Fats</h3>
              <p className="text-xl">Total: {macroSummary.fats}g</p>
              <p className="text-sm text-gray-400">
                Daily: {totals.totalFats}g
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            <p className="mt-4 text-gray-400">Loading meal plans...</p>
          </div>
        )}

        {/* Meal Cards */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeDayMeals.map((meal) => (
              <div
                key={meal.id}
                className="bg-gradient-to-br from-[#141424] to-[#0f0f1e] border border-[#222233] rounded-lg overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  {/* Meal Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-emerald-600/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-medium">
                          {meal.time}
                        </span>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                          {meal.mealName}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              meal.day === "training day"
                                ? "bg-emerald-900/30 text-emerald-300 border border-emerald-700/50"
                                : meal.day === "rest day"
                                ? "bg-gray-800/30 text-gray-300 border border-gray-700/50"
                                : "bg-purple-900/30 text-purple-300 border border-purple-700/50"
                            }`}
                          >
                            {dayDisplayNames[meal.day]}
                          </span>
                        </h3>
                      </div>
                      <p className="text-sm text-emerald-400">
                        {meal.calories} kcal
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditMeal(meal)}
                        className="w-10 h-10 rounded-full bg-blue-600/20 border-2 border-blue-600 hover:bg-blue-600/30 flex items-center justify-center transition-all"
                        disabled={loading}
                      >
                        <Pencil className="w-4 h-4 text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(meal.id)}
                        className="w-10 h-10 rounded-full bg-red-600/20 border-2 border-red-600 hover:bg-red-600/30 flex items-center justify-center transition-all"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>

                  {/* Macros */}
                  <div className="flex gap-2">
                    <span className="bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full">
                      P: {meal.protein}g
                    </span>
                    <span className="bg-yellow-600/20 text-yellow-400 text-xs px-3 py-1 rounded-full">
                      C: {meal.carbs}g
                    </span>
                    <span className="bg-orange-600/20 text-orange-400 text-xs px-3 py-1 rounded-full">
                      F: {meal.fats}g
                    </span>
                  </div>

                  {/* Food Items */}
                  <div className="pt-4 border-t border-[#2a2a2a]">
                    <div className="space-y-2">
                      {meal.food.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                          <span className="text-sm text-gray-300">
                            {item.foodName} ({item.quantity}g)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && activeDayMeals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No meals added for {dayDisplayNames[activeDay]} yet.
            </p>
            <button
              onClick={() => {
                setEditingMeal(null);
                setShowMealModal(true);
              }}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              disabled={loading}
            >
              Add Your First Meal
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddModal
        open={showMealModal}
        onOpenChange={(open) => {
          setShowMealModal(open);
          if (!open) setEditingMeal(null);
        }}
        onSave={handleSaveMeal}
        editingMeal={editingMeal}
        currentDay={activeDay}
        loading={loading}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        title="Delete Meal"
        message="Are you sure you want to delete this meal? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, id: null })}
        // loading={loading}
      />
    </div>
  );
}
