"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Loader, X } from "lucide-react";

interface SupplementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    dosage: string;
    time: string;
    purpose: string;
    brand: string;
    comment: string;
  }) => void;
  initialData?: {
    name: string;
    dosage: string;
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
    dosage: "",
    time: "",
    purpose: "",
    brand: "",
    comment: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        dosage: "",
        time: "",
        purpose: "",
        brand: "",
        comment: "",
      });
    }
  }, [initialData, isOpen]);

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      onSave(formData);
      setLoading(false);
    }, 2000); // 2 seconds loading
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#08081A] border border-[#303245] rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {initialData ? "Edit Supplement" : "Add Supplement"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Name, Dosage, Time */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Supplements Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Insert a value"
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Dosage</label>
              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                placeholder="Insert a value"
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Time</label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="Insert a value"
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
              />
            </div>
          </div>

          {/* Row 2: Purpose, Brand, Comment */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Purpose</label>
              <input
                type="text"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="Insert a value"
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Insert a value"
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Comment</label>
              <input
                type="text"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="Insert a value"
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center items-center pt-4">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#4040D3] hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
