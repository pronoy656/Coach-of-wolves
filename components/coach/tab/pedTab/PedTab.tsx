"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Edit3, Save, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchPedData,
  fetchAthletePedData,
  updateAthletePedData,
  clearPedSuccess,
  clearPedError,
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

interface PedTabProps {
  athleteId?: string;
}

const PedTab: React.FC<PedTabProps> = ({ athleteId }) => {
  const dispatch = useAppDispatch();
  const {
    data: globalPedData,
    athletePedData,
    loading,
    error,
    successMessage,
  } = useAppSelector((state) => state.ped);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  // Helper function to map data
  const mapPedDataToSchedule = (
    globalData: typeof globalPedData,
    athleteData: typeof athletePedData,
  ): PedCategory[] => {
    if (!globalData?.categories) return [];

    return globalData.categories.map((globalCat: BackendPedCategory) => {
      // Find corresponding category in athlete data (if it exists)
      const athleteCat = athleteData?.categories?.find(
        (ac) => ac.name === globalCat.name,
      );

      return {
        category: globalCat.name,
        items: globalCat.subCategory.map((globalSub) => {
          // Find corresponding subcategory (item) in athlete data
          const athleteSub = athleteCat?.subCategory?.find(
            (as) => as.name === globalSub.name,
          );

          return {
            name: globalSub.name,
            // Use athlete's value if present, otherwise default to empty string
            dosage: athleteSub?.dosage || "",
            freq: athleteSub?.frequency || "",
            days: [
              athleteSub?.mon || "",
              athleteSub?.tue || "",
              athleteSub?.wed || "",
              athleteSub?.thu || "",
              athleteSub?.fri || "",
              athleteSub?.sat || "",
              athleteSub?.sun || "",
            ],
          };
        }),
      };
    });
  };

  const [schedule, setSchedule] = useState<PedCategory[]>(() =>
    mapPedDataToSchedule(globalPedData, athletePedData),
  );

  // Track previous props to implement "Adjust state on prop change" pattern
  const [prevGlobalData, setPrevGlobalData] = useState(globalPedData);
  const [prevAthleteData, setPrevAthleteData] = useState(athletePedData);

  // Adjust state during render if dependencies change
  if (globalPedData !== prevGlobalData || athletePedData !== prevAthleteData) {
    setPrevGlobalData(globalPedData);
    setPrevAthleteData(athletePedData);
    setSchedule(mapPedDataToSchedule(globalPedData, athletePedData));
  }

  const [selectedWeek, setSelectedWeek] = useState<string>("week_1");

  // Fetch global data (Structure)
  useEffect(() => {
    dispatch(fetchPedData());
  }, [dispatch]);

  // Fetch athlete specific data (Values)
  useEffect(() => {
    if (athleteId) {
      dispatch(fetchAthletePedData({ athleteId, week: selectedWeek }));
    }
  }, [dispatch, athleteId, selectedWeek]);

  // Handle Success/Error Toasts
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearPedSuccess());
    }
    if (error) {
      toast.error(error);
      dispatch(clearPedError());
    }
  }, [successMessage, error, dispatch]);

  const handleSave = async () => {
    if (!athleteId) return;

    const payload = {
      categories: schedule.map((cat) => ({
        name: cat.category,
        subCategory: cat.items.map((item) => ({
          name: item.name,
          dosage: item.dosage,
          frequency: item.freq,
          mon: item.days[0],
          tue: item.days[1],
          wed: item.days[2],
          thu: item.days[3],
          fri: item.days[4],
          sat: item.days[5],
          sun: item.days[6],
        })),
      })),
    };

    try {
      await dispatch(
        updateAthletePedData({
          athleteId,
          week: selectedWeek,
          data: payload,
        }),
      ).unwrap();

      // Success actions
      setIsEditing(false);
      // Refetch data to ensure UI is in sync with backend
      dispatch(fetchAthletePedData({ athleteId, week: selectedWeek }));
    } catch (err) {
      console.error("Failed to update PED data:", err);
    }
  };

  // Handle changes for Dosage or Frequency
  const handleInputChange = (
    catIndex: number,
    itemIndex: number,
    field: "dosage" | "freq",
    value: string,
  ) => {
    const newData = schedule.map((cat, cIdx) => {
      if (cIdx !== catIndex) return cat;
      return {
        ...cat,
        items: cat.items.map((item, iIdx) => {
          if (iIdx !== itemIndex) return item;
          return { ...item, [field]: value };
        }),
      };
    });
    setSchedule(newData);
  };

  // Handle changes for specific Days
  const handleDayChange = (
    catIndex: number,
    itemIndex: number,
    dayIndex: number,
    value: string,
  ) => {
    const newData = schedule.map((cat, cIdx) => {
      if (cIdx !== catIndex) return cat;
      return {
        ...cat,
        items: cat.items.map((item, iIdx) => {
          if (iIdx !== itemIndex) return item;
          const newDays = [...item.days];
          newDays[dayIndex] = value;
          return { ...item, days: newDays };
        }),
      };
    });
    setSchedule(newData);
  };

  if (loading && !schedule.length) {
    return (
      <div className="min-h-screen bg-[#0d0b14] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0b14] p-8 text-xs font-sans">
      {/* Top Header / Buttons */}
      <div className="flex justify-between items-center mb-4">
        {/* Week Selector */}
        <div className="flex items-center gap-2">
          <label className="text-gray-400 text-sm">Week:</label>
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="bg-[#1a1625] text-white border border-[#4b3c5e] rounded px-3 py-1 outline-none focus:border-emerald-500"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i + 1} value={`week_${i + 1}`}>
                Week {i + 1}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded border transition-colors ${
            isEditing
              ? "bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-700"
              : "bg-transparent border-[#4b3c5e] text-gray-300 hover:bg-[#1f1a2e]"
          }`}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isEditing ? (
            <Save size={16} />
          ) : (
            <Edit3 size={16} />
          )}
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
              {/* Top Left: WEEK (Spans Category + Name columns) */}
              <th
                colSpan={2}
                className="bg-[#1a1625] text-white border-r border-b border-[#4b3c5e] tracking-wider uppercase"
              >
                {selectedWeek.replace("_", " ").toUpperCase()}
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
