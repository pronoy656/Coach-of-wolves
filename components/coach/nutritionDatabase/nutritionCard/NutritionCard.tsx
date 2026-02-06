"use client";

import { Edit, Trash } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

// Exact backend interface
interface Nutrition {
  _id: string;
  name: string;
  brand?: string;
  category: string;
  defaultQuantity: string;
  caloriesQuantity: number;
  proteinQuantity: number;
  fatsQuantity: number;
  carbsQuantity: number;
  sugarQuantity: number;
  fiberQuantity: number;
  saturatedFats: number;
  unsaturatedFats: number;
}

interface NutritionCardProps {
  nutrition: Nutrition;
  onEdit: () => void;
  onDelete: () => void;
}

const translations = {
  en: {
    brandName: "Brand Name:",
    defaultQuantity: "Default quantity:",
    kcal: "kcal",
    protein: "P:",
    carbs: "C:",
    sugar: "Su:",
    fats: "F:",
    fiber: "Fi:",
    saturatedFats: "Sat F:",
    unsaturatedFats: "UnSat F:",
    categoryLabels: {
      Protein: "Protein",
      Carbs: "Carbs",
      Fats: "Fats",
      Vegetables: "Vegetables",
      Fruits: "Fruits",
      Dairy: "Dairy",
      Supplements: "Supplements",
      Other: "Other",
    } as Record<string, string>,
  },
  de: {
    brandName: "Marke:",
    defaultQuantity: "Standardmenge:",
    kcal: "kcal",
    protein: "P:",
    carbs: "KH:",
    sugar: "Z:",
    fats: "F:",
    fiber: "B:",
    saturatedFats: "Ges. F:",
    unsaturatedFats: "Unges. F:",
    categoryLabels: {
      Protein: "Protein",
      Carbs: "Kohlenhydrate",
      Fats: "Fette",
      Vegetables: "Gemüse",
      Fruits: "Obst",
      Dairy: "Milchprodukte",
      Supplements: "Nahrungsergänzungen",
      Other: "Sonstiges",
    } as Record<string, string>,
  },
};

export default function NutritionCard({
  nutrition,
  onEdit,
  onDelete,
}: NutritionCardProps) {
  const { language } = useAppSelector((state) => state.language);
  const t = translations[language as keyof typeof translations];

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
            <p className="text-sm text-muted-foreground">
              {t.brandName}{" "}
              <span className="text-red-500">{nutrition.brand}</span>
            </p>
          )}
          <div className="mt-2 mb-2">
            <span
              className={`text-sm px-2 py-1 rounded ${categoryColor.bg} ${categoryColor.text}`}
            >
              {t.categoryLabels[nutrition.category] || nutrition.category}
            </span>
          </div>
          <span className="font-semibold text-muted-foreground mt-2">
            <p>
              {t.defaultQuantity} {nutrition.defaultQuantity}
            </p>
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"
            aria-label="Edit"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
            aria-label="Delete"
          >
            <Trash className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-primary font-semibold">
          {nutrition.caloriesQuantity} {t.kcal}
        </span>
        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm">
          {t.protein} {nutrition.proteinQuantity}g
        </span>
        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm">
          {t.carbs} {nutrition.carbsQuantity}g
        </span>
        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm">
          {t.sugar} {nutrition.sugarQuantity}g
        </span>
        <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-sm">
          {t.fats} {nutrition.fatsQuantity}g
        </span>
        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm">
          {t.fiber} {nutrition.fiberQuantity}g
        </span>
        <span className="bg-gray-600/30 text-gray-300 px-2 py-1 rounded text-sm">
          {t.saturatedFats} {nutrition.saturatedFats}g
        </span>
        <span className="bg-gray-600/30 text-gray-300 px-2 py-1 rounded text-sm">
          {t.unsaturatedFats} {nutrition.unsaturatedFats}g
        </span>
      </div>
    </div>
  );
}
