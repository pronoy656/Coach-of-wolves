// import React from "react";

// export default function ShowManagementModal() {
//   return <div>ShowManagementModal</div>;
// }

"use client";

import type React from "react";

import { useState } from "react";

interface ShowFormData {
  showName: string;
  division: string;
  date: string;
  location: string;
  countdown: string;
}

interface ShowModalProps {
  show?: {
    id: string;
    showName: string;
    division: string;
    date: string;
    location: string;
    countdown: string;
  } | null;
  onSave: (data: ShowFormData) => void;
  onClose: () => void;
}

export default function ShowManagementModal({
  show,
  onSave,
  onClose,
}: ShowModalProps) {
  const [formData, setFormData] = useState<ShowFormData>({
    showName: show?.showName || "",
    division: show?.division || "",
    date: show?.date || "",
    location: show?.location || "",
    countdown: show?.countdown || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-card border border-border rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-foreground">
            {show ? "Edit Show" : "Add Show"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First row: Show Name, Division, Date */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Show Name
                </label>
                <input
                  type="text"
                  name="showName"
                  value={formData.showName}
                  onChange={handleChange}
                  placeholder="Insert a value"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Division
                </label>
                <input
                  type="text"
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  placeholder="Insert a value"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Date
                </label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  placeholder="Insert a value"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Second row: Location */}
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Insert a value"
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Third row: Countdown */}
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Countdown
              </label>
              <input
                type="text"
                name="countdown"
                value={formData.countdown}
                onChange={handleChange}
                placeholder="Insert a value"
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
