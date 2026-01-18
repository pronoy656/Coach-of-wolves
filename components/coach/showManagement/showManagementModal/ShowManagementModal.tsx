
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Show } from "@/redux/features/show/showTypes";
import { useAppSelector } from "@/redux/hooks";

interface ShowFormData {
  name: string;
  division: string;
  date: string;
  location: string;
}

interface ShowModalProps {
  show?: Show | null;
  onSave: (data: ShowFormData) => void;
  onClose: () => void;
  loading?: boolean;
}

const DIVISION_OPTIONS = [
  "Bodybuilding",
  "Lifestyle",
  "Classic Physique",
  "Men's Physique",
  "Women's Physique",
  "Bikini",
  "Figure",
  "Wellness",
  "Fitness",
  "212 Bodybuilding",
  "Other",
];

const translations = {
  en: {
    titleAdd: "Add Show",
    titleEdit: "Edit Show",
    nameLabel: "Show Name *",
    namePlaceholder: "Enter show name",
    divisionLabel: "Division *",
    divisionPlaceholder: "Select division",
    dateLabel: "Date *",
    dateHelp: "Select a future date for the show",
    locationLabel: "Location *",
    locationPlaceholder: "Enter show location",
    cancel: "Cancel",
    saveSaving: "Saving...",
    saveUpdate: "Update Show",
    saveAdd: "Add Show",
    errorNameRequired: "Show name is required",
    errorDivisionRequired: "Division is required",
    errorDateRequired: "Date is required",
    errorDatePast: "Date cannot be in the past",
    errorLocationRequired: "Location is required",
    divisionLabels: {
      Bodybuilding: "Bodybuilding",
      Lifestyle: "Lifestyle",
      "Classic Physique": "Classic Physique",
      "Men's Physique": "Men's Physique",
      "Women's Physique": "Women's Physique",
      Bikini: "Bikini",
      Figure: "Figure",
      Wellness: "Wellness",
      Fitness: "Fitness",
      "212 Bodybuilding": "212 Bodybuilding",
      Other: "Other",
    } as Record<string, string>,
  },
  de: {
    titleAdd: "Show hinzufügen",
    titleEdit: "Show bearbeiten",
    nameLabel: "Show-Name *",
    namePlaceholder: "Show-Namen eingeben",
    divisionLabel: "Division *",
    divisionPlaceholder: "Division auswählen",
    dateLabel: "Datum *",
    dateHelp: "Wähle ein zukünftiges Datum für die Show",
    locationLabel: "Ort *",
    locationPlaceholder: "Show-Ort eingeben",
    cancel: "Abbrechen",
    saveSaving: "Wird gespeichert...",
    saveUpdate: "Show aktualisieren",
    saveAdd: "Show hinzufügen",
    errorNameRequired: "Show-Name ist erforderlich",
    errorDivisionRequired: "Division ist erforderlich",
    errorDateRequired: "Datum ist erforderlich",
    errorDatePast: "Datum darf nicht in der Vergangenheit liegen",
    errorLocationRequired: "Ort ist erforderlich",
    divisionLabels: {
      Bodybuilding: "Bodybuilding",
      Lifestyle: "Lifestyle",
      "Classic Physique": "Classic Physique",
      "Men's Physique": "Men's Physique",
      "Women's Physique": "Women's Physique",
      Bikini: "Bikini",
      Figure: "Figure",
      Wellness: "Wellness",
      Fitness: "Fitness",
      "212 Bodybuilding": "212 Bodybuilding",
      Other: "Andere",
    } as Record<string, string>,
  },
};

export default function ShowManagementModal({
  show,
  onSave,
  onClose,
  loading = false,
}: ShowModalProps) {
  const [formData, setFormData] = useState<ShowFormData>({
    name: show?.name || "",
    division: show?.division || "",
    date: show?.date || "",
    location: show?.location || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { language } = useAppSelector((state) => state.language);
  const t = translations[language as keyof typeof translations];

  useEffect(() => {
    if (show) {
      setFormData({
        name: show.name,
        division: show.division,
        date: show.date.split('T')[0], // Format date for input
        location: show.location,
      });
    } else {
      setFormData({
        name: "",
        division: "",
        date: "",
        location: "",
      });
    }
    setErrors({});
  }, [show]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t.errorNameRequired;
    }

    if (!formData.division.trim()) {
      newErrors.division = t.errorDivisionRequired;
    }

    if (!formData.date.trim()) {
      newErrors.date = t.errorDateRequired;
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = t.errorDatePast;
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = t.errorLocationRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-[#08081A] border border-[#303245] rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {loading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 rounded-lg">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
          )}

          <h2 className="text-2xl font-bold mb-6 text-white">
            {show ? t.titleEdit : t.titleAdd}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-emerald-300">
                {t.nameLabel}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t.namePlaceholder}
                disabled={loading}
                className={`w-full px-4 py-2 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-colors disabled:opacity-50 ${errors.name ? "border-red-500" : "border-emerald-500/30 focus:border-emerald-500/60"
                  }`}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-emerald-300">
                {t.divisionLabel}
              </label>
              <select
                name="division"
                value={formData.division}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-2 bg-slate-800/50 border rounded-lg text-white focus:outline-none transition-colors appearance-none cursor-pointer disabled:opacity-50 ${errors.division ? "border-red-500" : "border-emerald-500/30 focus:border-emerald-500/60"
                  }`}
              >
                <option value="">{t.divisionPlaceholder}</option>
                {DIVISION_OPTIONS.map((division) => (
                  <option key={division} value={division}>
                    {t.divisionLabels[division] ?? division}
                  </option>
                ))}
              </select>
              {errors.division && (
                <p className="text-red-400 text-xs mt-1">{errors.division}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-emerald-300">
                {t.dateLabel}
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                disabled={loading}
                className={`w-full px-4 py-2 bg-slate-800/50 border rounded-lg text-white focus:outline-none transition-colors disabled:opacity-50 ${errors.date ? "border-red-500" : "border-emerald-500/30 focus:border-emerald-500/60"
                  }`}
              />
              {errors.date ? (
                <p className="text-red-400 text-xs mt-1">{errors.date}</p>
              ) : (
                <p className="text-gray-400 text-xs mt-1">
                  {t.dateHelp}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-emerald-300">
                {t.locationLabel}
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder={t.locationPlaceholder}
                disabled={loading}
                className={`w-full px-4 py-2 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-colors disabled:opacity-50 ${errors.location ? "border-red-500" : "border-emerald-500/30 focus:border-emerald-500/60"
                  }`}
              />
              {errors.location && (
                <p className="text-red-400 text-xs mt-1">{errors.location}</p>
              )}
            </div>

            <div className="flex gap-4 pt-6 border-t border-emerald-500/20">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white font-semibold hover:border-emerald-400 hover:bg-slate-800/70 transition-colors disabled:opacity-50"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg text-white font-semibold hover:from-emerald-400 hover:to-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? t.saveSaving
                  : show
                  ? t.saveUpdate
                  : t.saveAdd}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
