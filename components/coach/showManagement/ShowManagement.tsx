
"use client";

import { useState, useEffect, useMemo } from "react";
import { Edit2, Trash2, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Show } from "@/redux/features/show/showTypes";
import {
  fetchShows,
  addShow,
  updateShow,
  deleteShow,
  clearMessages,
} from "@/redux/features/show/showSlice";
import ShowManagementStatCard from "./showManagementStatCard/ShowManagementStatCard";
import ShowManagementModal from "./showManagementModal/ShowManagementModal";
import DeleteModal from "../exerciseDatabase/deleteModal/DeleteModal";
import toast from "react-hot-toast";

export default function ShowManagement() {
  const dispatch = useAppDispatch();
  const { shows, loading, error, successMessage } = useAppSelector(
    (state) => state.show
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const [deleteConfirmShow, setDeleteConfirmShow] = useState<Show | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch shows on component mount
  useEffect(() => {
    dispatch(fetchShows());
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

  const handleAddShow = () => {
    setEditingShow(null);
    setIsModalOpen(true);
  };

  const handleEditShow = (show: Show) => {
    setEditingShow(show);
    setIsModalOpen(true);
  };

  const handleDeleteShow = (show: Show) => {
    setDeleteConfirmShow(show);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmShow) {
      try {
        setIsProcessing(true);
        await dispatch(deleteShow(deleteConfirmShow._id)).unwrap();
        toast.success("Show deleted successfully");
        setDeleteConfirmShow(null);
      } catch (error: any) {
        toast.error(error.message || "Failed to delete show");
        setIsProcessing(false);
      }
    }
  };

  const handleSaveShow = async (formData: any) => {
    try {
      setIsProcessing(true);
      if (editingShow) {
        // Edit existing show
        await dispatch(updateShow({
          id: editingShow._id,
          data: formData
        })).unwrap();
        toast.success("Show updated successfully");
      } else {
        // Add new show
        await dispatch(addShow(formData)).unwrap();
        toast.success("Show added successfully");
      }
      setIsModalOpen(false);
      setEditingShow(null);
      // Refresh shows
      dispatch(fetchShows());
    } catch (error: any) {
      toast.error(error.message || "Failed to save show");
      setIsProcessing(false);
    }
  };

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format countdown
  const formatCountdown = (countdown: number) => {
    if (countdown < 0) return "Completed";
    if (countdown === 0) return "Today";
    return `${countdown} Day${countdown !== 1 ? 's' : ''}`;
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
            {/* Loading overlay */}
            {(loading || isProcessing) && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-[#1a1a2e] p-6 rounded-lg flex flex-col items-center">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
                  <span className="text-gray-300">
                    {isProcessing ? "Processing..." : "Loading shows..."}
                  </span>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Show Management</h1>
                <p className="text-gray-400">
                  Manage competition schedules and peak week triggers
                </p>
              </div>
              <button
                onClick={handleAddShow}
                disabled={loading || isProcessing}
                className="px-6 py-2 border border-green-500 text-green-500 rounded-full hover:bg-green-500/10 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Add Show
              </button>
            </div>

            {/* Stats Cards */}
            <ShowManagementStatCard
              upcomingCount={stats.upcomingCount}
              peakWeekCount={stats.peakWeekCount}
              completedCount={stats.completedCount}
            />

            {/* Table */}
            <div className="bg-[#0f0f1e] border border-[#24273f] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="border-b border-[#24273f] bg-[#020231]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Show Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Division
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Countdown
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedShows.map((show, index) => {
                    const isPast = new Date(show.date) < new Date();

                    return (
                      <tr
                        key={show._id}
                        className={`border-b border-[#303245] hover:bg-[#1a1a2a] transition-colors ${index % 2 === 0 ? "bg-[#0f0f1e]" : "bg-[#0a0a14]"
                          } ${isPast ? "opacity-70" : ""}`}
                      >
                        <td className="px-6 py-4 text-white font-medium">
                          {show.name}
                        </td>
                        <td className="px-6 py-4 text-emerald-400">
                          {show.division}
                        </td>
                        <td className="px-6 py-4 text-white">
                          {formatDisplayDate(show.date)}
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {show.location}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-medium ${show.countdown <= 0
                            ? "text-gray-400"
                            : show.countdown <= 7
                              ? "text-amber-400"
                              : "text-emerald-400"
                            }`}>
                            {formatCountdown(show.countdown)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleEditShow(show)}
                              disabled={loading || isProcessing}
                              className="w-8 h-8 bg-blue-600/20 border border-blue-600 hover:bg-blue-600/30 rounded-full flex items-center justify-center text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteShow(show)}
                              disabled={loading || isProcessing}
                              className="w-8 h-8 bg-red-600/20 border border-red-600 hover:bg-red-600/30 rounded-full flex items-center justify-center text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete"
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

              {/* Empty State */}
              {!loading && shows.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg mb-4">
                    No shows added yet. Add your first show to get started.
                  </p>
                  <button
                    onClick={handleAddShow}
                    className="px-6 py-2 border border-green-500 text-green-500 rounded-full hover:bg-green-500/10 transition-colors font-medium"
                  >
                    Add Your First Show
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <ShowManagementModal
          show={editingShow}
          onSave={handleSaveShow}
          onClose={() => {
            setIsModalOpen(false);
            setEditingShow(null);
          }}
          loading={loading || isProcessing}
        />
      )}

      {deleteConfirmShow && (
        <DeleteModal
          isOpen={!!deleteConfirmShow}
          title="Delete Show"
          message={`Are you sure you want to delete "${deleteConfirmShow.name}"? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirmShow(null)}
        />
      )}
    </div>
  );
}