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
    excerciseNote: "",
    exerciseSets: [{ sets: "1", repRange: "", rir: "" }],
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
            exerciseSets:
              ex.exerciseSets && ex.exerciseSets.length > 0
                ? ex.exerciseSets.map((sd) => ({
                    ...sd,
                    sets: sd.sets || "1",
                    repRange: sd.repRange || "",
                    rir: sd.rir || "",
                  }))
                : [{ sets: "1", repRange: "", rir: "" }],
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

  const handleAddSet = (exerciseId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exerciseId) {
          const newSets = [
            ...(ex.exerciseSets || []),
            { sets: "1", repRange: "", rir: "" },
          ];
          return { ...ex, exerciseSets: newSets };
        }
        return ex;
      }),
    );
  };

  const handleRemoveSet = (exerciseId: string, setIndex: number) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exerciseId && (ex.exerciseSets?.length || 0) > 1) {
          const newSets = (ex.exerciseSets || []).filter(
            (_, i) => i !== setIndex,
          );
          return { ...ex, exerciseSets: newSets };
        }
        return ex;
      }),
    );
  };

  const handleSetDetailChange = (
    exerciseId: string,
    setIndex: number,
    field: keyof ExerciseSet,
    value: string,
  ) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exerciseId) {
          const newSets = (ex.exerciseSets || []).map((set, i) =>
            i === setIndex ? { ...set, [field]: value } : set,
          );
          return { ...ex, exerciseSets: newSets };
        }
        return ex;
      }),
    );
  };

  const handleSave = () => {
    const planData: TrainingPlanFormData = {
      traingPlanName,
      dificulty,
      exercise: exercises.map(({ id, ...rest }) => rest),
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
        ex.id === id ? { ...ex, exerciseName: item.name } : ex,
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

                  <div className="space-y-4">
                    {exercise.exerciseSets?.map((set, setIndex) => (
                      <div
                        key={setIndex}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end animate-in fade-in slide-in-from-left-2 transition-all duration-200 bg-[#1a1a1a] p-3 rounded-lg border border-[#2a2a2a]/50 relative group/set"
                      >
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-400">
                            Sets
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="1"
                              placeholder="1"
                              value={set.sets}
                              onChange={(e) =>
                                handleSetDetailChange(
                                  exercise.id,
                                  setIndex,
                                  "sets",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-emerald-500"
                            />
                            <button
                              onClick={() => handleAddSet(exercise.id)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#2a2a2a] hover:bg-[#3a3a3a] p-1.5 rounded-md text-emerald-500 transition-colors"
                              title="Add another set group"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-400">
                            Rep Range
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 10-12"
                            value={set.repRange}
                            onChange={(e) =>
                              handleSetDetailChange(
                                exercise.id,
                                setIndex,
                                "repRange",
                                e.target.value,
                              )
                            }
                            className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="space-y-2 relative">
                          <label className="text-xs font-medium text-gray-400">
                            RIR
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 2"
                            value={set.rir}
                            onChange={(e) =>
                              handleSetDetailChange(
                                exercise.id,
                                setIndex,
                                "rir",
                                e.target.value,
                              )
                            }
                            className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-emerald-500"
                          />
                          {exercise.exerciseSets &&
                            exercise.exerciseSets.length > 1 && (
                              <button
                                onClick={() =>
                                  handleRemoveSet(exercise.id, setIndex)
                                }
                                className="absolute -right-2 -top-2 bg-red-500/20 text-red-500 hover:bg-red-500 p-1 rounded-full opacity-0 group-hover/set:opacity-100 transition-all border border-red-500/50 z-10"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                      Exercise Note
                    </label>
                    <textarea
                      placeholder="Specific notes for this exercise..."
                      value={exercise.excerciseNote}
                      onChange={(e) =>
                        handleExerciseChange(
                          exercise.id,
                          "excerciseNote",
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
