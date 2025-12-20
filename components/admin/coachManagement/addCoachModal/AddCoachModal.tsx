"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Loader, X } from "lucide-react";

interface CoachModalProps {
  coach?: {
    id: string;
    name: string;
    email: string;
    status: "Active" | "Inactive";
    image?: string;
  } | null;
  onSave: (data: {
    name: string;
    email: string;
    status: "Active" | "Inactive";
    image?: string;
  }) => void;
  onClose: () => void;
}

export default function AddCoachModal({
  coach,
  onSave,
  onClose,
}: CoachModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "Active" as "Active" | "Inactive",
    image: "",
  });

  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (coach) {
      setFormData({
        name: coach.name,
        email: coach.email,
        status: coach.status,
        image: coach.image || "",
      });
    }
  }, [coach]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Form Data:", JSON.stringify(formData, null, 2));

    setTimeout(() => {
      onSave(formData);
      setLoading(false);
    }, 800);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-[#08081A] border border-[#303245] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-none">
          <div className="flex items-center justify-between p-6 border-b border-[#303245] sticky top-0 bg-card/95 backdrop-blur-sm">
            <h2 className="text-xl font-bold">
              {coach ? "Edit Coach" : "Add Coach"}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Insert a value"
                className="w-full bg-input border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Insert a value"
                className="w-full bg-[#08081A] border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full bg-[#08081A] border border-[#303245] rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4A9E4A]"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium items-center gap-2 mb-4">
                <span>Upload Image</span>
              </label>
              <label className="block w-full cursor-pointer">
                <div className="border-2 border-dashed border-[#4A9E4A] bg-[#4A9E4A]/20 rounded-lg p-8 text-center hover:bg-primary/20 transition-colors ">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <svg
                    className="w-8 h-8 mx-auto mb-2 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <p className="text-primary font-medium">
                    {fileName || "Select File"}
                  </p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4040D3] hover:bg-blue-700 disabled:bg-primary/60 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <span>{coach ? "Update Coach" : "Create Coach"}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
