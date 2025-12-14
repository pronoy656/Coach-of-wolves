// import React from "react";

// export default function TrainingSplitPreview() {
//   return <div>TrainingSplitPreview</div>;
// }

"use client";

// import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Trash2 } from "lucide-react";

interface SplitEntry {
  id: string;
  day: string;
  exercise: string;
}

interface TrainingSplitPreviewProps {
  splits: SplitEntry[];
  onEdit: () => void;
  onDelete: () => void;
}

export default function TrainingSplitPreview({
  splits,
  onEdit,
  onDelete,
}: TrainingSplitPreviewProps) {
  return (
    <div className="bg-[#0f0f23] border-[#2d2d45] overflow-hidden">
      <div className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2d45]">
          <h3 className="font-semibold text-base">Training Split Schedule</h3>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="w-10 h-10 rounded-full bg-blue-600/20 border-2 border-blue-600 hover:bg-blue-600/30 flex items-center justify-center transition-all"
            >
              <Pencil className="w-4 h-4 text-blue-400" />
            </button>
            <button
              onClick={onDelete}
              className="w-10 h-10 rounded-full bg-red-600/20 border-2 border-red-600 hover:bg-red-600/30 flex items-center justify-center transition-all"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden">
          <div className="grid grid-cols-2 bg-[#1a1a30] px-6 py-3 text-sm font-medium">
            <div>Day</div>
            <div>Work</div>
          </div>
          {splits.map((split, index) => (
            <div
              key={split.id}
              className={`grid grid-cols-2 px-6 py-4 text-sm ${
                index !== splits.length - 1 ? "border-b border-[#2d2d45]" : ""
              }`}
            >
              <div className="text-gray-300">{split.day}</div>
              <div className="text-gray-300">{split.exercise}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
