"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchPedData,
  addPedData,
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

const translations = {
  en: {
    addPed: "Add PED",
    week1: "WEEK 1",
    dosage: "Dosage",
    frequency: "Frequency",
    noData: 'No PED data available. Click "Add PED" to start.',
    category: "Category",
    subCategory: "Sub-category (Item Name)",
    addToDatabase: "Add to Database",
    adding: "Adding...",
    fillBoth: "Please fill in both Category and Sub-category",
    days: ["MO", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
  },
  de: {
    addPed: "PED hinzufügen",
    week1: "WOCHE 1",
    dosage: "Dosierung",
    frequency: "Häufigkeit",
    noData:
      'Keine PED-Daten verfügbar. Klicken Sie auf "PED hinzufügen", um zu beginnen.',
    category: "Kategorie",
    subCategory: "Unterkategorie (Artikelname)",
    addToDatabase: "Zur Datenbank hinzufügen",
    adding: "Hinzufügen...",
    fillBoth: "Bitte füllen Sie sowohl Kategorie als auch Unterkategorie aus",
    days: ["MO", "DI", "MI", "DO", "FR", "SA", "SO"],
  },
};

const PedTracker: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    data: pedData,
    loading,
    error,
    successMessage,
  } = useAppSelector((state) => state.ped);
  const { language } = useAppSelector((state) => state.language);
  const t = translations[language as keyof typeof translations];

  const [isEditing, setIsEditing] = useState<boolean>(false);
  // Helper function to map backend data to frontend state
  const mapPedDataToSchedule = (data: typeof pedData): PedCategory[] => {
    if (!data?.categories) return [];
    return data.categories.map((cat: BackendPedCategory) => ({
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
    }));
  };

  const [schedule, setSchedule] = useState<PedCategory[]>(() =>
    mapPedDataToSchedule(pedData),
  );

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchPedData())
      .unwrap()
      .then((data) => {
        setSchedule(mapPedDataToSchedule({ ...pedData, ...data }));
      })
      .catch((err) => {
        console.error("Failed to fetch PED data:", err);
      });
  }, [dispatch]);

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

  const handleAddPed = async () => {
    if (!newCategory.trim() || !newSubCategory.trim()) {
      toast.error(t.fillBoth);
      return;
    }

    try {
      const result = await dispatch(
        addPedData({
          category: newCategory,
          subCategory: [{ name: newSubCategory }],
        }),
      ).unwrap();

      // Update local state with the new data
      setSchedule(mapPedDataToSchedule(result));

      // Success actions
      setIsModalOpen(false);
      setNewCategory("");
      setNewSubCategory("");
    } catch (err) {
      // Error handling is managed by the slice/effect
      console.error("Failed to add PED:", err);
    }
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
      <div className="flex justify-end mb-4 gap-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded border border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10 transition-colors"
        >
          <Plus size={16} />
          {t.addPed}
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
                {t.week1}
              </th>
              {/* Dosage */}
              <th className="bg-[#f0f0f0] text-[#1a1625] border-r border-[#ccc]">
                {t.dosage}
              </th>
              {/* Frequency */}
              <th className="bg-[#f0f0f0] text-[#1a1625] border-r border-[#ccc]">
                {t.frequency}
              </th>
              {/* Days */}
              {t.days.map((day, i) => (
                <th
                  key={day}
                  className={`bg-[#f0f0f0] text-[#1a1625] ${
                    i !== 6 ? "border-r border-[#ccc]" : ""
                  }`}
                >
                  {day}
                </th>
              ))}
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
                  {t.noData}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add PED Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1a1625] border border-[#4b3c5e] rounded-lg p-6 w-96 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">{t.addPed}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2 text-sm">
                  {t.category}
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. TEST"
                  className="w-full bg-[#0d0b14] border border-[#4b3c5e] rounded p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2 text-sm">
                  {t.subCategory}
                </label>
                <input
                  type="text"
                  value={newSubCategory}
                  onChange={(e) => setNewSubCategory(e.target.value)}
                  placeholder="e.g. TESTE"
                  className="w-full bg-[#0d0b14] border border-[#4b3c5e] rounded p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <button
                onClick={handleAddPed}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded transition-colors mt-2 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t.adding}
                  </>
                ) : (
                  t.addToDatabase
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PedTracker;
