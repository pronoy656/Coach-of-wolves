// import React from "react";

// export default function TrainingTab() {
//   return <div>TrainingTab</div>;
// }

"use client";

import { useState } from "react";
import {
  Search,
  Pencil,
  Trash2,
  Clock,
  Dumbbell,
  TrendingUp,
} from "lucide-react";
import TrainingPlanPreview from "./TrainingPlanPreview";
import TrainingSplitPreview from "./TrainingSplitPreview";
import AddTrainingSplitModal from "./AddTrainingSplitModal";
import AddTrainingPlanModal from "./AddTrainingPlanModal";
import DeleteModal from "../../exerciseDatabase/deleteModal/DeleteModal";
// import { TrainingSplitModal } from "@/components/training-split-modal"
// import { AddPlanModal } from "@/components/add-plan-modal"
// import { PlanPreviewCard } from "@/components/plan-preview-card"
// import { TrainingSplitPreview } from "@/components/training-split-preview"
// import DeleteModal from "@/components/delete-modal"

interface TrainingPlan {
  id: string;
  name: string;
  exercise: string;
}

interface PlanData {
  id: string;
  title: string;
  exercise: string;
  reps: string;
  sets: string;
  range: string;
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

  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([
    { id: "1", name: "PLACEHOLDER", exercise: "No Exercises" },
    { id: "2", name: "TRAINING PLAN", exercise: "Leterral Rise (Machine)" },
    { id: "3", name: "PUSH FULLBODY", exercise: "Lateral Rise (Dumbble)" },
    { id: "4", name: "TRAININGS PLAN", exercise: "Lateral Rise (Machine)" },
    { id: "5", name: "PUSH FULLBODY", exercise: "Lateral Rise (Dumbble)" },
  ]);

  const [planPreviews, setPlanPreviews] = useState<PlanData[]>([
    {
      id: "p1",
      title: "PUSH FULLBODY",
      exercise: "Lateral Rise (Dumbble)",
      reps: "8-10 Rep",
      sets: "Sets(3)",
      range: "Range(Strength)",
      notes:
        "Lorem ipsum dolor sit amet consectetur, adipiscing senor nunc feugiat non ipsum eu interdum non non elit",
    },
    {
      id: "p2",
      title: "TRAINING PLAN",
      exercise: "Leterral Rise (Mechine)",
      reps: "8-10 Rep",
      sets: "Sets(3)",
      range: "Range(Strength)",
      notes:
        "Lorem ipsum dolor sit amet consectetur, adipiscing senor nunc feugiat non ipsum eu interdum non non elit",
    },
  ]);

  const handleDeleteClick = (
    type: "plan" | "preview" | "split",
    id: string
  ) => {
    setDeleteModal({ isOpen: true, type, id });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.type === "plan" && deleteModal.id) {
      setTrainingPlans(
        trainingPlans.filter((plan) => plan.id !== deleteModal.id)
      );
    } else if (deleteModal.type === "preview" && deleteModal.id) {
      setPlanPreviews(
        planPreviews.filter((plan) => plan.id !== deleteModal.id)
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

  const handleEditPlan = (plan: TrainingPlan) => {
    const fullPlanData = planPreviews.find(
      (p) => p.title === plan.name && p.exercise === plan.exercise
    );

    if (fullPlanData) {
      setEditingPlan(fullPlanData);
    } else {
      // Convert TrainingPlan to PlanData format for editing
      const planData: PlanData = {
        id: plan.id,
        title: plan.name,
        exercise: plan.exercise,
        reps: "",
        sets: "",
        range: "",
        notes: "",
      };
      setEditingPlan(planData);
    }
    setShowAddPlanModal(true);
  };

  const handleAddPlan = (planData: PlanData) => {
    if (editingPlan) {
      // Update in planPreviews
      setPlanPreviews(
        planPreviews.map((p) => (p.id === editingPlan.id ? planData : p))
      );
      // Update in trainingPlans
      setTrainingPlans(
        trainingPlans.map((p) =>
          p.name === editingPlan.title && p.exercise === editingPlan.exercise
            ? { id: p.id, name: planData.title, exercise: planData.exercise }
            : p
        )
      );
      setEditingPlan(null);
    } else {
      // Add to planPreviews
      const newPlanData = { ...planData, id: Date.now().toString() };
      setPlanPreviews([...planPreviews, newPlanData]);
      // Add to trainingPlans
      setTrainingPlans([
        ...trainingPlans,
        {
          id: Date.now().toString(),
          name: planData.title,
          exercise: planData.exercise,
        },
      ]);
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

          {/* Training Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {trainingPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-gradient-to-br from-[#141424] to-[#0f0f1e] border border-[#2d2d45] hover:border-emerald-500/50 transition-all shadow-lg rounded-lg"
              >
                <div className="p-6 space-y-4 min-h-[140px]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <h3 className="font-bold text-base leading-tight">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-gray-400 leading-snug">
                        {plan.exercise}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditPlan(plan)}
                        className="w-8 h-8 rounded-full bg-blue-600/20 border-2 border-blue-600 hover:bg-blue-600/30 flex items-center justify-center transition-all"
                      >
                        <Pencil className="w-4 h-4 text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick("plan", plan.id)}
                        className="w-8 h-8 rounded-full bg-red-600/20 border-2 border-red-600 hover:bg-red-600/30 flex items-center justify-center transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Plan Preview Cards */}
          {planPreviews.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-300">
                Preview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
