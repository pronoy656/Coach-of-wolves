/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import {
  BackendExercise,
  TrainingPlan,
  TrainingPlanFormData,
  ExerciseSet,
} from "@/redux/features/trainingPlan/trainingPlanType";
import {
  getAllExercises,
  Exercise,
} from "@/redux/features/exercise/exerciseSlice";

interface ExerciseState extends BackendExercise {
  id: string;
  dbId?: string; // Storing the MongoDB _id of the exercise template
}

interface AddPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: TrainingPlanFormData) => void;
  editingPlan: TrainingPlan | null;
  loading?: boolean;
}

export default function AddTrainingPlanModal({
  open,
  onOpenChange,
  onSave,
  editingPlan,
  loading = false,
}: AddPlanModalProps) {
  const dispatch = useAppDispatch();
  const createEmptyExercise = (id: string): ExerciseState => ({
    id,
    exerciseName: "",
    sets: "1",
    rep: "",
    range: "",
    comment: "",
    exerciseId: "",
  });

  const [traingPlanName, setTraingPlanName] = useState("");
  const [dificulty, setDificulty] = useState("Begineer");
  const [comment, setComment] = useState("");
  const [exercises, setExercises] = useState<ExerciseState[]>([
    createEmptyExercise("0"),
  ]);
  const [exerciseSuggestions, setExerciseSuggestions] = useState<Exercise[]>(
    [],
  );
  const [isSearching, setIsSearching] = useState(false);
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdownForId, setShowDropdownForId] = useState<string | null>(
    null,
  );
  const [fallbackExerciseId, setFallbackExerciseId] = useState("6988ff7ffd965df20288901c");

  // Fetch initial exercise list to have a valid fallback exerciseId if needed
  useEffect(() => {
    if (!open) return;
    dispatch(
      getAllExercises({
        page: 1,
        limit: 10,
        search: "",
      }),
    )
      .unwrap()
      .then((res) => {
        if (res.exercises && res.exercises.length > 0) {
          setFallbackExerciseId(res.exercises[0]._id);
        }
      })
      .catch(() => {});
  }, [dispatch, open]);

  useEffect(() => {
    if (!open) return;

    const hasEditingPlan = !!editingPlan;

    const nextTraingPlanName = hasEditingPlan ? editingPlan.traingPlanName : "";
    const nextDificulty = hasEditingPlan
      ? editingPlan.dificulty || "Begineer"
      : "Begineer";
    const nextComment = hasEditingPlan ? editingPlan.comment || "" : "";
    const nextExercises = hasEditingPlan
      ? editingPlan.exercise && editingPlan.exercise.length > 0
        ? editingPlan.exercise.map((ex, index) => ({
            ...ex,
            id: ex._id || `local-${index}`,
            dbId: ex.exerciseId || "",
            sets: ex.sets || "1",
            rep: ex.rep || "",
            range: ex.range || "",
            comment: ex.comment || "",
            exerciseId: ex.exerciseId || "",
          }))
        : [createEmptyExercise("0")]
      : [createEmptyExercise("0")];

    const id = setTimeout(() => {
      setTraingPlanName(nextTraingPlanName);
      setDificulty(nextDificulty);
      setComment(nextComment);
      setExercises(nextExercises);
    }, 0);

    return () => clearTimeout(id);
  }, [editingPlan, open]);

  const handleAddExercise = () => {
    setExercises((prev) => [...prev, createEmptyExercise(String(prev.length))]);
  };

  const handleRemoveExercise = (id: string) => {
    if (exercises.length > 1) {
      setExercises((prev) => prev.filter((ex) => ex.id !== id));
    } else {
      setExercises([createEmptyExercise("0")]);
    }
  };

  const handleExerciseChange = (
    id: string,
    field: keyof ExerciseState,
    value: any,
  ) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex)),
    );
    if (field === "exerciseName") {
      setActiveExerciseId(id);
      setSearchTerm(String(value));
    }
  };



  const handleSave = () => {
    const planData: TrainingPlanFormData = {
      traingPlanName,
      exerciseId: fallbackExerciseId, // Add empty or fallback since required, but not critical
      dificulty,
      exercise: exercises.map(({ id, dbId, ...rest }) => ({
        ...rest,
        exerciseId: dbId || rest.exerciseId || fallbackExerciseId
      })),
      comment,
    };
    onSave(planData);
  };

  useEffect(() => {
    const query = searchTerm.trim();
    if (!query || query.length < 2) {
      return;
    }

    const handler = setTimeout(() => {
      setIsSearching(true);
      dispatch(
        getAllExercises({
          page: 1,
          limit: 10,
          search: query,
        }),
      )
        .unwrap()
        .then((res) => {
          setExerciseSuggestions(res.exercises);
        })
        .catch(() => {
          setExerciseSuggestions([]);
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 300);

    return () => clearTimeout(handler);
  }, [dispatch, searchTerm]);

  const handleExerciseFocus = (id: string) => {
    setShowDropdownForId(id);
    setActiveExerciseId(id);

    if (exerciseSuggestions.length > 0 || isSearching) return;

    setIsSearching(true);
    dispatch(
      getAllExercises({
        page: 1,
        limit: 50,
        search: "",
      }),
    )
      .unwrap()
      .then((res) => {
        setExerciseSuggestions(res.exercises);
      })
      .catch(() => {
        setExerciseSuggestions([]);
      })
      .finally(() => {
        setIsSearching(false);
      });
  };

  const handleSelectExerciseSuggestion = (id: string, item: Exercise) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === id ? { ...ex, exerciseName: item.name, dbId: item._id } : ex,
      ),
    );
    setShowDropdownForId(null);
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
                  value={traingPlanName}
                  onChange={(e) => setTraingPlanName(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Difficulty
                </label>
                <div className="relative">
                  <select
                    value={dificulty}
                    onChange={(e) => setDificulty(e.target.value)}
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
                        value={exercise.exerciseName}
                        onChange={(e) =>
                          handleExerciseChange(
                            exercise.id,
                            "exerciseName",
                            e.target.value,
                          )
                        }
                        onFocus={() => handleExerciseFocus(exercise.id)}
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-4 pr-12 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                        autoComplete="off"
                      />
                      {showDropdownForId === exercise.id && (
                        <div className="absolute z-20 mt-1 w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-lg max-h-56 overflow-y-auto">
                          {isSearching && (
                            <div className="px-3 py-2 text-xs text-gray-400">
                              Searching...
                            </div>
                          )}
                          {!isSearching &&
                            exerciseSuggestions.map((item) => (
                              <button
                                key={item._id}
                                type="button"
                                onClick={() =>
                                  handleSelectExerciseSuggestion(
                                    exercise.id,
                                    item,
                                  )
                                }
                                className="w-full text-left px-3 py-2 hover:bg-[#2a2a2a] text-sm"
                              >
                                <div className="text-white">{item.name}</div>
                                {item.musal && (
                                  <div className="text-xs text-gray-400">
                                    {item.musal}
                                  </div>
                                )}
                              </button>
                            ))}
                          {!isSearching && exerciseSuggestions.length === 0 && (
                            <div className="px-3 py-2 text-xs text-gray-500">
                              No matches found
                            </div>
                          )}
                        </div>
                      )}
                      <button
                        onClick={handleAddExercise}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#2a2a2a] hover:bg-[#3a3a3a] p-1.5 rounded-md text-emerald-500 transition-colors"
                        title="Add another exercise"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end animate-in fade-in slide-in-from-left-2 transition-all duration-200 bg-[#1a1a1a] p-3 rounded-lg border border-[#2a2a2a]/50 relative">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-400">
                        Sets
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 4"
                        value={exercise.sets}
                        onChange={(e) =>
                          handleExerciseChange(
                            exercise.id,
                            "sets",
                            e.target.value,
                          )
                        }
                        className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-400">
                        Rep Range
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 8-10"
                        value={exercise.rep}
                        onChange={(e) =>
                          handleExerciseChange(
                            exercise.id,
                            "rep",
                            e.target.value,
                          )
                        }
                        className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-400">
                        Range / Weight
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 70-80kg"
                        value={exercise.range}
                        onChange={(e) =>
                          handleExerciseChange(
                            exercise.id,
                            "range",
                            e.target.value,
                          )
                        }
                        className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                      Exercise Comment
                    </label>
                    <textarea
                      placeholder="Specific notes for this exercise... (e.g., Keep elbows tucked)"
                      value={exercise.comment}
                      onChange={(e) =>
                        handleExerciseChange(
                          exercise.id,
                          "comment",
                          e.target.value,
                        )
                      }
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 resize-none"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Main Plan Notes Section */}
            <div className="space-y-2 border-t border-[#2a2a2a] pt-6">
              <label className="text-lg font-bold text-white">
                Main Plan Notes
              </label>
              <textarea
                placeholder="Add general instructions or notes for the entire plan..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 min-h-[120px] resize-none"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-base text-white mt-4 h-12 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Training Plan"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
