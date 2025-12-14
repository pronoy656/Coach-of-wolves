/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { Search, Dumbbell, Edit2, Trash2 } from "lucide-react";
import AddExerciseModal from "./addExerciseModal/AddExerciseModal";
import DeleteModal from "@/components/coach/exerciseDatabase/deleteModal/DeleteModal";

interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  muscleGroup: string;
  equipment: string;
  subcategories: string[];
  iconName?: string;
}

export default function AdminExerciseDatabase() {
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: "1",
      name: "Barbell Bench Press",
      description: "Compound Pressing Movement for chest development",
      category: "Chest",
      muscleGroup: "Chest",
      equipment: "Barbell",
      subcategories: ["Chest", "Triceps", "Shoulders"],
      iconName: "dumbbell",
    },
    {
      id: "2",
      name: "Barbell Squat",
      description: "Compound lower body movement for leg strength",
      category: "Legs",
      muscleGroup: "Legs",
      equipment: "Barbell",
      subcategories: ["Legs", "Back"],
      iconName: "dumbbell",
    },
    {
      id: "3",
      name: "Deadlift",
      description: "Full body compound exercise for overall strength",
      category: "Back",
      muscleGroup: "Back",
      equipment: "Barbell",
      subcategories: ["Back", "Legs"],
      iconName: "dumbbell",
    },
    {
      id: "4",
      name: "Pull-ups",
      description: "Upper body pulling exercise for back and arms",
      category: "Back",
      muscleGroup: "Back",
      equipment: "Pull-up Bar",
      subcategories: ["Back", "Arms"],
      iconName: "dumbbell",
    },
    {
      id: "5",
      name: "Shoulder Press",
      description: "Compound pressing movement for shoulder development",
      category: "Arms",
      muscleGroup: "Shoulders",
      equipment: "Dumbbell",
      subcategories: ["Shoulders", "Triceps"],
      iconName: "dumbbell",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    id?: string;
  }>({ show: false });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] =
    useState("All Muscle Groups");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(null);

  const muscleGroups = [
    "All Muscle Groups",
    "Chest",
    "Back",
    "Legs",
    "Arms",
    "Shoulders",
    "Core",
    "Neck",
  ];

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup =
      selectedMuscleGroup === "All Muscle Groups" ||
      exercise.muscleGroup === selectedMuscleGroup;
    return matchesSearch && matchesGroup;
  });

  const handleAddExercise = () => {
    setSelectedExercise(null);
    setIsModalOpen(true);
  };

  const handleEdit = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setExerciseToDelete(id);
    setShowDeleteModal(true);
    setDeleteConfirm({ show: true, id });
  };

  const confirmDelete = () => {
    if (exerciseToDelete) {
      setExercises(exercises.filter((ex) => ex.id !== exerciseToDelete));
      setShowDeleteModal(false);
      setExerciseToDelete(null);
    }
  };

  const handleSaveExercise = (formData: any) => {
    if (selectedExercise) {
      setExercises(
        exercises.map((ex) =>
          ex.id === selectedExercise.id
            ? { ...formData, id: selectedExercise.id }
            : ex
        )
      );
    } else {
      setExercises([...exercises, { ...formData, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
    setSelectedExercise(null);
  };

  return (
    <div className="flex h-screen bg-background text-foreground dark">
      <div className="flex-1 overflow-hidden flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Exercise Database</h1>
              <p className="text-muted-foreground">
                Global exercise library shared across all coaches
              </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search Exercise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 bg-[#08081A] border border-[#303245] rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                />
              </div>

              <select
                value={selectedMuscleGroup}
                onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                className="px-4 py-4 bg-[#08081A] border border-[#303245] rounded-lg text-foreground focus:outline-none focus:border-[#4A9E4A]"
              >
                {muscleGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAddExercise}
                className="px-6 py-3 border-2 border-[#4A9E4A] text-[#4A9E4A] rounded-3xl hover:bg-[#4A9E4A]/10 transition-colors font-medium"
              >
                + Add Exercise
              </button>
            </div>

            {/* Exercise Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="bg-[#08081A] from-card to-card/80 border border-[#303245] rounded-xl p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300 flex flex-col h-full group"
                >
                  {/* Header with icon and actions */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-400/30 to-emerald-500/20 flex items-center justify-center flex-shrink-0 border border-green-400/40">
                      <Dumbbell
                        className="w-7 h-7 text-green-500"
                        strokeWidth={1.5}
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(exercise)}
                        className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-all duration-200 border border-blue-500/20 hover:border-blue-500/40"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(exercise.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-all duration-200 border border-red-500/20 hover:border-red-500/40"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-foreground line-clamp-2">
                        {exercise.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {exercise.description}
                      </p>
                    </div>

                    {/* Info section */}
                    <div className="space-y-2 pt-4 border-t border-[#303245]">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground font-medium">
                          MUSCLE GROUP
                        </span>
                        <span className="text-sm font-semibold text-primary">
                          {exercise.muscleGroup}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground font-medium">
                          EQUIPMENT
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {exercise.equipment}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {exercise.subcategories.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#303245]">
                      <div className="flex flex-wrap gap-2">
                        {exercise.subcategories.map((sub, index) => {
                          const isEven = index % 2 === 0;
                          return (
                            <span
                              key={sub}
                              className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                                isEven
                                  ? "bg-gradient-to-r from-green-400/20 to-emerald-500/20 text-green-600 dark:text-green-400 border-green-400/40 hover:border-green-400/60"
                                  : "bg-gradient-to-r from-blue-400/20 to-blue-400/20 text-blue-600 dark:text-blue-400 border-blue-400/40 hover:border-blue-400/60"
                              }`}
                            >
                              {sub}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredExercises.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No exercises found matching your criteria
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <AddExerciseModal
          exercise={selectedExercise}
          onSave={handleSaveExercise}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedExercise(null);
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          isOpen={deleteConfirm.show}
          title="Delete Exercise"
          message="Are you sure you want to delete this exercise? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setExerciseToDelete(null);
          }}
        />
      )}
    </div>
  );
}
