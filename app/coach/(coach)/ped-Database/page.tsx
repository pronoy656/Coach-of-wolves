"use client";

import React, { useState, ChangeEvent } from "react";
import { Edit3, Save } from "lucide-react";

// --- Types ---
interface PedItem {
  name: string;
  dosage: string;
  freq: string;
  days: string[];
}

interface PedCategory {
  category: string;
  items: PedItem[];
}

// --- Initial Data ---
const INITIAL_DATA: PedCategory[] = [
  {
    category: "TEST",
    items: [
      { name: "TESTE", dosage: "", freq: "", days: Array(7).fill("") },
      { name: "TESTP", dosage: "", freq: "", days: Array(7).fill("") },
      { name: "HALOTESTIN", dosage: "", freq: "", days: Array(7).fill("") },
      { name: "DLANABOL", dosage: "", freq: "", days: Array(7).fill("") },
      { name: "PRIMOBOLAN", dosage: "", freq: "", days: Array(7).fill("") },
    ],
  },
  {
    category: "DHT",
    items: [
      { name: "MASTERON", dosage: "", freq: "", days: Array(7).fill("") },
      { name: "ANAVER", dosage: "", freq: "", days: Array(7).fill("") },
      { name: "PROVIRON", dosage: "", freq: "", days: Array(7).fill("") },
      { name: "WINSTROL", dosage: "", freq: "", days: Array(7).fill("") },
      { name: "ANADROL", dosage: "", freq: "", days: Array(7).fill("") },
    ],
  },
  {
    category: "19-NOR",
    items: [
      { name: "NPP", dosage: "", freq: "", days: Array(7).fill("") },
      { name: "DECA", dosage: "", freq: "", days: Array(7).fill("") },
      { name: "TRENE", dosage: "", freq: "", days: Array(7).fill("") },
    ],
  },
  {
    category: "ESTROGEN & FERTILITY MANAGEMENT",
    items: [
      { name: "ANASTROZOLE", dosage: "", freq: "", days: Array(7).fill("") },
      { name: "EXEMESTANE", dosage: "", freq: "", days: Array(7).fill("") },
      { name: "NOLVADEX", dosage: "", freq: "", days: Array(7).fill("") },
      { name: "CLOMED", dosage: "", freq: "", days: Array(7).fill("") },
      { name: "HCG", dosage: "", freq: "", days: Array(7).fill("") },
      { name: "ARIMIDEX", dosage: "", freq: "", days: Array(7).fill("") },
    ],
  },
  {
    category: "FATLOSS",
    items: [
      { name: "YOMIMBINE", dosage: "", freq: "", days: Array(7).fill("") },
      { name: "CLEN", dosage: "", freq: "", days: Array(7).fill("") },
      { name: "MOM", dosage: "", freq: "", days: Array(7).fill("") },
    ],
  },
  {
    category: "THYROID",
    items: [
      {
        name: "T3",
        dosage: "4.0 mg",
        freq: "ED",
        days: Array(7).fill("4.0 IU"),
      },
      { name: "T4", dosage: "", freq: "", days: Array(7).fill("") },
    ],
  },
  {
    category: "INSULIN",
    items: [
      { name: "LANTUS", dosage: "", freq: "", days: Array(7).fill("") },
      { name: "NOVORAPID", dosage: "", freq: "", days: Array(7).fill("") },
    ],
  },
  {
    category: "OTHER",
    items: [
      { name: "TELMISANTAN", dosage: "", freq: "", days: Array(7).fill("") },
      { name: "METFORMIN", dosage: "", freq: "", days: Array(7).fill("") },
    ],
  },
  {
    category: "PEPTIDES",
    items: [
      { name: "TB500", dosage: "", freq: "", days: Array(7).fill("") },
      { name: "BPC-157", dosage: "", freq: "", days: Array(7).fill("") },
      { name: "MOTSC", dosage: "", freq: "", days: Array(7).fill("") },
      { name: "SLU-PP-332", dosage: "", freq: "", days: Array(7).fill("") },
    ],
  },
];

const PedTracker: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [schedule, setSchedule] = useState<PedCategory[]>(INITIAL_DATA);

  // Handle changes for Dosage or Frequency
  const handleInputChange = (
    catIndex: number,
    itemIndex: number,
    field: "dosage" | "freq",
    value: string
  ) => {
    const newData = [...schedule];
    newData[catIndex].items[itemIndex][field] = value;
    setSchedule(newData);
  };

  // Handle changes for specific Days
  const handleDayChange = (
    catIndex: number,
    itemIndex: number,
    dayIndex: number,
    value: string
  ) => {
    const newData = [...schedule];
    newData[catIndex].items[itemIndex].days[dayIndex] = value;
    setSchedule(newData);
  };

  return (
    <div className="min-h-screen bg-[#0d0b14] p-8 text-xs font-sans">
      {/* Top Header / Buttons */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-4 py-2 rounded border transition-colors ${
            isEditing
              ? "bg-green-600 border-green-500 text-white hover:bg-green-700"
              : "bg-transparent border-[#4b3c5e] text-gray-300 hover:bg-[#1f1a2e]"
          }`}
        >
          {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
          {isEditing ? "Save PED" : "Edit PED"}
        </button>
      </div>

      {/* Main Table Container */}
      <div className="border border-[#4b3c5e] rounded-sm overflow-hidden bg-[#1a1625] overflow-x-auto">
        <table className="w-full border-collapse table-fixed">
          {/* Column Width Definitions for Perfect Alignment */}
          <colgroup>
            <col className="w-24" /> {/* Category Label */}
            <col className="w-24" /> {/* Item Name */}
            <col className="w-24" /> {/* Dosage */}
            <col className="w-24" /> {/* Frequency */}
            <col className="w-auto" /> {/* Mon */}
            <col className="w-auto" /> {/* Tue */}
            <col className="w-auto" /> {/* Wed */}
            <col className="w-auto" /> {/* Thu */}
            <col className="w-auto" /> {/* Fri */}
            <col className="w-auto" /> {/* Sat */}
            <col className="w-auto" /> {/* Sun */}
          </colgroup>

          {/* Table Header */}
          <thead>
            <tr className="h-10 text-[10px] font-semibold">
              {/* Top Left: WEEK 1 (Spans Category + Name columns) */}
              <th
                colSpan={2}
                className="bg-[#1a1625] text-white border-r border-b border-[#4b3c5e] tracking-wider uppercase"
              >
                WEEK 1
              </th>
              {/* Dosage */}
              <th className="bg-[#f0f0f0] text-[#1a1625] border-r border-[#ccc]">
                Dosage
              </th>
              {/* Frequency */}
              <th className="bg-[#f0f0f0] text-[#1a1625] border-r border-[#ccc]">
                Frequency
              </th>
              {/* Days */}
              {["MO", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                (day, i) => (
                  <th
                    key={day}
                    className={`bg-[#f0f0f0] text-[#1a1625] ${
                      i !== 6 ? "border-r border-[#ccc]" : ""
                    }`}
                  >
                    {day}
                  </th>
                )
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {schedule.map((cat, catIndex) => (
              <React.Fragment key={cat.category}>
                {cat.items.map((item, itemIndex) => (
                  <tr
                    key={item.name}
                    className="h-9 border-b border-[#4b3c5e] last:border-b-0"
                  >
                    {/* Category Label (RowSpan logic) */}
                    {itemIndex === 0 && (
                      <td
                        rowSpan={cat.items.length}
                        className="bg-[#4b3c5e]/40 text-gray-200 font-bold text-center border-r border-[#4b3c5e] p-2 align-middle uppercase"
                      >
                        <span className="block text-[10px] leading-tight">
                          {cat.category ===
                          "ESTROGEN & FERTILITY MANAGEMENT" ? (
                            <>
                              ESTROGEN &<br />
                              FERTILITY
                              <br />
                              MANAGEMENT
                            </>
                          ) : (
                            cat.category
                          )}
                        </span>
                      </td>
                    )}

                    {/* Item Name */}
                    <td className="bg-[#382b42]/50 text-gray-300 font-medium text-center border-r border-[#4b3c5e] text-[10px]">
                      {item.name}
                    </td>

                    {/* Dosage Input (Editable) */}
                    <td className="border-r border-[#4b3c5e] bg-[#2a2435]">
                      <input
                        type="text"
                        value={item.dosage}
                        readOnly={!isEditing}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleInputChange(
                            catIndex,
                            itemIndex,
                            "dosage",
                            e.target.value
                          )
                        }
                        className={`w-full h-full text-center bg-transparent outline-none text-white placeholder-gray-600 ${
                          isEditing
                            ? "bg-[#352c41] focus:bg-[#453a54] cursor-text"
                            : "cursor-default"
                        }`}
                      />
                    </td>

                    {/* Frequency Input (Editable) */}
                    <td className="border-r border-[#4b3c5e] bg-[#2a2435]">
                      <input
                        type="text"
                        value={item.freq}
                        readOnly={!isEditing}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleInputChange(
                            catIndex,
                            itemIndex,
                            "freq",
                            e.target.value
                          )
                        }
                        className={`w-full h-full text-center bg-transparent outline-none text-white placeholder-gray-600 ${
                          isEditing
                            ? "bg-[#352c41] focus:bg-[#453a54] cursor-text"
                            : "cursor-default"
                        }`}
                      />
                    </td>

                    {/* Days Inputs (Editable) */}
                    {item.days.map((dayValue, dayIndex) => (
                      <td
                        key={dayIndex}
                        className="border-r border-[#4b3c5e] last:border-r-0 bg-[#3e304b]/50"
                      >
                        <input
                          type="text"
                          value={dayValue}
                          readOnly={!isEditing}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleDayChange(
                              catIndex,
                              itemIndex,
                              dayIndex,
                              e.target.value
                            )
                          }
                          className={`w-full h-full text-center bg-transparent outline-none text-white font-medium ${
                            isEditing
                              ? "bg-[#4b3c5e]/50 focus:bg-[#5e4b75] cursor-text"
                              : "cursor-default"
                          }`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PedTracker;
