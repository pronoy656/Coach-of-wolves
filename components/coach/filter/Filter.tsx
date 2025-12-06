// import React from 'react'

// export default function Filter() {
//   return (
//     <div>Filter</div>
//   )
// }

"use client";

interface Props {
  selectedGender: string | null;
  selectedCategories: string[];
  selectedStatus: string[];
  selectedPhase: string[];
  onGenderChange: (gender: string) => void;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: string) => void;
  onPhaseChange: (phase: string) => void;
}

const maleCategories = [
  "Lifestyle",
  "Men's Physique",
  "Classic Physique",
  "212 Bodybuilding",
  "Bodybuilding",
  "Other",
];

const femaleCategories = [
  "Lifestyle",
  "Fitmodel",
  "Bikini",
  "Figure",
  "Wellness",
  "Women's Physique",
  "Women's Bodybuilding",
  "Other",
];

const statuses = ["Natural", "Enhanced"];
const phases = [
  "Pre-Prep",
  "Ofsession",
  "Peak Week",
  "Diet Break",
  "Prep",
  "Diet- Break",
  "Fat- Reduction Phase",
  "Reverse- Diet-Phase",
];

export default function Filter({
  selectedGender,
  selectedCategories,
  selectedStatus,
  selectedPhase,
  onGenderChange,
  onCategoryChange,
  onStatusChange,
  onPhaseChange,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Gender */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Gender</h3>
        <div className="space-y-2">
          {["Male", "Female"].map((gender) => (
            <label
              key={gender}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedGender === gender}
                onChange={() => onGenderChange(gender)}
                className="w-4 h-4 rounded border-2 border-primary cursor-pointer"
              />
              <span className="text-sm text-foreground">{gender}</span>
            </label>
          ))}
        </div>
      </div>

      {selectedGender === "Male" && (
        <div>
          <h3 className="font-semibold text-foreground mb-3">
            Category (Male)
          </h3>
          <div className="space-y-2">
            {maleCategories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => onCategoryChange(category)}
                  className="w-4 h-4 rounded border-2 border-primary cursor-pointer"
                />
                <span className="text-sm text-foreground">{category}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {selectedGender === "Female" && (
        <div>
          <h3 className="font-semibold text-foreground mb-3">
            Category (Female)
          </h3>
          <div className="space-y-2">
            {femaleCategories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => onCategoryChange(category)}
                  className="w-4 h-4 rounded border-2 border-primary cursor-pointer"
                />
                <span className="text-sm text-foreground">{category}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Status */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Status</h3>
        <div className="space-y-2">
          {statuses.map((status) => (
            <label
              key={status}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedStatus.includes(status)}
                onChange={() => onStatusChange(status)}
                className="w-4 h-4 rounded border-2 border-primary cursor-pointer"
              />
              <span className="text-sm text-foreground">{status}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Phase */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Phase</h3>
        <div className="space-y-2">
          {phases.map((phase) => (
            <label
              key={phase}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedPhase.includes(phase)}
                onChange={() => onPhaseChange(phase)}
                className="w-4 h-4 rounded border-2 border-primary cursor-pointer"
              />
              <span className="text-sm text-foreground">{phase}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
