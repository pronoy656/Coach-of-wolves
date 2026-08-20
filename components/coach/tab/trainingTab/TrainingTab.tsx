"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchTrainingPlans,
  addTrainingPlan,
  updateTrainingPlan,
  deleteTrainingPlan,
  searchTrainingPlans,
  clearMessages,
  reorderPlans,
  reorderTrainingPlan,
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
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const translations = {
  en: {
    searchPlaceholder: "Search Here...",
    addPlan: "Add Plan",
    trainingPlanTitle: "Training Plan",
    noExercises: "No Exercises",
    more: "more",
    reps: "Reps:",
    rir: "RIR:",
    noPlansFound: "No training plans found.",
    preview: "Preview",
    difficulties: {
      Advanced: "Advanced",
      Intermediate: "Intermediate",
      Begineer: "Beginner",
      Beginner: "Beginner",
    },
    reorderFailed: "Reordering failed. Please try again.",
    nameTaken: "This training plan name is already taken.",
    deletePlanTitle: "Delete Training Plan",
    deletePreviewTitle: "Delete Plan Preview",
    deleteMessage: "Are you sure you want to delete this item? This action cannot be undone.",
  },
  de: {
    searchPlaceholder: "Hier suchen...",
    addPlan: "Plan hinzufügen",
    trainingPlanTitle: "Trainingsplan",
    noExercises: "Keine Übungen",
    more: "weitere",
    reps: "Wdh:",
    rir: "RIR:",
    noPlansFound: "Keine Trainingspläne gefunden.",
    preview: "Vorschau",
    difficulties: {
      Advanced: "Fortgeschritten",
      Intermediate: "Mittel",
      Begineer: "Anfänger",
      Beginner: "Anfänger",
    },
    reorderFailed: "Neusortierung fehlgeschlagen. Bitte erneut versuchen.",
    nameTaken: "Dieser Trainingsplanname ist bereits vergeben.",
    deletePlanTitle: "Trainingsplan löschen",
    deletePreviewTitle: "Planvorschau löschen",
    deleteMessage: "Bist du sicher, dass du dieses Element löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.",
  }
};

interface TrainingPageProps {
  athleteId: string;
}

export default function TrainingPage({ athleteId }: TrainingPageProps) {
  const dispatch = useAppDispatch();
  const { plans, loading, error, successMessage } = useAppSelector(
    (state) => state.trainingPlan,
  );
  const { language } = useAppSelector((state) => state.language);
  const t = translations[language as keyof typeof translations] || translations.en;

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = plans.findIndex((p) => p._id === active.id);
      const newIndex = plans.findIndex((p) => p._id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        // Step 4: Optimistic Update
        dispatch(reorderPlans({ oldIndex, newIndex }));

        // Step 3: Call Reorder API
        // Backend position is 1-based, so newPosition = newIndex + 1
        dispatch(
          reorderTrainingPlan({
            athleteId,
            planId: active.id as string,
            newPosition: newIndex + 1,
          })
        )
          .unwrap()
          .then(() => {
            // Step 5: Re-fetch After Success (Final source of truth)
            dispatch(fetchTrainingPlans(athleteId));
          })
          .catch((err) => {
            // Step 6: Error Handling (Restore old order if needed, but fetch usually fixes it)
            toast.error(t.reorderFailed);
            dispatch(fetchTrainingPlans(athleteId));
          });
      }
    }
  };

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
    const normalizeStr = (str?: string) => (str || "").trim().toLowerCase().replace(/\s+/g, " ");
    const newName = normalizeStr(data.traingPlanName);
    
    // Check if name already exists
    const isDuplicate = plans.some((plan) => {
      // If editing, don't compare against the plan currently being edited
      if (editingPlan && plan._id === editingPlan._id) {
        return false;
      }
      return normalizeStr(plan.traingPlanName) === newName;
    });

    if (isDuplicate) {
      toast.error(t.nameTaken);
      return;
    }

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
        .then((res: any) => {
          setShowAddPlanModal(false);
          // Automatically move the newly created plan to the top (position 1)
          if (res?.data?._id) {
            dispatch(reorderTrainingPlan({ athleteId, planId: res.data._id, newPosition: 1 }))
              .unwrap()
              .then(() => {
                dispatch(fetchTrainingPlans(athleteId));
              })
              .catch(() => {
                dispatch(fetchTrainingPlans(athleteId));
              });
          } else {
            dispatch(fetchTrainingPlans(athleteId));
          }
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
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 bg-[#111111] border border-[#2a2a2a] rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end">
          <button
            onClick={() => {
              setEditingPlan(null);
              setShowAddPlanModal(true);
            }}
            className="group flex items-center gap-2 bg-transparent border-2 border-emerald-500 text-emerald-500 text-base font-bold hover:bg-emerald-500/10 rounded-full px-8 h-11 transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-95"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span>{t.addPlan}</span>
          </button>
        </div>

        {/* Training Plan Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">{t.trainingPlanTitle}</h2>

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
                              : t.noExercises}
                            {plan.exercise.length > 1 && (
                              <span className="text-emerald-500 text-xs ml-1">
                                +{plan.exercise.length - 1} {t.more}
                              </span>
                            )}
                          </p>
                          {plan.exercise.length > 0 &&
                            plan.exercise[0].exerciseSets &&
                            plan.exercise[0].exerciseSets.length > 0 && (
                              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                <span className="bg-[#1a1a30] px-1.5 py-0.5 rounded border border-[#2d2d45]">
                                  {t.reps}{" "}
                                  {plan.exercise[0].exerciseSets[0].repRange ||
                                    "-"}
                                </span>
                                <span className="bg-[#1a1a30] px-1.5 py-0.5 rounded border border-[#2d2d45]">
                                  {t.rir}{" "}
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
                        className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${plan.dificulty === "Advanced"
                          ? "border-red-500/30 text-red-400 bg-red-500/10"
                          : plan.dificulty === "Intermediate"
                            ? "border-amber-500/30 text-amber-400 bg-amber-500/10"
                            : "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                          }`}
                      >
                        {t.difficulties[plan.dificulty as keyof typeof t.difficulties] || plan.dificulty}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500 italic">
                {t.noPlansFound}
              </div>
            )}
          </div>

          {/* Plan Preview Cards (Detailed List) */}
          {plans.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-300">
                {t.preview}
              </h3>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={plans.map((p) => p._id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {plans.map((plan) => (
                      <TrainingPlanPreview
                        key={plan._id}
                        plan={plan}
                        athleteId={athleteId}
                        onEdit={() => handleEditPreview(plan)}
                        onDelete={() => handleDeleteClick("plan", plan._id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>

        <div className="pt-8 border-t border-[#2d2d45]">
          <TrainingSplitManager athleteId={athleteId} />
        </div>

        {/* Training History Section */}
        <TrainingHistory athleteId={athleteId} />
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
            ? t.deletePlanTitle
            : t.deletePreviewTitle
        }
        message={t.deleteMessage}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, type: null, id: null })}
      />
    </div>
  );
}
