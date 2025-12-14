// import React from 'react'

// export default function AddModal() {
//   return (
//     <div>AddModal</div>
//   )
// }

"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { X, Clock, Plus, Trash2 } from "lucide-react";

type DayType = "Training Day" | "Rest Day" | "Special Day";

interface MealData {
  id: string;
  mealsName: string;
  foodNames: string[];
  time: string;
  day: DayType;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  foodItems: string[];
}

interface MealModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (meal: MealData) => void;
  editingMeal: MealData | null;
  currentDay: DayType;
}

export default function AddModal({
  open,
  onOpenChange,
  onSave,
  editingMeal,
  currentDay,
}: MealModalProps) {
  const [formData, setFormData] = useState({
    mealsName: "",
    foodNames: [""],
    time: "",
    day: currentDay as DayType,
  });

  useEffect(() => {
    if (editingMeal) {
      setFormData({
        mealsName: editingMeal.mealsName,
        foodNames:
          editingMeal.foodNames.length > 0 ? editingMeal.foodNames : [""],
        time: editingMeal.time,
        day: editingMeal.day,
      });
    } else {
      setFormData({
        mealsName: "",
        foodNames: [""],
        time: "",
        day: currentDay,
      });
    }
  }, [editingMeal, open, currentDay]);

  const handleAddFoodName = () => {
    setFormData({ ...formData, foodNames: [...formData.foodNames, ""] });
  };

  const handleRemoveFoodName = (index: number) => {
    const newFoodNames = formData.foodNames.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      foodNames: newFoodNames.length > 0 ? newFoodNames : [""],
    });
  };

  const handleFoodNameChange = (index: number, value: string) => {
    const newFoodNames = [...formData.foodNames];
    newFoodNames[index] = value;
    setFormData({ ...formData, foodNames: newFoodNames });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mealData: MealData = {
      id: editingMeal?.id || Date.now().toString(),
      mealsName: formData.mealsName,
      foodNames: formData.foodNames.filter((name) => name.trim() !== ""),
      time: formData.time,
      day: formData.day,
      calories: editingMeal?.calories || 550,
      protein: editingMeal?.protein || 35,
      carbs: editingMeal?.carbs || 75,
      fats: editingMeal?.fats || 5,
      foodItems: editingMeal?.foodItems || ["Sample food item"],
    };

    onSave(mealData);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/80"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative bg-[#0f0f1e] border border-emerald-500/30 rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {editingMeal ? "Edit Meal" : "Add New Meal"}
            </h2>
            <button
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Meals Name
              </label>
              <input
                type="text"
                placeholder="Type.."
                value={formData.mealsName}
                onChange={(e) =>
                  setFormData({ ...formData, mealsName: e.target.value })
                }
                className="w-full bg-[#08081A] border border-[#303245] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Food Name
              </label>
              <div className="space-y-2">
                {formData.foodNames.map((foodName, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type.."
                      value={foodName}
                      onChange={(e) =>
                        handleFoodNameChange(index, e.target.value)
                      }
                      className="flex-1 bg-[#08081A] border border-[#303245] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                    />
                    {formData.foodNames.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFoodName(index)}
                        className="w-10 h-10 rounded-lg bg-red-600/20 border border-red-600 hover:bg-red-600/30 flex items-center justify-center transition-all flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    )}
                    {index === formData.foodNames.length - 1 && (
                      <button
                        type="button"
                        onClick={handleAddFoodName}
                        className="w-10 h-10 rounded-lg bg-emerald-600/20 border border-emerald-600 hover:bg-emerald-600/30 flex items-center justify-center transition-all flex-shrink-0"
                      >
                        <Plus className="w-4 h-4 text-emerald-400" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    placeholder="Type.."
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className="w-full bg-[#08081A] border border-[#303245] rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Day</label>
                <select
                  value={formData.day}
                  onChange={(e) =>
                    setFormData({ ...formData, day: e.target.value as DayType })
                  }
                  className="w-full bg-[#08081A] border border-[#303245] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                  required
                >
                  <option value="Training Day">Training Day</option>
                  <option value="Rest Day">Rest Day</option>
                  <option value="Special Day">Special Day</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
