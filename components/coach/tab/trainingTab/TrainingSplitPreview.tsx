"use client";

import { Pencil, Trash2, Calendar, Dumbbell, Loader2 } from "lucide-react";
import { TrainingSplit, SplitDay } from "@/redux/features/trainingSplit/trainingSplitTypes";

interface TrainingSplitPreviewProps {
  split: TrainingSplit;
  onEdit: () => void;
  onDelete: () => void;
  loading?: boolean;
}

export default function TrainingSplitPreview({
  split,
  onEdit,
  onDelete,
  loading = false,
}: TrainingSplitPreviewProps) {
  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Sort splits by day of week
  const sortedSplits = [...split.splite].sort((a, b) => {
    const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
  });

  return (
    <div className="bg-gradient-to-br from-[#141424] to-[#0f0f1e] border border-[#2d2d45] rounded-lg overflow-hidden">
      <div className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2d45] bg-gradient-to-r from-[#1a1a2e] to-[#16213e]">
          <div>
            <h3 className="font-semibold text-lg mb-1">Training Split Schedule</h3>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Created: {formatDate(split.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Dumbbell className="w-3 h-3" />
                <span>{split.splite.length} days</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              disabled={loading}
              className="w-10 h-10 rounded-full bg-blue-600/20 border-2 border-blue-600 hover:bg-blue-600/30 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Edit split"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              ) : (
                <Pencil className="w-4 h-4 text-blue-400" />
              )}
            </button>
            <button
              onClick={onDelete}
              disabled={loading}
              className="w-10 h-10 rounded-full bg-red-600/20 border-2 border-red-600 hover:bg-red-600/30 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete split"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>

        {/* Split Days Table */}
        <div className="overflow-hidden">
          <div className="grid grid-cols-12 bg-[#1a1a30] px-6 py-3 text-sm font-medium">
            <div className="col-span-3">Day</div>
            <div className="col-span-9">Workout</div>
          </div>

          {sortedSplits.length > 0 ? (
            sortedSplits.map((splitDay: SplitDay, index: number) => (
              <div
                key={`${splitDay.day}-${index}`}
                className={`grid grid-cols-12 px-6 py-4 text-sm transition-colors hover:bg-[#1a1a30]/50 ${index !== sortedSplits.length - 1 ? "border-b border-[#2d2d45]" : ""
                  }`}
              >
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${splitDay.exerciseName.toLowerCase().includes('rest') ||
                      splitDay.exerciseName.toLowerCase().includes('recovery')
                      ? "bg-gray-500"
                      : "bg-emerald-500"
                      }`} />
                    <span className="font-medium text-white">{splitDay.day}</span>
                  </div>
                </div>
                <div className="col-span-9">
                  <div className="text-gray-300">{splitDay.exerciseName}</div>
                  {splitDay.exerciseName.toLowerCase().includes('rest') ||
                    splitDay.exerciseName.toLowerCase().includes('recovery') ? (
                    <span className="text-xs text-gray-400 mt-1 block">Rest/Recovery Day</span>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              No training days configured
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="px-6 py-4 border-t border-[#2d2d45] bg-[#1a1a30]/30">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-emerald-400">
                {sortedSplits.filter(s =>
                  !s.exerciseName.toLowerCase().includes('rest') &&
                  !s.exerciseName.toLowerCase().includes('recovery')
                ).length}
              </div>
              <div className="text-xs text-gray-400">Workout Days</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-400">
                {sortedSplits.filter(s =>
                  s.exerciseName.toLowerCase().includes('rest') ||
                  s.exerciseName.toLowerCase().includes('recovery')
                ).length}
              </div>
              <div className="text-xs text-gray-400">Rest Days</div>
            </div>
            <div>
              <div className="text-lg font-bold text-amber-400">
                {split.splite.length}
              </div>
              <div className="text-xs text-gray-400">Total Days</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}