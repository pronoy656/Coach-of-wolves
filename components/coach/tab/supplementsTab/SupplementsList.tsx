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
    link: "Link",
    view: "View",
  },
  de: {
    noSupplementsFound: "Keine Nahrungsergänzungsmittel gefunden",
    brand: "Marke",
    dosage: "Dosierung",
    frequency: "Häufigkeit",
    purpose: "Zweck",
    note: "Notiz",
    time: "Zeit",
    link: "Link",
    view: "Ansehen",
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
      <div className="text-center py-16 bg-gradient-to-br from-[#141424] to-[#0f0f1e] border border-[#2d2d45] rounded-xl">
        <p className="text-gray-400 text-base">{t.noSupplementsFound}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {supplements.map((supplement) => {
        // Legacy support: if the DB has the link stored in frequency
        let actualLink = supplement.productLink || (supplement as any).link;
        let actualFrequency = supplement.frequency;

        if (
          supplement.frequency &&
          (supplement.frequency.includes("http") ||
            supplement.frequency.includes("www.") ||
            supplement.frequency.includes(".com"))
        ) {
          if (!actualLink) {
            actualLink = supplement.frequency;
          }
          actualFrequency = "-"; // Clear frequency as it was mistakenly a link
        }

        return (
          <div
            key={supplement._id}
            className="bg-gradient-to-br from-[#141424] to-[#0f0f1e] border border-[#2d2d45] hover:border-emerald-500/40 rounded-xl p-5 transition-all shadow-md group"
          >
            {/* Supplement Name and Actions */}
            <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-[#2d2d45]/60">
              <h3 className="text-lg font-bold text-white tracking-wide">
                {supplement.name}
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onEdit(supplement)}
                  className="w-8 h-8 rounded-full bg-blue-600/10 border border-blue-600/50 hover:bg-blue-600/30 flex items-center justify-center transition-all"
                  title="Edit supplement"
                  aria-label="Edit supplement"
                >
                  <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                </button>
                <button
                  onClick={() => onDelete(supplement._id)}
                  className="w-8 h-8 rounded-full bg-red-600/10 border border-red-600/50 hover:bg-red-600/30 flex items-center justify-center transition-all"
                  title="Delete supplement"
                  aria-label="Delete supplement"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            </div>

            {/* Supplement Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Brand */}
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">{t.brand}</p>
                <p className="text-sm font-medium text-emerald-400 truncate">
                  {supplement.brand || "-"}
                </p>
              </div>

              {/* Dosage */}
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">{t.dosage}</p>
                <p className="text-sm font-medium text-emerald-400 truncate">
                  {supplement.dosage || "-"}
                </p>
              </div>

              {/* Frequency */}
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">{t.frequency}</p>
                <p className="text-sm font-medium text-emerald-400 truncate">
                  {actualFrequency || "-"}
                </p>
              </div>

              {/* Time */}
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">{t.time}</p>
                <p className="text-sm font-medium text-emerald-400 truncate">
                  {supplement.time || "-"}
                </p>
              </div>

              {/* Purpose */}
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">{t.purpose}</p>
                <p className="text-sm font-medium text-emerald-400 truncate">
                  {supplement.purpose || "-"}
                </p>
              </div>

              {/* Link */}
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">{(t as any).link}</p>
                {actualLink ? (
                  <a
                    href={
                      actualLink.startsWith("http")
                        ? actualLink
                        : `https://${actualLink}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-400 hover:text-blue-300 underline inline-block truncate max-w-full"
                  >
                    {(t as any).view}
                  </a>
                ) : (
                  <p className="text-sm font-medium text-gray-500">-</p>
                )}
              </div>
            </div>

            {/* Note */}
            {supplement.note && (
              <div className="mt-3 pt-3 border-t border-[#2d2d45]/60">
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">{t.note}</p>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{supplement.note}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
