"use client";

import { X, Calendar, MapPin, Target, Trophy } from "lucide-react";
import { Athlete } from "@/redux/features/coachAthletes/coachAthletesType";

interface ViewShowsDetailsModalProps {
  athlete: Athlete;
  onClose: () => void;
}

export default function ViewShowsDetailsModal({
  athlete,
  onClose,
}: ViewShowsDetailsModalProps) {
  const shows = (athlete as any).shows || [];

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-[70] p-4">
        <div className="bg-[#08081A] border border-[#303245] rounded-xl p-8 max-w-4xl w-full relative shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2 border-b border-[#303245] pb-4">
            <Trophy size={28} className="text-amber-400" />
            {athlete.name}'s Details
          </h2>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-8">
            {/* Athlete Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-[#111125] p-5 rounded-lg border border-[#303245]">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email</p>
                  <p className="text-sm text-gray-200">{athlete.email || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Age</p>
                  <p className="text-sm text-gray-200">{athlete.age ? `${athlete.age} years` : "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Gender</p>
                  <p className="text-sm text-gray-200">{athlete.gender || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Height</p>
                  <p className="text-sm text-gray-200">{athlete.height ? `${athlete.height} cm` : "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Weight</p>
                  <p className="text-sm text-gray-200">{athlete.weight ? `${athlete.weight} kg` : "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Status</p>
                  <p className="text-sm text-gray-200">{athlete.status || "N/A"}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Competition & Program Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-[#111125] p-5 rounded-lg border border-[#303245]">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Category</p>
                  <p className="text-sm text-gray-200">{athlete.category || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Phase</p>
                  <p className="text-sm text-gray-200">{athlete.phase || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Goal</p>
                  <p className="text-sm text-gray-200">{athlete.goal || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Water Intake</p>
                  <p className="text-sm text-gray-200">{athlete.waterQuantity ? `${athlete.waterQuantity} L` : "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Training Steps</p>
                  <p className="text-sm text-gray-200">{athlete.trainingDaySteps ? athlete.trainingDaySteps.toLocaleString() : "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Rest Steps</p>
                  <p className="text-sm text-gray-200">{athlete.restDaySteps ? athlete.restDaySteps.toLocaleString() : "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Check-In Day</p>
                  <p className="text-sm text-gray-200">{athlete.checkInDay || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Assigned Shows Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Assigned Shows
                </h3>
                <span className="text-xs bg-slate-800 text-gray-300 px-3 py-1 rounded-full border border-[#303245]">
                  Total: {shows.length}
                </span>
              </div>
              
              <div className="space-y-3">
                {shows.length > 0 ? (
                  shows.map((show: any, index: number) => {
                    const isObject = typeof show === 'object' && show !== null;
                    const showName = isObject ? show.name : "Unknown Show (ID Only)";
                    const showDate = isObject ? show.date : null;
                    const showLocation = isObject ? show.location : "Unknown Location";
                    const showDivision = isObject ? show.division : "Unknown Division";
                    const showCountdown = isObject ? show.countdown : 0;

                    return (
                      <div
                        key={isObject ? show._id || index : show}
                        className="bg-[#111125] border border-[#303245] rounded-lg p-5 flex flex-col gap-3 transition-colors hover:border-emerald-500/50"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="text-base font-bold text-emerald-400">
                            {showName}
                          </h4>
                          {isObject && showCountdown !== undefined && (
                            <div className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full whitespace-nowrap">
                              <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                                {showCountdown} days left
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                          {showDate && (
                            <div className="flex items-center gap-2 text-gray-300">
                              <Calendar size={14} className="text-gray-500" />
                              <span className="text-sm">
                                {new Date(showDate).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          )}
                          
                          {showLocation && (
                            <div className="flex items-center gap-2 text-gray-300">
                              <MapPin size={14} className="text-gray-500" />
                              <span className="text-sm">{showLocation}</span>
                            </div>
                          )}

                          {showDivision && (
                            <div className="flex items-center gap-2 text-gray-300">
                              <Target size={14} className="text-gray-500" />
                              <span className="text-sm">{showDivision}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10 bg-[#111125] border border-[#303245] border-dashed rounded-lg">
                    <Trophy size={40} className="mx-auto text-gray-600 mb-3" />
                    <p className="text-gray-400 text-sm">No shows assigned to this athlete yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-[#303245]">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white font-semibold hover:border-emerald-400 hover:bg-slate-800/70 transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
