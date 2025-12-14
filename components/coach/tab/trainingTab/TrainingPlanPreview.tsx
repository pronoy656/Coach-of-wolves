"use client";

import { Pencil, Trash2, CheckCircle2 } from "lucide-react";

interface PlanData {
  id: string;
  title: string;
  exercise: string;
  reps: string;
  sets: string;
  range: string;
  notes: string;
}

interface PlanPreviewCardProps {
  plan: PlanData;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TrainingPlanPreview({
  plan,
  onEdit,
  onDelete,
}: PlanPreviewCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#141424] to-[#0f0f1e] border-[#2d2d45] hover:border-emerald-500/50 transition-all shadow-lg">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{plan.title}</h3>
            <p className="text-sm text-gray-400">{plan.exercise}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="w-8 h-8 rounded-full bg-blue-600/20 border-2 border-blue-600 hover:bg-blue-600/30 flex items-center justify-center transition-all"
            >
              <Pencil className="w-4 h-4 text-blue-400" />
            </button>
            <button
              onClick={onDelete}
              className="w-8 h-8 rounded-full bg-red-600/20 border-2 border-red-600 hover:bg-red-600/30 flex items-center justify-center transition-all"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs rounded-full font-medium">
            {plan.reps}
          </span>
          <span className="px-3 py-1.5 bg-[#1a1a30] border border-[#2d2d45] text-gray-300 text-xs rounded-full font-medium">
            {plan.sets}
          </span>
          <span className="px-3 py-1.5 bg-[#1a1a30] border border-[#2d2d45] text-gray-300 text-xs rounded-full font-medium">
            {plan.range}
          </span>
          <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto" />
        </div>

        <div className="pt-4 border-t border-[#2d2d45]">
          <h4 className="text-sm font-semibold mb-2 text-gray-300">Notes</h4>
          <p className="text-sm text-gray-400 leading-relaxed">{plan.notes}</p>
        </div>
      </div>
    </div>
  );
}
