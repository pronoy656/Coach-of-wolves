// import React from "react";

// export default function nutritionDatabase() {
//   return <div>nutritionDatabase</div>;
// }

"use client";

import { useState } from "react";
import NutritionCard from "./nutritionCard/NutritionCard";
import NutritionModal from "./nutritionModal/NutritionModal";
import DeleteModal from "@/components/coach/exerciseDatabase/deleteModal/DeleteModal";
// import DeleteModal from "../exerciseDatabase/deleteModal/DeleteModal";

// import NutritionCard from "@/components/nutrition-card"
// import NutritionModal from "@/components/nutrition-modal"
// import DeleteConfirmationModal from "@/components/delete-confirmation-modal"

interface Nutrition {
  id: string;
  name: string;
  brand?: string;
  category: string;
  defaultQuantity: string;
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
  sugar: number;
  fiber: number;
  saturatedFats: number;
  unsaturatedFats: number;
}

export default function NutritionDatabase() {
  const [nutritions, setNutritions] = useState<Nutrition[]>([
    {
      id: "1",
      name: "Banana",
      category: "Fruits",
      defaultQuantity: "100g",
      calories: 105,
      proteins: 1,
      carbohydrates: 27,
      fats: 0,
      sugar: 14,
      fiber: 3,
      saturatedFats: 0,
      unsaturatedFats: 0,
    },
    {
      id: "2",
      name: "Chicken breast",
      category: "Protein",
      defaultQuantity: "100g",
      calories: 330,
      proteins: 62,
      carbohydrates: 0,
      fats: 7,
      sugar: 0,
      fiber: 0,
      saturatedFats: 2,
      unsaturatedFats: 2,
    },
    {
      id: "3",
      name: "Milk Shake",
      category: "Protein",
      defaultQuantity: "100g",
      calories: 330,
      proteins: 62,
      carbohydrates: 0,
      fats: 7,
      sugar: 0,
      fiber: 0,
      saturatedFats: 2,
      unsaturatedFats: 2,
    },
    {
      id: "4",
      name: "Oatmeal",
      category: "Carbohydrate",
      defaultQuantity: "100g",
      calories: 389,
      proteins: 17,
      carbohydrates: 66,
      fats: 7,
      sugar: 1,
      fiber: 11,
      saturatedFats: 1,
      unsaturatedFats: 5,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const confirmDelete = () => {
    if (deletingId) {
      setNutritions(nutritions.filter((n) => n.id !== deletingId));
    }
    setShowDeleteModal(false);
    setDeletingId(null);
  };

  const handleSaveNutrition = (nutrition: Nutrition) => {
    if (editingId) {
      setNutritions(
        nutritions.map((n) => (n.id === editingId ? nutrition : n))
      );
    } else {
      setNutritions([
        ...nutritions,
        { ...nutrition, id: Date.now().toString() },
      ]);
    }
    setShowModal(false);
    setEditingId(null);
  };

  const editingNutrition = editingId
    ? nutritions.find((n) => n.id === editingId)
    : null;

  return (
    <div className="flex h-screen bg-background text-foreground dark">
      <div className="flex-1 overflow-hidden flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Nutrition Database</h1>
              <button
                onClick={handleAddNutrition}
                className="px-6 py-3 border-2 border-[#4A9E4A] text-[#4A9E4A] rounded-3xl hover:bg-[#4A9E4A]/10 transition-colors font-medium"
              >
                + Add Nutrition
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {nutritions.map((nutrition) => (
                <NutritionCard
                  key={nutrition.id}
                  nutrition={nutrition}
                  onEdit={() => handleEditNutrition(nutrition.id)}
                  onDelete={() => handleDeleteNutrition(nutrition.id)}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <NutritionModal
          nutrition={editingNutrition || undefined}
          onSave={handleSaveNutrition}
          onClose={() => {
            setShowModal(false);
            setEditingId(null);
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
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
