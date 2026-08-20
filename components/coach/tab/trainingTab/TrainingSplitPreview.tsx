import { Pencil, Trash2, Calendar, Dumbbell, Loader2 } from "lucide-react";
import { TrainingSplit, SplitDay } from "@/redux/features/trainingSplit/trainingSplitTypes";
import { useAppSelector } from "@/redux/hooks";

const translations = {
  en: {
    header: "Training Split Schedule",
    created: "Created:",
    days: (count: number) => `${count} days`,
    edit: "Edit split",
    delete: "Delete split",
    dayCol: "Day",
    workoutCol: "Workout",
    restRecovery: "Rest/Recovery Day",
    noDays: "No training days configured",
    workoutDays: "Workout Days",
    restDays: "Rest Days",
    totalDays: "Total Days",
    dayNames: {
      "Day 1": "Day 1",
      "Day 2": "Day 2",
      "Day 3": "Day 3",
      "Day 4": "Day 4",
      "Day 5": "Day 5",
      "Day 6": "Day 6",
      "Day 7": "Day 7",
    }
  },
  de: {
    header: "Trainings-Split Zeitplan",
    created: "Erstellt:",
    days: (count: number) => `${count} Tage`,
    edit: "Split bearbeiten",
    delete: "Split löschen",
    dayCol: "Tag",
    workoutCol: "Training",
    restRecovery: "Ruhe-/Erholungstag",
    noDays: "Keine Trainingstage konfiguriert",
    workoutDays: "Trainingstage",
    restDays: "Ruhetage",
    totalDays: "Tage gesamt",
    dayNames: {
      "Day 1": "Tag 1",
      "Day 2": "Tag 2",
      "Day 3": "Tag 3",
      "Day 4": "Tag 4",
      "Day 5": "Tag 5",
      "Day 6": "Tag 6",
      "Day 7": "Tag 7",
    }
  }
};

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
  const { language } = useAppSelector((state) => state.language);
  const t = translations[language as keyof typeof translations] || translations.en;

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === "de" ? "de-DE" : "en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  const dayMapping: Record<string, string> = {
    "Monday": "Day 1",
    "Tuesday": "Day 2",
    "Wednesday": "Day 3",
    "Thursday": "Day 4",
    "Friday": "Day 5",
    "Saturday": "Day 6",
    "Sunday": "Day 7"
  };

  // Helper to get consistent day label
  const getDayLabel = (day: string) => {
    const mapped = dayMapping[day] || day;
    return t.dayNames[mapped as keyof typeof t.dayNames] || mapped;
  };

  // Sort splits by day
  const sortedSplits = [...split.splite].sort((a, b) => {
    const getSortKey = (dayStr: string) => dayMapping[dayStr] || dayStr;
    const labelA = getSortKey(a.day);
    const labelB = getSortKey(b.day);

    const daysOrder = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];
    const indexA = daysOrder.indexOf(labelA);
    const indexB = daysOrder.indexOf(labelB);

    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    // Fallback for custom labels like "Day 8" or numeric-prefixed days
    const numA = parseInt(labelA.match(/\d+/)?.[0] || "0");
    const numB = parseInt(labelB.match(/\d+/)?.[0] || "0");
    return numA - numB || labelA.localeCompare(labelB);
  });

  return (
    <div className="bg-gradient-to-br from-[#141424] to-[#0f0f1e] border border-[#2d2d45] rounded-lg overflow-hidden">
      <div className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2d45] bg-gradient-to-r from-[#1a1a2e] to-[#16213e]">
          <div>
            <h3 className="font-semibold text-lg mb-1">{t.header}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{t.created} {formatDate(split.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Dumbbell className="w-3 h-3" />
                <span>{t.days(split.splite.length)}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              disabled={loading}
              className="w-10 h-10 rounded-full bg-blue-600/20 border-2 border-blue-600 hover:bg-blue-600/30 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title={t.edit}
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
              title={t.delete}
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>

        {/* Split Days Table */}
        <div className="overflow-hidden">
          <div className="grid grid-cols-12 bg-[#1a1a30] px-6 py-3 text-sm font-medium">
            <div className="col-span-3">{t.dayCol}</div>
            <div className="col-span-9">{t.workoutCol}</div>
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
                    <span className="font-medium text-white">{getDayLabel(splitDay.day)}</span>
                  </div>
                </div>
                <div className="col-span-9">
                  <div className="text-gray-300">{splitDay.exerciseName}</div>
                  {splitDay.exerciseName.toLowerCase().includes('rest') ||
                    splitDay.exerciseName.toLowerCase().includes('recovery') ? (
                    <span className="text-xs text-gray-400 mt-1 block">{t.restRecovery}</span>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              {t.noDays}
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
              <div className="text-xs text-gray-400">{t.workoutDays}</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-400">
                {sortedSplits.filter(s =>
                  s.exerciseName.toLowerCase().includes('rest') ||
                  s.exerciseName.toLowerCase().includes('recovery')
                ).length}
              </div>
              <div className="text-xs text-gray-400">{t.restDays}</div>
            </div>
            <div>
              <div className="text-lg font-bold text-amber-400">
                {split.splite.length}
              </div>
              <div className="text-xs text-gray-400">{t.totalDays}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}