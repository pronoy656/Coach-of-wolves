/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState, useEffect } from "react";
import { Pencil, Save, ChevronDown, Loader2, CheckSquare } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchTimelineByAthlete, updateTimelinePhases, clearMessages } from "@/redux/features/timeline/timelineSlice";
import { TimelineItem } from "@/redux/features/timeline/timelineType";
import toast from "react-hot-toast";

// --- Types ---
interface DailyMetric {
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
}

interface ActivityMetric {
  steps: number;
  cardio: number;
}

export interface TrackingRow {
  id: string;
  week: number;
  date: string; // Stored as YYYY-MM-DD for easy editing
  phase: string;
  bodyweight: number;
  bwDelta1: number | null;
  bwDelta2: number | null;
  trainingNutrition: DailyMetric;
  restNutrition: DailyMetric;
  trainingActivity: ActivityMetric;
  restActivity: ActivityMetric;
}

interface TimelineTabProps {
  athleteId: string;
}

export default function TimelineTable({ athleteId }: TimelineTabProps) {
  const dispatch = useAppDispatch();
  const { timeline, loading, error, successMessage } = useAppSelector((state) => state.timeline);
  const [data, setData] = useState<TrackingRow[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
  const [selectedPhase, setSelectedPhase] = useState("");

  const phasesList = [
    "Offseason",
    "Offseasons",
    "Reverse-Diet-Phase",
    "korpegewich-gold",
    "korpegewich-brown",
    "korpegewich-green",
    "Prep",
  ];

  useEffect(() => {
    if (athleteId) {
      dispatch(fetchTimelineByAthlete(athleteId));
    }
  }, [dispatch, athleteId]);

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

  useEffect(() => {
    const allWeeks: TrackingRow[] = Array.from({ length: 52 }, (_, index) => {
      // Find item if timeline has a week property, else assume positional
      const item = timeline.find((t: any) => t.week === index + 1) || timeline[index];

      if (item) {
        return {
          id: item._id || (item as any).id || `empty-${index + 1}`,
          week: index + 1,
          date: item.checkInDate || "",
          phase: item.phase || "",
          bodyweight: item.averages?.restDay?.avgWeight || item.averages?.trainingDay?.avgWeight || 0,
          bwDelta1: null,
          bwDelta2: null,
          trainingNutrition: {
            protein: item.averages?.trainingDay?.avgProtein || 0,
            carbs: item.averages?.trainingDay?.avgCarbs || 0,
            fats: item.averages?.trainingDay?.avgFats || 0,
            calories: item.averages?.trainingDay?.avgCalories || 0,
          },
          restNutrition: {
            protein: item.averages?.restDay?.avgProtein || 0,
            carbs: item.averages?.restDay?.avgCarbs || 0,
            fats: item.averages?.restDay?.avgFats || 0,
            calories: item.averages?.restDay?.avgCalories || 0,
          },
          trainingActivity: {
            steps: item.averages?.trainingDay?.avgActivityStep || 0,
            cardio: item.averages?.trainingDay?.avgCardioPerMin || 0,
          },
          restActivity: {
            steps: item.averages?.restDay?.avgActivityStep || 0,
            cardio: item.averages?.restDay?.avgCardioPerMin || 0,
          },
        };
      }

      // Empty placeholder for week
      return {
        id: `empty-${index + 1}`,
        week: index + 1,
        date: "",
        phase: "",
        bodyweight: 0,
        bwDelta1: null,
        bwDelta2: null,
        trainingNutrition: { protein: 0, carbs: 0, fats: 0, calories: 0 },
        restNutrition: { protein: 0, carbs: 0, fats: 0, calories: 0 },
        trainingActivity: { steps: 0, cardio: 0 },
        restActivity: { steps: 0, cardio: 0 },
      };
    });

    setData(allWeeks);
  }, [timeline]);

  // Helper to format YYYY-MM-DD to "30 Dec, 24"
  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    }).format(date);
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "korpegewich-gold":
        return "bg-[#D4A017] text-white";
      case "korpegewich-brown":
        return "bg-[#653616] text-white";
      case "korpegewich-green":
        return "bg-[#357a38] text-white";
      case "Offseason":
      case "Offseasons":
        return "bg-[#3e562e] text-white";
      default:
        return "bg-gray-700";
    }
  };

  const handleSelectRow = (id: string, index: number, e: React.MouseEvent) => {
    if (e.shiftKey && lastSelectedIndex !== null) {
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);

      const newSelected = new Set(selectedIds);
      for (let i = start; i <= end; i++) {
        newSelected.add(data[i].id);
      }
      setSelectedIds(Array.from(newSelected));
    } else {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
      setLastSelectedIndex(index);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(data.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handlePhaseChange = (newPhase: string, rowId: string) => {
    if (!newPhase) return;

    const idsToUpdate =
      selectedIds.includes(rowId) && selectedIds.length > 1
        ? selectedIds
        : [rowId];

    // Update locally so UI reflects change immediately
    setData((prev) =>
      prev.map((r) => (idsToUpdate.includes(r.id) ? { ...r, phase: newPhase } : r))
    );

    const validApiIds = idsToUpdate.filter((id) => !id.startsWith("empty"));

    if (validApiIds.length === 0) {
      toast.error("Cannot assign phase to an empty week. Wait for timeline data.");
      setSelectedIds([]);
      setSelectedPhase("");
      return;
    }

    // Always fire API unconditionally 
    dispatch(
      updateTimelinePhases({ athleteId, timelineIds: validApiIds, newPhase })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setSelectedIds([]);
        setSelectedPhase("");
        // Refetch to sync from backend
        dispatch(fetchTimelineByAthlete(athleteId)); 
      }
    });
  };

  const handleUpdatePhase = () => {
    if (selectedIds.length === 0 || !selectedPhase) return;
    handlePhaseChange(selectedPhase, selectedIds[0]);
  };

  return (
    <div className="w-full bg-[#03030b] p-4 font-sans text-xs sm:text-sm text-white">
      {/* --- Toolbar --- */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <>
              <span className="text-gray-400 text-sm">{selectedIds.length} selected</span>
              <select
                value={selectedPhase}
                onChange={(e) => setSelectedPhase(e.target.value)}
                className="bg-[#1e2029] border border-gray-600 rounded px-3 py-1.5 focus:outline-none"
              >
                <option value="">Select new phase...</option>
                {phasesList.map((p) => (
                  <option key={p} value={p}>
                    {p.replace(/-/g, " ")}
                  </option>
                ))}
              </select>
              <button
                onClick={handleUpdatePhase}
                disabled={!selectedPhase || loading}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 text-white rounded px-4 py-1.5 font-medium transition"
              >
                {loading ? "Updating..." : "Update Phase"}
              </button>
            </>
          )}
        </div>
        {loading && <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />}
      </div>

      {/* --- Scrollable Wrapper --- */}
      <div className="w-full overflow-x-auto rounded-lg border border-gray-700">
        <table className="w-full min-w-[1200px] border-collapse text-center">
          {/* --- Table Header --- */}
          <thead>
            <tr className="bg-[#a8a8af] text-gray-900 font-bold">
              <th
                rowSpan={2}
                className="border border-gray-600 px-2 py-1 w-12"
              >
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    selectedIds.length > 0 &&
                    selectedIds.length === data.length
                  }
                  className="rounded bg-black border-gray-500"
                />
              </th>
              <th
                rowSpan={2}
                className="border border-gray-600 px-2 py-1 min-w-10"
              >
                Week
              </th>
              <th
                rowSpan={2}
                className="border border-gray-600 px-2 py-1 min-w-[100px]"
              >
                Date
              </th>
              <th
                rowSpan={2}
                className="border border-gray-600 px-2 py-1 min-w-[140px]"
              >
                Phase
              </th>
              <th
                rowSpan={2}
                className="border border-gray-600 px-2 py-1 min-w-[60px]"
              >
                Bodyweight
              </th>
              <th
                rowSpan={2}
                className="border border-gray-600 w-10 bg-gray-400"
              ></th>
              <th
                rowSpan={2}
                className="border border-gray-600 w-10 bg-gray-400"
              ></th>

              <th
                colSpan={4}
                className="border border-gray-600 px-2 py-1 bg-[#a9a9af]"
              >
                Training day
              </th>
              <th
                colSpan={4}
                className="border border-gray-600 px-2 py-1 bg-[#a9a9af]"
              >
                Restday
              </th>
              <th
                colSpan={2}
                className="border border-gray-600 px-2 py-1 bg-[#a9a9af]"
              >
                Training day
              </th>
              <th
                colSpan={2}
                className="border border-gray-600 px-2 py-1 bg-[#a9a9af]"
              >
                Restday
              </th>
            </tr>

            <tr className="bg-[#a8a8af] text-[10px] sm:text-xs text-gray-800 font-semibold">
              <th className="border border-gray-600 py-1">Protein</th>
              <th className="border border-gray-600 py-1">Carbs</th>
              <th className="border border-gray-600 py-1">Fats</th>
              <th className="border border-gray-600 py-1">Calories</th>
              <th className="border border-gray-600 py-1">Protein</th>
              <th className="border border-gray-600 py-1">Carbs</th>
              <th className="border border-gray-600 py-1">Fats</th>
              <th className="border border-gray-600 py-1">Calories</th>
              <th className="border border-gray-600 py-1">Steps</th>
              <th className="border border-gray-600 py-1">Cardio (min)</th>
              <th className="border border-gray-600 py-1">Steps</th>
              <th className="border border-gray-600 py-1">Cardio (min)</th>
            </tr>
          </thead>

          {/* --- Table Body --- */}
          <tbody>
            {data.map((row, index) => {
              const isEmpty = row.id.startsWith("empty");
              const isSelected = selectedIds.includes(row.id);

              return (
                <tr key={row.id} className="hover:bg-white/5 transition-colors">
                  <td className="border border-gray-700 bg-[#0d0d14] p-0 align-middle text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      onClick={(e) => handleSelectRow(row.id, index, e)}
                      className="rounded bg-black border-gray-500 cursor-pointer w-4 h-4 mx-auto"
                    />
                  </td>
                  <td className="border border-gray-700 bg-[#0d0d14] px-2 py-3">
                    {row.week}
                  </td>

                {/* --- DATE COLUMN --- */}
                <td className="border border-gray-700 bg-[#1e2029] px-2 py-3 text-xs">
                  <span>{formatDateDisplay(row.date)}</span>
                </td>

                {/* Phase */}
                <td
                  className={`border border-gray-700 px-0 relative ${getPhaseColor(
                    row.phase
                  )}`}
                >
                  <div className="flex items-center justify-between w-full h-full relative">
                    <select
                      value={row.phase}
                      onChange={(e) => handlePhaseChange(e.target.value, row.id)}
                      className="w-full h-full bg-transparent text-white appearance-none cursor-pointer focus:outline-none px-2 py-3"
                      disabled={loading}
                    >
                      <option value="" className="bg-gray-800 text-gray-400">
                         Select phase
                      </option>
                      {phasesList.map((p) => (
                        <option key={p} value={p} className="bg-gray-800 text-white">
                          {p.replace(/-/g, " ")}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 opacity-50 absolute right-2 pointer-events-none" />
                  </div>
                </td>

                {/* Bodyweight */}
                <td className="border border-gray-700 bg-[#101017] px-2 py-3 font-mono">
                  <span>{row.bodyweight}</span>
                </td>
                <td className="border border-gray-700 bg-[#1e2029] text-gray-400 text-[10px]">
                  {row.bwDelta1 ?? "--"}
                </td>
                <td className="border border-gray-700 bg-[#1e2029] text-gray-400 text-[10px]">
                  {row.bwDelta2 ?? "--"}
                </td>

                {/* Training Nutrition */}
                <td className="border border-gray-700 bg-black font-bold text-white px-1">
                  <span>{row.trainingNutrition.protein}</span>
                </td>
                <td className="border border-gray-700 bg-[#0a0a0f] text-gray-300 px-1">
                  <span>{row.trainingNutrition.carbs}</span>
                </td>
                <td className="border border-gray-700 bg-[#0a0a0f] text-gray-300 px-1">
                  <span>{row.trainingNutrition.fats}</span>
                </td>
                <td className="border border-gray-700 bg-[#0a0a0f] text-gray-300 px-1">
                  <span>{row.trainingNutrition.calories}</span>
                </td>

                {/* Rest Nutrition */}
                <td className="border border-gray-700 bg-[#15151e] text-gray-300 px-1">
                  <span>{row.restNutrition.protein}</span>
                </td>
                <td className="border border-gray-700 bg-[#15151e] text-gray-300 px-1">
                  <span>{row.restNutrition.carbs}</span>
                </td>
                <td className="border border-gray-700 bg-[#15151e] text-gray-300 px-1">
                  <span>{row.restNutrition.fats}</span>
                </td>
                <td className="border border-gray-700 bg-[#15151e] text-gray-300 px-1">
                  <span>{row.restNutrition.calories}</span>
                </td>

                {/* Training Activity */}
                <td className="border border-gray-700 bg-[#15151e] font-bold text-white px-1">
                  <span>{row.trainingActivity.steps}</span>
                </td>
                <td className="border border-gray-700 bg-[#1a1a24] text-gray-300 px-1">
                  <span>{row.trainingActivity.cardio}</span>
                </td>

                {/* Rest Activity */}
                <td className="border border-gray-700 bg-[#1e2029] text-gray-300 px-1">
                  <span>{row.restActivity.steps}</span>
                </td>
                <td className="border border-gray-700 bg-[#1e2029] text-gray-300 px-1">
                  <span>{row.restActivity.cardio}</span>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

