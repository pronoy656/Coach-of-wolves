
"use client";

import DeleteModal from "@/components/coach/exerciseDatabase/deleteModal/DeleteModal";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";

interface CheckIn {
  id: number;
  athlete: string;
  week: string;
  checkInDate: string;
  coach: string;
  weightChange: string;
  status: string;
  originalData?: {
    athleteName: string;
    weekNumber: number;
  };
}

interface CheckInTableProps {
  checkIns: CheckIn[];
  onDelete: (id: number, athleteName: string, weekNumber: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const translations = {
  en: {
    headers: {
      athlete: "Athlete",
      week: "Week",
      checkinDate: "Check-in Date",
      coach: "Coach",
      weightChange: "Weight Change",
      status: "Status",
      action: "Action",
    } as Record<string, string>,
    loading: "Loading check-ins...",
    empty: "No check-ins found matching your filters.",
    pagination: (from: number, to: number, total: number) =>
      `Showing ${from} to ${to} of ${total} results`,
    previous: "Previous",
    next: "Next",
    pageOf: (current: number, total: number) => `Page ${current} of ${total}`,
    deleteTitle: "Delete Check-In",
    deleteMessage: (athlete: string, week: number) =>
      `Are you sure you want to delete ${athlete}'s check-in for Week ${week}? This action cannot be undone.`,
    deleteTooltip: "Delete check-in",
  },
  de: {
    headers: {
      athlete: "Athlet",
      week: "Woche",
      checkinDate: "Check-in-Datum",
      coach: "Coach",
      weightChange: "Gewichtsänderung",
      status: "Status",
      action: "Aktion",
    } as Record<string, string>,
    loading: "Check-ins werden geladen...",
    empty: "Keine Check-ins für die aktuellen Filter gefunden.",
    pagination: (from: number, to: number, total: number) =>
      `Zeige ${from} bis ${to} von ${total} Ergebnissen`,
    previous: "Zurück",
    next: "Weiter",
    pageOf: (current: number, total: number) => `Seite ${current} von ${total}`,
    deleteTitle: "Check-in löschen",
    deleteMessage: (athlete: string, week: number) =>
      `Möchtest du den Check-in von ${athlete} für Woche ${week} wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`,
    deleteTooltip: "Check-in löschen",
  },
};

export default function CheckInTable({
  checkIns,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}: CheckInTableProps) {
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: number;
    athlete: string;
    weekNumber: number;
  }>({
    isOpen: false,
    id: 0,
    athlete: "",
    weekNumber: 0,
  });
  const { language } = useAppSelector((state) => state.language);
  const t = translations[language as keyof typeof translations];

  const handleDeleteClick = (id: number, athlete: string, weekNumber: number) => {
    setDeleteModal({ isOpen: true, id, athlete, weekNumber });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.athlete && deleteModal.weekNumber) {
      onDelete(deleteModal.id, deleteModal.athlete, deleteModal.weekNumber);
    }
    setDeleteModal({ isOpen: false, id: 0, athlete: "", weekNumber: 0 });
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, id: 0, athlete: "", weekNumber: 0 });
  };

  const hasData = checkIns.length > 0;

  // Get week number from "Week X" string
  const getWeekNumber = (weekString: string) => {
    const match = weekString.match(/Week (\d+)/);
    return match ? parseInt(match[1]) : 1;
  };

  return (
    <>
      <div className="bg-[#0f0f1e] border border-[#24273f] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#020231] border-b border-[#24273f]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  {t.headers.athlete}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  {t.headers.week}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  {t.headers.checkinDate}
                </th>
                <th className="px6 py-4 text-left text-sm font-semibold text-gray-300">
                  {t.headers.coach}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  {t.headers.weightChange}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  {t.headers.status}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  {t.headers.action}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
                      <span className="text-gray-400">{t.loading}</span>
                    </div>
                  </td>
                </tr>
              ) : hasData ? (
                checkIns.map((checkIn, index) => (
                  <tr
                    key={`${checkIn.athlete}-${checkIn.week}-${index}`}
                    className={`border-b border-[#303245] hover:bg-[#1a1a2a] transition-colors ${index % 2 === 0 ? "bg-[#0f0f1e]" : "bg-[#0a0a14]"
                      }`}
                  >
                    <td className="px-6 py-4 text-sm text-white">
                      {checkIn.athlete}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {checkIn.week}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {checkIn.checkInDate}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {checkIn.coach}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={
                          checkIn.weightChange.startsWith("+")
                            ? "text-red-400 font-medium"
                            : "text-emerald-400 font-medium"
                        }
                      >
                        {checkIn.weightChange}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${checkIn.status === "Completed"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}
                      >
                        {checkIn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() =>
                          handleDeleteClick(
                            checkIn.id,
                            checkIn.athlete,
                            getWeekNumber(checkIn.week)
                          )
                        }
                        disabled={loading}
                        className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={t.deleteTooltip}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-gray-400"
                  >
                    {t.empty}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="flex items-center justify-between px-6 py-4 bg-[#020231]/50 border-t border-[#303245]">
              <p className="text-sm text-gray-400">
                {t.pagination(
                  checkIns.length > 0 ? (currentPage - 1) * 10 + 1 : 0,
                  Math.min(
                    currentPage * 10,
                    checkIns.length + (currentPage - 1) * 10
                  ),
                  checkIns.length + (currentPage - 1) * 10
                )}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm rounded-lg bg-[#08081A] border border-[#303245] text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#303245]/50 transition-colors"
                >
                  {t.previous}
                </button>

                <span className="px-4 text-sm text-gray-300">
                  {t.pageOf(currentPage, totalPages)}
                </span>

                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm rounded-lg bg-[#08081A] border border-[#303245] text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#303245]/50 transition-colors"
                >
                  {t.next}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        title={t.deleteTitle}
        message={t.deleteMessage(deleteModal.athlete, deleteModal.weekNumber)}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}
