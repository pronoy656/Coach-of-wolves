// import React from "react";

// export default function AddExerciseModal() {
//   return <div>AddExerciseModal</div>;
// }

"use client";

import type React from "react";
import { X, Loader } from "lucide-react";
import { useState, useEffect } from "react";

interface Exercise {
  id?: string;
  name: string;
  group?: string;
  category: string;
  subcategories: string[];
  iconName?: string;
  description: string;
  image?: File | null;
  video?: File | null;
  muscleGroup?: string;
  muscleGroups?: string[];
  equipment?: string;
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

export default function AddExerciseModal({
  exercise,
  onSave,
  onClose,
}: ExerciseModalProps) {
  const [formData, setFormData] = useState<Omit<Exercise, "id">>({
    name: "",
    group: "",
    category: "",
    subcategories: [],
    iconName: "",
    description: "",
    image: null,
    video: null,
    muscleGroup: "",
    equipment: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (exercise) {
      setFormData({
        name: exercise.name || "",
        group: exercise.group || "",
        category: exercise.category || "",
        subcategories: exercise.subcategories || [],
        iconName: exercise.iconName || "dumbbell",
        description: exercise.description || "",
        image: exercise.image || null,
        video: exercise.video || null,
        muscleGroup: exercise.muscleGroup || "",
        equipment: exercise.equipment || "",
      });
      setImagePreview(null);
      setVideoFile(null);
    } else {
      setFormData({
        name: "",
        group: "",
        category: "",
        subcategories: [],
        iconName: "dumbbell",
        description: "",
        image: null,
        video: null,
        muscleGroup: "",
        equipment: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      onSave(formData);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#08081A] border border-[#303245] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-none shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#303245] sticky top-0 bg-card/95 backdrop-blur-sm">
          <h2 className="text-2xl font-bold">
            {exercise ? "Edit Exercise" : "Add Exercise"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Row 1: Exercise Name, Group, Category */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">
                Exercise Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Barbell Bench Press"
                required
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">
                Group
              </label>
              <input
                type="text"
                name="group"
                value={formData.group}
                onChange={handleChange}
                placeholder="e.g. Compound"
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">
                Muscle Group *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
              >
                <option value="">Select a category...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">
              Equipment
            </label>
            <input
              type="text"
              name="equipment"
              value={formData.equipment || ""}
              onChange={handleChange}
              placeholder="e.g. Barbell, Dumbbell..."
              className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the exercise in detail..."
              className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
            />
          </div>

          {/* Subcategories */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-foreground">
              Sub Categories
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
                    className="w-5 h-5 rounded border-border bg-card accent-primary cursor-pointer"
                  />
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">
                    {subcat}
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
                Upload Image
              </label>
            </div>
            <label className="block w-full border-2 border-dashed border-green-500/60 rounded-lg p-8 text-center cursor-pointer hover:bg-primary/5 hover:border-primary transition-all">
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
                  Select or drag image file
                </span>
                <span className="text-xs text-[#65698b] -foreground mt-1">
                  PNG, JPG, GIF up to 10MB
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {imagePreview && (
              <div className="mt-4 relative rounded-lg overflow-hidden border border-border">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-32 object-cover"
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
                Upload Video
              </label>
            </div>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleVideoDrop}
              className="block w-full border-2 border-dashed border-green-500/60 rounded-lg p-8 text-center hover:bg-primary/5 hover:border-primary transition-all cursor-pointer"
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
                  Drag & drop video or click to browse
                </span>
                <span className="text-xs text-[#65698b] mt-1">
                  MP4, WebM up to 100MB
                </span>
              </div>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
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
            className="w-full  bg-[#4040D3] hover:bg-blue-700 disabled:bg-primary/60 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <span>{exercise ? "Update Exercise" : "Create Exercise"}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
