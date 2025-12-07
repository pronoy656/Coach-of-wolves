"use client";

import { Edit2, Trash2 } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  group: string;
  category: string;
  subcategories?: string[];
  iconName: string;
  description: string;
  muscleGroups?: string[];
}

interface ExerciseCardProps {
  exercise: Exercise;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ExerciseDatabaseCard({
  exercise,
  onEdit,
  onDelete,
}: ExerciseCardProps) {
  const displayedCategories =
    exercise.subcategories && exercise.subcategories.length > 0
      ? exercise.subcategories
      : exercise.muscleGroups || [];

  return (
    <div className="bg-[#08081A] border border-[#303245] rounded-lg p-6 hover:border-[#4A9E4A] transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Icon placeholder */}
          <div className="w-16 h-16 bg-[#29293F] rounded-lg flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#66b42a]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold uppercase mb-1">
              {exercise.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="bg-green-600/40 text-primary px-2 py-1 rounded-xl text-sm font-medium">
                {exercise.category}
              </span>
              <span className="text-muted-foreground text-sm flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                </svg>
                {exercise.group}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 hover:bg-secondary rounded transition-colors text-green-500"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-secondary rounded transition-colors text-red-600"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Subcategory tags */}
      <div className="flex flex-wrap gap-2">
        {displayedCategories.map((cat) => (
          <span
            key={cat}
            className="bg-[#30303D] text-muted-foreground px-3 py-1.5 rounded-2xl text-sm"
          >
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}
