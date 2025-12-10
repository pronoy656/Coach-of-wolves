/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState } from "react";
import { Pencil, Save, ChevronDown } from "lucide-react";

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
  phase:
    | "korpegewich-gold"
    | "korpegewich-brown"
    | "korpegewich-green"
    | "Offseason";
  bodyweight: number;
  bwDelta1: number | null;
  bwDelta2: number | null;
  trainingNutrition: DailyMetric;
  restNutrition: DailyMetric;
  trainingActivity: ActivityMetric;
  restActivity: ActivityMetric;
}

// --- Mock Data (Dates updated to ISO format YYYY-MM-DD for the picker to work) ---
const initialData: TrackingRow[] = [
  {
    id: "1",
    week: 1,
    date: "2024-12-30",
    phase: "korpegewich-gold",
    bodyweight: 85.0,
    bwDelta1: null,
    bwDelta2: null,
    trainingNutrition: { protein: 200, carbs: 200, fats: 400, calories: 200 },
    restNutrition: { protein: 200, carbs: 200, fats: 200, calories: 200 },
    trainingActivity: { steps: 200, cardio: 200 },
    restActivity: { steps: 200, cardio: 200 },
  },
  {
    id: "2",
    week: 2,
    date: "2025-01-06",
    phase: "korpegewich-gold",
    bodyweight: 83.6,
    bwDelta1: -0.7,
    bwDelta2: -0.8,
    trainingNutrition: { protein: 200, carbs: 350, fats: 83.6, calories: 200 },
    restNutrition: { protein: 200, carbs: 200, fats: 200, calories: 200 },
    trainingActivity: { steps: 200, cardio: 350 },
    restActivity: { steps: 200, cardio: 200 },
  },
  {
    id: "3",
    week: 3,
    date: "2025-01-13",
    phase: "korpegewich-gold",
    bodyweight: 83.6,
    bwDelta1: -0.7,
    bwDelta2: -0.8,
    trainingNutrition: { protein: 200, carbs: 354, fats: 83.6, calories: 200 },
    restNutrition: { protein: 200, carbs: 200, fats: 200, calories: 200 },
    trainingActivity: { steps: 200, cardio: 354 },
    restActivity: { steps: 200, cardio: 200 },
  },
  {
    id: "4",
    week: 4,
    date: "2025-01-20",
    phase: "korpegewich-brown",
    bodyweight: 83.6,
    bwDelta1: -0.7,
    bwDelta2: -0.8,
    trainingNutrition: { protein: 200, carbs: 124, fats: 83.6, calories: 200 },
    restNutrition: { protein: 200, carbs: 200, fats: 200, calories: 200 },
    trainingActivity: { steps: 200, cardio: 124 },
    restActivity: { steps: 200, cardio: 200 },
  },
  {
    id: "5",
    week: 5,
    date: "2025-01-27",
    phase: "korpegewich-brown",
    bodyweight: 83.6,
    bwDelta1: -0.7,
    bwDelta2: -0.8,
    trainingNutrition: { protein: 200, carbs: 454, fats: 83.6, calories: 200 },
    restNutrition: { protein: 200, carbs: 200, fats: 200, calories: -0.8 },
    trainingActivity: { steps: 200, cardio: 454 },
    restActivity: { steps: 200, cardio: 200 },
  },
  {
    id: "6",
    week: 6,
    date: "2025-02-03",
    phase: "korpegewich-green",
    bodyweight: 83.6,
    bwDelta1: -0.7,
    bwDelta2: -0.8,
    trainingNutrition: { protein: 200, carbs: 124, fats: 83.6, calories: 200 },
    restNutrition: { protein: 200, carbs: 200, fats: 200, calories: -0.8 },
    trainingActivity: { steps: 200, cardio: 124 },
    restActivity: { steps: 200, cardio: 200 },
  },
  {
    id: "7",
    week: 7,
    date: "2025-02-10",
    phase: "Offseason",
    bodyweight: 83.6,
    bwDelta1: -0.7,
    bwDelta2: -0.8,
    trainingNutrition: { protein: 200, carbs: 457, fats: 83.6, calories: 200 },
    restNutrition: { protein: 200, carbs: 200, fats: 200, calories: -0.8 },
    trainingActivity: { steps: 200, cardio: 457 },
    restActivity: { steps: 200, cardio: 200 },
  },
];

export default function TimelineTable() {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<TrackingRow[]>(initialData);

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

  const updateRow = (id: string, path: string[], value: string | number) => {
    setData((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;

        if (path.length === 1) {
          const key = path[0] as keyof TrackingRow;
          return { ...row, [key]: value };
        }

        if (path.length === 2) {
          const parentKey = path[0] as keyof TrackingRow;
          const childKey = path[1];
          const parentObj = row[parentKey] as Record<string, any>;
          return {
            ...row,
            [parentKey]: { ...parentObj, [childKey]: value },
          };
        }
        return row;
      })
    );
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
        return "bg-[#3e562e] text-white";
      default:
        return "bg-gray-700";
    }
  };

  return (
    <div className="w-full bg-[#03030b] p-4 font-sans text-xs sm:text-sm text-white">
      {/* --- Toolbar --- */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 transition-colors hover:bg-white/10"
        >
          {isEditing ? (
            <Save className="h-4 w-4" />
          ) : (
            <Pencil className="h-4 w-4" />
          )}
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      {/* --- Scrollable Wrapper --- */}
      <div className="w-full overflow-x-auto rounded-lg border border-gray-700">
        <table className="w-full min-w-[1200px] border-collapse text-center">
          {/* --- Table Header --- */}
          <thead>
            <tr className="bg-[#8b8b93] text-gray-900 font-bold">
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
                className="border border-gray-600 w-[40px] bg-gray-400"
              ></th>
              <th
                rowSpan={2}
                className="border border-gray-600 w-[40px] bg-gray-400"
              ></th>

              <th
                colSpan={4}
                className="border border-gray-600 px-2 py-1 bg-[#8b8b93]"
              >
                Training day
              </th>
              <th
                colSpan={4}
                className="border border-gray-600 px-2 py-1 bg-[#8b8b93]"
              >
                Restday
              </th>
              <th
                colSpan={2}
                className="border border-gray-600 px-2 py-1 bg-[#8b8b93]"
              >
                Training day
              </th>
              <th
                colSpan={2}
                className="border border-gray-600 px-2 py-1 bg-[#8b8b93]"
              >
                Restday
              </th>
            </tr>

            <tr className="bg-[#a1a1aa] text-[10px] sm:text-xs text-gray-800 font-semibold">
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
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-white/5 transition-colors">
                <td className="border border-gray-700 bg-[#0d0d14] px-2 py-3">
                  {row.week}
                </td>

                {/* --- DATE COLUMN (Editable) --- */}
                <td className="border border-gray-700 bg-[#1e2029] px-2 py-3 text-xs">
                  {isEditing ? (
                    <input
                      type="date"
                      value={row.date}
                      onChange={(e) =>
                        updateRow(row.id, ["date"], e.target.value)
                      }
                      // [color-scheme:dark] ensures the calendar icon is visible in dark mode
                      className="w-full bg-transparent text-white outline-none [color-scheme:dark] cursor-pointer"
                    />
                  ) : (
                    <span>{formatDateDisplay(row.date)}</span>
                  )}
                </td>

                {/* Phase */}
                <td
                  className={`border border-gray-700 px-2 py-3 relative ${getPhaseColor(
                    row.phase
                  )}`}
                >
                  {isEditing ? (
                    <div className="relative w-full">
                      <select
                        value={row.phase}
                        onChange={(e) =>
                          updateRow(row.id, ["phase"], e.target.value)
                        }
                        className="w-full appearance-none bg-transparent text-white outline-none font-medium cursor-pointer"
                      >
                        <option value="korpegewich-gold" className="text-black">
                          korpegewich (Gold)
                        </option>
                        <option
                          value="korpegewich-brown"
                          className="text-black"
                        >
                          korpegewich (Brown)
                        </option>
                        <option
                          value="korpegewich-green"
                          className="text-black"
                        >
                          korpegewich (Green)
                        </option>
                        <option value="Offseason" className="text-black">
                          Offseason
                        </option>
                      </select>
                      <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>
                        {row.phase
                          .split("-")[0]
                          .replace("Offseason", "Offseason")}
                      </span>
                      <ChevronDown className="w-3 h-3 opacity-50" />
                    </div>
                  )}
                </td>

                {/* Bodyweight */}
                <td className="border border-gray-700 bg-[#101017] px-2 py-3 font-mono">
                  <InputCell
                    isEditing={isEditing}
                    value={row.bodyweight}
                    onChange={(v) => updateRow(row.id, ["bodyweight"], v)}
                  />
                </td>
                <td className="border border-gray-700 bg-[#1e2029] text-gray-400 text-[10px]">
                  {row.bwDelta1 ?? "--"}
                </td>
                <td className="border border-gray-700 bg-[#1e2029] text-gray-400 text-[10px]">
                  {row.bwDelta2 ?? "--"}
                </td>

                {/* Training Nutrition */}
                <td className="border border-gray-700 bg-black font-bold text-white px-1">
                  <InputCell
                    isEditing={isEditing}
                    value={row.trainingNutrition.protein}
                    onChange={(v) =>
                      updateRow(row.id, ["trainingNutrition", "protein"], v)
                    }
                  />
                </td>
                <td className="border border-gray-700 bg-[#0a0a0f] text-gray-300 px-1">
                  <InputCell
                    isEditing={isEditing}
                    value={row.trainingNutrition.carbs}
                    onChange={(v) =>
                      updateRow(row.id, ["trainingNutrition", "carbs"], v)
                    }
                  />
                </td>
                <td className="border border-gray-700 bg-[#0a0a0f] text-gray-300 px-1">
                  <InputCell
                    isEditing={isEditing}
                    value={row.trainingNutrition.fats}
                    onChange={(v) =>
                      updateRow(row.id, ["trainingNutrition", "fats"], v)
                    }
                  />
                </td>
                <td className="border border-gray-700 bg-[#0a0a0f] text-gray-300 px-1">
                  <InputCell
                    isEditing={isEditing}
                    value={row.trainingNutrition.calories}
                    onChange={(v) =>
                      updateRow(row.id, ["trainingNutrition", "calories"], v)
                    }
                  />
                </td>

                {/* Rest Nutrition */}
                <td className="border border-gray-700 bg-[#15151e] text-gray-300 px-1">
                  <InputCell
                    isEditing={isEditing}
                    value={row.restNutrition.protein}
                    onChange={(v) =>
                      updateRow(row.id, ["restNutrition", "protein"], v)
                    }
                  />
                </td>
                <td className="border border-gray-700 bg-[#15151e] text-gray-300 px-1">
                  <InputCell
                    isEditing={isEditing}
                    value={row.restNutrition.carbs}
                    onChange={(v) =>
                      updateRow(row.id, ["restNutrition", "carbs"], v)
                    }
                  />
                </td>
                <td className="border border-gray-700 bg-[#15151e] text-gray-300 px-1">
                  <InputCell
                    isEditing={isEditing}
                    value={row.restNutrition.fats}
                    onChange={(v) =>
                      updateRow(row.id, ["restNutrition", "fats"], v)
                    }
                  />
                </td>
                <td className="border border-gray-700 bg-[#15151e] text-gray-300 px-1">
                  <InputCell
                    isEditing={isEditing}
                    value={row.restNutrition.calories}
                    onChange={(v) =>
                      updateRow(row.id, ["restNutrition", "calories"], v)
                    }
                  />
                </td>

                {/* Training Activity */}
                <td className="border border-gray-700 bg-[#15151e] font-bold text-white px-1">
                  <InputCell
                    isEditing={isEditing}
                    value={row.trainingActivity.steps}
                    onChange={(v) =>
                      updateRow(row.id, ["trainingActivity", "steps"], v)
                    }
                  />
                </td>
                <td className="border border-gray-700 bg-[#1a1a24] text-gray-300 px-1">
                  <InputCell
                    isEditing={isEditing}
                    value={row.trainingActivity.cardio}
                    onChange={(v) =>
                      updateRow(row.id, ["trainingActivity", "cardio"], v)
                    }
                  />
                </td>

                {/* Rest Activity */}
                <td className="border border-gray-700 bg-[#1e2029] text-gray-300 px-1">
                  <InputCell
                    isEditing={isEditing}
                    value={row.restActivity.steps}
                    onChange={(v) =>
                      updateRow(row.id, ["restActivity", "steps"], v)
                    }
                  />
                </td>
                <td className="border border-gray-700 bg-[#1e2029] text-gray-300 px-1">
                  <InputCell
                    isEditing={isEditing}
                    value={row.restActivity.cardio}
                    onChange={(v) =>
                      updateRow(row.id, ["restActivity", "cardio"], v)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const InputCell = ({
  isEditing,
  value,
  onChange,
}: {
  isEditing: boolean;
  value: number;
  onChange: (val: number) => void;
}) => {
  if (isEditing) {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-white/10 text-center text-white outline-none focus:bg-white/20 p-1 rounded"
      />
    );
  }
  return <span>{value}</span>;
};
