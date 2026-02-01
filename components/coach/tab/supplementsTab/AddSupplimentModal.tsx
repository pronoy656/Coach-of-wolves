"use client";

import type React from "react";

import { useState } from "react";
import { X } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import {
  Supplement,
  CreateSupplementPayload,
} from "@/redux/features/supplement/coachSupplementSlice";

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
    typePlaceholder: "Type..",
    save: "Save",
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
    typePlaceholder: "Eingeben..",
    save: "Speichern",
  },
};

interface SupplementFormModalProps {
  isOpen: boolean;
  supplement: Supplement | null;
  onClose: () => void;
  onSave: (data: CreateSupplementPayload) => void;
}

export default function AddSupplimentModal({
  isOpen,
  supplement,
  onClose,
  onSave,
}: SupplementFormModalProps) {
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
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-[#08081A] border border-[#303245] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#303245] sticky top-0 bg-[#08081A]">
            <h2 className="text-2xl font-bold text-white">
              {supplement ? t.editSupplement : t.addSupplement}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#303245] rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Supplement Name */}
              <div>
                <label className="block text-gray-400 mb-2">
                  {t.supplementName}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t.typePlaceholder}
                  className="w-full bg-[#0B0C15] border border-[#303245] rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block text-gray-400 mb-2">{t.brand}</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder={t.typePlaceholder}
                  className="w-full bg-[#0B0C15] border border-[#303245] rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dosage */}
              <div>
                <label className="block text-gray-400 mb-2">{t.dosage}</label>
                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  placeholder={t.typePlaceholder}
                  className="w-full bg-[#0B0C15] border border-[#303245] rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-gray-400 mb-2">
                  {t.frequency}
                </label>
                <input
                  type="text"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  placeholder={t.typePlaceholder}
                  className="w-full bg-[#0B0C15] border border-[#303245] rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-gray-400 mb-2">{t.time}</label>
                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder={t.typePlaceholder}
                  className="w-full bg-[#0B0C15] border border-[#303245] rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-gray-400 mb-2">{t.purpose}</label>
                <input
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder={t.typePlaceholder}
                  className="w-full bg-[#0B0C15] border border-[#303245] rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-gray-400 mb-2">{t.note}</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder={t.typePlaceholder}
                className="w-full bg-[#0B0C15] border border-[#303245] rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 h-32 resize-none"
              />
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t border-[#303245]">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-[#1F2130] text-white hover:bg-[#303245] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors"
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
