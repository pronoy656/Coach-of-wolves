"use client";

import { Edit2, Trash2 } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { Supplement } from "@/redux/features/supplement/coachSupplementSlice";

const translations = {
  en: {
    noSupplementsFound: "No supplements found",
    brand: "Brand",
    dosage: "Dosage",
    frequency: "Frequency",
    purpose: "Purpose",
    note: "Note",
    time: "Time",
  },
  de: {
    noSupplementsFound: "Keine Nahrungsergänzungsmittel gefunden",
    brand: "Marke",
    dosage: "Dosierung",
    frequency: "Häufigkeit",
    purpose: "Zweck",
    note: "Notiz",
    time: "Zeit",
  },
};

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
  const { language } = useAppSelector((state) => state.language);
  const t = translations[language as keyof typeof translations];

  if (supplements.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">{t.noSupplementsFound}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {supplements.map((supplement) => (
        <div
          key={supplement._id}
          className="bg-[#08081A] border border-[#303245] rounded-lg p-6"
        >
          {/* Supplement Name and Actions */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-white">{supplement.name}</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onEdit(supplement)}
                className="p-2 hover:bg-[#303245] rounded-lg transition-colors text-emerald-400"
                aria-label="Edit supplement"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(supplement._id)}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-500"
                aria-label="Delete supplement"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Supplement Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Brand */}
            <div>
              <p className="text-gray-300 mb-1 text-xl">{t.brand}</p>
              <p className="text-emerald-400 font-medium text-base">
                {supplement.brand}
              </p>
            </div>

            {/* Dosage */}
            <div>
              <p className="text-gray-300 mb-1 text-xl">{t.dosage}</p>
              <p className="text-emerald-400 font-medium text-base">
                {supplement.dosage}
              </p>
            </div>

            {/* Frequency */}
            <div>
              <p className="text-gray-300 mb-1 text-xl">{t.frequency}</p>
              <p className="text-emerald-400 font-medium text-base">
                {supplement.frequency}
              </p>
            </div>

            {/* Time */}
            <div>
              <p className="text-gray-300 mb-1 text-xl">{t.time}</p>
              <p className="text-emerald-400 font-medium text-base">
                {supplement.time}
              </p>
            </div>

            {/* Purpose */}
            <div>
              <p className="text-gray-300 mb-1 text-xl">{t.purpose}</p>
              <p className="text-emerald-400 font-medium text-base">
                {supplement.purpose}
              </p>
            </div>
          </div>

          {/* Note */}
          {supplement.note && (
            <div className="mt-4 pt-4 border-t border-[#303245]">
              <p className="text-gray-300 mb-1 text-xl">{t.note}</p>
              <p className="text-gray-400 text-base">{supplement.note}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
