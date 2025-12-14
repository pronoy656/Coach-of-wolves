// import React from "react";

// export default function AddTrainingPlanModal() {
//   return <div>AddTrainingPlanModal</div>;
// }

"use client";

import { useState, useEffect } from "react";
import { Edit2, X } from "lucide-react";

interface PlanData {
  id: string;
  title: string;
  exercise: string;
  reps: string;
  sets: string;
  range: string;
  notes: string;
}

interface AddPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (plan: PlanData) => void;
  editingPlan: PlanData | null;
}

export default function AddTrainingPlanModal({
  open,
  onOpenChange,
  onSave,
  editingPlan,
}: AddPlanModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    exercise: "",
    sets: "",
    reps: "",
    range: "",
    notes: "",
  });

  useEffect(() => {
    if (editingPlan) {
      setFormData({
        title: editingPlan.title,
        exercise: editingPlan.exercise,
        sets: editingPlan.sets,
        reps: editingPlan.reps,
        range: editingPlan.range,
        notes: editingPlan.notes,
      });
    } else {
      setFormData({
        title: "",
        exercise: "",
        sets: "",
        reps: "",
        range: "",
        notes: "",
      });
    }
  }, [editingPlan, open]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const planData: PlanData = {
      id: editingPlan?.id || Date.now().toString(),
      title: formData.title,
      exercise: formData.exercise,
      reps: formData.reps,
      sets: formData.sets,
      range: formData.range,
      notes: formData.notes,
    };
    onSave(planData);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={() => onOpenChange(false)}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-[#111120] border border-[#2a2a2a] rounded-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-[#2a2a2a] p-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-white">
                {editingPlan ? "Edit Plan" : "Add Training Plan"}
              </h2>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Training Plan Name
                </label>
                <input
                  type="text"
                  placeholder="Type.."
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Exercise Name
                </label>
                <input
                  type="text"
                  placeholder="Type.."
                  value={formData.exercise}
                  onChange={(e) => handleChange("exercise", e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Sets</label>
                <input
                  type="text"
                  placeholder="Type.."
                  value={formData.sets}
                  onChange={(e) => handleChange("sets", e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Rep</label>
                <input
                  type="text"
                  placeholder="Type.."
                  value={formData.reps}
                  onChange={(e) => handleChange("reps", e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Range</label>
                <input
                  type="text"
                  placeholder="Type.."
                  value={formData.range}
                  onChange={(e) => handleChange("range", e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Comment
                </label>
                <textarea
                  placeholder="Text"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 resize-none"
                  rows={3}
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-blue-600 hover:bg-blue-700  text-white mt-8 h-12 rounded-lg  transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
