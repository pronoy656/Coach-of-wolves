
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Show } from "@/redux/features/show/showTypes";

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
  "Other"
];

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
      newErrors.name = "Show name is required";
    }

    if (!formData.division.trim()) {
      newErrors.division = "Division is required";
    }

    if (!formData.date.trim()) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = "Date cannot be in the past";
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
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
            {show ? "Edit Show" : "Add Show"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Show Name */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-emerald-300">
                Show Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter show name"
                disabled={loading}
                className={`w-full px-4 py-2 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-colors disabled:opacity-50 ${errors.name ? "border-red-500" : "border-emerald-500/30 focus:border-emerald-500/60"
                  }`}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Division */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-emerald-300">
                Division *
              </label>
              <select
                name="division"
                value={formData.division}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-2 bg-slate-800/50 border rounded-lg text-white focus:outline-none transition-colors appearance-none cursor-pointer disabled:opacity-50 ${errors.division ? "border-red-500" : "border-emerald-500/30 focus:border-emerald-500/60"
                  }`}
              >
                <option value="">Select division</option>
                {DIVISION_OPTIONS.map((division) => (
                  <option key={division} value={division}>
                    {division}
                  </option>
                ))}
              </select>
              {errors.division && (
                <p className="text-red-400 text-xs mt-1">{errors.division}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-emerald-300">
                Date *
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
                  Select a future date for the show
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-emerald-300">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter show location"
                disabled={loading}
                className={`w-full px-4 py-2 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-colors disabled:opacity-50 ${errors.location ? "border-red-500" : "border-emerald-500/30 focus:border-emerald-500/60"
                  }`}
              />
              {errors.location && (
                <p className="text-red-400 text-xs mt-1">{errors.location}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6 border-t border-emerald-500/20">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white font-semibold hover:border-emerald-400 hover:bg-slate-800/70 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg text-white font-semibold hover:from-emerald-400 hover:to-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : show ? "Update Show" : "Add Show"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}