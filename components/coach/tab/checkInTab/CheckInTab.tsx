// import React from "react";

// export default function CheckInTab() {
//   return <div>CheckInTab</div>;
// }

"use client";

import { useState, useEffect } from "react";
import { Loader2, Calendar, Weight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchWeeklyCheckins, clearMessages, updateCheckinStatus } from "@/redux/features/weeklyCheckin/weeklyCheckinSlice";
import { WeeklyCheckin } from "@/redux/features/weeklyCheckin/weeklyCheckinTypes";
import DeleteModal from "../../exerciseDatabase/deleteModal/DeleteModal";
import CheckInDetailsPage from "./CheckInDetailsPage";
import toast from "react-hot-toast";

interface CheckInTabProps {
  athleteId: string;
}

export default function CheckInTab({ athleteId }: CheckInTabProps) {
  const dispatch = useAppDispatch();
  const { checkins, loading, error, successMessage } = useAppSelector((state) => state.weeklyCheckin);
  const [selectedCheckInId, setSelectedCheckInId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchWeeklyCheckins());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
    }
    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
  }, [successMessage, error, dispatch]);

  // Set first check-in as selected by default if none selected
  useEffect(() => {
    if (checkins.length > 0 && !selectedCheckInId) {
      setSelectedCheckInId(checkins[0]._id);
    }
  }, [checkins, selectedCheckInId]);

  const handleDeleteCheckIn = () => {
    // Backend delete not provided yet in the request, but we can clear it locally or wait for endpoint
    if (deleteId) {
      toast.error("Delete functionality not fully implemented on backend");
      setDeleteId(null);
    }
  };

  const currentCheckIn = checkins.find((c) => c._id === selectedCheckInId);

  const handleUpdateStatus = () => {
    if (currentCheckIn && currentCheckIn.userId) {
      dispatch(updateCheckinStatus(currentCheckIn.userId));
    }
  };

  return (
    <div className="min-h-screen p-2 md:p-6 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-white">Check-Ins</h1>
        </div>

        {loading && checkins.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
            <p className="text-gray-500">Loading check-ins...</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Main Content Area - Full Width */}
            <div className="w-full">
              {currentCheckIn ? (
                <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
                  <div className="bg-gradient-to-br from-[#111111] to-[#0a0a0a] border border-[#2a2a2a] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 blur-[100px]" />

                    <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-8 relative text-center md:text-left">
                      <div className="space-y-8 flex-1">
                        <div>
                          <p className="text-gray-500 text-xs uppercase tracking-widest mb-2 font-semibold">Check-in Date</p>
                          <p className="text-white font-black text-2xl md:text-3xl uppercase tracking-tighter">
                            {new Date(currentCheckIn.createdAt).toLocaleDateString(undefined, {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-12 md:gap-20">
                          <div>
                            <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Current Weight</p>
                            <p className="text-emerald-500 text-4xl md:text-5xl font-black">
                              {currentCheckIn.currentWeight} <span className="text-lg font-normal text-gray-500 ml-1">kg</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Average Weight</p>
                            <p className="text-emerald-500/80 text-4xl md:text-5xl font-black">
                              {currentCheckIn.averageWeight} <span className="text-lg font-normal text-gray-500 ml-1">kg</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center md:items-end gap-4">
                        <span className={`px-6 py-2 rounded-full border text-xs font-black uppercase tracking-widest ${currentCheckIn.checkinCompleted === "Completed"
                          ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                          : "bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                          }`}>
                          {currentCheckIn.checkinCompleted === "Completed" ? "Completed" : "Action Required"}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-[#2a2a2a] pt-10 mt-10">
                      <div className="relative group">
                        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-emerald-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                        <p className="text-gray-400 text-lg leading-relaxed italic pl-4">
                          "{currentCheckIn.athleteNote || "The athlete didn't provide any specific notes for this check-in."}"
                        </p>
                      </div>
                    </div>
                  </div>

                  <CheckInDetailsPage
                    checkIn={currentCheckIn}
                    onDelete={() => setDeleteId(currentCheckIn._id)}
                  />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center bg-[#0a0a0a] border border-dashed border-[#2a2a2a] rounded-3xl min-h-[500px]">
                  <div className="w-16 h-16 rounded-full bg-[#111111] border border-[#2a2a2a] flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-gray-500 italic text-lg">Select a check-in card from the list above</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {deleteId && (
        <DeleteModal
          isOpen={!!deleteId}
          title="Delete Check-In"
          message="Are you sure you want to delete this check-in? This action cannot be undone."
          onConfirm={handleDeleteCheckIn}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
