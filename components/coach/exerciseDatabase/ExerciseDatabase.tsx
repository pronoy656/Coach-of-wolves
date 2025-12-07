"use client";

import { useState } from "react";
import ExerciseDatabaseCard from "./exerciseDatabaseCard/ExerciseDatabaseCard";
import DeleteModal from "./deleteModal/DeleteModal";
import AddExerciseModal from "./addExerciseModal/AddExerciseModal";

interface Exercise {
  id: string;
  name: string;
  group: string;
  category: string;
  iconName: string;
  description: string;
  image?: File | null;
  video?: File | null;
  muscleGroups: string[];
}

export default function ExerciseDatabase() {
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: "1",
      name: "Bench Press",
      group: "Barbell",
      category: "Chest",
      iconName: "dumbbell",
      description: "Chest exercise",
      muscleGroups: ["Chest", "Triceps", "Shoulders"],
    },
    {
      id: "2",
      name: "Shoulder Press",
      group: "Barbell",
      category: "Shoulders",
      iconName: "dumbbell",
      description: "Shoulder exercise",
      muscleGroups: ["Triceps", "Shoulders"],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(null);

  const handleAddExercise = () => {
    setSelectedExercise(null);
    setIsModalOpen(true);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setExerciseToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (exerciseToDelete) {
      setExercises((prev) => prev.filter((ex) => ex.id !== exerciseToDelete));
      setDeleteConfirmOpen(false);
      setExerciseToDelete(null);
    }
  };

  const handleSaveExercise = (exercise: Omit<Exercise, "id">) => {
    if (selectedExercise) {
      // Edit mode
      setExercises((prev) =>
        prev.map((ex) =>
          ex.id === selectedExercise.id
            ? { ...exercise, id: selectedExercise.id }
            : ex
        )
      );
    } else {
      // Add mode
      const newExercise: Exercise = {
        ...exercise,
        id: Date.now().toString(),
      };
      setExercises((prev) => [...prev, newExercise]);
    }
    setIsModalOpen(false);
    setSelectedExercise(null);
  };

  return (
    <div className="flex h-screen bg-background text-foreground dark">
      <div className="flex-1 overflow-hidden flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Exercise Database</h1>
              <button
                onClick={handleAddExercise}
                className="px-6 py-3 border border-[#4A9E4A] text-primary rounded-3xl hover:bg-[#4A9E4A]/10 transition-colors font-medium"
              >
                + Add Exercise
              </button>
            </div>

            {/* Exercise Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {exercises.map((exercise) => (
                <ExerciseDatabaseCard
                  key={exercise.id}
                  exercise={exercise}
                  onEdit={() => handleEditExercise(exercise)}
                  onDelete={() => handleDeleteClick(exercise.id)}
                />
              ))}
            </div>

            {exercises.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No exercises added yet
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Exercise Modal */}
      <AddExerciseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExercise(null);
        }}
        onSave={handleSaveExercise}
        exercise={selectedExercise}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
