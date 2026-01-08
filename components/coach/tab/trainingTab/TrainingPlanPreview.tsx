

"use client";

import { Pencil, Trash2 } from "lucide-react";

// Updated interfaces to match the new data structure
interface ExerciseData {
  id: string;
  name: string;
  sets: string;
  repsRange: string;
  rir: string;
  notes: string;
}

interface PlanData {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  exercises: ExerciseData[];
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
  // Helper to determine badge colors based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Advanced":
        return "bg-red-500/15 border-red-500/30 text-red-400";
      case "Intermediate":
        return "bg-amber-500/15 border-amber-500/30 text-amber-400";
      case "Beginner":
      default:
        return "bg-emerald-500/15 border-emerald-500/30 text-emerald-400";
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#141424] to-[#0f0f1e] border border-[#2d2d45] hover:border-emerald-500/50 rounded-xl transition-all shadow-lg overflow-hidden group">
      <div className="p-6 space-y-5">
        {/* Header: Title, Difficulty Badge, Actions */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="font-bold text-lg text-white leading-tight">
                {plan.title}
              </h3>
              <span
                className={`px-2.5 py-0.5 border text-[10px] uppercase tracking-wider rounded-full font-semibold ${getDifficultyColor(
                  plan.difficulty
                )}`}
              >
                {plan.difficulty}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 shrink-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={onEdit}
              className="w-8 h-8 rounded-full bg-blue-600/10 border border-blue-600/50 hover:bg-blue-600/30 flex items-center justify-center transition-all"
              title="Edit Plan"
            >
              <Pencil className="w-3.5 h-3.5 text-blue-400" />
            </button>
            <button
              onClick={onDelete}
              className="w-8 h-8 rounded-full bg-red-600/10 border border-red-600/50 hover:bg-red-600/30 flex items-center justify-center transition-all"
              title="Delete Plan"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
            </button>
          </div>
        </div>

        {/* Exercises List */}
        <div className="space-y-3">
          {plan.exercises && plan.exercises.length > 0 ? (
            plan.exercises.map((ex, index) => (
              <div
                key={ex.id || index}
                className="bg-[#1a1a30]/50 rounded-lg p-3 border border-[#2d2d45] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Exercise Name with Number and Note */}
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#2d2d45] text-xs font-bold text-gray-400 shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-200 font-medium">
                      {ex.name}
                    </span>
                  </div>
                  {/* Individual Exercise Note */}
                  {ex.notes && (
                    <div className="pl-9">
                      <p className="text-[11px] text-emerald-400/80 italic leading-relaxed bg-emerald-500/5 px-2 py-1 rounded-md border border-emerald-500/10 inline-block">
                        Note: {ex.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Stats: Sets, Reps-Range, RIR */}
                <div className="flex flex-col gap-2 pl-9 sm:pl-0 shrink-0">
                  <div className="flex items-center gap-2 text-xs">
                    {ex.sets && (
                      <span className="px-2 py-1 bg-[#111120] border border-[#2d2d45] text-gray-400 rounded-md whitespace-nowrap">
                        <span className="text-emerald-500 font-semibold">
                          {ex.sets}
                        </span>{" "}
                        Sets
                      </span>
                    )}
                    {ex.repsRange && (
                      <span className="px-2 py-1 bg-[#111120] border border-[#2d2d45] text-gray-400 rounded-md whitespace-nowrap">
                        Reps: <span className="text-white font-semibold">
                          {ex.repsRange}
                        </span>
                      </span>
                    )}
                    {ex.rir && (
                      <span className="px-2 py-1 bg-[#111120] border border-[#2d2d45] text-gray-400 rounded-md whitespace-nowrap">
                        RIR: <span className="text-white">{ex.rir}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No exercises added.</p>
          )}
        </div>

        {/* Notes Section - Main Plan Notes */}
        {plan.notes && (
          <div className="pt-4 border-t border-[#2d2d45]">
            <h4 className="text-[11px] uppercase tracking-widest font-semibold mb-2 text-gray-500">
              Main Plan Notes
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
              {plan.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
