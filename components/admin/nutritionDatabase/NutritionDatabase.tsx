/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";
import {
  clearNutritionError,
  clearNutritionSuccess,
  createNutrition,
  CreateNutritionPayload,
  deleteNutrition,
  getAllNutritions,
  Nutrition,
  updateNutrition,
} from "@/redux/features/nutrition/nutritionSlice";

import NutritionCard from "./nutritionCard/NutritionCard";
import NutritionModal from "./nutritionModal/NutritionModal";
import DeleteModal from "@/components/coach/exerciseDatabase/deleteModal/DeleteModal";
import toast from "react-hot-toast";

export default function NutritionDatabase() {
  const dispatch = useDispatch<AppDispatch>();
  const { nutritions, loading, error, successMessage } = useAppSelector(
    (state) => state.nutrition
  );

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Load nutritions on component mount
  useEffect(() => {
    dispatch(getAllNutritions({ search: searchQuery }));
  }, [dispatch, searchQuery]);

  // Handle errors and success messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearNutritionError());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearNutritionSuccess());
    }
  }, [error, successMessage, dispatch]);

  const handleAddNutrition = () => {
    setEditingId(null);
    setShowModal(true);
  };

  const handleEditNutrition = (id: string) => {
    setEditingId(id);
    setShowModal(true);
  };

  const handleDeleteNutrition = (id: string) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      try {
        await dispatch(deleteNutrition(deletingId)).unwrap();
        toast.success("Nutrition item deleted successfully");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete nutrition item");
      }
    }
    setShowDeleteModal(false);
    setDeletingId(null);
  };

  const handleSaveNutrition = async (nutritionData: any) => {
    try {
      // Direct backend payload - no conversion needed
      const backendPayload: CreateNutritionPayload = {
        name: nutritionData.name,
        brand: nutritionData.brand || "",
        category: nutritionData.category,
        defaultQuantity: nutritionData.defaultQuantity,
        caloriesQuantity:
          nutritionData.caloriesQuantity || nutritionData.calories || 0,
        proteinQuantity:
          nutritionData.proteinQuantity || nutritionData.proteins || 0,
        fatsQuantity: nutritionData.fatsQuantity || nutritionData.fats || 0,
        carbsQuantity:
          nutritionData.carbsQuantity || nutritionData.carbohydrates || 0,
        sugarQuantity: nutritionData.sugarQuantity || nutritionData.sugar || 0,
        fiberQuantity: nutritionData.fiberQuantity || nutritionData.fiber || 0,
        saturatedFats: nutritionData.saturatedFats || 0,
        unsaturatedFats: nutritionData.unsaturatedFats || 0,
      };

      if (editingId) {
        await dispatch(
          updateNutrition({
            id: editingId,
            data: backendPayload,
          })
        ).unwrap();
        console.log("add");
        toast.success("Nutrition item updated successfully");
      } else {
        await dispatch(createNutrition(backendPayload)).unwrap();
        toast.success("Nutrition item created successfully");
      }

      setShowModal(false);
      setEditingId(null);
      // Refresh the list
      dispatch(getAllNutritions({ search: searchQuery }));
    } catch (error: any) {
      toast.error(error.message || "Failed to save nutrition item");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsSearching(value.length > 0);
  };

  // Find the nutrition being edited
  const editingNutrition = editingId
    ? nutritions.find((n) => n._id === editingId)
    : null;

  return (
    <div className="flex h-screen bg-background text-foreground dark">
      <div className="flex-1 overflow-hidden flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex flex-col gap-6 mb-8">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Nutrition Database</h1>
                <button
                  onClick={handleAddNutrition}
                  disabled={loading}
                  className="px-6 py-3 border-2 border-green-500 text-green-500 rounded-3xl hover:bg-green-500/10 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Add Nutrition
                </button>
              </div>
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Search nutrition items..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full px-4 py-3 bg-input border border-[#303245] rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                />
              </div>
            </div>

            {loading && nutritions.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A9E4A]"></div>
              </div>
            ) : nutritions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {isSearching
                    ? "No nutrition items found for your search."
                    : "No nutrition items found."}
                </p>
                <button
                  onClick={handleAddNutrition}
                  className="mt-4 px-6 py-3 border-2 border-[#4A9E4A] text-[#4A9E4A] rounded-3xl hover:bg-[#4A9E4A]/10 transition-colors font-medium"
                >
                  + Add Your First Nutrition
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {nutritions.map((nutrition) => (
                  <NutritionCard
                    key={nutrition._id}
                    nutrition={nutrition}
                    onEdit={() => handleEditNutrition(nutrition._id)}
                    onDelete={() => handleDeleteNutrition(nutrition._id)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <NutritionModal
          nutrition={editingNutrition}
          onSave={handleSaveNutrition}
          onClose={() => {
            setShowModal(false);
            setEditingId(null);
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          isOpen={showDeleteModal}
          title="Delete Nutrition"
          message="Are you sure you want to delete this nutrition? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeletingId(null);
          }}
        />
      )}
    </div>
  );
}
