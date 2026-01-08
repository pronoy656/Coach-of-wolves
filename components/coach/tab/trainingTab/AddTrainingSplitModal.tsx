"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { SplitDay } from "@/redux/features/trainingSplit/trainingSplitTypes";

interface TrainingSplitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (splitData: { splite: SplitDay[] }) => void;
  existingSplit?: {
    _id?: string;
    splite: SplitDay[];
  };
  loading?: boolean;
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const DEFAULT_EXERCISE_NAMES = [
  "Push (Chest, Shoulders, Triceps)",
  "Pull (Back, Biceps)",
  "Legs (Quads, Hamstrings, Glutes)",
  "Upper Body",
  "Lower Body",
  "Full Body",
  "Core & Abs",
  "Rest / Mobility",
  "Active Recovery / Cardio",
  "Chest & Triceps",
  "Back & Biceps",
  "Shoulders",
  "Arms",
  "Cardio & Conditioning"
];

export default function AddTrainingSplitModal({
  open,
  onOpenChange,
  onSave,
  existingSplit,
  loading = false,
}: TrainingSplitModalProps) {
  const [splits, setSplits] = useState<SplitDay[]>([
    { day: "Monday", exerciseName: "" },
  ]);
  const [errors, setErrors] = useState<Record<number, { day?: string; exerciseName?: string }>>({});

  useEffect(() => {
    if (open) {
      if (existingSplit && existingSplit.splite.length > 0) {
        setSplits(existingSplit.splite);
      } else {
        // Start with only Monday by default to avoid validation frustration
        setSplits([{ day: "Monday", exerciseName: "" }]);
      }
      setErrors({});
    }
  }, [open, existingSplit]);

  const handleAddMore = () => {
    if (splits.length < 7) {
      // Find next available day
      const usedDays = splits.map(s => s.day);
      const nextDay = DAYS_OF_WEEK.find(day => !usedDays.includes(day));

      setSplits([
        ...splits,
        { day: nextDay || "Custom Day", exerciseName: "" },
      ]);
    }
  };

  const handleRemove = (index: number) => {
    if (splits.length > 1) {
      const newSplits = [...splits];
      newSplits.splice(index, 1);
      setSplits(newSplits);

      // Remove error for this index
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    }
  };

  const handleChange = (index: number, field: keyof SplitDay, value: string) => {
    const newSplits = [...splits];
    newSplits[index] = { ...newSplits[index], [field]: value };
    setSplits(newSplits);

    // Clear error for this field
    if (errors[index] && errors[index][field]) {
      const newErrors = { ...errors };
      newErrors[index] = { ...newErrors[index], [field]: undefined };
      if (!newErrors[index].day && !newErrors[index].exerciseName) {
        delete newErrors[index];
      }
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors: Record<number, { day?: string; exerciseName?: string }> = {};
    let isValid = true;

    splits.forEach((split, index) => {
      const splitErrors: { day?: string; exerciseName?: string } = {};

      if (!split.day.trim()) {
        splitErrors.day = "Day is required";
        isValid = false;
      }

      if (!split.exerciseName.trim()) {
        splitErrors.exerciseName = "Exercise name is required";
        isValid = false;
      }

      if (Object.keys(splitErrors).length > 0) {
        newErrors[index] = splitErrors;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({ splite: splits });
    }
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={() => !loading && onOpenChange(false)}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-[#0f0f0f] z-10 border-b border-[#2a2a2a]">
            <div className="flex items-center justify-between p-6">
              <h2 className="text-xl font-semibold text-white">
                {existingSplit ? "Edit Training Split" : "Create Training Split"}
              </h2>
              <div className="flex items-center gap-3">
                {splits.length < 7 && (
                  <button
                    onClick={handleAddMore}
                    disabled={loading}
                    className="bg-transparent border border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4 inline mr-1" />
                    Add Day
                  </button>
                )}
                <button
                  onClick={() => !loading && onOpenChange(false)}
                  disabled={loading}
                  className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 rounded-lg">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              </div>
            )}

            <div className="space-y-6">
              {splits.map((split, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-semibold">
                      {index + 1}
                    </div>
                    <h3 className="text-sm font-medium text-gray-300">
                      Day {index + 1}
                    </h3>
                    {splits.length > 1 && (
                      <button
                        onClick={() => handleRemove(index)}
                        disabled={loading}
                        className="ml-auto p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
                    {/* Day Selection */}
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400 flex items-center justify-between">
                        <span>Day *</span>
                        {errors[index]?.day && (
                          <span className="text-red-400 text-xs">{errors[index]?.day}</span>
                        )}
                      </label>
                      <select
                        value={split.day}
                        onChange={(e) => handleChange(index, "day", e.target.value)}
                        disabled={loading}
                        className={`w-full bg-[#0f0f0f] border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors disabled:opacity-50 ${errors[index]?.day
                          ? "border-red-500"
                          : "border-[#2a2a2a] focus:border-emerald-500"
                          }`}
                      >
                        <option value="">Select Day</option>
                        {DAYS_OF_WEEK.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                        <option value="Custom">Custom Day</option>
                      </select>
                      {split.day === "Custom" && (
                        <input
                          type="text"
                          placeholder="Enter custom day name"
                          value={split.day === "Custom" ? "" : split.day}
                          onChange={(e) => handleChange(index, "day", e.target.value)}
                          disabled={loading}
                          className="w-full mt-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                        />
                      )}
                    </div>

                    {/* Exercise Name */}
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400 flex items-center justify-between">
                        <span>Exercise Name *</span>
                        {errors[index]?.exerciseName && (
                          <span className="text-red-400 text-xs">{errors[index]?.exerciseName}</span>
                        )}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g., Push (Chest, Shoulders, Triceps)"
                          value={split.exerciseName}
                          onChange={(e) => handleChange(index, "exerciseName", e.target.value)}
                          disabled={loading}
                          className={`w-full bg-[#0f0f0f] border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-colors disabled:opacity-50 ${errors[index]?.exerciseName
                            ? "border-red-500"
                            : "border-[#2a2a2a] focus:border-emerald-500"
                            }`}
                          list={`exercise-suggestions-${index}`}
                        />
                        <datalist id={`exercise-suggestions-${index}`}>
                          {DEFAULT_EXERCISE_NAMES.map((name) => (
                            <option key={name} value={name} />
                          ))}
                        </datalist>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Tips */}
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4">
                <h4 className="text-sm font-medium text-emerald-400 mb-2">Tips for creating effective splits:</h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Balance push and pull exercises throughout the week</li>
                  <li>• Include at least one rest or active recovery day</li>
                  <li>• Consider muscle group recovery (24-48 hours between working same muscles)</li>
                  <li>• Most effective splits have 3-5 workout days per week</li>
                </ul>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full border border-green-500 hover:border-green-600 hover:text-green-600 text-green-500 mt-4 h-12 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : existingSplit ? "Update Split" : "Create Split"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}