"use client";

import { useState } from "react";
import { Search, Clock, Dumbbell, TrendingUp } from "lucide-react";
import TrainingPlanPreview from "./TrainingPlanPreview";
import TrainingSplitPreview from "./TrainingSplitPreview";
import AddTrainingSplitModal from "./AddTrainingSplitModal";
import AddTrainingPlanModal from "./AddTrainingPlanModal";
import DeleteModal from "../../exerciseDatabase/deleteModal/DeleteModal";

// --- Interfaces ---
interface ExerciseData {
  id: string;
  name: string;
  sets: string;
  repsRange: string;
  rir: string;
}

interface PlanData {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  exercises: ExerciseData[];
  notes: string;
}

interface SplitEntry {
  id: string;
  day: string;
  exercise: string;
}

export default function TrainingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showTrainingSplitModal, setShowTrainingSplitModal] = useState(false);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanData | null>(null);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: "plan" | "preview" | "split" | null;
    id: string | null;
  }>({
    isOpen: false,
    type: null,
    id: null,
  });

  const [trainingSplits, setTrainingSplits] = useState<SplitEntry[]>([]);
  const [isEditingSplit, setIsEditingSplit] = useState(false);

  // --- Initial Data for Small Cards (Training Plans) ---
  const [trainingPlans, setTrainingPlans] = useState<PlanData[]>([
    {
      id: "1",
      title: "Leg Day Destruction",
      difficulty: "Advanced",
      exercises: [
        {
          id: "ex_1a",
          name: "Barbell Squat",
          sets: "4",
          repsRange: "5",
          rir: "0",
        },
        {
          id: "ex_1b",
          name: "Leg Press",
          sets: "3",
          repsRange: "12",
          rir: "0",
        },
        {
          id: "ex_1c",
          name: "Romanian Deadlift",
          sets: "3",
          repsRange: "10",
          rir: "0",
        },
        {
          id: "ex_1d",
          name: "Calf Raises",
          sets: "4",
          repsRange: "15",
          rir: "0",
        },
      ],
      notes: "Focus on depth for squats. Control the negative on leg press.",
    },
    {
      id: "2",
      title: "Upper Body Power",
      difficulty: "Intermediate",
      exercises: [
        {
          id: "ex_2a",
          name: "Bench Press",
          sets: "4",
          repsRange: "6",
          rir: "0",
        },
        {
          id: "ex_2b",
          name: "Bent Over Row",
          sets: "4",
          repsRange: "8",
          rir: "0",
        },
        {
          id: "ex_2c",
          name: "Overhead Press",
          sets: "3",
          repsRange: "8",
          rir: "0",
        },
      ],
      notes: "Keep strict form on rows. Don't use momentum.",
    },
    {
      id: "3",
      title: "Full Body Beginner",
      difficulty: "Beginner",
      exercises: [
        {
          id: "ex_3a",
          name: "Goblet Squat",
          sets: "3",
          repsRange: "12",
          rir: "0",
        },
        {
          id: "ex_3b",
          name: "Push Ups",
          sets: "3",
          repsRange: "10",
          rir: "0",
        },
        {
          id: "ex_3c",
          name: "Dumbbell Lunges",
          sets: "3",
          repsRange: "10",
          rir: "0",
        },
      ],
      notes: "Focus on learning the movement patterns.",
    },
  ]);

  // --- Initial Data for Preview Section ---
  const [planPreviews, setPlanPreviews] = useState<PlanData[]>([
    {
      id: "p1",
      title: "PUSH HYPERTROPHY",
      difficulty: "Advanced",
      exercises: [
        {
          id: "ex_p1a",
          name: "Incline Dumbbell Press",
          sets: "4",
          repsRange: "10",
          rir: "0",
        },
        {
          id: "ex_p1b",
          name: "Lateral Raise (Dumbbell)",
          sets: "4",
          repsRange: "15",
          rir: "0",
        },
        {
          id: "ex_p1c",
          name: "Tricep Pushdown",
          sets: "3",
          repsRange: "12",
          rir: "0",
        },
        {
          id: "ex_p1d",
          name: "Cable Flys",
          sets: "3",
          repsRange: "15",
          rir: "0",
        },
      ],
      notes:
        "Focus on the stretch at the bottom of the movement for flys. Control the eccentric phase.",
    },
    {
      id: "p2",
      title: "PULL STRENGTH",
      difficulty: "Intermediate",
      exercises: [
        {
          id: "ex_p2a",
          name: "Deadlift",
          sets: "3",
          repsRange: "5",
          rir: "0",
        },
        {
          id: "ex_p2b",
          name: "Pull Ups",
          sets: "3",
          repsRange: "8",
          rir: "0",
        },
        {
          id: "ex_p2c",
          name: "Face Pulls",
          sets: "4",
          repsRange: "15",
          rir: "0",
        },
        {
          id: "ex_p2d",
          name: "Bicep Curls",
          sets: "3",
          repsRange: "12",
          rir: "0",
        },
      ],
      notes:
        "Ensure neutral spine during deadlifts. Squeeze at the top of the pull up.",
    },
  ]);

  const handleDeleteClick = (
    type: "plan" | "preview" | "split",
    id: string
  ) => {
    setDeleteModal({ isOpen: true, type, id });
  };

  const handleDeleteConfirm = () => {
    if (
      (deleteModal.type === "plan" || deleteModal.type === "preview") &&
      deleteModal.id
    ) {
      setTrainingPlans((prev) =>
        prev.filter((plan) => plan.id !== deleteModal.id)
      );
      setPlanPreviews((prev) =>
        prev.filter((plan) => plan.id !== deleteModal.id)
      );
    } else if (deleteModal.type === "split") {
      setTrainingSplits([]);
    }
    setDeleteModal({ isOpen: false, type: null, id: null });
  };

  const handleEditPreview = (plan: PlanData) => {
    setEditingPlan(plan);
    setShowAddPlanModal(true);
  };

  const handleAddPlan = (planData: PlanData) => {
    if (editingPlan) {
      // Update in both lists to keep them synchronized
      setPlanPreviews((prev) =>
        prev.map((p) => (p.id === editingPlan.id ? planData : p))
      );
      setTrainingPlans((prev) =>
        prev.map((p) => (p.id === editingPlan.id ? planData : p))
      );
      setEditingPlan(null);
    } else {
      // Add new plan to BOTH lists
      const newPlanData = { ...planData, id: Date.now().toString() };
      setPlanPreviews((prev) => [...prev, newPlanData]);
      setTrainingPlans((prev) => [...prev, newPlanData]);
    }
  };

  const handleSaveTrainingSplit = (splits: SplitEntry[]) => {
    setTrainingSplits(splits);
    setIsEditingSplit(false);
  };

  const handleEditTrainingSplit = () => {
    setIsEditingSplit(true);
    setShowTrainingSplitModal(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="space-y-8">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search Here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 bg-[#111111] border border-[#2a2a2a] rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setIsEditingSplit(false);
              setShowTrainingSplitModal(true);
            }}
            className="bg-transparent border border-emerald-500 text-emerald-500 text-base hover:bg-emerald-500/10 rounded-full px-6 h-10 transition-colors"
          >
            + Add Training Split
          </button>
          <button
            onClick={() => {
              setEditingPlan(null);
              setShowAddPlanModal(true);
            }}
            className="bg-transparent border border-emerald-500 text-emerald-500 text-base hover:bg-emerald-500/10 rounded-full px-6 h-10 transition-colors"
          >
            + Add Plan
          </button>
        </div>

        {/* Training Plan Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Training Plan</h2>

          {/* Training Plan Cards (Small Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {trainingPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-gradient-to-br from-[#141424] to-[#0f0f1e] border border-[#2d2d45] hover:border-emerald-500/50 transition-all shadow-lg rounded-lg group"
              >
                <div className="p-6 space-y-4 min-h-[140px] flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <h3 className="font-bold text-base leading-tight">
                        {plan.title}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400 leading-snug">
                          {plan.exercises.length > 0
                            ? plan.exercises[0].name
                            : "No Exercises"}
                          {plan.exercises.length > 1 && (
                            <span className="text-emerald-500 text-xs ml-1">
                              +{plan.exercises.length - 1} more
                            </span>
                          )}
                        </p>
                        {plan.exercises.length > 0 && (
                          <div className="flex items-center gap-2 text-[10px] text-gray-500">
                            <span className="bg-[#1a1a30] px-1.5 py-0.5 rounded border border-[#2d2d45]">
                              Reps: {plan.exercises[0].repsRange}
                            </span>
                            <span className="bg-[#1a1a30] px-1.5 py-0.5 rounded border border-[#2d2d45]">
                              RIR: {plan.exercises[0].rir}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer with Difficulty Badge Only */}
                  <div className="flex items-end mt-auto">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${plan.difficulty === "Advanced"
                        ? "border-red-500/30 text-red-400 bg-red-500/10"
                        : plan.difficulty === "Intermediate"
                          ? "border-amber-500/30 text-amber-400 bg-amber-500/10"
                          : "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                        }`}
                    >
                      {plan.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Plan Preview Cards (Detailed List) */}
          {planPreviews.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-300">
                Preview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {planPreviews.map((plan) => (
                  <TrainingPlanPreview
                    key={plan.id}
                    plan={plan}
                    onEdit={() => handleEditPreview(plan)}
                    onDelete={() => handleDeleteClick("preview", plan.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {trainingSplits.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Training Split</h2>
            <TrainingSplitPreview
              splits={trainingSplits}
              onEdit={handleEditTrainingSplit}
              onDelete={() => handleDeleteClick("split", "")}
            />
          </div>
        )}

        {/* Training History Section */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Training History</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* History Card 1 */}
            <div className="bg-gradient-to-br from-[#141424] to-[#0f0f1e] border border-emerald-500/30 shadow-lg rounded-lg">
              <div className="p-6 space-y-4">
                <div className="pb-4 border-b border-[#2a2a2a]">
                  <h3 className="text-xl font-bold mb-2">November</h3>
                  <p className="text-gray-400">9 Workouts</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Pull Fullbody</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    Tuesday, 18 November 2025 at 16:52
                  </p>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p className="text-gray-400">
                        Sets / Bestes Set → Best Set
                      </p>
                      <p className="text-white mt-1">
                        2 × Seated Row (Machine) → Best: 68 kg × 8 @ 10 [F]
                      </p>
                    </div>
                    <div className="text-sm">
                      <p className="text-white">
                        2 × Wide Row Machine → Best: 65 kg × 7 @ 10 [F]
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#2a2a2a] text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>1 h 31 m</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dumbbell className="w-4 h-4 text-gray-400" />
                      <span>5000(kg)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-500">0 PRs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* History Card 2 */}
            <div className="bg-gradient-to-br from-[#141424] to-[#0f0f1e] border border-[#2d2d45] shadow-lg rounded-lg">
              <div className="p-6 space-y-4">
                <div className="pb-4 border-b border-[#2a2a2a]">
                  <h3 className="text-xl font-bold mb-2">
                    Tuesday, 18 November 2025 at 16:52
                  </h3>
                  <p className="text-gray-400">
                    Warm up the rotator cuffs and hips
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Seated Row (Machine)</h4>
                      <span className="text-sm text-gray-400">1 Rm</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">36 kg x 6</span>
                        <span>42</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">50 kg x 6</span>
                        <span>51</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Wide Row (Machine)</h4>
                      <span className="text-sm text-gray-400">1 Rm</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">20 kg x 6</span>
                        <span>23</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">40 kg x 2</span>
                        <span>41</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modals */}
      <AddTrainingSplitModal
        open={showTrainingSplitModal}
        onOpenChange={setShowTrainingSplitModal}
        onSave={handleSaveTrainingSplit}
        existingSplits={isEditingSplit ? trainingSplits : []}
      />
      <AddTrainingPlanModal
        open={showAddPlanModal}
        onOpenChange={(open) => {
          setShowAddPlanModal(open);
          if (!open) setEditingPlan(null);
        }}
        onSave={handleAddPlan}
        editingPlan={editingPlan}
      />
      <DeleteModal
        isOpen={deleteModal.isOpen}
        title={
          deleteModal.type === "plan"
            ? "Delete Training Plan"
            : deleteModal.type === "preview"
              ? "Delete Plan Preview"
              : "Delete Training Split"
        }
        message="Are you sure you want to delete this item? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, type: null, id: null })}
      />
    </div>
  );
}
