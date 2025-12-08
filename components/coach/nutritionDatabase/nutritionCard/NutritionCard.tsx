"use client";

import { Trash } from "lucide-react";

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

interface NutritionCardProps {
  nutrition: Nutrition;
  onEdit: () => void;
  onDelete: () => void;
}

export default function NutritionCard({
  nutrition,
  onEdit,
  onDelete,
}: NutritionCardProps) {
  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: { bg: string; text: string } } = {
      Protein: { bg: "bg-red-500/20", text: "text-red-400" },
      Carbs: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
      Fats: { bg: "bg-orange-500/20", text: "text-orange-400" },
      Vegetables: { bg: "bg-green-500/20", text: "text-green-400" },
      Fruits: { bg: "bg-purple-500/20", text: "text-purple-400" },
      Dairy: { bg: "bg-blue-500/20", text: "text-blue-400" },
      Supplements: { bg: "bg-cyan-500/20", text: "text-cyan-400" },
      Other: { bg: "bg-gray-500/20", text: "text-gray-400" },
    };
    return colorMap[category] || { bg: "bg-primary/10", text: "text-primary" };
  };

  const categoryColor = getCategoryColor(nutrition.category);

  return (
    <div className="bg-[#08081A] border border-[#303245] rounded-lg p-6 hover:border-[#4A9E4A] transition">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">
            {nutrition.name}
          </h3>
          {nutrition.brand && (
            <p className="text-sm text-muted-foreground">{nutrition.brand}</p>
          )}
          <div className="mt-2 mb-2">
            <span
              className={`text-sm px-2 py-1 rounded ${categoryColor.bg} ${categoryColor.text}`}
            >
              {nutrition.category}
            </span>
          </div>
          <span className="font-semibold text-muted-foreground mt-2">
            <p>Default quantity: {nutrition.defaultQuantity}</p>
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"
            aria-label="Edit"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
            aria-label="Delete"
          >
            {/* <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v1a1 1 0 001 1h1.105l.894 12.748a2 2 0 001.991 1.748h9.018a2 2 0 001.991-1.748L19.894 7H21a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0015 2H9zM9 11a1 1 0 10-2 0v6a1 1 0 102 0v-6zm4 0a1 1 0 10-2 0v6a1 1 0 102 0v-6zm4 0a1 1 0 10-2 0v6a1 1 0 102 0v-6z" />
            </svg> */}
            <Trash className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-primary font-semibold">
          {nutrition.calories} kcal
        </span>
        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm">
          P: {nutrition.proteins}g
        </span>
        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm">
          C: {nutrition.carbohydrates}g
        </span>
        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm">
          Su: {nutrition.sugar}g
        </span>
        <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-sm">
          F: {nutrition.fats}g
        </span>
        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm">
          Fi: {nutrition.fiber}g
        </span>
        <span className="bg-gray-600/30 text-gray-300 px-2 py-1 rounded text-sm">
          Sat F: {nutrition.saturatedFats}g
        </span>
        <span className="bg-gray-600/30 text-gray-300 px-2 py-1 rounded text-sm">
          UnSat F: {nutrition.unsaturatedFats}g
        </span>
      </div>
    </div>
  );
}
