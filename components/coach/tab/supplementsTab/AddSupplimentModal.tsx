"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  Supplement as CoachSupplement,
  CreateSupplementPayload,
} from "@/redux/features/supplement/coachSupplementSlice";
import {
  searchSupplements,
  Supplement as DbSupplement,
} from "@/redux/features/supplement/supplementSlice";

const translations = {
  en: {
    editSupplement: "Edit Supplement",
    addSupplement: "Add Supplement",
    supplementName: "Supplements Name",
    brand: "Brand",
    dosage: "Dosage",
    frequency: "Frequency",
    purpose: "Purpose",
    note: "Note",
    time: "Time",
    link: "Link",
    typePlaceholder: "Type..",
    save: "Save",
    cancel: "Cancel",
    searching: "Searching...",
    noMatches: "No matches found",
  },
  de: {
    editSupplement: "Ergänzungsmittel bearbeiten",
    addSupplement: "Ergänzungsmittel hinzufügen",
    supplementName: "Name des Ergänzungsmittels",
    brand: "Marke",
    dosage: "Dosierung",
    frequency: "Häufigkeit",
    purpose: "Zweck",
    note: "Notiz",
    time: "Zeit",
    link: "Link",
    typePlaceholder: "Eingeben..",
    save: "Speichern",
    cancel: "Abbrechen",
    searching: "Suche...",
    noMatches: "Keine Treffer gefunden",
  },
};

interface SupplementFormModalProps {
  isOpen: boolean;
  supplement: CoachSupplement | null;
  onClose: () => void;
  onSave: (data: CreateSupplementPayload) => void;
}

export default function AddSupplimentModal({
  isOpen,
  supplement,
  onClose,
  onSave,
}: SupplementFormModalProps) {
  const dispatch = useAppDispatch();
  const { language } = useAppSelector((state) => state.language);
  const t = translations[language as keyof typeof translations];

  // Initialize state from props if supplement exists, otherwise empty defaults
  // Note: We use a key on the modal or useEffect in parent to reset this when opening
  // But for now, we'll initialize it once.
  // Ideally, this component should be fully controlled or use a key to reset.
  // Assuming the parent handles the key or conditional rendering (which it does based on previous fixes).
  const [formData, setFormData] = useState<CreateSupplementPayload>({
    name: supplement?.name || "",
    dosage: supplement?.dosage || "",
    frequency: supplement?.frequency || "",
    purpose: supplement?.purpose || "",
    note: supplement?.note || "",
    time: supplement?.time || "",
    brand: supplement?.brand || "",
    productLink: supplement?.productLink || (supplement as any)?.link || "",
  });

  const [suggestions, setSuggestions] = useState<DbSupplement[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectSuggestion = (supp: DbSupplement) => {
    setFormData((prev) => {
      let actualLink = supp.productLink || (supp as any).link || prev.productLink;
      let actualFrequency = supp.frequency;
      
      // Legacy support: if the DB has the link stored in frequency
      if (supp.frequency && (supp.frequency.includes('http') || supp.frequency.includes('www.') || supp.frequency.includes('.com'))) {
        if (!supp.productLink && !(supp as any).link) {
          actualLink = supp.frequency;
        }
        actualFrequency = ""; // Clear frequency as it was mistakenly a link
      }

      return {
        ...prev,
        name: supp.name,
        brand: supp.brand || prev.brand,
        dosage: supp.dosage || prev.dosage,
        frequency: actualFrequency || prev.frequency,
        time: supp.time || prev.time,
        purpose: supp.purpose || prev.purpose,
        productLink: actualLink,
        note: supp.note || prev.note,
      };
    });
    setSuggestions([]);
    setShowDropdown(false);
  };

  useEffect(() => {
    const query = formData.name.trim();
    if (!query || query.length < 2) {
      return;
    }

    const handler = setTimeout(() => {
      setIsSearching(true);
      dispatch(
        searchSupplements({
          query,
          page: 1,
          limit: 10,
        }),
      )
        .unwrap()
        .then((res) => {
          setSuggestions(res.items);
        })
        .catch(() => {
          setSuggestions([]);
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 300);

    return () => clearTimeout(handler);
  }, [dispatch, formData.name]);

  const handleNameFocus = () => {
    setShowDropdown(true);

    if (suggestions.length > 0 || isSearching) return;

    setIsSearching(true);
    dispatch(
      searchSupplements({
        query: "",
        page: 1,
        limit: 50,
      }),
    )
      .unwrap()
      .then((res) => {
        setSuggestions(res.items);
      })
      .catch(() => {
        setSuggestions([]);
      })
      .finally(() => {
        setIsSearching(false);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-[#0f0f1e] border border-emerald-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl relative">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#2d2d45] sticky top-0 bg-[#0f0f1e] z-10">
            <h2 className="text-xl font-bold text-white">
              {supplement ? t.editSupplement : t.addSupplement}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#2d2d45] rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Supplement Name */}
              <div className="relative">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  {t.supplementName}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={handleNameFocus}
                  placeholder={t.typePlaceholder}
                  className="w-full bg-[#08081A] border border-[#303245] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  autoComplete="off"
                  required
                />
                {showDropdown && (
                  <div className="absolute z-20 mt-1 w-full bg-[#08081A] border border-[#303245] rounded-lg shadow-lg max-h-56 overflow-y-auto">
                    {isSearching && (
                      <div className="px-3 py-2 text-xs text-gray-400">
                        {t.searching}
                      </div>
                    )}
                    {!isSearching &&
                      suggestions.map((sugg) => (
                        <button
                          key={sugg._id}
                          type="button"
                          onClick={() => handleSelectSuggestion(sugg)}
                          className="w-full text-left px-3 py-2 hover:bg-[#1a1b2b] text-sm"
                        >
                          <div className="text-white">{sugg.name}</div>
                          {sugg.brand && (
                            <div className="text-xs text-gray-400">
                              {sugg.brand}
                            </div>
                          )}
                        </button>
                      ))}
                    {!isSearching && suggestions.length === 0 && (
                      <div className="px-3 py-2 text-xs text-gray-500">
                        {t.noMatches}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Brand */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{t.brand}</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder={t.typePlaceholder}
                  className="w-full bg-[#08081A] border border-[#303245] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dosage */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{t.dosage}</label>
                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  placeholder={t.typePlaceholder}
                  className="w-full bg-[#08081A] border border-[#303245] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  {t.frequency}
                </label>
                <input
                  type="text"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  placeholder={t.typePlaceholder}
                  className="w-full bg-[#08081A] border border-[#303245] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{t.time}</label>
                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder={t.typePlaceholder}
                  className="w-full bg-[#08081A] border border-[#303245] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{t.purpose}</label>
                <input
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder={t.typePlaceholder}
                  className="w-full bg-[#08081A] border border-[#303245] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>

              {/* Link */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{(t as any).link}</label>
                <input
                  type="text"
                  name="productLink"
                  value={formData.productLink}
                  onChange={handleChange}
                  placeholder={t.typePlaceholder}
                  className="w-full bg-[#08081A] border border-[#303245] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{t.note}</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder={t.typePlaceholder}
                className="w-full bg-[#08081A] border border-[#303245] rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 h-28 resize-none transition-colors"
              />
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#2d2d45]">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg bg-[#1a1a2e] border border-[#2d2d45] text-gray-300 hover:bg-[#25253e] font-medium transition-colors text-sm"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors text-sm"
              >
                {t.save}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
