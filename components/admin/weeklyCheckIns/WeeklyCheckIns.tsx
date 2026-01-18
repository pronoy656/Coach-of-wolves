"use client";

import { useState, useMemo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { WeeklyCheckin } from "@/redux/features/weeklyCheckin/weeklyCheckinTypes";
import {
  fetchWeeklyCheckins,
  deleteWeeklyCheckin,
  clearMessages,
} from "@/redux/features/weeklyCheckin/weeklyCheckinSlice";
import WeeklyStatCard from "./weeklyStatCard/WeeklyStatCard";
import WeekCalender from "./weekCalender/WeekCalender";
import CheckInTable from "./checkInTable/CheckInTable";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const translations = {
  en: {
    title: "Weekly Check-Ins",
    subtitle: "Monitor all athlete check-ins and progress",
    loadingOverlay: "Loading check-ins...",
    searchPlaceholder: "Search athlete or coach...",
    statusFilterAll: "All Status",
    statusFilterPending: "Pending",
    statusFilterCompleted: "Completed",
    activeFiltersPrefix: "Showing",
    activeFiltersFor: "check-ins for",
    activeFiltersOnlySuffix: (status: string) => ` (${status} only)`,
    activeFiltersSearchSuffix: (term: string) => ` matching "${term}"`,
  },
  de: {
    title: "Wöchentliche Check-ins",
    subtitle: "Überwache alle Check-ins und Fortschritte deiner Athleten",
    loadingOverlay: "Check-ins werden geladen...",
    searchPlaceholder: "Athlet oder Coach suchen...",
    statusFilterAll: "Alle Status",
    statusFilterPending: "Ausstehend",
    statusFilterCompleted: "Abgeschlossen",
    activeFiltersPrefix: "Zeige",
    activeFiltersFor: "Check-ins für",
    activeFiltersOnlySuffix: (status: string) => ` (${status} nur)`,
    activeFiltersSearchSuffix: (term: string) => ` passend zu „${term}“`,
  },
};

export default function WeeklyCheckIns() {
  const dispatch = useAppDispatch();
  const { checkins, loading, error, successMessage, stats } = useAppSelector(
    (state) => state.weeklyCheckin
  );
  const { language } = useAppSelector((state) => state.language);
  const t = translations[language as keyof typeof translations];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedWeek, setSelectedWeek] = useState<string>("Week 1");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Format date function - MOVED BEFORE useMemo
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Fetch checkins on component mount
  useEffect(() => {
    dispatch(fetchWeeklyCheckins());
  }, [dispatch]);

  // Handle success/error messages
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
    }
    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
  }, [error, successMessage, dispatch]);

  // Filter and transform data
  const filteredCheckIns = useMemo(() => {
    const weekNumber = parseInt(selectedWeek.replace("Week ", ""));

    return checkins.filter((checkIn) => {
      const matchesSearch =
        searchTerm === "" ||
        checkIn.athleteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        checkIn.coachName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "All" || checkIn.checkinCompleted === selectedStatus;

      const matchesWeek = checkIn.weekNumber === weekNumber;

      return matchesSearch && matchesStatus && matchesWeek;
    });
  }, [searchTerm, selectedStatus, selectedWeek, checkins]);

  // Transform data for table - NOW formatDate IS AVAILABLE
  const tableData = useMemo(() => {
    return filteredCheckIns.map((checkIn, index) => ({
      id: index + 1,
      athlete: checkIn.athleteName,
      week: `Week ${checkIn.weekNumber}`,
      checkInDate: formatDate(checkIn.nextCheckInDate),
      coach: checkIn.coachName,
      weightChange: `${checkIn.weight > 0 ? "+" : ""}${checkIn.weight.toFixed(
        1
      )}(kg)`,
      status: checkIn.checkinCompleted,
      originalData: checkIn, // Keep original for operations
    }));
  }, [filteredCheckIns]); // formatDate is stable, no need to include in dependencies

  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const paginatedCheckIns = tableData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle delete
  const handleDeleteCheckIn = async (
    id: number,
    athleteName: string,
    weekNumber: number
  ) => {
    // We need to find the correct _id for the thunk
    const checkinToDelete = filteredCheckIns.find(
      (c) => c.athleteName === athleteName && c.weekNumber === weekNumber
    );
    if (!checkinToDelete) {
      toast.error("Could not find check-in ID to delete");
      return;
    }

    try {
      await dispatch(deleteWeeklyCheckin(checkinToDelete._id)).unwrap();
      toast.success("Check-in deleted successfully");
    } catch (error: any) {
      toast.error(error || "Failed to delete check-in");
    }
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleWeekChange = (week: string) => {
    setSelectedWeek(week);
    setCurrentPage(1);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <div className="flex-1 overflow-hidden flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {loading && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-[#1a1a2e] p-6 rounded-lg flex flex-col items-center">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
                  <span className="text-gray-300">{t.loadingOverlay}</span>
                </div>
              </div>
            )}

            <div>
              <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
              <p className="text-gray-400">{t.subtitle}</p>
            </div>

            {/* Stats Cards Component */}
            <WeeklyStatCard
              completedCount={stats.completedCount}
              pendingCount={stats.pendingCount}
              completionRate={stats.completionRate}
            />

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

                <select
                  value={selectedStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="px-4 py-2 bg-[#08081A] border border-[#303245] rounded-lg text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  disabled={loading}
                >
                  <option value="All">{t.statusFilterAll}</option>
                  <option value="Pending">{t.statusFilterPending}</option>
                  <option value="Completed">{t.statusFilterCompleted}</option>
                </select>

                {/* Week Calendar */}
                <WeekCalender
                  selectedWeek={selectedWeek}
                  onWeekChange={handleWeekChange}
                />
              </div>

              <div className="text-sm text-gray-400">
                {t.activeFiltersPrefix} {filteredCheckIns.length}{" "}
                {t.activeFiltersFor} {selectedWeek}
                {selectedStatus !== "All" &&
                  t.activeFiltersOnlySuffix(selectedStatus)}
                {searchTerm && t.activeFiltersSearchSuffix(searchTerm)}
              </div>
            </div>

            {/* Table Component */}
            <CheckInTable
              checkIns={paginatedCheckIns}
              onDelete={handleDeleteCheckIn}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              loading={loading}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
