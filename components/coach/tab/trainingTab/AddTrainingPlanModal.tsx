// "use client";

// import { useState, useEffect } from "react";
// import { X, Plus, Trash2 } from "lucide-react";

// // Updated interfaces to support multiple exercises
// interface ExerciseData {
//   id: string;
//   name: string;
//   sets: string;
//   reps: string;
//   range: string;
// }

// interface PlanData {
//   id: string;
//   title: string;
//   difficulty: "Beginner" | "Intermediate" | "Advanced";
//   exercises: ExerciseData[];
//   notes: string;
// }

// interface AddPlanModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSave: (plan: PlanData) => void;
//   editingPlan: PlanData | null;
// }

// export default function AddTrainingPlanModal({
//   open,
//   onOpenChange,
//   onSave,
//   editingPlan,
// }: AddPlanModalProps) {
//   // Initial empty exercise state
//   const initialExercise: ExerciseData = {
//     id: Date.now().toString(),
//     name: "",
//     sets: "",
//     reps: "",
//     range: "",
//   };

//   const [title, setTitle] = useState("");
//   const [difficulty, setDifficulty] = useState<
//     "Beginner" | "Intermediate" | "Advanced"
//   >("Beginner");
//   const [notes, setNotes] = useState("");
//   const [exercises, setExercises] = useState<ExerciseData[]>([initialExercise]);

//   useEffect(() => {
//     if (editingPlan) {
//       setTitle(editingPlan.title);
//       setDifficulty(editingPlan.difficulty || "Beginner");
//       setNotes(editingPlan.notes);
//       // Ensure there is at least one exercise block even if editingPlan.exercises is empty
//       setExercises(
//         editingPlan.exercises && editingPlan.exercises.length > 0
//           ? editingPlan.exercises
//           : [initialExercise]
//       );
//     } else {
//       // Reset form
//       setTitle("");
//       setDifficulty("Beginner");
//       setNotes("");
//       setExercises([{ ...initialExercise, id: Date.now().toString() }]);
//     }
//   }, [editingPlan, open]);

//   const handleAddExercise = () => {
//     setExercises((prev) => [
//       ...prev,
//       {
//         id: Date.now().toString() + Math.random(), // Unique ID
//         name: "",
//         sets: "",
//         reps: "",
//         range: "",
//       },
//     ]);
//   };

//   const handleRemoveExercise = (id: string) => {
//     if (exercises.length > 1) {
//       setExercises((prev) => prev.filter((ex) => ex.id !== id));
//     } else {
//       // If it's the last one, just clear the data instead of removing the row
//       setExercises([{ ...initialExercise, id: Date.now().toString() }]);
//     }
//   };

//   const handleExerciseChange = (
//     id: string,
//     field: keyof ExerciseData,
//     value: string
//   ) => {
//     setExercises((prev) =>
//       prev.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex))
//     );
//   };

//   const handleSave = () => {
//     const planData: PlanData = {
//       id: editingPlan?.id || Date.now().toString(),
//       title,
//       difficulty,
//       exercises,
//       notes,
//     };
//     onSave(planData);
//     onOpenChange(false);
//   };

//   if (!open) return null;

//   return (
//     <>
//       <div
//         className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
//         onClick={() => onOpenChange(false)}
//       />
//       <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
//         <div className="bg-[#111120] border border-[#2a2a2a] rounded-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar scrollbar-none">
//           {/* Header */}
//           <div className="flex items-center justify-between border-b border-[#2a2a2a] p-6 sticky top-0 bg-[#111120] z-10">
//             <h2 className="text-xl font-semibold text-white">
//               {editingPlan ? "Edit Plan" : "Add Training Plan"}
//             </h2>
//             <button
//               onClick={() => onOpenChange(false)}
//               className="text-gray-400 hover:text-white transition-colors"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>

//           <div className="p-6 space-y-6">
//             {/* Top Row: Title and Difficulty */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-white">
//                   Training Plan Name
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Type.."
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-white">
//                   Difficulty
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={difficulty}
//                     onChange={(e) =>
//                       setDifficulty(
//                         e.target.value as
//                           | "Beginner"
//                           | "Intermediate"
//                           | "Advanced"
//                       )
//                     }
//                     className="w-full appearance-none bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
//                   >
//                     <option value="Beginner">Beginner</option>
//                     <option value="Intermediate">Intermediate</option>
//                     <option value="Advanced">Advanced</option>
//                   </select>
//                   {/* Custom Arrow for Select */}
//                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
//                     <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
//                       <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Dynamic Exercises List */}
//             <div className="space-y-6">
//               {exercises.map((exercise, index) => (
//                 <div
//                   key={exercise.id}
//                   className="bg-[#1a1a1a]/50 p-4 rounded-xl border border-[#2a2a2a] space-y-4 animate-in fade-in slide-in-from-bottom-2"
//                 >
//                   {/* Exercise Name Row */}
//                   <div className="space-y-2">
//                     <div className="flex justify-between items-center">
//                       <label className="text-sm font-medium text-white">
//                         Exercise Name {exercises.length > 1 && `#${index + 1}`}
//                       </label>
//                       {exercises.length > 1 && (
//                         <button
//                           onClick={() => handleRemoveExercise(exercise.id)}
//                           className="text-red-500 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
//                         >
//                           <Trash2 className="w-3 h-3" /> Remove
//                         </button>
//                       )}
//                     </div>
//                     <div className="relative">
//                       <input
//                         type="text"
//                         placeholder="Type exercise name..."
//                         value={exercise.name}
//                         onChange={(e) =>
//                           handleExerciseChange(
//                             exercise.id,
//                             "name",
//                             e.target.value
//                           )
//                         }
//                         className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-4 pr-12 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
//                       />
//                       {/* Plus Icon Button inside the input */}
//                       <button
//                         onClick={handleAddExercise}
//                         className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#2a2a2a] hover:bg-[#3a3a3a] p-1.5 rounded-md text-emerald-500 transition-colors"
//                         title="Add another exercise"
//                       >
//                         <Plus className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Sets, Reps, Range Grid */}
//                   <div className="grid grid-cols-3 gap-4">
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-gray-400">
//                         Sets
//                       </label>
//                       <input
//                         type="text"
//                         placeholder="0"
//                         value={exercise.sets}
//                         onChange={(e) =>
//                           handleExerciseChange(
//                             exercise.id,
//                             "sets",
//                             e.target.value
//                           )
//                         }
//                         className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-gray-400">
//                         Reps
//                       </label>
//                       <input
//                         type="text"
//                         placeholder="0"
//                         value={exercise.reps}
//                         onChange={(e) =>
//                           handleExerciseChange(
//                             exercise.id,
//                             "reps",
//                             e.target.value
//                           )
//                         }
//                         className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-gray-400">
//                         Range
//                       </label>
//                       <input
//                         type="text"
//                         placeholder="e.g. 8-12"
//                         value={exercise.range}
//                         onChange={(e) =>
//                           handleExerciseChange(
//                             exercise.id,
//                             "range",
//                             e.target.value
//                           )
//                         }
//                         className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Notes Section */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-white">Comment</label>
//               <textarea
//                 placeholder="Additional notes..."
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//                 className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 resize-none"
//                 rows={3}
//               />
//             </div>

//             <button
//               onClick={handleSave}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4 h-12 rounded-lg transition-colors font-medium"
//             >
//               Save Training Plan
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";

interface ExerciseData {
  id: string;
  name: string;
  sets: string; // Keeping as string to handle empty input state easily, but content will be numeric
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
  const initialExercise: ExerciseData = {
    id: Date.now().toString(),
    name: "",
    sets: "",
    reps: "",
    range: "",
  };

  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<
    "Beginner" | "Intermediate" | "Advanced"
  >("Beginner");
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState<ExerciseData[]>([initialExercise]);

  useEffect(() => {
    if (editingPlan) {
      setTitle(editingPlan.title);
      setDifficulty(editingPlan.difficulty || "Beginner");
      setNotes(editingPlan.notes);
      setExercises(
        editingPlan.exercises && editingPlan.exercises.length > 0
          ? editingPlan.exercises
          : [initialExercise]
      );
    } else {
      setTitle("");
      setDifficulty("Beginner");
      setNotes("");
      setExercises([{ ...initialExercise, id: Date.now().toString() }]);
    }
  }, [editingPlan, open]);

  const handleAddExercise = () => {
    setExercises((prev) => [
      ...prev,
      {
        id: Date.now().toString() + Math.random(),
        name: "",
        sets: "",
        reps: "",
        range: "",
      },
    ]);
  };

  const handleRemoveExercise = (id: string) => {
    if (exercises.length > 1) {
      setExercises((prev) => prev.filter((ex) => ex.id !== id));
    } else {
      setExercises([{ ...initialExercise, id: Date.now().toString() }]);
    }
  };

  const handleExerciseChange = (
    id: string,
    field: keyof ExerciseData,
    value: string
  ) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex))
    );
  };

  const handleSave = () => {
    const planData: PlanData = {
      id: editingPlan?.id || Date.now().toString(),
      title,
      difficulty,
      exercises,
      notes,
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
        <div className="bg-[#111120] border border-[#2a2a2a] rounded-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto scrollbar-none">
          <div className="flex items-center justify-between border-b border-[#2a2a2a] p-6 sticky top-0 bg-[#111120] z-10">
            <h2 className="text-xl font-semibold text-white">
              {editingPlan ? "Edit Plan" : "Add Training Plan"}
            </h2>
            <button
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Top Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Training Plan Name
                </label>
                <input
                  type="text"
                  placeholder="Type.."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Difficulty
                </label>
                <div className="relative">
                  <select
                    value={difficulty}
                    onChange={(e) =>
                      setDifficulty(
                        e.target.value as
                          | "Beginner"
                          | "Intermediate"
                          | "Advanced"
                      )
                    }
                    className="w-full appearance-none bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Exercises */}
            <div className="space-y-6">
              {exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className="bg-[#1a1a1a]/50 p-4 rounded-xl border border-[#2a2a2a] space-y-4 animate-in fade-in slide-in-from-bottom-2"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-white">
                        Exercise Name {exercises.length > 1 && `#${index + 1}`}
                      </label>
                      {exercises.length > 1 && (
                        <button
                          onClick={() => handleRemoveExercise(exercise.id)}
                          className="text-red-500 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Type exercise name..."
                        value={exercise.name}
                        onChange={(e) =>
                          handleExerciseChange(
                            exercise.id,
                            "name",
                            e.target.value
                          )
                        }
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-4 pr-12 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        onClick={handleAddExercise}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#2a2a2a] hover:bg-[#3a3a3a] p-1.5 rounded-md text-emerald-500 transition-colors"
                        title="Add another exercise"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">
                        Sets
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={exercise.sets}
                        onChange={(e) =>
                          handleExerciseChange(
                            exercise.id,
                            "sets",
                            e.target.value
                          )
                        }
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">
                        Reps
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={exercise.reps}
                        onChange={(e) =>
                          handleExerciseChange(
                            exercise.id,
                            "reps",
                            e.target.value
                          )
                        }
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">
                        Range
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={exercise.range}
                        onChange={(e) =>
                          handleExerciseChange(
                            exercise.id,
                            "range",
                            e.target.value
                          )
                        }
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Comment</label>
              <textarea
                placeholder="Additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 resize-none"
                rows={3}
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4 h-12 rounded-lg transition-colors font-medium"
            >
              Save Training Plan
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
