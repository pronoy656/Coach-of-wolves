"use client";

import { useState, useMemo, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import axiosInstance from "@/lib/axiosInstance";
import WeeklyStatCard from "./weeklyStatCard/WeeklyStatCard";
import CheckInTable, { AthleteTableData } from "./checkInTable/CheckInTable";
import ViewHistoryModal from "./viewHistoryModal/ViewHistoryModal";
import toast from "react-hot-toast";

const translations = {
  en: {
    title: "Weekly Check-Ins",
    subtitle: "Monitor all athlete check-ins and progress",
    searchPlaceholder: "Search athlete name or email...",
    activeFiltersPrefix: "Showing",
    activeFiltersFor: "check-ins",
    activeFiltersSearchSuffix: (term: string) => ` matching "${term}"`,
  },
  de: {
    title: "Wöchentliche Check-ins",
    subtitle: "Überwache alle Check-ins und Fortschritte deiner Athleten",
    searchPlaceholder: "Athletenname oder E-Mail suchen...",
    activeFiltersPrefix: "Zeige",
    activeFiltersFor: "Check-ins",
    activeFiltersSearchSuffix: (term: string) => ` passend zu "${term}"`,
  },
};

export default function WeeklyCheckIns() {
  const { language } = useAppSelector((state) => state.language);
  const t = translations[language as keyof typeof translations];

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [athletes, setAthletes] = useState<AthleteTableData[]>([]);
  const [loading, setLoading] = useState(true);

  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteTableData | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Fetch athletes table on component mount
  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/check-in/weekly-table/coach");
        if (res.data?.success) {
          setAthletes(res.data.data);
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch athletes table");
      } finally {
        setLoading(false);
      }
    };
    fetchAthletes();
  }, []);

  // Filter and transform data
  const filteredAthletes = useMemo(() => {
    return athletes.filter((athlete) => {
      const name = athlete.name || "";
      const email = athlete.email || "";

      return (
        searchTerm === "" ||
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm, athletes]);

  const totalPages = Math.ceil(filteredAthletes.length / itemsPerPage);
  const paginatedAthletes = filteredAthletes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleViewHistory = async (athlete: AthleteTableData) => {
    setSelectedAthlete(athlete);
    setHistoryModalOpen(true);
    setHistoryLoading(true);
    try {
      const res = await axiosInstance.get(`/check-in/history/${athlete.athleteId}`);
      if (res.data?.success) {
        setHistoryData(res.data.data);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch check-in history");
      setHistoryData([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <div className="flex-1 overflow-hidden flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
              <p className="text-gray-400">{t.subtitle}</p>
            </div>

            {/* Stats Cards Component */}
            <WeeklyStatCard />

            {/* Filters */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 flex-wrap">
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="flex-1 min-w-[200px] px-4 py-2 bg-[#08081A] border border-[#303245] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  disabled={loading}
                />
              </div>

              <div className="text-sm text-gray-400">
                {t.activeFiltersPrefix} {filteredAthletes.length} {t.activeFiltersFor}
                {searchTerm && t.activeFiltersSearchSuffix(searchTerm)}
              </div>
            </div>

            {/* Table Component */}
            <CheckInTable
              athletes={paginatedAthletes}
              onViewHistory={handleViewHistory}
              currentPage={currentPage}
              totalPages={totalPages || 1}
              onPageChange={setCurrentPage}
              loading={loading}
            />
          </div>
        </main>
      </div>

      {/* History Modal */}
      {selectedAthlete && (
        <ViewHistoryModal
          isOpen={historyModalOpen}
          onClose={() => setHistoryModalOpen(false)}
          athleteName={selectedAthlete.name}
          history={historyData}
          loading={historyLoading}
        />
      )}
    </div>
  );
}
