"use client";

import { Edit2, Trash2 } from "lucide-react";

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  note: string;
}

interface SupplementsListProps {
  supplements: Supplement[];
  onEdit: (supplement: Supplement) => void;
  onDelete: (id: string) => void;
}

export default function SupplementsList({
  supplements,
  onEdit,
  onDelete,
}: SupplementsListProps) {
  if (supplements.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No supplements found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {supplements.map((supplement) => (
        <div
          key={supplement.id}
          className="bg-[#08081A] border border-[#303245] rounded-lg p-6"
        >
          {/* Supplement Name and Actions */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">{supplement.name}</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onEdit(supplement)}
                className="p-2 hover:bg-[#303245] rounded-lg transition-colors text-emerald-400"
                aria-label="Edit supplement"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(supplement.id)}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-500"
                aria-label="Delete supplement"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Supplement Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Dosage */}
            <div>
              <p className="text-gray-300 mb-1">Dosage</p>
              <p className="text-emerald-400 font-medium">
                {supplement.dosage}
              </p>
            </div>

            {/* Frequency */}
            <div>
              <p className="text-gray-300 mb-1">Frequency</p>
              <p className="text-emerald-400 font-medium">
                {supplement.frequency}
              </p>
            </div>

            {/* Purpose */}
            <div>
              <p className="text-gray-300 mb-1">Purpose</p>
              <p className="text-emerald-400 font-medium">
                {supplement.purpose}
              </p>
            </div>

            {/* Note */}
            <div>
              <p className="text-gray-300 mb-1">Note</p>
              <p className="text-emerald-400 font-medium">{supplement.note}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
