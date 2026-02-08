"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Loader, X } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

const translations = {
  en: {
    titleAdd: "Add Supplement",
    titleEdit: "Edit Supplement",
    nameLabel: "Supplements Name *",
    timeLabel: "Time *",
    purposeLabel: "Purpose *",
    brandLabel: "Brand",
    commentLabel: "Comment",
    placeholderValue: "Insert a value",
    alertRequired: "Please fill in all required fields",
    alertSaveFailed: "Failed to save supplement. Please try again.",
    saveButton: "Save",
    saveButtonLoading: "Saving...",
  },
  de: {
    titleAdd: "Supplement hinzufügen",
    titleEdit: "Supplement bearbeiten",
    nameLabel: "Supplementname *",
    timeLabel: "Zeitpunkt *",
    purposeLabel: "Zweck *",
    brandLabel: "Marke",
    commentLabel: "Kommentar",
    placeholderValue: "Wert eingeben",
    alertRequired: "Bitte fülle alle Pflichtfelder aus",
    alertSaveFailed: "Speichern fehlgeschlagen. Bitte versuche es erneut.",
    saveButton: "Speichern",
    saveButtonLoading: "Speichern...",
  },
};

interface SupplementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    time: string;
    purpose: string;
    brand: string;
    comment: string;
  }) => void;
  initialData?: {
    name: string;
    time: string;
    purpose: string;
    brand: string;
    comment: string;
  };
}

export default function SupplementModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: SupplementModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    time: "",
    purpose: "",
    brand: "",
    comment: "",
  });

  const [loading, setLoading] = useState(false);
  const { language } = useAppSelector((state) => state.language);
  const t = translations[language as keyof typeof translations];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        time: "",
        purpose: "",
        brand: "",
        comment: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.time || !formData.purpose) {
      alert(t.alertRequired);
      return;
    }

    setLoading(true);
    try {
      onSave(formData);
    } catch (error) {
      alert(t.alertSaveFailed);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#08081A] border border-[#303245] rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {initialData ? t.titleEdit : t.titleAdd}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Name, Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.nameLabel}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t.placeholderValue}
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.timeLabel}
              </label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder={t.placeholderValue}
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Row 2: Purpose, Brand */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.purposeLabel}
              </label>
              <input
                type="text"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder={t.placeholderValue}
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.brandLabel}
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder={t.placeholderValue}
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                disabled={loading}
              />
            </div>
          </div>

          {/* Row 3: Comment (Full width textarea) */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t.commentLabel}
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder={t.placeholderValue}
              rows={3}
              className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A] resize-none"
              disabled={loading}
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-center items-center pt-4">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#4040D3] hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  {t.saveButtonLoading}
                </>
              ) : (
                t.saveButton
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
