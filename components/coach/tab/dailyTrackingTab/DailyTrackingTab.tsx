/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchDailyWeekData } from "@/redux/features/tab/dailyTrackingSlice";
import { Loader2, ChevronDown, MessageSquare, Send } from "lucide-react";
import toast from "react-hot-toast";

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

type CellType = "text" | "number" | "dropdown" | "input" | "read-only";

interface RowData {
  id: string;
  label: string;
  subLabel?: string;
  unit?: string;
  type: CellType;
  values: (string | number)[]; // 7 days
  average?: string | number;
  rowColor?: string; // Hex override for specific rows
  cellColors?: string[]; // Specific background colors for each cell in the row
}

interface SectionData {
  title: string;
  rows: RowData[];
}

// --- Components ---

const HeaderCell = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`flex items-center justify-center text-xs font-bold text-white uppercase tracking-wider ${className}`}
  >
    {children}
  </div>
);

const DataCell = ({
  value,
  type,
  bgColor = "bg-[#2B2B3D]", // Default dark grey
  textColor = "text-gray-200",
}: {
  value: string | number;
  type: CellType;
  bgColor?: string;
  textColor?: string;
}) => {
  const isDropdown = type === "dropdown";

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center p-2 text-xs text-center border-none outline-none overflow-hidden ${textColor}`}
      style={{ backgroundColor: bgColor }}
    >
      {isDropdown ? (
        <div className="flex items-center justify-center w-full px-2">
          <span>{value}</span>
        </div>
      ) : (
        <span className="w-full wrap-break-word">{value}</span>
      )}
    </div>
  );
};

const LabelCell = ({
  label,
  subLabel,
  unit,
  bgColor = "bg-[#3f3f4e]", // Slightly lighter grey for label column
}: {
  label: string;
  subLabel?: string;
  unit?: string;
  bgColor?: string;
}) => (
  <div
    className={`flex flex-col justify-center px-4 py-2 h-full text-white font-bold text-sm leading-tight`}
    style={{ backgroundColor: bgColor }}
  >
    <span className="uppercase">{label}</span>
    {unit && <span className="text-xs font-normal">{unit}</span>}
    {subLabel && (
      <span className="text-[10px] text-gray-400 font-normal uppercase mt-1">
        {subLabel}
      </span>
    )}
  </div>
);

// --- Main Dashboard Component ---

export default function Dashboard() {
  const params = useParams();
  const userId = params.id as string;
  const dispatch = useAppDispatch();
  const { weekData, averages, loading, error } = useAppSelector(
    (state) => state.dailyTracking
  );

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined
  );
  const [coachNote, setCoachNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Generate a list of previous weeks (last 4 weeks for now)
  const getWeekOptions = () => {
    const options: { label: string; value: string | undefined }[] = [
      { label: "Current Week", value: undefined },
    ];
    const today = new Date();

    for (let i = 1; i <= 52; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i * 7);
      // Find the Monday of that week
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d.setDate(diff));

      const dateStr = monday.toISOString().split("T")[0];
      options.push({
        label: `Week of ${monday.toLocaleDateString()}`,
        value: dateStr,
      });
    }
    return options;
  };

  const weekOptions = getWeekOptions();

  useEffect(() => {
    if (userId) {
      dispatch(fetchDailyWeekData({ userId, date: selectedDate }));
    }
  }, [dispatch, userId, selectedDate]);

  const handleSubmitNote = async () => {
    if (!coachNote.trim()) {
      toast.error("Please enter a note before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      // Mocking submission logic - This should be replaced with a real API call or Redux thunk
      // For now we'll just show a success message as the backend endpoint is not yet defined
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Coach note submitted successfully!");
      setCoachNote("");
    } catch (err) {
      toast.error("Failed to submit coach note");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0C15] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0C15] flex items-center justify-center">
        <p className="text-red-500 text-xl font-bold">{error}</p>
      </div>
    );
  }

  const getValues = (path: string) => {
    return Array.from({ length: 7 }).map((_, i) => {
      const dayData = weekData[i];
      if (!dayData) return "";
      const keys = path.split(".");
      let val: any = dayData;
      for (const key of keys) {
        val = val?.[key];
      }
      // If val is null, undefined, or the string "none", return empty string
      if (val === null || val === undefined) {
        return "";
      }
      return val;
    });
  };

  const getAverage = (path: string) => {
    if (!averages) return "";
    const keys = path.split(".");
    let val: any = averages;
    for (const key of keys) {
      val = val?.[key];
    }
    // Handle null, undefined or "none" for averages
    if (
      val === null ||
      val === undefined ||
      String(val).toLowerCase() === "none"
    ) {
      return "";
    }
    return typeof val === "number" ? val.toFixed(1) : val;
  };

  // Reconstructing dynamic data using the EXACT original design structure
  const dataSections: SectionData[] = [
    {
      title: "", // Top section (Weight)
      rows: [
        {
          id: "weight",
          label: "WEIGHT",
          unit: "(kg)",
          type: "read-only",
          values: getValues("weight"),
          average: getAverage("weight"),
          rowColor: "#593C62",
        },
      ],
    },
    {
      title: "Nutrition & Digestion",
      rows: [
        {
          id: "cal",
          label: "CALORIE",
          type: "read-only",
          values: getValues("nutrition.calories"),
          average: getAverage("nutrition.calories"),
        },
        {
          id: "e",
          label: "E",
          unit: "(g)",
          type: "read-only",
          values: getValues("nutrition.protein"),
          average: getAverage("nutrition.protein"),
          rowColor: "#593C62",
        },
        {
          id: "k",
          label: "K",
          unit: "(g)",
          type: "read-only",
          values: getValues("nutrition.carbs"),
          average: getAverage("nutrition.carbs"),
        },
        {
          id: "f",
          label: "F",
          unit: "(g)",
          type: "read-only",
          values: getValues("nutrition.fats"),
          average: getAverage("nutrition.fats"),
          rowColor: "#593C62",
        },
        {
          id: "salt",
          label: "Salt",
          unit: "(g)",
          type: "read-only",
          values: getValues("nutrition.salt"),
          average: getAverage("nutrition.salt"),
        },
        {
          id: "hunger",
          label: "HUNGER",
          subLabel: "SCALE 1-10",
          type: "dropdown",
          values: getValues("nutrition.hungerLevel"),
          average: getAverage("nutrition.hungerLevel"),
          cellColors: [
            "#D97706",
            "#D97706",
            "#B45309",
            "#EAB308",
            "#EAB308",
            "#EAB308",
            "#EAB308",
          ],
        },
        {
          id: "digestion",
          label: "Digestion",
          subLabel: "SCALE 1-10",
          type: "dropdown",
          values: getValues("nutrition.digestionLevel"),
          average: getAverage("nutrition.digestionLevel"),
          cellColors: [
            "#D97706",
            "#D97706",
            "#B45309",
            "#EAB308",
            "#EAB308",
            "#EAB308",
            "#EAB308",
          ],
        },
      ],
    },
    {
      title: "ACTIVITY",
      rows: [
        {
          id: "steps",
          label: "Steps",
          type: "read-only",
          values: getValues("activityStep"),
          average: getAverage("activityStep"),
        },
        {
          id: "cardio",
          label: "CARDIO",
          unit: "(min)",
          type: "read-only",
          values: getValues("training.duration"),
          average: getAverage("training.cardioDuration"),
          rowColor: "#593C62",
        },
        {
          id: "training",
          label: "TRAINING",
          type: "text",
          values: Array.from({ length: 7 }).map(
            (_, i) => weekData[i]?.training?.trainingPlan?.join(", ") || ""
          ),
          average: "",
        },
      ],
    },
    {
      title: "Sleep",
      rows: [
        {
          id: "sleep_dur",
          label: "Sleep duration",
          subLabel: "subjective perception",
          type: "text",
          values: getValues("sleepHour"),
          average: getAverage("sleepHour"),
        },
        {
          id: "sleep_qual",
          label: "Sleep quality",
          type: "text",
          values: getValues("sleepQuality"),
          average: getAverage("sleepQuality"),
          rowColor: "#593C62",
        },
      ],
    },
    {
      title: "Sick",
      rows: [
        {
          id: "sickness",
          label: "Sickness",
          subLabel: "YES / NO",
          type: "dropdown",
          values: Array.from({ length: 7 }).map((_, i) =>
            weekData[i] ? (weekData[i].sick ? "YES" : "NO") : ""
          ),
          average: "",
          cellColors: [
            "#B45309",
            "#B45309",
            "#B45309",
            "#B45309",
            "#4d7c0f",
            "#B45309",
            "#4d7c0f",
          ],
        },
      ],
    },
    {
      title: "Well-Being",
      rows: [
        {
          id: "mood",
          label: "Mood",
          subLabel: "SCALE 1-10",
          type: "dropdown",
          values: getValues("energyAndWellBeing.mood"),
          average: getAverage("energyAndWellBeing.mood"),
          cellColors: [
            "#D97706",
            "#B45309",
            "#EAB308",
            "#EAB308",
            "#B45309",
            "#B45309",
            "#B45309",
          ],
        },
        {
          id: "motivation",
          label: "Motivation",
          subLabel: "SCALE 1-10",
          type: "dropdown",
          values: getValues("energyAndWellBeing.motivation"),
          average: getAverage("energyAndWellBeing.motivation"),
          cellColors: [
            "#D97706",
            "#B45309",
            "#EAB308",
            "#EAB308",
            "#B45309",
            "#B45309",
            "#B45309",
          ],
        },
        {
          id: "energy",
          label: "ENERGY",
          subLabel: "SCALE 1-10",
          type: "dropdown",
          values: getValues("energyAndWellBeing.energyLevel"),
          average: getAverage("energyAndWellBeing.energyLevel"),
          cellColors: [
            "#D97706",
            "#B45309",
            "#EAB308",
            "#EAB308",
            "#B45309",
            "#B45309",
            "#B45309",
          ],
        },
        {
          id: "muscle",
          label: "Muscle ache",
          subLabel: "SCALE 1-10",
          type: "dropdown",
          values: getValues("energyAndWellBeing.muscelLevel"),
          average: getAverage("energyAndWellBeing.muscelLevel"),
          cellColors: [
            "#EAB308",
            "#EAB308",
            "#EAB308",
            "#B45309",
            "#EAB308",
            "#4d7c0f",
            "#4d7c0f",
          ],
        },
        {
          id: "stress",
          label: "STRESS",
          subLabel: "SCALE 1-10",
          type: "dropdown",
          values: getValues("energyAndWellBeing.stressLevel"),
          average: getAverage("energyAndWellBeing.stressLevel"),
          cellColors: [
            "#EAB308",
            "#15803d",
            "#15803d",
            "#EAB308",
            "#4d7c0f",
            "#EAB308",
            "#4d7c0f",
          ],
        },
      ],
    },
    {
      title: "Training Plan",
      rows: [
        {
          id: "tr_comp",
          label: "Training Completed",
          type: "text",
          values: Array.from({ length: 7 }).map((_, i) =>
            weekData[i]
              ? weekData[i].training?.trainingCompleted
                ? "Yes"
                : "No"
              : ""
          ),
          average: "",
        },
        {
          id: "tr_plan",
          label: "Training Plan",
          type: "text",
          values: Array.from({ length: 7 }).map(
            (_, i) => weekData[i]?.training?.trainingPlan?.join(", ") || ""
          ),
          average: "",
        },
        {
          id: "cardio_comp",
          label: "Cardio Completed",
          type: "text",
          values: Array.from({ length: 7 }).map((_, i) =>
            weekData[i]
              ? weekData[i].training?.cardioCompleted
                ? "Yes"
                : "No"
              : ""
          ),
          average: "",
        },

        {
          id: "cardio_type",
          label: "Cardio Type",
          type: "text",
          values: getValues("training.cardioType"),
          average: "",
        },
        {
          id: "duration",
          label: "Duration",
          type: "text",
          values: getValues("training.duration"),
          average: getAverage("training.cardioDuration"),
        },
      ],
    },
    {
      title: "Women",
      rows: [
        {
          id: "cycle_phase",
          label: "Cycle Phase",
          type: "text",
          values: getValues("woman.cyclePhase"),
          average: "",
        },
        {
          id: "cycle_day",
          label: "Cycle day",
          type: "text",
          values: getValues("woman.cycleDay"),
          average: "",
        },
        {
          id: "pms",
          label: "PMS symptoms",
          subLabel: "SCALE 1-10",
          type: "dropdown",
          values: getValues("woman.pmsSymptoms"),
          average: getAverage("woman.pmsSymptoms"),
          cellColors: [
            "#B45309",
            "#D97706",
            "#EAB308",
            "#EAB308",
            "#B45309",
            "#B45309",
            "#EAB308",
          ],
        },
        {
          id: "cramps",
          label: "Cramps",
          subLabel: "SCALE 1-10",
          type: "dropdown",
          values: getValues("woman.cramps"),
          average: getAverage("woman.cramps"),
          cellColors: [
            "#B45309",
            "#D97706",
            "#EAB308",
            "#EAB308",
            "#B45309",
            "#B45309",
            "#EAB308",
          ],
        },
        {
          id: "symptoms",
          label: "Symptoms",
          type: "text",
          values: Array.from({ length: 7 }).map(
            (_, i) => weekData[i]?.woman?.symptoms?.join(", ") || ""
          ),
          average: "",
        },
      ],
    },
    {
      title: "PEDs",
      rows: [
        {
          id: "dosage",
          label: "Daily dosage taken",
          type: "text",
          values: getValues("ped.dailyDosage"),
          average: "",
        },
        {
          id: "side_effects",
          label: "Side effects notes",
          type: "text",
          values: getValues("ped.sideEffect"),
          average: "",
        },
      ],
    },
    {
      title: "Everyone",
      rows: [
        {
          id: "bp",
          label: "Blood pressure",
          type: "text",
          values: Array.from({ length: 7 }).map((_, i) => {
            const bp = weekData[i]?.bloodPressure;
            if (!bp) return "";
            return `${bp.systolic}/${bp.diastolic}`;
          }),
          average: averages?.bloodPressure
            ? `${Number(averages.bloodPressure.systolic).toFixed(0)}/${Number(
              averages.bloodPressure.diastolic
            ).toFixed(0)}`
            : "",
        },
        {
          id: "rhr",
          label: "Resting heart rate",
          type: "text",
          values: getValues("bloodPressure.restingHeartRate"),
          average: getAverage("bloodPressure.restingHeartRate"),
        },
        {
          id: "glucose",
          label: "Blood glucose",
          type: "text",
          values: getValues("bloodPressure.bloodGlucose"),
          average: getAverage("bloodPressure.bloodGlucose"),
        },
      ],
    },

    {
      title: "Daily Note",
      rows: [
        {
          id: "notes",
          label: "Daily Notes",
          type: "text",
          values: getValues("dailyNotes"),
          average: "",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0C15] p-6 font-sans text-white">
      {/* Top Header Button with Dropdown */}
      <div className="mb-6 relative" ref={dropdownRef}>
        <button
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="flex items-center gap-2 px-6 py-3 bg-[#0f101a] border border-gray-700 rounded-lg hover:bg-[#1a1b26] transition-colors text-white font-medium"
        >
          <CalendarIcon />
          <span className="text-base">
            {selectedDate
              ? `Week of ${new Date(selectedDate).toLocaleDateString()}`
              : "Current Week"}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isCalendarOpen ? "rotate-180" : ""
              }`}
          />
        </button>

        {isCalendarOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-[#1a1b26] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {weekOptions.map((option) => (
                <button
                  key={option.value || "current"}
                  onClick={() => {
                    setSelectedDate(option.value);
                    setIsCalendarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-[#2B2B3D] transition-colors border-b border-gray-800 last:border-none ${selectedDate === option.value
                    ? "bg-[#2B2B3D] text-emerald-500"
                    : "text-gray-300"
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Grid Container */}
      <div className="w-full border border-gray-800 rounded-lg overflow-hidden bg-[#0B0C15]">
        {/* Table Header Section */}
        <div className="grid grid-cols-[1.2fr_repeat(7,1fr)_0.8fr] gap-px bg-[#0B0C15]">
          {/* Corner Cell */}
          <div className="bg-[#9CA3AF] flex items-center justify-center h-20">
            <span className="text-xl font-bold text-white">Data</span>
          </div>

          {/* Days Columns */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-col h-20">
              <div className="flex-1 bg-[#d1d5db] flex items-center justify-center">
                <span className="text-gray-800 font-bold text-sm uppercase">
                  TAG {i + 1}
                </span>
              </div>
              <div className="flex-1 bg-[#1F1F2E] flex items-center justify-center border-t border-gray-700 px-1">
                <span className="text-gray-300 text-[10px] text-center">
                  {weekData[i]?.date || `Day ${i + 1}`}
                </span>
              </div>
            </div>
          ))}

          {/* Average Column Header */}
          <div className="bg-[#9CA3AF] flex items-center justify-center h-20">
            <span className="text-sm font-bold text-white">Average</span>
          </div>
        </div>

        {/* Data Sections */}
        <div className="flex flex-col gap-[1px] bg-[#0B0C15]">
          {dataSections.map((section, secIndex) => (
            <React.Fragment key={secIndex}>
              {/* Section Title */}
              {section.title && (
                <div className="py-2 bg-[#0B0C15] flex items-center justify-center">
                  <h3 className="text-lg font-bold text-white">
                    {section.title}
                  </h3>
                </div>
              )}

              {/* Rows */}
              {section.rows.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-[1.2fr_repeat(7,1fr)_0.8fr] gap-[1px] bg-[#0B0C15] min-h-[50px]"
                >
                  {/* Label Column */}
                  <LabelCell
                    label={row.label}
                    subLabel={row.subLabel}
                    unit={row.unit}
                    bgColor={row.rowColor ? row.rowColor + "99" : "#373745"}
                  />

                  {/* Value Columns (Mon-Sun) */}
                  {row.values.map((val, i) => (
                    <DataCell
                      key={i}
                      value={val}
                      type={row.type}
                      bgColor={
                        row.cellColors?.[i]
                          ? row.cellColors[i]
                          : row.rowColor
                            ? row.rowColor
                            : "#2B2B3D"
                      }
                    />
                  ))}

                  {/* Average Column */}
                  <DataCell
                    value={row.average ?? ""}
                    type="read-only"
                    bgColor="#593C62"
                  />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Coach Note Section */}
      <div className="mt-8 bg-[#0f101a] border border-gray-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <MessageSquare className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold text-white uppercase tracking-tight">Coach Note</h3>
        </div>

        <div className="space-y-4">
          <textarea
            value={coachNote}
            onChange={(e) => setCoachNote(e.target.value)}
            placeholder="Add your feedback or notes for this athlete's week here..."
            className="w-full min-h-[120px] bg-[#0B0C15] border border-gray-800 rounded-lg p-4 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
          />

          <div className="flex justify-end">
            <button
              onClick={handleSubmitNote}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 border border-green-500 disabled:bg-emerald-600/50 disabled:cursor-not-allowed text-green-500 rounded-lg transition-all shadow-lg hover:shadow-emerald-500/10"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Note</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
