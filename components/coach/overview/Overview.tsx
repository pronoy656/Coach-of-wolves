// import React from "react";
// import StatsCard from "../stattsCard/StatsCard";

// export default function Overview() {
//   return (
//     <div>
//       <StatsCard />
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import StatsCard from "../stattsCard/StatsCard";
import AthletesSection from "../athlatesSection/AthlatesSection";
import Filter from "../filter/Filter";

// import StatsCards from "@/components/stats-cards"
// import AthletesSection from "@/components/athletes-section"
// import FilterPanel from "@/components/filter-panel"

export default function Dashboard() {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  const handleGenderChange = (gender: string) => {
    setSelectedGender(selectedGender === gender ? null : gender);
    setSelectedCategories([]);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handlePhaseChange = (phase: string) => {
    setSelectedPhase((prev) =>
      prev.includes(phase) ? prev.filter((p) => p !== phase) : [...prev, phase]
    );
  };

  return (
    <div className="flex h-screen bg-background text-foreground dark">
      <div className="flex-1 overflow-hidden flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <StatsCard />
            <AthletesSection
              selectedGender={selectedGender}
              selectedCategories={selectedCategories}
              selectedStatus={selectedStatus}
              selectedPhase={selectedPhase}
              onFilterClick={() => setShowFilter(true)}
            />
          </div>
        </main>
      </div>

      {showFilter && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowFilter(false)}
          />
          <div className="fixed right-0 top-0 h-full w-96 bg-background border-l border-border overflow-y-auto z-50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button
                  onClick={() => setShowFilter(false)}
                  className="text-muted-foreground hover:text-foreground text-2xl"
                >
                  ×
                </button>
              </div>
              <Filter
                selectedGender={selectedGender}
                selectedCategories={selectedCategories}
                selectedStatus={selectedStatus}
                selectedPhase={selectedPhase}
                onGenderChange={handleGenderChange}
                onCategoryChange={handleCategoryChange}
                onStatusChange={handleStatusChange}
                onPhaseChange={handlePhaseChange}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
