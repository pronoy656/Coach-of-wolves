"use client";

import type React from "react";
import { X, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks";

interface Exercise {
  id?: string;
  name: string;
  category: string;
  subcategories: string[];
  iconName?: string;
  description: string;
  image?: File | null;
  video?: File | null;
  muscleGroup: string;
  equipment: string;
  difficulty: string;
}

interface ExerciseModalProps {
  exercise?: Exercise | null;
  onSave: (exercise: Omit<Exercise, "id">) => void;
  onClose: () => void;
}

const CATEGORIES = [
  "Chest",
  "Neck",
  "Shoulders",
  "Arms",
  "Back",
  "Core",
  "Legs",
];
const SUBCATEGORIES = [
  "Chest",
  "Neck",
  "Shoulders",
  "Arms",
  "Back",
  "Core",
  "Legs",
  "Triceps",
];
const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"];

const translations = {
  en: {
    titleAdd: "Add Exercise",
    titleEdit: "Edit Exercise",
    nameLabel: "Exercise Name *",
    namePlaceholder: "e.g. Barbell Bench Press",
    muscleGroupLabel: "Muscle Group *",
    muscleGroupPlaceholder: "Select a muscle group...",
    difficultyLabel: "Difficulty Level *",
    difficultyPlaceholder: "Select difficulty...",
    equipmentLabel: "Equipment",
    equipmentPlaceholder: "e.g. Barbell, Dumbbell, Bodyweight...",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Describe the exercise in detail...",
    subcategoriesLabel: "Sub Categories",
    uploadImageLabel: "Upload Image",
    uploadImageText: "Select or drag image file",
    uploadImageHint: "PNG, JPG, GIF up to 10MB",
    uploadVideoLabel: "Upload Video",
    uploadVideoText: "Drag & drop video or click to browse",
    uploadVideoHint: "MP4, WebM up to 100MB",
    validationRequired:
      "Please fill in all required fields (Name, Muscle Group, and Difficulty)",
    submitSaving: "Saving...",
    submitCreate: "Create Exercise",
    submitUpdate: "Update Exercise",
    muscleGroupLabels: {
      Chest: "Chest",
      Neck: "Neck",
      Shoulders: "Shoulders",
      Arms: "Arms",
      Back: "Back",
      Core: "Core",
      Legs: "Legs",
    } as Record<string, string>,
    difficultyLabels: {
      Beginner: "Beginner",
      Intermediate: "Intermediate",
      Advanced: "Advanced",
    } as Record<string, string>,
    subcategoryLabels: {
      Chest: "Chest",
      Neck: "Neck",
      Shoulders: "Shoulders",
      Arms: "Arms",
      Back: "Back",
      Core: "Core",
      Legs: "Legs",
      Triceps: "Triceps",
    } as Record<string, string>,
  },
  de: {
    titleAdd: "Übung hinzufügen",
    titleEdit: "Übung bearbeiten",
    nameLabel: "Übungsname *",
    namePlaceholder: "z. B. Bankdrücken mit Langhantel",
    muscleGroupLabel: "Muskelgruppe *",
    muscleGroupPlaceholder: "Muskelgruppe auswählen...",
    difficultyLabel: "Schwierigkeitsgrad *",
    difficultyPlaceholder: "Schwierigkeitsgrad auswählen...",
    equipmentLabel: "Geräte",
    equipmentPlaceholder: "z. B. Langhantel, Kurzhantel, Eigengewicht...",
    descriptionLabel: "Beschreibung",
    descriptionPlaceholder: "Beschreibe die Übung im Detail...",
    subcategoriesLabel: "Unterkategorien",
    uploadImageLabel: "Bild hochladen",
    uploadImageText: "Bilddatei auswählen oder ziehen",
    uploadImageHint: "PNG, JPG, GIF bis 10 MB",
    uploadVideoLabel: "Video hochladen",
    uploadVideoText: "Video ziehen & ablegen oder klicken zum Auswählen",
    uploadVideoHint: "MP4, WebM bis 100 MB",
    validationRequired:
      "Bitte alle Pflichtfelder ausfüllen (Name, Muskelgruppe und Schwierigkeitsgrad)",
    submitSaving: "Speichern...",
    submitCreate: "Übung erstellen",
    submitUpdate: "Übung aktualisieren",
    muscleGroupLabels: {
      Chest: "Brust",
      Neck: "Nacken",
      Shoulders: "Schultern",
      Arms: "Arme",
      Back: "Rücken",
      Core: "Rumpf",
      Legs: "Beine",
    } as Record<string, string>,
    difficultyLabels: {
      Beginner: "Anfänger",
      Intermediate: "Mittelstufe",
      Advanced: "Fortgeschritten",
    } as Record<string, string>,
    subcategoryLabels: {
      Chest: "Brust",
      Neck: "Nacken",
      Shoulders: "Schultern",
      Arms: "Arme",
      Back: "Rücken",
      Core: "Rumpf",
      Legs: "Beine",
      Triceps: "Trizeps",
    } as Record<string, string>,
  },
};

export default function AddExerciseModal({
  exercise,
  onSave,
  onClose,
}: ExerciseModalProps) {
  const [formData, setFormData] = useState<Omit<Exercise, "id">>({
    name: "",
    category: "",
    subcategories: [],
    iconName: "",
    description: "",
    image: null,
    video: null,
    muscleGroup: "",
    equipment: "",
    difficulty: "Intermediate",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { language } = useAppSelector((state) => state.language);
  const t = translations[language as keyof typeof translations];

  useEffect(() => {
    if (exercise) {
      setFormData({
        name: exercise.name || "",
        category: exercise.category || "",
        subcategories: exercise.subcategories || [],
        iconName: exercise.iconName || "dumbbell",
        description: exercise.description || "",
        image: exercise.image || null,
        video: exercise.video || null,
        muscleGroup: exercise.muscleGroup || "",
        equipment: exercise.equipment || "",
        difficulty: exercise.difficulty || "Intermediate",
      });
      setImagePreview(null);
      setVideoFile(null);
    } else {
      setFormData({
        name: "",
        category: "",
        subcategories: [],
        iconName: "dumbbell",
        description: "",
        image: null,
        video: null,
        muscleGroup: "",
        equipment: "",
        difficulty: "Intermediate",
      });
      setImagePreview(null);
      setVideoFile(null);
    }
  }, [exercise]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setFormData((prev) => {
      const current = prev.subcategories || [];
      const isChecked = current.includes(subcategory);
      return {
        ...prev,
        subcategories: isChecked
          ? current.filter((s) => s !== subcategory)
          : [...current, subcategory],
      };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setFormData((prev) => ({
        ...prev,
        video: file,
      }));
      setVideoFile(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        video: file,
      }));
      setVideoFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.muscleGroup || !formData.difficulty) {
      alert(t.validationRequired);
      return;
    }

    setLoading(true);
    try {
      onSave(formData);
    } catch (error) {
      alert("Failed to save exercise. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#08081A] border border-[#303245] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-none shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#303245] sticky top-0 bg-card/95 backdrop-blur-sm">
          <h2 className="text-2xl font-bold">
            {exercise ? t.titleEdit : t.titleAdd}
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Row 1: Exercise Name and Muscle Group */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">
                {t.nameLabel}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t.namePlaceholder}
                required
                disabled={loading}
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A] disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">
                {t.muscleGroupLabel}
              </label>
              <select
                name="muscleGroup"
                value={formData.muscleGroup}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">{t.muscleGroupPlaceholder}</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {t.muscleGroupLabels[cat] ?? cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Difficulty and Equipment */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">
                {t.difficultyLabel}
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-[#303245] focus:border-[#4A9E4A] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">{t.difficultyPlaceholder}</option>
                {DIFFICULTY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {t.difficultyLabels[level] ?? level}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">
                {t.equipmentLabel}
              </label>
              <input
                type="text"
                name="equipment"
                value={formData.equipment}
                onChange={handleChange}
                placeholder={t.equipmentPlaceholder}
                disabled={loading}
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A] disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">
              {t.descriptionLabel}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t.descriptionPlaceholder}
              disabled={loading}
              rows={3}
              className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A] disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Subcategories */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-foreground">
              {t.subcategoriesLabel}
            </label>
            <div className="grid grid-cols-2 gap-4 bg-secondary border border-[#303245] rounded-lg p-4">
              {SUBCATEGORIES.map((subcat) => (
                <label
                  key={subcat}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={formData.subcategories.includes(subcat)}
                    onChange={() => handleSubcategoryChange(subcat)}
                    disabled={loading}
                    className="w-5 h-5 rounded border-border bg-card accent-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">
                    {t.subcategoryLabels[subcat] ?? subcat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Upload Image */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <label className="text-sm font-semibold text-foreground">
                {t.uploadImageLabel}
              </label>
            </div>
            <label
              className={`block w-full border-2 border-dashed border-green-500/60 rounded-lg p-8 text-center cursor-pointer hover:bg-primary/5 hover:border-primary transition-all ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="flex flex-col items-center">
                <svg
                  className="w-12 h-12 text-green-500/60 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-[#c6c9dd] font-medium">
                  {t.uploadImageText}
                </span>
                <span className="text-xs text-[#65698b] -foreground mt-1">
                  {t.uploadImageHint}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
                className="hidden"
              />
            </label>
            {imagePreview && (
              <div className="mt-4 relative rounded-lg overflow-hidden border border-border">
                <Image
                  src={imagePreview}
                  alt="Exercise preview"
                  width={400}
                  height={128}
                  className="w-full h-32 object-cover"
                  unoptimized // Required for data URLs/blobs
                />
              </div>
            )}
          </div>

          {/* Upload Video */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg
                className="w-5 h-5 "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <label className="text-sm font-semibold text-foreground">
                {t.uploadVideoLabel}
              </label>
            </div>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleVideoDrop}
              className={`block w-full border-2 border-dashed border-green-500/60 rounded-lg p-8 text-center hover:bg-primary/5 hover:border-primary transition-all cursor-pointer ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="flex flex-col items-center">
                <svg
                  className="w-12 h-12 text-green-500/60 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-[#c6c9dd] font-medium">
                  {t.uploadVideoText}
                </span>
                <span className="text-xs text-[#65698b] mt-1">
                  {t.uploadVideoHint}
                </span>
              </div>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                disabled={loading}
                className="hidden"
              />
            </div>
            {videoFile && (
              <div className="mt-3 text-sm font-medium text-primary flex items-center gap-2">
                ✓ {videoFile.name}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4040D3] hover:bg-blue-700 disabled:bg-primary/60 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                {t.submitSaving}
              </>
            ) : (
              <span>{exercise ? t.submitUpdate : t.submitCreate}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
