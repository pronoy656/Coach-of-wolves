"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";

interface Athlete {
  id?: string;
  name: string;
  category: string;
  phase: string;
  weight: number;
  height: number;
  status: "Natural" | "Enhanced";
  gender: string;
  email: string;
  age: number;
  trainingDaySteps: number;
  restDaySteps: number;
  checkInDay: string;
  waterQuantity: number; // ✅ NEW
  goal: string;
  lastCheckIn?: string;
  image?: string;
}

interface AthleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (athlete: Athlete) => void;
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

export default function AddAthleteModal({
  isOpen,
  onClose,
  onSave,
  athlete,
}: AthleteModalProps) {
  const [formData, setFormData] = useState<Athlete>({
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
      [name]:
        name === "weight" ||
          name === "height" ||
          name === "age" ||
          name === "trainingDaySteps" ||
          name === "restDaySteps" ||
          name === "waterQuantity" // ✅ NEW
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
            {athlete ? "Edit Athlete" : "Add Athlete"}
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
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                required
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500/60 transition-colors appearance-none cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Enter weight"
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="Enter height"
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500/60 transition-colors appearance-none cursor-pointer"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                Training Day Steps
              </label>
              <input
                type="number"
                name="trainingDaySteps"
                value={formData.trainingDaySteps}
                onChange={handleChange}
                placeholder="Enter steps"
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                Rest Day Steps
              </label>
              <input
                type="number"
                name="restDaySteps"
                value={formData.restDaySteps}
                onChange={handleChange}
                placeholder="Enter steps"
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500/60 transition-colors appearance-none cursor-pointer"
              >
                <option value="">Select category</option>
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
                Phase
              </label>
              <select
                name="phase"
                value={formData.phase}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500/60 transition-colors appearance-none cursor-pointer"
              >
                {PHASE_OPTIONS.map((phase) => (
                  <option key={phase} value={phase}>
                    {phase}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age"
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-300 mb-2">
                Check in Day
              </label>
              <select
                name="checkInDay"
                value={formData.checkInDay}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500/60 transition-colors appearance-none cursor-pointer"
              >
                {CHECK_IN_DAYS.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-emerald-300 mb-2">
              Water Quantity (Liters)
            </label>
            <input
              type="number"
              name="waterQuantity"
              value={formData.waterQuantity}
              onChange={handleChange}
              placeholder="Enter daily water intake"
              className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
            />
          </div>

          {/* Goal */}
          <div>
            <label className="block text-sm font-semibold text-emerald-300 mb-2">
              Goal
            </label>
            <textarea
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="Enter goal"
              rows={3}
              className="w-full px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors resize-none"
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className="block text-sm font-semibold text-emerald-300 mb-3">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer block">
              <div className="w-full px-6 py-8 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/40 rounded-lg hover:border-emerald-400/60 transition-colors flex flex-col items-center justify-center gap-3 group">
                <div className="p-3 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                  <Upload className="w-6 h-6 text-emerald-400" />
                </div>
                <span className="text-white font-semibold">Select File</span>
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
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg text-white font-semibold hover:from-emerald-400 hover:to-emerald-500 transition-colors disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
