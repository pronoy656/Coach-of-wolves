"use client";

import type React from "react";

import { useState } from "react";
import { X } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

const translations = {
  en: {
    editSupplement: "Edit Supplement",
    addSupplement: "Add Supplement",
    supplementName: "Supplements Name",
    dosage: "Dosage",
    frequency: "Frequency",
    purpose: "Purpose",
    note: "Note",
    typePlaceholder: "Type..",
    save: "Save",
  },
  de: {
    editSupplement: "Ergänzungsmittel bearbeiten",
    addSupplement: "Ergänzungsmittel hinzufügen",
    supplementName: "Name des Ergänzungsmittels",
    dosage: "Dosierung",
    frequency: "Häufigkeit",
    purpose: "Zweck",
    note: "Notiz",
    typePlaceholder: "Eingeben..",
    save: "Speichern",
  },
};

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  note: string;
}

interface SupplementFormModalProps {
  isOpen: boolean;
  supplement: Supplement | null;
  onClose: () => void;
  onSave: (data: Omit<Supplement, "id">) => void;
}

export default function AddSupplimentModal({
  isOpen,
  supplement,
  onClose,
  onSave,
}: SupplementFormModalProps) {
  const { language } = useAppSelector((state) => state.language);
  const t = translations[language as keyof typeof translations];

  const [formData, setFormData] = useState({
    name: supplement?.name || "",
    dosage: supplement?.dosage || "",
    frequency: supplement?.frequency || "",
    purpose: supplement?.purpose || "",
    note: supplement?.note || "",
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
              {supplement ? "Edit Supplement" : "Add Supplement"}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#303245] rounded-lg transition-colors text-gray-400 hover:text-white"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* First Row - Supplements Name, Dosage, Frequency */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t.supplementName}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t.typePlaceholder}
                    className="w-full px-3 py-2 bg-[#0F0F23] border border-[#303245] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring focus:ring-green-400/50 focus:border-green-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t.dosage}
                  </label>
                  <input
                    type="text"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleChange}
                    placeholder={t.typePlaceholder}
                    className="w-full px-3 py-2 bg-[#0F0F23] border border-[#303245] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring focus:ring-green-400/50 focus:border-green-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t.frequency}
                  </label>
                  <input
                    type="text"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    placeholder={t.typePlaceholder}
                    className="w-full px-3 py-2 bg-[#0F0F23] border border-[#303245] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring focus:ring-green-400/50 focus:border-green-400"
                    required
                  />
                </div>
              </div>

              {/* Second Row - Purpose, Note, Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t.purpose}
                  </label>
                  <input
                    type="text"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    placeholder={t.typePlaceholder}
                    className="w-full px-3 py-2 bg-[#0F0F23] border border-[#303245] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring focus:ring-green-400/50 focus:border-green-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t.note}
                  </label>
                  <input
                    type="text"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder={t.typePlaceholder}
                    className="w-full px-3 py-2 bg-[#0F0F23] border border-[#303245] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring focus:ring-green-400/50 focus:border-green-400"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#4040D3] text-white rounded-lg hover:bg-blue-600 transition-colors font-bold"
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
