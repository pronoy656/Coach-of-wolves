"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Edit3, Save, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchPedData,
  PedCategory as BackendPedCategory,
} from "@/redux/features/ped/pedSlice";
import toast from "react-hot-toast";

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

const PedTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    data: pedData,
    loading,
    error,
  } = useAppSelector((state) => state.ped);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [schedule, setSchedule] = useState<PedCategory[]>([]);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchPedData());
  }, [dispatch]);

  // Sync Redux state to local state
  useEffect(() => {
    if (pedData?.categories) {
      const mappedData: PedCategory[] = pedData.categories.map(
        (cat: BackendPedCategory) => ({
          category: cat.name,
          items: cat.subCategory.map((sub) => ({
            name: sub.name,
            dosage: sub.dosage || "",
            freq: sub.frequency || "",
            days: [
              sub.mon || "",
              sub.tue || "",
              sub.wed || "",
              sub.thu || "",
              sub.fri || "",
              sub.sat || "",
              sub.sun || "",
            ],
          })),
        }),
      );
      setSchedule(mappedData);
    }
  }, [pedData]);

  // Handle changes for Dosage or Frequency
  const handleInputChange = (
    catIndex: number,
    itemIndex: number,
    field: "dosage" | "freq",
    value: string,
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
    value: string,
  ) => {
    const newData = [...schedule];
    newData[catIndex].items[itemIndex].days[dayIndex] = value;
    setSchedule(newData);
  };

  if (status === "loading") {
    return <div className="p-8 text-white">Loading PED data...</div>;
  }

  if (status === "failed") {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#0d0b14] p-8 text-xs font-sans">
      {/* Top Header / Buttons */}
      <div className="flex justify-end mb-4 gap-4">
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
            <col className="w-24" />
            <col className="w-24" />
            <col className="w-24" />
            <col className="w-24" />
            <col className="w-auto" />
            <col className="w-auto" />
            <col className="w-auto" />
            <col className="w-auto" />
            <col className="w-auto" />
            <col className="w-auto" />
            <col className="w-auto" />
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
                ),
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {schedule.length > 0 ? (
              schedule.map((cat, catIndex) => (
                <React.Fragment key={catIndex}>
                  {cat.items.map((item, itemIndex) => (
                    <tr
                      key={`${catIndex}-${itemIndex}`}
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
                              e.target.value,
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
                              e.target.value,
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
                                e.target.value,
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
              ))
            ) : (
              <tr>
                <td colSpan={11} className="text-center py-8 text-gray-500">
                  No PED data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PedTab;
