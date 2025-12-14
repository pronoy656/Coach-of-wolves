// import React from "react";

// export default function AddTrainingSplitModal() {
//   return <div>AddTrainingSplitModal</div>;
// }

"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface TrainingSplitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (splits: SplitEntry[]) => void;
  existingSplits?: SplitEntry[];
}

interface SplitEntry {
  id: string;
  day: string;
  exercise: string;
}

export default function AddTrainingSplitModal({
  open,
  onOpenChange,
  onSave,
  existingSplits = [],
}: TrainingSplitModalProps) {
  const [splits, setSplits] = useState<SplitEntry[]>([
    { id: "1", day: "", exercise: "" },
  ]);

  useEffect(() => {
    if (open) {
      if (existingSplits.length > 0) {
        setSplits(existingSplits);
      } else {
        setSplits([{ id: "1", day: "", exercise: "" }]);
      }
    }
  }, [open, existingSplits]);

  const handleAddMore = () => {
    setSplits([
      ...splits,
      { id: Date.now().toString(), day: "", exercise: "" },
    ]);
  };

  const handleChange = (
    id: string,
    field: "day" | "exercise",
    value: string
  ) => {
    setSplits(
      splits.map((split) =>
        split.id === id ? { ...split, [field]: value } : split
      )
    );
  };

  const handleSave = () => {
    onSave(splits);
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
        <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-[#2a2a2a]">
            <h2 className="text-xl font-semibold text-white">Training Split</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddMore}
                className="bg-transparent border border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              >
                + Add More
              </button>
              <button
                onClick={() => onOpenChange(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {splits.map((split) => (
                <div key={split.id} className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Day</label>
                    <input
                      type="text"
                      placeholder="Type.."
                      value={split.day}
                      onChange={(e) =>
                        handleChange(split.id, "day", e.target.value)
                      }
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">
                      Exercise Name
                    </label>
                    <input
                      type="text"
                      placeholder="Type.."
                      value={split.exercise}
                      onChange={(e) =>
                        handleChange(split.id, "exercise", e.target.value)
                      }
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-8 h-12 rounded-lg font-medium transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
