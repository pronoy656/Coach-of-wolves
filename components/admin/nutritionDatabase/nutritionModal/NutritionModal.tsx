"use client";

import { Loader, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";

// Exact backend interface
interface Nutrition {
  _id?: string;
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

interface NutritionModalProps {
  nutrition?: Nutrition | null;
  onSave: (nutrition: Nutrition) => void;
  onClose: () => void;
}

const CATEGORIES = [
  "Protein",
  "Carbs",
  "Fats",
  "Vegetables",
  "Fruits",
  "Dairy",
  "Supplements",
  "Other",
];

const translations = {
  en: {
    headingAdd: "Add Nutrition",
    headingEdit: "Edit Nutrition",
    fieldFoodName: "Food Name",
    placeholderFoodName: "Insert a food name",
    fieldBrand: "Brand (Optional)",
    placeholderBrand: "Insert a brand name",
    fieldCategory: "Category",
    selectCategory: "Select category",
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
    defaultQuantityLabel: "Default quantity(100g, 1pcs)",
    caloriesLabel: "Calories per default quantity",
    proteinsLabel: "Proteins per default quantity",
    carbsLabel: "Carbohydrates per default quantity",
    fatsLabel: "Fats per default quantity",
    sugarLabel: "Sugar default quantity",
    fiberLabel: "Fiber default quantity",
    saturatedFatsLabel: "Saturated fats default quantity",
    unsaturatedFatsLabel: "Unsaturated fats default quantity",
    placeholderValue: "Insert a value",
    alertRequired: "Please fill in all required fields",
    alertSaveFailed: "Failed to save nutrition. Please try again.",
    saveButton: "Save",
    saveButtonLoading: "Saving...",
  },
  de: {
    headingAdd: "Ernährungseintrag hinzufügen",
    headingEdit: "Ernährungseintrag bearbeiten",
    fieldFoodName: "Lebensmittelname",
    placeholderFoodName: "Lebensmittelname eingeben",
    fieldBrand: "Marke (optional)",
    placeholderBrand: "Markennamen eingeben",
    fieldCategory: "Kategorie",
    selectCategory: "Kategorie auswählen",
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
    defaultQuantityLabel: "Standardmenge (100 g, 1 Stk.)",
    caloriesLabel: "Kalorien pro Standardmenge",
    proteinsLabel: "Proteine pro Standardmenge",
    carbsLabel: "Kohlenhydrate pro Standardmenge",
    fatsLabel: "Fette pro Standardmenge",
    sugarLabel: "Zucker pro Standardmenge",
    fiberLabel: "Ballaststoffe pro Standardmenge",
    saturatedFatsLabel: "Gesättigte Fette pro Standardmenge",
    unsaturatedFatsLabel: "Ungesättigte Fette pro Standardmenge",
    placeholderValue: "Wert eingeben",
    alertRequired: "Bitte fülle alle Pflichtfelder aus",
    alertSaveFailed: "Speichern fehlgeschlagen. Bitte versuche es erneut.",
    saveButton: "Speichern",
    saveButtonLoading: "Speichern...",
  },
};

export default function NutritionModal({
  nutrition,
  onSave,
  onClose,
}: NutritionModalProps) {
  const [formData, setFormData] = useState<Nutrition>(
    nutrition || {
      name: "",
      brand: "",
      category: "",
      defaultQuantity: "100g",
      caloriesQuantity: 0,
      proteinQuantity: 0,
      fatsQuantity: 0,
      carbsQuantity: 0,
      sugarQuantity: 0,
      fiberQuantity: 0,
      saturatedFats: 0,
      unsaturatedFats: 0,
    }
  );

  const [loading, setLoading] = useState(false);
  const isVisible = true;
  const { language } = useAppSelector((state) => state.language);
  const t = translations[language as keyof typeof translations];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: [
        "caloriesQuantity",
        "proteinQuantity",
        "fatsQuantity",
        "carbsQuantity",
        "sugarQuantity",
        "fiberQuantity",
        "saturatedFats",
        "unsaturatedFats",
      ].includes(name)
        ? Number.parseFloat(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category) {
      alert(t.alertRequired);
      return;
    }

    setLoading(true);
    try {
      onSave(formData);
    } catch (error) {
      setLoading(false);
      alert(t.alertSaveFailed);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className={`bg-[#08081A] border border-[#303245] rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto transition-all duration-300 transform ${
            isVisible
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {nutrition ? t.headingEdit : t.headingAdd}
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-red-500 rounded transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 ">
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {t.fieldFoodName}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t.placeholderFoodName}
                      className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {t.fieldBrand}
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand || ""}
                      onChange={handleChange}
                      placeholder={t.placeholderBrand}
                      className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {t.fieldCategory}
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-input border border-[#303245] rounded px-3 py-2 text-foreground focus:border-[#4A9E4A] focus:ring-2 focus:ring-primary"
                    >
                      <option
                        value=""
                        style={{ backgroundColor: "#1E1F25", color: "white" }}
                      >
                        {t.selectCategory}
                      </option>
                      {CATEGORIES.map((cat) => (
                        <option
                          key={cat}
                          value={cat}
                          style={{ backgroundColor: "#1E1F25" }}
                        >
                          {t.categoryLabels[cat] ?? cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {t.defaultQuantityLabel}
                    </label>
                    <input
                      type="text"
                      name="defaultQuantity"
                      value={formData.defaultQuantity}
                      onChange={handleChange}
                      placeholder={t.placeholderValue}
                      className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {t.caloriesLabel}
                    </label>
                    <input
                      type="number"
                      name="caloriesQuantity"
                      value={formData.caloriesQuantity}
                      onChange={handleChange}
                      placeholder={t.placeholderValue}
                      className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {t.proteinsLabel}
                    </label>
                    <input
                      type="number"
                      name="proteinQuantity"
                      value={formData.proteinQuantity}
                      onChange={handleChange}
                      placeholder={t.placeholderValue}
                      className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {t.carbsLabel}
                    </label>
                    <input
                      type="number"
                      name="carbsQuantity"
                      value={formData.carbsQuantity}
                      onChange={handleChange}
                      placeholder={t.placeholderValue}
                      className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {t.fatsLabel}
                    </label>
                    <input
                      type="number"
                      name="fatsQuantity"
                      value={formData.fatsQuantity}
                      onChange={handleChange}
                      placeholder={t.placeholderValue}
                      className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {t.sugarLabel}
                    </label>
                    <input
                      type="number"
                      name="sugarQuantity"
                      value={formData.sugarQuantity}
                      onChange={handleChange}
                      placeholder={t.placeholderValue}
                      className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {t.fiberLabel}
                    </label>
                    <input
                      type="number"
                      name="fiberQuantity"
                      value={formData.fiberQuantity}
                      onChange={handleChange}
                      placeholder={t.placeholderValue}
                      className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2"></label>
                    <div />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {t.saturatedFatsLabel}
                    </label>
                    <input
                      type="number"
                      name="saturatedFats"
                      value={formData.saturatedFats}
                      onChange={handleChange}
                      placeholder={t.placeholderValue}
                      className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {t.unsaturatedFatsLabel}
                    </label>
                    <input
                      type="number"
                      name="unsaturatedFats"
                      value={formData.unsaturatedFats}
                      onChange={handleChange}
                      placeholder={t.placeholderValue}
                      className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-9 w-full flex items-center justify-center bg-[#4040D3] hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      {t.saveButtonLoading}
                    </>
                  ) : (
                    t.saveButton
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
