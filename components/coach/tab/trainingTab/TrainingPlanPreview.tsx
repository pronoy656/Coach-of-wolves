// "use client";

// import { Pencil, Trash2, CheckCircle2 } from "lucide-react";

// interface PlanData {
//   id: string;
//   title: string;
//   exercise: string;
//   reps: string;
//   sets: string;
//   range: string;
//   notes: string;
// }

// interface PlanPreviewCardProps {
//   plan: PlanData;
//   onEdit: () => void;
//   onDelete: () => void;
// }

// export default function TrainingPlanPreview({
//   plan,
//   onEdit,
//   onDelete,
// }: PlanPreviewCardProps) {
//   return (
//     <div className="bg-gradient-to-br from-[#141424] to-[#0f0f1e] border-[#2d2d45] hover:border-emerald-500/50 transition-all shadow-lg">
//       <div className="p-6 space-y-4">
//         <div className="flex items-start justify-between">
//           <div className="flex-1">
//             <h3 className="font-bold text-lg mb-1">{plan.title}</h3>
//             <p className="text-sm text-gray-400">{plan.exercise}</p>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={onEdit}
//               className="w-8 h-8 rounded-full bg-blue-600/20 border-2 border-blue-600 hover:bg-blue-600/30 flex items-center justify-center transition-all"
//             >
//               <Pencil className="w-4 h-4 text-blue-400" />
//             </button>
//             <button
//               onClick={onDelete}
//               className="w-8 h-8 rounded-full bg-red-600/20 border-2 border-red-600 hover:bg-red-600/30 flex items-center justify-center transition-all"
//             >
//               <Trash2 className="w-4 h-4 text-red-400" />
//             </button>
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           <span className="px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs rounded-full font-medium">
//             {plan.reps}
//           </span>
//           <span className="px-3 py-1.5 bg-[#1a1a30] border border-[#2d2d45] text-gray-300 text-xs rounded-full font-medium">
//             {plan.sets}
//           </span>
//           <span className="px-3 py-1.5 bg-[#1a1a30] border border-[#2d2d45] text-gray-300 text-xs rounded-full font-medium">
//             {plan.range}
//           </span>
//           <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto" />
//         </div>

//         <div className="pt-4 border-t border-[#2d2d45]">
//           <h4 className="text-sm font-semibold mb-2 text-gray-300">Notes</h4>
//           <p className="text-sm text-gray-400 leading-relaxed">{plan.notes}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { Pencil, Trash2 } from "lucide-react";

// Updated interfaces to match the new data structure
interface ExerciseData {
  id: string;
  name: string;
  sets: string;
  reps: string;
  range: string;
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
                {/* Exercise Name with Number */}
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#2d2d45] text-xs font-bold text-gray-400 shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-200 font-medium">
                    {ex.name}
                  </span>
                </div>

                {/* Stats: Sets, Reps, Range */}
                <div className="flex items-center gap-2 text-xs pl-9 sm:pl-0">
                  {ex.sets && (
                    <span className="px-2 py-1 bg-[#111120] border border-[#2d2d45] text-gray-400 rounded-md whitespace-nowrap">
                      <span className="text-emerald-500 font-semibold">
                        {ex.sets}
                      </span>{" "}
                      Sets
                    </span>
                  )}
                  {ex.reps && (
                    <span className="px-2 py-1 bg-[#111120] border border-[#2d2d45] text-gray-400 rounded-md whitespace-nowrap">
                      <span className="text-emerald-500 font-semibold">
                        {ex.reps}
                      </span>{" "}
                      Reps
                    </span>
                  )}
                  {ex.range && (
                    <span className="px-2 py-1 bg-[#111120] border border-[#2d2d45] text-gray-400 rounded-md whitespace-nowrap">
                      Rng: <span className="text-white">{ex.range}</span>
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No exercises added.</p>
          )}
        </div>

        {/* Notes Section */}
        {plan.notes && (
          <div className="pt-4 border-t border-[#2d2d45]">
            <h4 className="text-[11px] uppercase tracking-widest font-semibold mb-2 text-gray-500">
              Notes
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
