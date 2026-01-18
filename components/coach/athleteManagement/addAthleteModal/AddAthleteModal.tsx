"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { Athlete } from "@/redux/features/coachAthletes/coachAthletesType";
import { useAppSelector } from "@/redux/hooks";

interface AthleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (athlete: Partial<Athlete>) => void;
  athlete?: Athlete | null;
}

const STATUS_OPTIONS = ["Natural", "Enhanced"];
const PHASE_OPTIONS = [
  "Pre-Prep",
  "Offseason",
  "Peak Week",
  "Prep",
  "Diet-Break",
  "Fat-Reduction Phase",
  "Reverse-Diet-Phase",
];
const CATEGORY_MALE = [
  "Lifestyle",
  "Men's Physique",
  "Classic Physique",
  "212 Bodybuilding",
  "Bodybuilding",
  "Other",
];
const CATEGORY_FEMALE = [
  "Lifestyle",
  "Fitmodel",
  "Bikini",
  "Figure",
  "Wellness",
  "Women's Physique",
  "Women's Bodybuilding",
  "Other",
];
const CHECK_IN_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const translations = {
  en: {
    titleAdd: "Add Athlete",
    titleEdit: "Edit Athlete",
    nameLabel: "Name *",
    namePlaceholder: "Enter name",
    emailLabel: "Email *",
    emailPlaceholder: "Enter email",
    genderLabel: "Gender",
    genderMale: "Male",
    genderFemale: "Female",
    weightLabel: "Weight (kg)",
    weightPlaceholder: "Enter weight",
    heightLabel: "Height (cm)",
    heightPlaceholder: "Enter height",
    statusLabel: "Status",
    statusNatural: "Natural",
    statusEnhanced: "Enhanced",
    trainingStepsLabel: "Training Day Steps",
    trainingStepsPlaceholder: "Enter steps",
    restStepsLabel: "Rest Day Steps",
    restStepsPlaceholder: "Enter steps",
    categoryLabel: "Category",
    categoryPlaceholder: "Select category",
    phaseLabel: "Phase",
    phaseLabels: {
      "Pre-Prep": "Pre-Prep",
      Offseason: "Offseason",
      "Peak Week": "Peak Week",
      Prep: "Prep",
      "Diet-Break": "Diet-Break",
      "Fat-Reduction Phase": "Fat-Reduction Phase",
      "Reverse-Diet-Phase": "Reverse-Diet-Phase",
    } as Record<string, string>,
    ageLabel: "Age",
    agePlaceholder: "Enter age",
    checkinLabel: "Check in Day",
    checkinDays: {
      Monday: "Monday",
      Tuesday: "Tuesday",
      Wednesday: "Wednesday",
      Thursday: "Thursday",
      Friday: "Friday",
      Saturday: "Saturday",
      Sunday: "Sunday",
    } as Record<string, string>,
    waterLabel: "Water Quantity (Liters)",
    waterPlaceholder: "Enter daily water intake",
    goalLabel: "Goal",
    goalPlaceholder: "Enter goal",
    uploadLabel: "Upload Image",
    uploadButton: "Select File",
    cancel: "Cancel",
    save: "Save",
    validationMissing: "Name and email are required.",
  },
  de: {
    titleAdd: "Athlet hinzufügen",
    titleEdit: "Athlet bearbeiten",
    nameLabel: "Name *",
    namePlaceholder: "Name eingeben",
    emailLabel: "E-Mail *",
    emailPlaceholder: "E-Mail eingeben",
    genderLabel: "Geschlecht",
    genderMale: "Männlich",
    genderFemale: "Weiblich",
    weightLabel: "Gewicht (kg)",
    weightPlaceholder: "Gewicht eingeben",
    heightLabel: "Größe (cm)",
    heightPlaceholder: "Größe eingeben",
    statusLabel: "Status",
    statusNatural: "Natural",
    statusEnhanced: "Enhanced",
    trainingStepsLabel: "Schritte Trainingstag",
    trainingStepsPlaceholder: "Schritte eingeben",
    restStepsLabel: "Schritte Ruhetag",
    restStepsPlaceholder: "Schritte eingeben",
    categoryLabel: "Kategorie",
    categoryPlaceholder: "Kategorie auswählen",
    phaseLabel: "Phase",
    phaseLabels: {
      "Pre-Prep": "Pre-Prep",
      Offseason: "Offseason",
      "Peak Week": "Peak Week",
      Prep: "Prep",
      "Diet-Break": "Diet-Break",
      "Fat-Reduction Phase": "Fat-Reduction Phase",
      "Reverse-Diet-Phase": "Reverse-Diet-Phase",
    } as Record<string, string>,
    ageLabel: "Alter",
    agePlaceholder: "Alter eingeben",
    checkinLabel: "Check-in-Tag",
    checkinDays: {
      Monday: "Montag",
      Tuesday: "Dienstag",
      Wednesday: "Mittwoch",
      Thursday: "Donnerstag",
      Friday: "Freitag",
      Saturday: "Samstag",
      Sunday: "Sonntag",
    } as Record<string, string>,
    waterLabel: "Wassermenge (Liter)",
    waterPlaceholder: "Tägliche Wasserzufuhr eingeben",
    goalLabel: "Ziel",
    goalPlaceholder: "Ziel eingeben",
    uploadLabel: "Bild hochladen",
    uploadButton: "Datei auswählen",
    cancel: "Abbrechen",
    save: "Speichern",
    validationMissing: "Name und E-Mail sind erforderlich.",
  },
};

export default function AddAthleteModal({
  isOpen,
  onClose,
  onSave,
  athlete,
}: AthleteModalProps) {
  const { language } = useAppSelector((state) => state.language);
  const t = translations[language as keyof typeof translations];
  const [formData, setFormData] = useState<Partial<Athlete>>({
    name: "",
    category: "",
    phase: "Offseason",
    weight: 1,
    height: 1,
    status: "Natural",
    gender: "Male",
    email: "",
    age: 1,
    trainingDaySteps: 1,
    restDaySteps: 1,
    checkInDay: "Monday",
    waterQuantity: 1,
    goal: "",
    image: "",
    isActive: "Active",
    role: "ATHLETE",
  });

  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (athlete) {
      setFormData(athlete);
      if (athlete.image) {
        setImagePreview(athlete.image);
      } else {
        setImagePreview("");
      }
    } else {
      setFormData({
        name: "",
        category: "",
        phase: "Offseason",
        weight: 0,
        height: 0,
        status: "Natural",
        gender: "Male",
        email: "",
        age: 0,
        trainingDaySteps: 0,
        restDaySteps: 0,
        checkInDay: "Monday",
        waterQuantity: 0, // ✅ NEW
        goal: "",
        image: "",
      });
      setImagePreview("");
    }
  }, [athlete, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: [
        "weight",
        "height",
        "age",
        "trainingDaySteps",
        "restDaySteps",
        "waterQuantity",
      ].includes(name)
        ? Number(value) || 0
        : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData((prev) => ({
          ...prev,
          image: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      console.log("[v0] Missing required fields");
      return;
    }
    onSave(formData);
    setImagePreview("");
  };

  const categoryOptions =
    formData.gender === "Male" ? CATEGORY_MALE : CATEGORY_FEMALE;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 ">
      <div className="bg-[#08081A] border border-[#303245]  max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-none">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#303245] backdrop-blur-sm  sticky top-0 bg-[#08081A]">
          <h2 className="text-2xl font-bold text-white">
            {athlete ? t.titleEdit : t.titleAdd}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-500/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-emerald-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                {t.nameLabel}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t.namePlaceholder}
                required
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                {t.emailLabel}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t.emailPlaceholder}
                required
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                {t.genderLabel}
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500/60 transition-colors appearance-none cursor-pointer"
              >
                <option value="Male">{t.genderMale}</option>
                <option value="Female">{t.genderFemale}</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                {t.weightLabel}
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder={t.weightPlaceholder}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                {t.heightLabel}
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder={t.heightPlaceholder}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                {t.statusLabel}
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500/60 transition-colors appearance-none cursor-pointer"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status === "Natural" ? t.statusNatural : t.statusEnhanced}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                {t.trainingStepsLabel}
              </label>
              <input
                type="number"
                name="trainingDaySteps"
                value={formData.trainingDaySteps}
                onChange={handleChange}
                placeholder={t.trainingStepsPlaceholder}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                {t.restStepsLabel}
              </label>
              <input
                type="number"
                name="restDaySteps"
                value={formData.restDaySteps}
                onChange={handleChange}
                placeholder={t.restStepsPlaceholder}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                {t.categoryLabel}
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500/60 transition-colors appearance-none cursor-pointer"
              >
                <option value="">{t.categoryPlaceholder}</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                {t.phaseLabel}
              </label>
              <select
                name="phase"
                value={formData.phase}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500/60 transition-colors appearance-none cursor-pointer"
              >
                {PHASE_OPTIONS.map((phase) => (
                  <option key={phase} value={phase}>
                    {t.phaseLabels[phase] ?? phase}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                {t.ageLabel}
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder={t.agePlaceholder}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                {t.checkinLabel}
              </label>
              <select
                name="checkInDay"
                value={formData.checkInDay}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500/60 transition-colors appearance-none cursor-pointer"
              >
                {CHECK_IN_DAYS.map((day) => (
                  <option key={day} value={day}>
                    {t.checkinDays[day] ?? day}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-emerald-300 mb-2">
              {t.waterLabel}
            </label>
            <input
              type="number"
              name="waterQuantity"
              value={formData.waterQuantity}
              onChange={handleChange}
              placeholder={t.waterPlaceholder}
              className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
            />
          </div>

          {/* Goal */}
          <div>
            <label className="block text-sm font-semibold text-emerald-300 mb-2">
              {t.goalLabel}
            </label>
            <textarea
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder={t.goalPlaceholder}
              rows={3}
              className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors resize-none"
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className="block text-sm font-semibold text-emerald-300 mb-3">
              {t.uploadLabel}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer block">
              <div className="w-full px-6 py-8 bg-linear-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/40 rounded-lg hover:border-emerald-400/60 transition-colors flex flex-col items-center justify-center gap-3 group">
                <div className="p-3 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                  <Upload className="w-6 h-6 text-emerald-400" />
                </div>
                <span className="text-white font-semibold">
                  {t.uploadButton}
                </span>
              </div>
            </label>

            {imagePreview && (
              <div className="mt-4 relative">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-emerald-500/40"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview("");
                    setFormData((prev) => ({ ...prev, image: "" }));
                  }}
                  className="absolute top-2 right-2 p-1 bg-rose-500/80 hover:bg-rose-600 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-emerald-500/20">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white font-semibold hover:border-emerald-400 hover:bg-slate-800/70 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 rounded-lg text-white font-semibold hover:from-emerald-400 hover:to-emerald-500 transition-colors disabled:opacity-50"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
