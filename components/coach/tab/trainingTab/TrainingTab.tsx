"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchTrainingPlans,
  addTrainingPlan,
  updateTrainingPlan,
  deleteTrainingPlan,
  searchTrainingPlans,
  clearMessages,
} from "@/redux/features/trainingPlan/trainingPlanSlice";
import {
  TrainingPlan,
  TrainingPlanFormData,
} from "@/redux/features/trainingPlan/trainingPlanType";
import TrainingPlanPreview from "./TrainingPlanPreview";
import TrainingSplitManager from "./TrainingSplitManager";
import AddTrainingPlanModal from "./AddTrainingPlanModal";
import DeleteModal from "../../exerciseDatabase/deleteModal/DeleteModal";
import TrainingHistory from "./TrainingHistory";
import toast from "react-hot-toast";

interface TrainingPageProps {
  athleteId: string;
}

export default function TrainingPage({ athleteId }: TrainingPageProps) {
  const dispatch = useAppDispatch();
  const { plans, loading, error, successMessage } = useAppSelector(
    (state) => state.trainingPlan,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<TrainingPlan | null>(null);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: "plan" | "preview" | null;
    id: string | null;
  }>({
    isOpen: false,
    type: null,
    id: null,
  });

  useEffect(() => {
    if (athleteId) {
      dispatch(fetchTrainingPlans(athleteId));
    }
  }, [athleteId, dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
    }
    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
  }, [successMessage, error, dispatch]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      dispatch(searchTrainingPlans({ athleteId, name: query }));
    } else {
      dispatch(fetchTrainingPlans(athleteId));
    }
  };

  const handleDeleteClick = (type: "plan" | "preview", id: string) => {
    setDeleteModal({ isOpen: true, type, id });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.id) {
      dispatch(deleteTrainingPlan({ athleteId, planId: deleteModal.id }));
    }
    setDeleteModal({ isOpen: false, type: null, id: null });
  };

  const handleEditPreview = (plan: TrainingPlan) => {
    setEditingPlan(plan);
    setShowAddPlanModal(true);
  };

  const handleAddPlan = (data: TrainingPlanFormData) => {
    if (editingPlan) {
      dispatch(updateTrainingPlan({ athleteId, planId: editingPlan._id, data }))
        .unwrap()
        .then(() => {
          setShowAddPlanModal(false);
          setEditingPlan(null);
          dispatch(fetchTrainingPlans(athleteId)); // Re-fetch to get updated state
        });
    } else {
      dispatch(addTrainingPlan({ athleteId, data }))
        .unwrap()
        .then(() => {
          setShowAddPlanModal(false);
        });
    }
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
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 bg-[#111111] border border-[#2a2a2a] rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
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
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              </div>
            ) : plans.length > 0 ? (
              plans.map((plan) => (
                <div
                  key={plan._id}
                  className="bg-gradient-to-br from-[#141424] to-[#0f0f1e] border border-[#2d2d45] hover:border-emerald-500/50 transition-all shadow-lg rounded-lg group"
                >
                  <div className="p-6 space-y-4 min-h-[140px] flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <h3 className="font-bold text-base leading-tight">
                          {plan.traingPlanName}
                        </h3>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400 leading-snug">
                            {plan.exercise.length > 0
                              ? plan.exercise[0].exerciseName
                              : "No Exercises"}
                            {plan.exercise.length > 1 && (
                              <span className="text-emerald-500 text-xs ml-1">
                                +{plan.exercise.length - 1} more
                              </span>
                            )}
                          </p>
                          {plan.exercise.length > 0 &&
                            plan.exercise[0].exerciseSets &&
                            plan.exercise[0].exerciseSets.length > 0 && (
                              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                <span className="bg-[#1a1a30] px-1.5 py-0.5 rounded border border-[#2d2d45]">
                                  Reps:{" "}
                                  {plan.exercise[0].exerciseSets[0].repRange ||
                                    "-"}
                                </span>
                                <span className="bg-[#1a1a30] px-1.5 py-0.5 rounded border border-[#2d2d45]">
                                  RIR:{" "}
                                  {plan.exercise[0].exerciseSets[0].rir || "-"}
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Footer with Difficulty Badge Only */}
                    <div className="flex items-end mt-auto">
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          plan.dificulty === "Advanced"
                            ? "border-red-500/30 text-red-400 bg-red-500/10"
                            : plan.dificulty === "Intermediate"
                              ? "border-amber-500/30 text-amber-400 bg-amber-500/10"
                              : "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                        }`}
                      >
                        {plan.dificulty}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500 italic">
                No training plans found.
              </div>
            )}
          </div>

          {/* Plan Preview Cards (Detailed List) */}
          {plans.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-300">
                Preview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map((plan) => (
                  <TrainingPlanPreview
                    key={plan._id}
                    plan={plan}
                    onEdit={() => handleEditPreview(plan)}
                    onDelete={() => handleDeleteClick("plan", plan._id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-8 border-t border-[#2d2d45]">
          <TrainingSplitManager athleteId={athleteId} />
        </div>

        {/* Training History Section */}
        <TrainingHistory />
      </div>
      {/* Modals */}
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
            : "Delete Plan Preview"
        }
        message="Are you sure you want to delete this item? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, type: null, id: null })}
      />
    </div>
  );
}
