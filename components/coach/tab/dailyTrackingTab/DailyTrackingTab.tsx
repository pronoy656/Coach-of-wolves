"use client";

import React, { useState } from "react";

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
type ColorVariant =
  | "default"
  | "purple"
  | "green"
  | "orange"
  | "yellow"
  | "red"
  | "dark";

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

// --- Mock Data Construction (Matching Image) ---

const HEADER_DATES = [
  "MO.13/1/25",
  "DI.13/1/25",
  "MI.13/1/25",
  "DO.13/1/25",
  "FR.13/1/25",
  "SA.13/1/25",
  "SO.13/1/25",
];

const DATA_SECTIONS: SectionData[] = [
  {
    title: "", // Top section (Weight)
    rows: [
      {
        id: "weight",
        label: "WEIGHT",
        unit: "(kg)",
        type: "read-only",
        values: ["80.3", "80.3", "80.3", "80.3", "80.3", "80.3", "80.3"],
        average: "80.3",
        rowColor: "#593C62", // Purple background from image
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
        values: [2471, 2471, 2471, 2471, 2471, 2471, 2471],
        average: 2471,
      },
      {
        id: "e",
        label: "E",
        unit: "(g)",
        type: "read-only",
        values: [244, 244, 244, 244, 244, 244, 244],
        average: 244,
        rowColor: "#593C62",
      },
      {
        id: "k",
        label: "K",
        unit: "(g)",
        type: "read-only",
        values: [241, 241, 241, 241, 241, 241, 241],
        average: 241,
      },
      {
        id: "f",
        label: "F",
        unit: "(g)",
        type: "read-only",
        values: [60, 60, 60, 60, 60, 60, 60],
        average: 60,
        rowColor: "#593C62",
      },
      {
        id: "salt",
        label: "Salt",
        unit: "(g)",
        type: "read-only",
        values: [60, 60, 60, 60, 60, "", ""], // Empty for Sat/Sun in image
        average: "",
      },
      {
        id: "hunger",
        label: "HUNGER",
        subLabel: "SCALR 1-10",
        type: "dropdown",
        values: [4, 4, 4, 4, 4, 4, 4],
        average: 4,
        cellColors: [
          "#D97706",
          "#D97706",
          "#B45309",
          "#EAB308",
          "#EAB308",
          "#EAB308",
          "#EAB308",
        ], // Orange/Yellow mix
      },
      {
        id: "digestion",
        label: "Digestion",
        subLabel: "SCALR 1-10",
        type: "dropdown",
        values: [4, 4, 4, 4, 4, 4, 4],
        average: 4,
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
        values: [3000, 3000, 3000, 3000, 3000, 3000, 3000],
        average: 3000,
      },
      {
        id: "cardio",
        label: "CARDIO",
        unit: "(min)",
        type: "read-only",
        values: [0, 0, 0, 0, 0, 0, 0],
        average: 0,
        rowColor: "#593C62",
      },
      {
        id: "training",
        label: "TRAINING",
        type: "text",
        values: ["", "", "", "PULL FULL BODY", "PULL FULL BODY", "", ""],
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
        values: [
          "8:15",
          "8:15",
          "8:15",
          "8:15",
          "8:15",
          "8:15",
          "8:15",
          "8:15",
        ],
        average: "8:15",
      },
      {
        id: "sleep_qual",
        label: "Sleep quality",
        type: "text",
        values: [9, 9, 9, 9, 9, 9, 9],
        average: 9,
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
        values: ["YES", "YES", "YES", "YES", "YES", "YES", "YES"],
        average: 4,
        cellColors: [
          "#B45309",
          "#B45309",
          "#B45309",
          "#B45309",
          "#4d7c0f",
          "#B45309",
          "#4d7c0f",
        ], // Matching image colors roughly
      },
    ],
  },
  {
    title: "Well-Being",
    rows: [
      {
        id: "mood",
        label: "Mood",
        subLabel: "SCALR 1-10",
        type: "dropdown",
        values: [4, 4, 4, 4, 4, 4, 4],
        average: 4,
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
        subLabel: "SCALR 1-10",
        type: "dropdown",
        values: [4, 4, 4, 4, 4, 4, 4],
        average: 4,
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
        subLabel: "SCALR 1-10",
        type: "dropdown",
        values: [4, 4, 4, 4, 4, 4, 4],
        average: 4,
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
        subLabel: "SCALR 1-10",
        type: "dropdown",
        values: [4, 4, 4, 4, 4, 4, 4],
        average: 4,
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
        subLabel: "SCALR 1-10",
        type: "dropdown",
        values: [4, 4, 4, 4, 4, 4, 4],
        average: 4,
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
        values: ["Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes"],
        average: 9,
      },
      {
        id: "tr_plan",
        label: "Training Plan",
        type: "text",
        values: [
          "Push Fullbody",
          "Push Fullbody",
          "Leg Day Advanced",
          "Push Fullbody",
          "Push Fullbody",
          "Push Fullbody",
          "Push Fullbody",
        ],
        average: 9,
      },
      {
        id: "cardio_comp",
        label: "Cardio Completed",
        type: "text",
        values: ["Yes", "Yes", "No", "Yes", "No", "No", "No"],
        average: 9,
      },
      {
        id: "cardio_type",
        label: "Cardio Type",
        type: "text",
        values: [
          "Cycling",
          "Walking",
          "Cycling",
          "Cycling",
          "Walking",
          "Walking",
          "Cycling",
        ],
        average: 9,
      },
      {
        id: "duration",
        label: "Duration",
        type: "text",
        values: [
          "4 (min)",
          "4 (min)",
          "4 (min)",
          "4 (min)",
          "4 (min)",
          "4 (min)",
          "4 (min)",
        ],
        average: 9,
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
        values: [
          "ovulation",
          "Follicular",
          "ovulation",
          "luteal",
          "menstruation",
          "menstruation",
          "luteal",
        ],
        average: 9,
      },
      {
        id: "cycle_day",
        label: "Cycle day",
        type: "text",
        values: [
          "Sunday",
          "Sunday",
          "Sunday",
          "Sunday",
          "Sunday",
          "Sunday",
          "Sunday",
        ],
        average: 9,
      },
      {
        id: "pms",
        label: "PMS symptoms",
        subLabel: "SCALR 1-10",
        type: "dropdown",
        values: [4, 4, 4, 4, 4, 4, 4],
        average: 4,
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
        subLabel: "SCALR 1-10",
        type: "dropdown",
        values: [4, 4, 4, 4, 4, 4, 4],
        average: 4,
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
        values: [
          "cravings",
          "everything fine",
          "cramps",
          "vaginal dryness",
          "Acne",
          "Tiredness",
          "Sleepless",
        ],
        average: 9,
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
        values: ["Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes"],
        average: 9,
      },
      {
        id: "side_effects",
        label: "Side effects notes",
        type: "text",
        values: [
          "Lorem ipsum dolor",
          "Lorem ipsum dolor",
          "Lorem ipsum dolor",
          "Lorem ipsum dolor",
          "Lorem ipsum dolor",
          "Lorem ipsum dolor",
          "Lorem ipsum dolor",
        ],
        average: 9,
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
        values: [
          "systolic (120 Mmhg)",
          "systolic (120 Mmhg)",
          "systolic (120 Mmhg)",
          "Diastolic 80 (Mmhg)",
          "Diastolic 80 (Mmhg)",
          "Diastolic 80 (Mmhg)",
          "Diastolic 80 (Mmhg)",
        ],
        average: 9,
      },
      {
        id: "rhr",
        label: "Resting heart rate",
        type: "text",
        values: [
          "60-100",
          "60-100",
          "60-100",
          "60-100",
          "60-100",
          "60-100",
          "60-100",
        ],
        average: 9,
      },
      {
        id: "glucose",
        label: "Blood glucose",
        type: "text",
        values: [
          "70-140 (mg)",
          "70-140 (mg)",
          "70-140 (mg)",
          "70-140 (mg)",
          "70-140 (mg)",
          "70-140 (mg)",
          "70-140 (mg)",
        ],
        average: 9,
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
        values: [
          "Lorem ipsum dolor",
          "Lorem ipsum dolor",
          "Lorem ipsum dolor",
          "Lorem ipsum dolor",
          "Lorem ipsum dolor",
          "Lorem ipsum dolor",
          "Lorem ipsum dolor",
        ],
        average: "",
      },
    ],
  },
];

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
  // If specific color is provided via props (from mock data), use it, otherwise default
  // Note: We use inline style for dynamic hex colors not in Tailwind config

  const isDropdown = type === "dropdown";

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center p-2 text-xs text-center border-none outline-none overflow-hidden ${textColor}`}
      style={{ backgroundColor: bgColor }}
    >
      {isDropdown ? (
        <div className="flex items-center justify-between w-full px-2">
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
  return (
    <div className="min-h-screen bg-[#0B0C15] p-6 font-sans text-white">
      {/* Top Header Button */}
      <div className="mb-6">
        <button className="flex items-center gap-2 px-6 py-3 bg-[#0f101a] border border-gray-700 rounded-lg hover:bg-[#1a1b26] transition-colors text-white font-medium">
          <CalendarIcon />
          <span className="text-base">Calendar</span>
        </button>
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
              <div className="flex-1 bg-[#1F1F2E] flex items-center justify-center border-t border-gray-700">
                <span className="text-gray-300 text-xs">{HEADER_DATES[i]}</span>
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
          {DATA_SECTIONS.map((section, secIndex) => (
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
                    bgColor={row.rowColor ? row.rowColor + "99" : "#373745"} // Slightly transparent if colored, else grey
                  />

                  {/* Value Columns (Mon-Sun) */}
                  {row.values.map((val, i) => (
                    <DataCell
                      key={i}
                      value={val}
                      type={row.type}
                      bgColor={
                        row.cellColors?.[i] // Use specific cell color if defined
                          ? row.cellColors[i]
                          : row.rowColor // Use row color if defined
                          ? row.rowColor
                          : "#2B2B3D" // Default dark cell
                      }
                    />
                  ))}

                  {/* Average Column */}
                  <DataCell
                    value={row.average ?? ""}
                    type="read-only"
                    bgColor="#593C62" // The purple column on the right
                  />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
