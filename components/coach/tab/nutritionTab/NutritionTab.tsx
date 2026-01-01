"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Search, Pencil, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import AddModal from "./AddModal";
import DeleteModal from "../../exerciseDatabase/deleteModal/DeleteModal";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchNutritionPlans,
  addNutritionPlan,
  updateNutritionPlan,
  deleteNutritionPlan,
  clearMessages,
} from "@/redux/features/tab/oneNutritionPlanSlice";
import { NutritionPlan } from "@/redux/features/tab/oneNutritionPlanType";

interface NutritionTabProps {
  athleteId: string;
}

export default function NutritionTab({ athleteId }: NutritionTabProps) {
  const dispatch = useAppDispatch();
  const { plans, totals, loading, error, successMessage } = useAppSelector(
    (state) => state.oneNutritionPlan
  );


  const [activeDay, setActiveDay] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMealModal, setShowMealModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState<NutritionPlan | null>(null);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  useEffect(() => {
    if (athleteId) {
      dispatch(fetchNutritionPlans(athleteId));
    }
  }, [dispatch, athleteId]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
    }
    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
  }, [error, successMessage, dispatch]);

  const activeDayMeals = plans.filter(
    (meal) =>
      (activeDay === "All" || meal.trainingDay === activeDay) &&
      (meal.mealName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meal.food.some((f) =>
          f.foodName.toLowerCase().includes(searchQuery.toLowerCase())
        ))
  );

  // Calculate macro summary for active day
  const macroSummary = {
    calories: activeDayMeals.reduce((sum, meal) => sum + (meal.totalCalories || 0), 0),
    protein: activeDayMeals.reduce((sum, meal) => sum + (meal.totalProtein || 0), 0),
    carbs: activeDayMeals.reduce((sum, meal) => sum + (meal.totalCarbs || 0), 0),
    fats: activeDayMeals.reduce((sum, meal) => sum + (meal.totalFats || 0), 0),
    mealCount: activeDayMeals.length,
  };

  const handleDeleteClick = (id: string) => {
    setDeleteModal({ isOpen: true, id });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.id && athleteId) {
      dispatch(deleteNutritionPlan({ planId: deleteModal.id, athleteId }))
        .unwrap()
        .then(() => dispatch(fetchNutritionPlans(athleteId)));
    }
    setDeleteModal({ isOpen: false, id: null });
  };

  const handleEditMeal = (meal: NutritionPlan) => {
    setEditingMeal(meal);
    setShowMealModal(true);
  };

  const handleSaveMeal = (mealData: any) => {
    if (editingMeal) {
      dispatch(
        updateNutritionPlan({
          planId: editingMeal._id,
          athleteId,
          data: mealData,
        })
      )
        .unwrap()
        .then(() => dispatch(fetchNutritionPlans(athleteId)));
      setEditingMeal(null);
    } else {
      dispatch(addNutritionPlan({ athleteId, data: mealData }))
        .unwrap()
        .then(() => dispatch(fetchNutritionPlans(athleteId)));
    }
    setShowMealModal(false);
  };


  const dayTypes = [
    { label: "All", value: "All" },
    { label: "Training Day", value: "training day" },
    { label: "Rest Day", value: "rest day" },
    { label: "Special Day", value: "special day" },
  ];

  const getDayBadgeColor = (day: string) => {
    if (day === "training day") return "bg-emerald-500";
    if (day === "rest day") return "bg-gray-500";
    return "bg-purple-500";
  };


  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
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
        <div className="flex gap-3">
          {dayTypes.map((dayType) => (
            <button
              key={dayType.value}
              onClick={() => setActiveDay(dayType.value)}
              className={`px-6 py-3 rounded-full font-medium transition-all text-sm ${activeDay === dayType.value
                ? "bg-[#4f961f] hover:bg-[#3c7913]"
                : "bg-transparent border border-gray-600 hover:bg-gray-800"
                }`}
            >
              {dayType.label}
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
          >
            + Add More
          </button>
        </div>

        {/* Macro Summary */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Macro Summary</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[#2d2d45] rounded-lg p-6">
              <h3 className="mb-2 text-emerald-400">Calories</h3>
              <p className="text-xl">
                {totals.totalCalories.toLocaleString()} kcal
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[#2d2d45] rounded-lg p-6">
              <h3 className=" mb-2 text-blue-400">Protein</h3>
              <p className="text-xl">{totals.totalProtein}g</p>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[#2d2d45] rounded-lg p-6">
              <h3 className="mb-2 text-yellow-400">Carbs</h3>
              <p className="text-xl">{totals.totalCarbs}g</p>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[#2d2d45] rounded-lg p-6">
              <h3 className="text-orange-400 mb-2">Fats</h3>
              <p className="text-xl">{totals.totalFats}g</p>
            </div>
          </div>
        </div>

        {/* Meal Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeDayMeals.map((meal) => (
            <div
              key={meal._id}
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
                          className={`px-3 py-1 rounded-full text-xs font-medium ${meal.trainingDay === "training day"
                            ? "bg-emerald-900/30 text-emerald-300 border border-emerald-700/50"
                            : meal.trainingDay === "rest day"
                              ? "bg-gray-800/30 text-gray-300 border border-gray-700/50"
                              : "bg-purple-900/30 text-purple-300 border border-purple-700/50"
                            }`}
                        >
                          {meal.trainingDay === "training day" ? "Training Day" : meal.trainingDay === "rest day" ? "Rest Day" : "Special Day"}
                        </span>
                      </h3>
                    </div>
                    <p className="text-sm text-emerald-400">
                      {meal.totalCalories} kcal
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEditMeal(meal)}
                      className="w-10 h-10 rounded-full bg-blue-600/20 border-2 border-blue-600 hover:bg-blue-600/30 flex items-center justify-center transition-all"
                    >
                      <Pencil className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(meal._id)}
                      className="w-10 h-10 rounded-full bg-red-600/20 border-2 border-red-600 hover:bg-red-600/30 flex items-center justify-center transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Macros */}
                <div className="flex gap-2">
                  <span className="bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full">
                    P: {meal.totalProtein}g
                  </span>
                  <span className="bg-yellow-600/20 text-yellow-400 text-xs px-3 py-1 rounded-full">
                    C: {meal.totalCarbs}g
                  </span>
                  <span className="bg-orange-600/20 text-orange-400 text-xs px-3 py-1 rounded-full">
                    F: {meal.totalFats}g
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

        {activeDayMeals.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No meals added for {dayTypes.find(d => d.value === activeDay)?.label} yet.
            </p>
            <button
              onClick={() => {
                setEditingMeal(null);
                setShowMealModal(true);
              }}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
        currentDay={activeDay === "All" ? "training day" : activeDay}
        loading={loading}
      />


      <DeleteModal
        isOpen={deleteModal.isOpen}
        title="Delete Meal"
        message="Are you sure you want to delete this meal? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, id: null })}
      />
    </div>
  );
}

