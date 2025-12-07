"use client";

import type React from "react";
import { X, Loader } from "lucide-react";
import { useState, useEffect } from "react";

interface Exercise {
  id: string;
  name: string;
  group: string;
  category: string;
  subcategories: string[];
  iconName: string;
  description: string;
  image?: File | null;
  video?: File | null;
  muscleGroups: string[];
}

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exercise: Omit<Exercise, "id">) => void;
  exercise?: Exercise | null | undefined;
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
  isOpen,
  onClose,
  onSave,
  exercise,
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
    muscleGroups: [],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (exercise) {
      setFormData({
        name: exercise.name,
        group: exercise.group,
        category: exercise.category,
        subcategories: exercise.subcategories || [],
        iconName: exercise.iconName,
        description: exercise.description,
        image: exercise.image || null,
        video: exercise.video || null,
        muscleGroups: exercise.muscleGroups,
      });
    } else {
      setFormData({
        name: "",
        group: "",
        category: "",
        subcategories: [],
        iconName: "",
        description: "",
        image: null,
        video: null,
        muscleGroups: [],
      });
    }
    setImagePreview(null);
    setVideoFile(null);
  }, [exercise, isOpen]);

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
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-2xl font-bold">
            {exercise ? "Edit Exercise" : "Add Exercise"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary/50 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Row 1: Exercise Name, Group, Category */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Exercise Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Type.."
                className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Group</label>
              <input
                type="text"
                name="group"
                value={formData.group}
                onChange={handleChange}
                placeholder="Type.."
                className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
              >
                <option value="">Type..</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Icon Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Icon Name</label>
            <input
              type="text"
              name="iconName"
              value={formData.iconName}
              onChange={handleChange}
              placeholder="Type.."
              className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {/* Row 3: Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Type.."
              className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary min-h-[100px] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              Sub Category
            </label>
            <div className="grid grid-cols-2 gap-3 bg-input border border-border rounded-lg p-4">
              {SUBCATEGORIES.map((subcat) => (
                <label
                  key={subcat}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.subcategories.includes(subcat)}
                    onChange={() => handleSubcategoryChange(subcat)}
                    className="w-4 h-4 rounded border-border bg-secondary accent-primary"
                  />
                  <span className="text-sm">{subcat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Upload Image */}
          <div>
            <div className="flex items-center gap-2 mb-3">
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <label className="text-sm font-medium">Upload Image</label>
            </div>
            <label className="block w-full border-2 border-dashed border-primary rounded-lg p-8 text-center cursor-pointer hover:bg-primary/5 transition-colors">
              <div className="flex flex-col items-center">
                <svg
                  className="w-12 h-12 text-primary mb-2"
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
                <span className="text-foreground font-medium">Select File</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {imagePreview && (
              <div className="mt-3 relative">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Upload Video */}
          <div>
            <div className="flex items-center gap-2 mb-3">
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
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <label className="text-sm font-medium">Upload Video</label>
            </div>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleVideoDrop}
              className="block w-full border-2 border-dashed border-primary rounded-lg p-8 text-center hover:bg-primary/5 transition-colors cursor-pointer"
            >
              <div className="flex flex-col items-center">
                <svg
                  className="w-12 h-12 text-primary mb-2"
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
                <span className="text-foreground font-medium">
                  Drag & drop video file
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
              <div className="mt-3 text-sm text-primary font-medium">
                ✓ {videoFile.name} selected
              </div>
            )}
          </div>

          <button
            type="button"
            className="w-full bg-[#4040D3] hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Upload
          </button>

          {/* Save button moved below Upload button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-[#4040D3] hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
