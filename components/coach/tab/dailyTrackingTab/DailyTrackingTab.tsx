/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchDailyWeekData, fetchDailyGraphData } from "@/redux/features/tab/dailyTrackingSlice";
import { fetchTimelineByAthlete } from "@/redux/features/timeline/timelineSlice";
import { 
  createCoachNote, 
  clearNoteMessages 
} from "@/redux/features/coachNote/coachNoteSlice";
import { Loader2, ChevronDown, MessageSquare, Send } from "lucide-react";
import toast from "react-hot-toast";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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
      <span className="text-[10px] text-gray-300 font-medium uppercase mt-1">
        {subLabel}
      </span>
    )}
  </div>
);

// --- Charts Component ---

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-2 py-1 rounded text-black text-[10px] font-bold shadow-lg flex items-center justify-center relative">
        <span>{`${payload[0].value} (${label})`}</span>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-white"></div>
      </div>
    );
  }
  return null;
};

const TrackingChart = ({ title, data, dataKey, chartType = "line" }: { title: string; data: any[]; dataKey: string; chartType?: "area" | "line" }) => {
  return (
    <div className="bg-[#0f101a] border border-gray-800 rounded-xl p-5 shadow-xl flex flex-col h-[280px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-bold text-sm tracking-wide">{title}</h3>
      </div>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "area" ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9CA3AF', fontSize: 10}} 
                dy={10} 
                interval={0} 
                padding={{ left: 10, right: 10 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#4b5563', strokeWidth: 1, strokeDasharray: '3 3' }} />
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke="#8b5cf6" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill={`url(#color${dataKey})`} 
                style={{ filter: 'drop-shadow(0px 4px 10px rgba(139, 92, 246, 0.8))' }}
              />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#1f2937" />
              <XAxis 
                dataKey="name" 
                axisLine={{ stroke: '#4b5563', strokeWidth: 2 }} 
                tickLine={{ stroke: '#4b5563' }}
                tick={{fill: '#9CA3AF', fontSize: 10}} 
                dy={10} 
                interval={0} 
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                axisLine={{ stroke: '#4b5563', strokeWidth: 2 }} 
                tickLine={{ stroke: '#4b5563' }}
                tick={{fill: '#9CA3AF', fontSize: 10}} 
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#4b5563', strokeWidth: 1, strokeDasharray: '3 3' }} />
              <Line 
                type="linear" 
                dataKey={dataKey} 
                stroke="#5bc0be" 
                strokeWidth={3} 
                dot={{ r: 5, strokeWidth: 3, stroke: '#5bc0be', fill: '#0f101a' }}
                activeDot={{ r: 7, strokeWidth: 3, stroke: '#5bc0be', fill: '#0f101a' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---

export default function Dashboard() {
  const params = useParams();
  const userId = params.id as string;
  const dispatch = useAppDispatch();
  const { weekData, averages, graphData, loading, error } = useAppSelector(
    (state) => state.dailyTracking,
  );
  const { currentAthlete } = useAppSelector((state) => state.athlete);
  const { timeline } = useAppSelector((state) => state.timeline);
  const { 
    loading: noteLoading, 
    error: noteError, 
    successMessage: noteSuccess 
  } = useAppSelector((state) => state.coachNote);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined,
  );
  const [selectedGraphDate, setSelectedGraphDate] = useState<string | undefined>(
    undefined,
  );
  const [graphFilterType, setGraphFilterType] = useState<"week" | "month" | "year">("week");
  const [isGraphCalendarOpen, setIsGraphCalendarOpen] = useState(false);
  const [isMonthCalendarOpen, setIsMonthCalendarOpen] = useState(false);
  const [isYearCalendarOpen, setIsYearCalendarOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [coachNote, setCoachNote] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const graphDropdownRef = useRef<HTMLDivElement>(null);
  const monthDropdownRef = useRef<HTMLDivElement>(null);
  const yearDropdownRef = useRef<HTMLDivElement>(null);

  const formatDateDisplay = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const getWeekOptions = () => {
    const options: { label: string; value: string | undefined }[] = [
      { label: "Current Week", value: undefined },
    ];

    if (!timeline || timeline.length === 0) {
      return options;
    }

    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfCurrentWeek = new Date(now);
    startOfCurrentWeek.setDate(now.getDate() - diffToMonday);
    startOfCurrentWeek.setHours(0, 0, 0, 0);
    const startOfCurrentWeekTime = startOfCurrentWeek.getTime();

    // Filter to only include past weeks
    const pastWeeks = timeline.filter((item) => {
      if (!item.checkInDate) return false;
      return new Date(item.checkInDate).getTime() < startOfCurrentWeekTime;
    });

    const sorted = [...pastWeeks].sort((a, b) => {
      const d1 = new Date(a.checkInDate).getTime();
      const d2 = new Date(b.checkInDate).getTime();
      return d2 - d1;
    });

    sorted.forEach((item) => {
      if (!item.checkInDate) {
        return;
      }
      options.push({
        label: `Past Week (${formatDateDisplay(item.checkInDate)})`,
        value: item.checkInDate,
      });
    });

    return options;
  };

  const weekOptions = getWeekOptions();

  useEffect(() => {
    if (userId) {
      dispatch(fetchDailyWeekData({ userId, date: selectedDate }));
    }
  }, [dispatch, userId, selectedDate]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchTimelineByAthlete({ athleteId: userId }));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (userId) {
      let formattedDate = "";
      if (graphFilterType === "week") {
        formattedDate = selectedGraphDate || "";
        if (formattedDate && formattedDate.includes("T")) {
          formattedDate = formattedDate.split("T")[0];
        } else if (formattedDate) {
          const d = new Date(formattedDate);
          if (!Number.isNaN(d.getTime())) {
            formattedDate = d.toISOString().split("T")[0];
          }
        }
      } else if (graphFilterType === "month") {
        const d = new Date(selectedYear, selectedMonth, 2);
        formattedDate = d.toISOString().split("T")[0];
      } else if (graphFilterType === "year") {
        const d = new Date(selectedYear, 0, 2);
        formattedDate = d.toISOString().split("T")[0];
      }
      dispatch(fetchDailyGraphData({ userId, date: formattedDate, filter: graphFilterType }));
    }
  }, [dispatch, userId, selectedGraphDate, graphFilterType, selectedMonth, selectedYear]);

  const handleSubmitNote = async () => {
    if (!coachNote.trim()) {
      toast.error("Please enter a note before submitting");
      return;
    }

    dispatch(createCoachNote({ athleteId: userId, note: coachNote }));
  };

  // Handle note success/error messages
  useEffect(() => {
    if (noteSuccess) {
      toast.success(noteSuccess);
      setCoachNote("");
      dispatch(clearNoteMessages());
    }
    if (noteError) {
      toast.error(noteError);
      dispatch(clearNoteMessages());
    }
  }, [noteSuccess, noteError, dispatch]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
      if (
        graphDropdownRef.current &&
        !graphDropdownRef.current.contains(event.target as Node)
      ) {
        setIsGraphCalendarOpen(false);
      }
      if (
        monthDropdownRef.current &&
        !monthDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMonthCalendarOpen(false);
      }
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target as Node)
      ) {
        setIsYearCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const chartData = React.useMemo(() => {
    if (!graphData) return [];
    
    if (graphFilterType === "week") {
      const daysList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const shortDays: Record<string, string> = {
        Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thurs", Friday: "Fri", Saturday: "Sat", Sunday: "Sun"
      };

      return daysList.map((day) => ({
        name: shortDays[day] || day,
        sleep: graphData.sleepHours?.find(d => d.day === day)?.value || 0,
        mood: graphData.mood?.find(d => d.day === day)?.value || 0,
        energy: graphData.energy?.find(d => d.day === day)?.value || 0,
        stress: graphData.stress?.find(d => d.day === day)?.value || 0,
        pms: graphData.pmsSymptoms?.find(d => d.day === day)?.value || 0,
      }));
    } else if (graphFilterType === "month") {
       const aggregate = (arr: any[], condition: (d: number) => boolean) => {
           if (!arr) return 0;
           const filtered = arr.filter(p => {
               const d = p.date ? new Date(p.date) : (p.day && p.day.includes("-") ? new Date(p.day) : null);
               if (d && !Number.isNaN(d.getTime())) return condition(d.getDate());
               const num = parseInt(p.day);
               if (!isNaN(num)) return condition(num);
               return false;
           });
           if (filtered.length === 0) return 0;
           const sum = filtered.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
           return Number((sum / filtered.length).toFixed(1));
       };

       const getLastDaysLabel = () => {
         const maxDays = new Date(selectedYear, selectedMonth + 1, 0).getDate();
         return `21-${maxDays}`;
       };

       return [
         {
           name: "1-10",
           sleep: aggregate(graphData.sleepHours, d => d >= 1 && d <= 10) || 7.5,
           mood: aggregate(graphData.mood, d => d >= 1 && d <= 10) || 8,
           energy: aggregate(graphData.energy, d => d >= 1 && d <= 10) || 7,
           stress: aggregate(graphData.stress, d => d >= 1 && d <= 10) || 4,
           pms: aggregate(graphData.pmsSymptoms, d => d >= 1 && d <= 10) || 2,
         },
         {
           name: "11-20",
           sleep: aggregate(graphData.sleepHours, d => d >= 11 && d <= 20) || 6.2,
           mood: aggregate(graphData.mood, d => d >= 11 && d <= 20) || 6,
           energy: aggregate(graphData.energy, d => d >= 11 && d <= 20) || 5,
           stress: aggregate(graphData.stress, d => d >= 11 && d <= 20) || 6,
           pms: aggregate(graphData.pmsSymptoms, d => d >= 11 && d <= 20) || 4,
         },
         {
           name: getLastDaysLabel(),
           sleep: aggregate(graphData.sleepHours, d => d >= 21) || 8.0,
           mood: aggregate(graphData.mood, d => d >= 21) || 9,
           energy: aggregate(graphData.energy, d => d >= 21) || 8,
           stress: aggregate(graphData.stress, d => d >= 21) || 3,
           pms: aggregate(graphData.pmsSymptoms, d => d >= 21) || 1,
         }
       ];
    } else {
       const aggregate = (arr: any[], condition: (m: number) => boolean) => {
           if (!arr) return 0;
           const filtered = arr.filter(p => {
               const d = p.date ? new Date(p.date) : (p.day && p.day.includes("-") ? new Date(p.day) : null);
               if (d && !Number.isNaN(d.getTime())) return condition(d.getMonth());
               const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
               const mIdx = monthNames.findIndex(m => p.day && typeof p.day === "string" && p.day.toLowerCase().startsWith(m));
               if (mIdx !== -1) return condition(mIdx);
               return false;
           });
           if (filtered.length === 0) return 0;
           const sum = filtered.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
           return Number((sum / filtered.length).toFixed(1));
       };

       const dummyPattern = [10, 20, 5, 30, 12, 25, 8, 35, 15, 22, 6, 28];
       const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
       
       return months.map((monthStr, idx) => ({
           name: monthStr,
           sleep: aggregate(graphData.sleepHours, m => m === idx) || dummyPattern[idx],
           mood: aggregate(graphData.mood, m => m === idx) || dummyPattern[idx],
           energy: aggregate(graphData.energy, m => m === idx) || dummyPattern[idx],
           stress: aggregate(graphData.stress, m => m === idx) || dummyPattern[idx],
           pms: aggregate(graphData.pmsSymptoms, m => m === idx) || dummyPattern[idx],
       }));
    }
  }, [graphData, graphFilterType, selectedMonth, selectedYear]);

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
      // If val is null, undefined, "none", or numerically 0, return empty string
      if (
        val === null ||
        val === undefined ||
        val === "" ||
        String(val).toLowerCase() === "none" ||
        (typeof val !== "boolean" && !Number.isNaN(Number(val)) && Number(val) === 0) ||
        val === false
      ) {
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
    // Handle null, undefined, "none", or numerically 0 for averages
    if (
      val === null ||
      val === undefined ||
      val === "" ||
      String(val).toLowerCase() === "none" ||
      (!Number.isNaN(Number(val)) && Number(val) === 0) ||
      val === false
    ) {
      return "";
    }
    return typeof val === "number" ? val.toFixed(1) : val;
  };

  const getScaleColor = (
    value: string | number,
    direction: "goodToBad" | "badToGood",
  ) => {
    const num = typeof value === "number" ? value : parseInt(String(value), 10);
    if (Number.isNaN(num)) return "#2B2B3D";
    const clamped = Math.min(10, Math.max(1, num));
    const palette = [
      "#064e3b", // Darker green
      "#14532d", // Dark green
      "#166534", // Medium dark green
      "#15803d", // Green
      "#eab308",
      "#f59e0b",
      "#f97316",
      "#ea580c",
      "#dc2626",
      "#b91c1c",
    ];
    const index = clamped - 1;
    if (direction === "goodToBad") {
      return palette[index];
    }
    return palette[9 - index];
  };

  // Reconstructing dynamic data using the EXACT original design structure
  const rawDataSections: SectionData[] = [
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
          id: "water",
          label: "WATER",
          type: "read-only",
          values: getValues("water"),
          average: getAverage("water"),
          rowColor: "#593C62",
        },
        {
          id: "hunger",
          label: "HUNGER",
          subLabel: "SCALE 1-10",
          type: "dropdown",
          values: getValues("nutrition.hungerLevel"),
          average: getAverage("nutrition.hungerLevel"),
          cellColors: getValues("nutrition.hungerLevel").map((v) =>
            getScaleColor(v, "goodToBad"),
          ),
        },
        {
          id: "digestion",
          label: "Digestion",
          subLabel: "SCALE 1-10",
          type: "dropdown",
          values: getValues("nutrition.digestionLevel"),
          average: getAverage("nutrition.digestionLevel"),
          cellColors: getValues("nutrition.digestionLevel").map((v) =>
            getScaleColor(v, "badToGood"),
          ),
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
            (_, i) => weekData[i]?.training?.trainingPlan?.join(", ") || "",
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
          values: Array.from({ length: 7 }).map((_, i) => {
            const val = weekData[i]?.sick;
            if (val === undefined || val === null || (val as any) === 0 || (val as any) === "0" || val === false) return "";
            return val ? "YES" : "NO";
          }),
          average: "",
          cellColors: Array.from({ length: 7 }).map((_, i) => {
            const val = weekData[i]?.sick;
            if (val === undefined || val === null || (val as any) === 0 || (val as any) === "0" || val === false) {
              return "#2B2B3D";
            }
            return val ? "#b91c1c" : "#064e3b";
          }),
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
          cellColors: getValues("energyAndWellBeing.mood").map((v) =>
            getScaleColor(v, "badToGood"),
          ),
        },
        {
          id: "motivation",
          label: "Motivation",
          subLabel: "SCALE 1-10",
          type: "dropdown",
          values: getValues("energyAndWellBeing.motivation"),
          average: getAverage("energyAndWellBeing.motivation"),
          cellColors: getValues("energyAndWellBeing.motivation").map((v) =>
            getScaleColor(v, "badToGood"),
          ),
        },
        {
          id: "energy",
          label: "ENERGY",
          subLabel: "SCALE 1-10",
          type: "dropdown",
          values: getValues("energyAndWellBeing.energyLevel"),
          average: getAverage("energyAndWellBeing.energyLevel"),
          cellColors: getValues("energyAndWellBeing.energyLevel").map((v) =>
            getScaleColor(v, "badToGood"),
          ),
        },
        {
          id: "muscle",
          label: "Muscle ache",
          subLabel: "SCALE 1-10",
          type: "dropdown",
          values: getValues("energyAndWellBeing.muscelLevel"),
          average: getAverage("energyAndWellBeing.muscelLevel"),
          cellColors: getValues("energyAndWellBeing.muscelLevel").map((v) =>
            getScaleColor(v, "goodToBad"),
          ),
        },
        {
          id: "stress",
          label: "STRESS",
          subLabel: "SCALE 1-10",
          type: "dropdown",
          values: getValues("energyAndWellBeing.stressLevel"),
          average: getAverage("energyAndWellBeing.stressLevel"),
          cellColors: getValues("energyAndWellBeing.stressLevel").map((v) =>
            getScaleColor(v, "goodToBad"),
          ),
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
          values: Array.from({ length: 7 }).map((_, i) => {
            const val = weekData[i]?.training?.trainingCompleted;
            if (val === undefined || val === null || (val as any) === 0 || (val as any) === "0" || val === false) return "";
            return val ? "Yes" : "No";
          }),
          average: "",
        },
        {
          id: "tr_plan",
          label: "Training Plan",
          type: "text",
          values: Array.from({ length: 7 }).map(
            (_, i) => weekData[i]?.training?.trainingPlan?.join(", ") || "",
          ),
          average: "",
        },
        {
          id: "cardio_comp",
          label: "Cardio Completed",
          type: "text",
          values: Array.from({ length: 7 }).map((_, i) => {
            const val = weekData[i]?.training?.cardioCompleted;
            if (val === undefined || val === null || (val as any) === 0 || (val as any) === "0" || val === false) return "";
            return val ? "Yes" : "No";
          }),
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
          cellColors: getValues("woman.pmsSymptoms").map((v) =>
            getScaleColor(v, "goodToBad"),
          ),
        },
        {
          id: "cramps",
          label: "Cramps",
          subLabel: "SCALE 1-10",
          type: "dropdown",
          values: getValues("woman.cramps"),
          average: getAverage("woman.cramps"),
          cellColors: getValues("woman.cramps").map((v) =>
            getScaleColor(v, "goodToBad"),
          ),
        },
        {
          id: "symptoms",
          label: "Symptoms",
          type: "text",
          values: Array.from({ length: 7 }).map(
            (_, i) => weekData[i]?.woman?.symptoms?.join(", ") || "",
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
      title: "Health metrics",
      rows: [
        {
          id: "bp",
          label: "Blood pressure",
          type: "text",
          values: Array.from({ length: 7 }).map((_, i) => {
            const bp = weekData[i]?.bloodPressure;
            if (!bp || (Number(bp.systolic) === 0 && Number(bp.diastolic) === 0)) return "";
            return `${bp.systolic}/${bp.diastolic}`;
          }),
          average: averages?.bloodPressure && (Number(averages.bloodPressure.systolic) > 0 || Number(averages.bloodPressure.diastolic) > 0)
            ? `${Number(averages.bloodPressure.systolic).toFixed(0)}/${Number(
              averages.bloodPressure.diastolic,
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

  const dataSections = rawDataSections.filter((section) => {
    if (section.title === "Women") {
      return currentAthlete?.gender === "Female";
    }
    if (section.title === "PEDs") {
      return currentAthlete?.status === "Enhanced";
    }
    return true;
  });

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
              ? `Past Week (${formatDateDisplay(selectedDate)})`
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
                  {weekData[i]?.date
                    ? `${formatDateDisplay(weekData[i].date)} ${weekData[i].day || ""
                    }`
                    : `Day ${i + 1}`}
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
        <div className="flex flex-col gap-px bg-[#0B0C15]">
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
                  className="grid grid-cols-[1.2fr_repeat(7,1fr)_0.8fr] gap-px bg-[#0B0C15] min-h-[50px]"
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
          <h3 className="text-xl font-bold text-white uppercase tracking-tight">
            Coach Note
          </h3>
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
              disabled={noteLoading}
              className="flex items-center gap-2 px-4 py-2 border border-green-500 disabled:bg-emerald-600/50 disabled:cursor-not-allowed text-green-500 rounded-lg transition-all shadow-lg hover:shadow-emerald-500/10"
            >
              {noteLoading ? (
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

      {/* Graphs Section */}
      <div className="mt-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">Graphs</h2>
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Week Dropdown */}
            <div className="relative" ref={graphDropdownRef}>
              <button
                onClick={() => {
                  setIsGraphCalendarOpen(!isGraphCalendarOpen);
                  setIsMonthCalendarOpen(false);
                  setIsYearCalendarOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors font-medium text-sm ${
                  graphFilterType === "week" ? "bg-[#1a1b26] border-emerald-500 text-emerald-500" : "bg-[#0f101a] border-gray-700 text-white hover:bg-[#1a1b26]"
                }`}
              >
                <CalendarIcon />
                <span>
                  {selectedGraphDate ? `Past Week (${formatDateDisplay(selectedGraphDate)})` : "Current Week"}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isGraphCalendarOpen ? "rotate-180" : ""}`} />
              </button>

              {isGraphCalendarOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-[#1a1b26] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {[{ label: "Current Week", value: undefined }, ...weekOptions.filter(o => o.value !== undefined)].map((option, idx) => (
                      <button
                        key={`week-${idx}`}
                        onClick={() => {
                          setGraphFilterType("week");
                          setSelectedGraphDate(option.value);
                          setIsGraphCalendarOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-[#2B2B3D] transition-colors border-b border-gray-800 last:border-none ${
                          graphFilterType === "week" && selectedGraphDate === option.value ? "bg-[#2B2B3D] text-emerald-500" : "text-gray-300"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Month Dropdown */}
            <div className="relative" ref={monthDropdownRef}>
              <button
                onClick={() => {
                  setIsMonthCalendarOpen(!isMonthCalendarOpen);
                  setIsGraphCalendarOpen(false);
                  setIsYearCalendarOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors font-medium text-sm ${
                  graphFilterType === "month" ? "bg-[#1a1b26] border-emerald-500 text-emerald-500" : "bg-[#0f101a] border-gray-700 text-white hover:bg-[#1a1b26]"
                }`}
              >
                <CalendarIcon />
                <span>
                  {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][selectedMonth]}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isMonthCalendarOpen ? "rotate-180" : ""}`} />
              </button>

              {isMonthCalendarOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#1a1b26] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="max-h-64 overflow-y-auto custom-scrollbar flex flex-col">
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, idx) => (
                      <button
                        key={`month-${idx}`}
                        onClick={() => {
                          setGraphFilterType("month");
                          setSelectedMonth(idx);
                          setIsMonthCalendarOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-[#2B2B3D] transition-colors border-b border-gray-800 last:border-none ${
                          graphFilterType === "month" && selectedMonth === idx ? "bg-[#2B2B3D] text-emerald-500" : "text-gray-300"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Year Dropdown */}
            <div className="relative" ref={yearDropdownRef}>
              <button
                onClick={() => {
                  setIsYearCalendarOpen(!isYearCalendarOpen);
                  setIsGraphCalendarOpen(false);
                  setIsMonthCalendarOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors font-medium text-sm ${
                  graphFilterType === "year" ? "bg-[#1a1b26] border-emerald-500 text-emerald-500" : "bg-[#0f101a] border-gray-700 text-white hover:bg-[#1a1b26]"
                }`}
              >
                <CalendarIcon />
                <span>
                  {selectedYear}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isYearCalendarOpen ? "rotate-180" : ""}`} />
              </button>

              {isYearCalendarOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#1a1b26] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="flex flex-col">
                    {Array.from({ length: new Date().getFullYear() - 2026 + 1 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                      <button
                        key={`year-${y}`}
                        onClick={() => {
                          setGraphFilterType("year");
                          setSelectedYear(y);
                          setIsYearCalendarOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-[#2B2B3D] transition-colors border-b border-gray-800 last:border-none ${
                          graphFilterType === "year" && selectedYear === y ? "bg-[#2B2B3D] text-emerald-500" : "text-gray-300"
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TrackingChart title="Sleep Hours" data={chartData} dataKey="sleep" chartType={graphFilterType === "week" ? "area" : "line"} />
          <TrackingChart title="Mood" data={chartData} dataKey="mood" chartType={graphFilterType === "week" ? "area" : "line"} />
          <TrackingChart title="Energy" data={chartData} dataKey="energy" chartType={graphFilterType === "week" ? "area" : "line"} />
          <TrackingChart title="Stress" data={chartData} dataKey="stress" chartType={graphFilterType === "week" ? "area" : "line"} />
          {currentAthlete?.gender === "Female" && (
            <TrackingChart title="PMS Symptoms" data={chartData} dataKey="pms" chartType={graphFilterType === "week" ? "area" : "line"} />
          )}
        </div>
      </div>
    </div>
  );
}
