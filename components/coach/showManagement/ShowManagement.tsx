/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect, useMemo } from "react";
import { Edit2, Trash2, Loader2, Plus, Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Show } from "@/redux/features/show/showTypes";
import {
  fetchShows,
  addShow,
  updateShow,
  deleteShow,
  clearMessages,
} from "@/redux/features/show/showSlice";
import { getAllAthletesByCoach } from "@/redux/features/athlete/athleteSlice";
import ShowManagementStatCard from "./showManagementStatCard/ShowManagementStatCard";
import ShowManagementModal from "./showManagementModal/ShowManagementModal";
import AssignShowModal from "./showManagementModal/AssignShowModal";
import DeleteModal from "../exerciseDatabase/deleteModal/DeleteModal";
import toast from "react-hot-toast";

const translations = {
  en: {
    title: "Show Management",
    subtitle: "Manage competition schedules and peak week triggers",
    loading: "Loading shows...",
    processing: "Processing...",
    addShowButton: "+ Add Show",
    tableHeaders: {
      showName: "Show Name",
      division: "Division",
      date: "Date",
      location: "Location",
      countdown: "Countdown",
      actions: "Actions",
    } as Record<string, string>,
    emptyStateText: "No shows added yet. Add your first show to get started.",
    emptyStateButton: "Add Your First Show",
    deleteTitle: "Delete Show",
    deleteMessage: (name: string) =>
      `Are you sure you want to delete "${name}"? This action cannot be undone.`,
    editTooltip: "Edit",
    deleteTooltip: "Delete",
    countdownFinished: "Finished",
    countdownDays: (count: number) => `${count} Day${count !== 1 ? "s" : ""}`,
    tabAllShows: "All Shows",
    tabAssignShow: "Assign Athlete",
    athleteName: "Athlete Name",
    assignedShows: "Assigned Shows",
    noAthletes: "No athletes found.",
    searchPlaceholder: "Search athletes...",
  },
  de: {
    title: "Show-Verwaltung",
    subtitle: "Verwalte Wettkampfpläne und Peak-Week-Auslöser",
    loading: "Shows werden geladen...",
    processing: "Wird verarbeitet...",
    addShowButton: "+ Show hinzufügen",
    tableHeaders: {
      showName: "Show-Name",
      division: "Division",
      date: "Datum",
      location: "Ort",
      countdown: "Countdown",
      actions: "Aktionen",
    } as Record<string, string>,
    emptyStateText:
      "Noch keine Shows hinzugefügt. Füge deine erste Show hinzu, um zu starten.",
    emptyStateButton: "Erste Show hinzufügen",
    deleteTitle: "Show löschen",
    deleteMessage: (name: string) =>
      `Möchtest du die Show „${name}“ wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`,
    editTooltip: "Bearbeiten",
    deleteTooltip: "Löschen",
    countdownFinished: "Abgeschlossen",
    countdownDays: (count: number) => `${count} Tag${count !== 1 ? "e" : ""}`,
    tabAllShows: "Alle Shows",
    tabAssignShow: "Athlet zuweisen",
    athleteName: "Name des Athleten",
    assignedShows: "Zugeordnete Shows",
    noAthletes: "Keine Athleten gefunden.",
    searchPlaceholder: "Athleten suchen...",
  },
};

export default function ShowManagement() {
  const dispatch = useAppDispatch();
  const { shows, loading, error, successMessage } = useAppSelector(
    (state) => state.show,
  );
  const { athletes } = useAppSelector((state) => state.athlete);
  const { language } = useAppSelector((state) => state.language);
  const t = translations[language as keyof typeof translations];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const [selectedShowForAssign, setSelectedShowForAssign] = useState<Show | null>(
    null,
  );
  const [deleteConfirmShow, setDeleteConfirmShow] = useState<Show | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "assign">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch shows and athletes on component mount
  useEffect(() => {
    dispatch(fetchShows());
    dispatch(getAllAthletesByCoach());
  }, [dispatch]);

  // Handle success/error messages
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
      setIsProcessing(false);
    }
    if (error) {
      toast.error(error);
      dispatch(clearMessages());
      setIsProcessing(false);
    }
  }, [error, successMessage, dispatch]);

  // Calculate statistics
  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let upcomingCount = 0;
    let peakWeekCount = 0;
    let completedCount = 0;

    shows.forEach((show) => {
      const showDate = new Date(show.date);
      const timeDiff = showDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysDiff > 7) {
        upcomingCount++;
      } else if (daysDiff > 0 && daysDiff <= 7) {
        peakWeekCount++;
      } else if (daysDiff <= 0) {
        completedCount++;
      }
    });

    return { upcomingCount, peakWeekCount, completedCount };
  }, [shows]);

  // Filter athletes based on search query
  const filteredAthletes = useMemo(() => {
    return athletes.filter((athlete: any) =>
      athlete.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      athlete.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [athletes, searchQuery]);

  const handleAddShow = () => {
    setEditingShow(null);
    setIsModalOpen(true);
  };

  const handleEditShow = (show: Show) => {
    setEditingShow(show);
    setIsModalOpen(true);
  };

  const handleAssignShow = (show: Show) => {
    setSelectedShowForAssign(show);
    setIsAssignModalOpen(true);
  };

  const handleDeleteShow = (show: Show) => {
    setDeleteConfirmShow(show);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmShow) {
      try {
        setIsProcessing(true);
        await dispatch(deleteShow(deleteConfirmShow._id)).unwrap();
        setDeleteConfirmShow(null);
      } catch (error: any) {
        setIsProcessing(false);
      }
    }
  };

  const handleSaveShow = async (formData: any) => {
    try {
      setIsProcessing(true);
      if (editingShow) {
        // Edit existing show
        await dispatch(
          updateShow({
            id: editingShow._id,
            data: formData,
          }),
        ).unwrap();
      } else {
        // Add new show
        await dispatch(addShow(formData)).unwrap();
      }
      setIsModalOpen(false);
      setEditingShow(null);
    } catch (error: any) {
      setIsProcessing(false);
    }
  };

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format countdown
  const formatCountdown = (countdown: number) => {
    if (countdown <= 0) return t.countdownFinished;
    return t.countdownDays(countdown);
  };

  // Sort shows by date (most recent first)
  const sortedShows = [...shows].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="flex h-screen bg-black text-white">
      <div className="flex-1 overflow-hidden flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {(loading || isProcessing) && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-[#1a1a2e] p-6 rounded-lg flex flex-col items-center">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
                  <span className="text-gray-300">
                    {isProcessing ? t.processing : t.loading}
                  </span>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
                <p className="text-gray-400">{t.subtitle}</p>
              </div>
              <button
                onClick={handleAddShow}
                disabled={loading || isProcessing}
                className="px-6 py-2 border border-green-500 text-green-500 rounded-full hover:bg-green-500/10 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.addShowButton}
              </button>
            </div>

            {/* Stats Cards */}
            <ShowManagementStatCard
              upcomingCount={stats.upcomingCount}
              peakWeekCount={stats.peakWeekCount}
              completedCount={stats.completedCount}
            />

            {/* Tabs */}
            <div className="flex gap-1 border-b border-[#24273f]">
              {(["all", "assign"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-semibold transition-all duration-200 border-b-2 -mb-px ${
                    activeTab === tab
                      ? "border-emerald-500 text-emerald-400"
                      : "border-transparent text-gray-400 hover:text-white hover:border-gray-500"
                  }`}
                >
                  {tab === "all" ? t.tabAllShows : t.tabAssignShow}
                </button>
              ))}
            </div>

            {/* All Shows Tab */}
            {activeTab === "all" && (
              <div className="bg-[#0f0f1e] border border-[#24273f] rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="border-b border-[#24273f] bg-[#020231]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        {t.tableHeaders.showName}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        {t.tableHeaders.division}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        {t.tableHeaders.date}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        {t.tableHeaders.location}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        {t.tableHeaders.countdown}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        {t.tableHeaders.actions}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedShows.map((show, index) => {
                      const isPast = new Date(show.date) < new Date();
                      return (
                        <tr
                          key={show._id}
                          className={`border-b border-[#303245] hover:bg-[#1a1a2a] transition-colors ${
                            index % 2 === 0 ? "bg-[#0f0f1e]" : "bg-[#0a0a14]"
                          } ${isPast ? "opacity-70" : ""}`}
                        >
                          <td className="px-6 py-4 text-white font-medium">{show.name}</td>
                          <td className="px-6 py-4 text-emerald-400">{show.division}</td>
                          <td className="px-6 py-4 text-white">{formatDisplayDate(show.date)}</td>
                          <td className="px-6 py-4 text-gray-300">{show.location}</td>
                          <td className="px-6 py-4">
                            {show.countdown <= 0 ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/40">
                                {formatCountdown(show.countdown)}
                              </span>
                            ) : (
                              <span
                                className={`font-medium ${
                                  show.countdown <= 7 ? "text-amber-400" : "text-emerald-400"
                                }`}
                              >
                                {formatCountdown(show.countdown)}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleAssignShow(show)}
                                disabled={loading || isProcessing || show.countdown <= 0}
                                className="w-8 h-8 bg-emerald-600/20 border border-emerald-600 hover:bg-emerald-600/30 rounded-full flex items-center justify-center text-emerald-400 transition-colors disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
                                title={show.countdown <= 0 ? "Show already finished" : "Assign Athlete"}
                              >
                                <Plus size={16} />
                              </button>
                              <button
                                onClick={() => handleEditShow(show)}
                                disabled={loading || isProcessing}
                                className="w-8 h-8 bg-blue-600/20 border border-blue-600 hover:bg-blue-600/30 rounded-full flex items-center justify-center text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title={t.editTooltip}
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteShow(show)}
                                disabled={loading || isProcessing}
                                className="w-8 h-8 bg-red-600/20 border border-red-600 hover:bg-red-600/30 rounded-full flex items-center justify-center text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title={t.deleteTooltip}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {!loading && shows.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg mb-4">{t.emptyStateText}</p>
                    <button
                      onClick={handleAddShow}
                      className="px-6 py-2 border border-green-500 text-green-500 rounded-full hover:bg-green-500/10 transition-colors font-medium"
                    >
                      {t.emptyStateButton}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Assign Athlete Tab */}
            {activeTab === "assign" && (
              <div className="space-y-6">
                <div className="relative max-w-md group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-emerald-500" />
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0f0f1e] border border-[#24273f] rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder:text-gray-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAthletes.length === 0 && !loading && (
                    <div className="col-span-full text-center py-12 text-gray-400 bg-[#0f0f1e] border border-[#24273f] rounded-xl">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-8 h-8 text-gray-600 mb-2" />
                        <p>{t.noAthletes}</p>
                      </div>
                    </div>
                  )}
                  {filteredAthletes.map((athlete: any) => (
                    <div
                      key={athlete._id}
                      className="bg-[#0f0f1e] border border-[#24273f] rounded-xl p-6 hover:border-emerald-500/30 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-lg">
                          {athlete.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-lg truncate group-hover:text-emerald-400 transition-colors">
                            {athlete.name}
                          </p>
                          <p className="text-gray-400 text-xs truncate">
                            {athlete.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="border-t border-[#303245] pt-4 mt-2">
                         <p className="text-gray-400 text-xs uppercase tracking-wider mb-3 leading-none">{t.assignedShows} ({athlete.shows?.length || 0})</p>
                         <div className="flex flex-wrap gap-2">
                           {athlete.shows?.length > 0 ? (
                              athlete.shows.map((showItem: any, i: number) => {
                                // Handle both populated objects and ID strings
                                const showId = typeof showItem === 'string' ? showItem : showItem._id;
                                const showName = typeof showItem === 'object' && showItem.name 
                                  ? showItem.name 
                                  : sortedShows.find(s => s._id === showId)?.name || "Show";
                                
                                return (
                                  <span 
                                    key={i} 
                                    className="px-3 py-1 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-400 font-medium whitespace-nowrap animate-in fade-in zoom-in-95 duration-200"
                                    style={{ animationDelay: `${i * 50}ms` }}
                                  >
                                    {showName}
                                  </span>
                                );
                              })
                           ) : (
                             <span className="text-gray-500 text-xs italic">No shows assigned</span>
                           )}
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <ShowManagementModal
          key={editingShow ? editingShow._id : "new-show"}
          show={editingShow}
          onSave={handleSaveShow}
          onClose={() => {
            setIsModalOpen(false);
            setEditingShow(null);
          }}
          loading={loading || isProcessing}
        />
      )}

      {isAssignModalOpen && selectedShowForAssign && (
        <AssignShowModal
          show={selectedShowForAssign}
          onClose={() => {
            setIsAssignModalOpen(false);
            setSelectedShowForAssign(null);
          }}
        />
      )}

      {deleteConfirmShow && (
        <DeleteModal
          isOpen={!!deleteConfirmShow}
          title={t.deleteTitle}
          message={t.deleteMessage(deleteConfirmShow.name)}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirmShow(null)}
        />
      )}
    </div>
  );
}
