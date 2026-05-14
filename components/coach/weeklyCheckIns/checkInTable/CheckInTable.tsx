"use client";

import { Eye, Loader2, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";

export interface AthleteTableData {
  athleteId: string;
  avatar: string;
  name: string;
  email: string;
  nextCheckIn: string | null;
}

interface CheckInTableProps {
  athletes: AthleteTableData[];
  onViewHistory: (athlete: AthleteTableData) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const translations = {
  en: {
    headers: {
      athlete: "Athlete",
      email: "Email",
      nextCheckinDate: "Next Check-in",
      action: "Action",
    } as Record<string, string>,
    loading: "Loading athletes...",
    empty: "No athletes found matching your search.",
    pagination: (from: number, to: number, total: number) =>
      `Showing ${from} to ${to} of ${total} results`,
    previous: "Previous",
    next: "Next",
    pageOf: (current: number, total: number) => `Page ${current} of ${total}`,
    viewTooltip: "View History",
  },
  de: {
    headers: {
      athlete: "Athlet",
      email: "E-Mail",
      nextCheckinDate: "Nächster Check-in",
      action: "Aktion",
    } as Record<string, string>,
    loading: "Athleten werden geladen...",
    empty: "Keine Athleten gefunden, die deiner Suche entsprechen.",
    pagination: (from: number, to: number, total: number) =>
      `Zeige ${from} bis ${to} von ${total} Ergebnissen`,
    previous: "Zurück",
    next: "Weiter",
    pageOf: (current: number, total: number) => `Seite ${current} von ${total}`,
    viewTooltip: "Verlauf anzeigen",
  },
};

export default function CheckInTable({
  athletes,
  onViewHistory,
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}: CheckInTableProps) {
  const { language } = useAppSelector((state) => state.language);
  const t = translations[language as keyof typeof translations];

  const hasData = athletes.length > 0;

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
                  {t.headers.email}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  {t.headers.nextCheckinDate}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  {t.headers.action}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-12">
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
                      <span className="text-gray-400">{t.loading}</span>
                    </div>
                  </td>
                </tr>
              ) : hasData ? (
                athletes.map((athlete, index) => (
                  <tr
                    key={athlete.athleteId}
                    className={`border-b border-[#303245] hover:bg-[#1a1a2a] transition-colors ${
                      index % 2 === 0 ? "bg-[#0f0f1e]" : "bg-[#0a0a14]"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-500/20 border border-emerald-500/30 flex-shrink-0 flex items-center justify-center relative">
                          {athlete.avatar && !athlete.avatar.includes("null") ? (
                         <img
              src={athlete.avatar}
              alt={athlete.name}
              width={64}
              height={64}
              className="w-16 h-16 min-w-[4rem] min-h-[4rem] rounded-full object-cover border-2 border-[#4A9E4A]/30"
            />
                          ) : (
                            <span className="text-emerald-500 font-bold text-sm">
                              {athlete.name?.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-medium text-white">
                          {athlete.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {athlete.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          athlete.nextCheckIn
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                        }`}
                      >
                        {athlete.nextCheckIn || "Not Scheduled"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onViewHistory(athlete)}
                          disabled={loading}
                          className="p-2 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={t.viewTooltip}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/coach/details/${athlete.athleteId}?tab=Check-Ins`}
                          className={`p-2 bg-emerald-500/20 text-emerald-400 rounded-full hover:bg-emerald-500/30 transition-colors ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                          title="Redirect to details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-400">
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
                  athletes.length > 0 ? (currentPage - 1) * 10 + 1 : 0,
                  Math.min(currentPage * 10, (currentPage - 1) * 10 + athletes.length),
                  athletes.length // Normally we would show total size here if we had backend pagination. For now, we do local pagination.
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
    </>
  );
}
