import { Pencil, Trash2, GripVertical } from "lucide-react";
import { TrainingPlan, BackendExercise } from "@/redux/features/trainingPlan/trainingPlanType";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { useAppDispatch } from "@/redux/hooks";
import { reorderExercisesLocally, reorderExercises, fetchTrainingPlans } from "@/redux/features/trainingPlan/trainingPlanSlice";
import toast from "react-hot-toast";

interface PlanPreviewCardProps {
  plan: TrainingPlan;
  athleteId: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TrainingPlanPreview({
  plan,
  athleteId,
  onEdit,
  onDelete,
}: PlanPreviewCardProps) {
  const dispatch = useAppDispatch();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleExerciseDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = plan.exercise.findIndex((ex) => ex._id === active.id);
      const newIndex = plan.exercise.findIndex((ex) => ex._id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        // Optimistic Update
        dispatch(reorderExercisesLocally({ planId: plan._id, oldIndex, newIndex }));

        // Call API
        dispatch(
          reorderExercises({
            planId: plan._id,
            exerciseId: active.id as string,
            newPosition: newIndex + 1,
          })
        )
          .unwrap()
          .then(() => {
            // Silently re-fetch to sync with backend
            dispatch(fetchTrainingPlans(athleteId));
          })
          .catch((err) => {
            toast.error("Exercise reordering failed.");
            // Re-fetch to restore state
            dispatch(fetchTrainingPlans(athleteId));
          });
      }
    }
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: plan._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.6 : 1,
  };

  // Helper to determine badge colors based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Advanced":
        return "bg-red-500/15 border-red-500/30 text-red-400";
      case "Intermediate":
        return "bg-amber-500/15 border-amber-500/30 text-amber-400";
      case "Begineer":
      default:
        return "bg-emerald-500/15 border-emerald-500/30 text-emerald-400";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gradient-to-br from-[#141424] to-[#0f0f1e] border border-[#2d2d45] hover:border-emerald-500/50 rounded-xl transition-all shadow-lg overflow-hidden group"
    >
      <div className="p-6 space-y-5">
        {/* Header: Title, Difficulty Badge, Actions */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-2 flex-1">
            {/* Drag Handle */}
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 -ml-2 text-gray-600 hover:text-emerald-500 transition-colors"
            >
              <GripVertical className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-bold text-lg text-white leading-tight">
                  {plan.traingPlanName}
                </h3>
                <span
                  className={`px-2.5 py-0.5 border text-[10px] uppercase tracking-wider rounded-full font-semibold ${getDifficultyColor(
                    plan.dificulty,
                  )}`}
                >
                  {plan.dificulty}
                </span>
              </div>
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
          {plan.exercise && plan.exercise.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleExerciseDragEnd}
            >
              <SortableContext
                items={plan.exercise.map((ex) => ex._id).filter((id): id is string => !!id)}
                strategy={verticalListSortingStrategy}
              >
                {plan.exercise.map((ex, index) => (
                  <SortableExercise
                    key={ex._id || index}
                    exercise={ex}
                    index={index}
                  />
                ))}
              </SortableContext>
            </DndContext>
          ) : (
            <p className="text-sm text-gray-500 italic">No exercises added.</p>
          )}
        </div>

        {/* Notes Section - Main Plan Notes */}
        {plan.comment && (
          <div className="pt-4 border-t border-[#2d2d45]">
            <h4 className="text-[11px] uppercase tracking-widest font-semibold mb-2 text-gray-500">
              Main Plan Notes
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
              {plan.comment}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// New SortableExercise Component
interface SortableExerciseProps {
  exercise: BackendExercise;
  index: number;
}

function SortableExercise({ exercise, index }: SortableExerciseProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exercise._id || "" });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 40 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-[#1a1a30]/50 rounded-lg p-3 border border-[#2d2d45] flex flex-col sm:flex-row sm:items-center justify-between gap-3 group/ex"
    >
      {/* Exercise Name with Number and Note */}
      <div className="flex flex-col gap-1 flex-1">
        <div className="flex items-center gap-3">
          {/* Exercise Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-gray-600 hover:text-emerald-500 transition-colors"
          >
            <GripVertical className="w-4 h-4" />
          </div>
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#2d2d45] text-xs font-bold text-gray-400 shrink-0">
            {index + 1}
          </span>
          <span className="text-sm text-gray-200 font-medium">
            {exercise.exerciseName}
          </span>
        </div>
        {/* Individual Exercise Note */}
        {exercise.excerciseNote && (
          <div className="pl-16">
            <p className="text-[11px] text-emerald-400/80 italic leading-relaxed bg-emerald-500/5 px-2 py-1 rounded-md border border-emerald-500/10 inline-block">
              Note: {exercise.excerciseNote}
            </p>
          </div>
        )}
      </div>

      {/* Stats: Sets, Reps-Range, RIR */}
      <div className="flex flex-col gap-2 pl-16 sm:pl-0 shrink-0">
        {exercise.exerciseSets && exercise.exerciseSets.length > 0 ? (
          <div className="flex flex-col items-start gap-2">
            {exercise.exerciseSets.map((set, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2">
                <div className="px-3 py-1 flex items-center bg-[#111120] border border-[#2d2d45] rounded-lg">
                  <span className="text-[11px] text-emerald-500 font-bold">
                    Sets: {set.sets}
                  </span>
                </div>
                <div className="px-3 py-1 flex items-center bg-[#111120] border border-[#2d2d45] rounded-lg">
                  <span className="text-xs text-white font-medium">
                    Reps: {set.repRange}
                  </span>
                </div>
                <div className="px-3 py-1 flex items-center bg-[#111120] border border-[#2d2d45] rounded-lg">
                  <span className="text-xs text-blue-400 font-medium">
                    RIR: {set.rir}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic">No sets added.</p>
        )}
      </div>
    </div>
  );
}
