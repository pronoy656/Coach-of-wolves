"use client";

import type React from "react";

import { Loader, X } from "lucide-react";
import { useState, useEffect } from "react";

interface Athlete {
  id: string;
  name: string;
  category: string;
  phase: string;
  weight: number;
  height: number;
  lastCheckIn: string;
  status: "Natural" | "Enhanced";
  restDaySteps: number;
  trainingDaySteps: number;
  birthday: string;
  assignedCardio: number;
  goal: string;
}

interface AthletesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (athlete: Omit<Athlete, "id">) => void;
  athlete?: Athlete | null;
}

export default function AthletesModal({
  isOpen,
  onClose,
  onSave,
  athlete,
}: AthletesModalProps) {
  const [formData, setFormData] = useState<Omit<Athlete, "id">>({
    name: "",
    category: "",
    phase: "",
    weight: 0,
    height: 0,
    lastCheckIn: "",
    status: "Natural",
    restDaySteps: 0,
    trainingDaySteps: 0,
    birthday: "",
    assignedCardio: 0,
    goal: "",
  });

  useEffect(() => {
    if (athlete) {
      setFormData({
        name: athlete.name,
        category: athlete.category,
        phase: athlete.phase,
        weight: athlete.weight,
        height: athlete.height,
        lastCheckIn: athlete.lastCheckIn,
        status: athlete.status,
        restDaySteps: athlete.restDaySteps,
        trainingDaySteps: athlete.trainingDaySteps,
        birthday: athlete.birthday,
        assignedCardio: athlete.assignedCardio,
        goal: athlete.goal,
      });
    } else {
      setFormData({
        name: "",
        category: "",
        phase: "",
        weight: 0,
        height: 0,
        lastCheckIn: "",
        status: "Natural",
        restDaySteps: 0,
        trainingDaySteps: 0,
        birthday: "",
        assignedCardio: 0,
        goal: "",
      });
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
      [name]: name === "status" ? value : value,
    }));
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      onSave(formData);
      setLoading(false);
    }, 2000); // 2 seconds loading
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#08081A] border border-[#303245] rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#303245] sticky top-0 bg-card">
          <h2 className="text-2xl font-bold"> Add Athletes</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary/50 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Type.."
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Type.."
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phase</label>
              <input
                type="text"
                name="phase"
                value={formData.phase}
                onChange={handleChange}
                placeholder="Type.."
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Type.."
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="Type.."
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Assigned Cardio(min)
              </label>
              <input
                type="number"
                name="assignedCardio"
                value={formData.assignedCardio}
                onChange={handleChange}
                placeholder="Type.."
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Rest Day Steps
              </label>
              <input
                type="number"
                name="restDaySteps"
                value={formData.restDaySteps}
                onChange={handleChange}
                placeholder="Type.."
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Training Day Steps
              </label>
              <input
                type="number"
                name="trainingDaySteps"
                value={formData.trainingDaySteps}
                onChange={handleChange}
                placeholder="Type.."
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Birthday date
              </label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                placeholder="Type.."
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
              />
            </div>
          </div>

          {/* Status and Goal */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-[#4A9E4A]"
              >
                <option className="bg-[#4040D3]" value="Natural ">
                  Natural
                </option>
                <option className="bg-[#4040D3]" value="Enhanced">
                  Enhanced
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Last Check In
              </label>
              <input
                type="date"
                name="lastCheckIn"
                value={formData.lastCheckIn}
                onChange={handleChange}
                placeholder="Type.."
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
              />
            </div>
          </div>

          {/* Goal */}
          <div>
            <label className="block text-sm font-medium mb-2">Goal</label>
            <textarea
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="Type.."
              className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A] min-h-[120px] resize-none"
            />
          </div>

          {/* Save Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center bg-[#4040D3] hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin text-center" />
              ) : (
                "Save"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-secondary border border-[#4040D3] hover:bg-secondary/80 text-foreground font-medium py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
