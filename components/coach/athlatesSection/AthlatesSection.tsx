"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import AthlatesCard from "../athlatesCard/AthlatesCard";

interface Props {
  selectedGender: string | null;
  selectedCategories: string[];
  selectedStatus: string[];
  selectedPhase: string[];
  onFilterClick: () => void;
}

export default function AthletesSection({
  selectedGender,
  selectedCategories,
  selectedStatus,
  selectedPhase,
  onFilterClick,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const athletes = [
    {
      name: "Sarah",
      status: "Natural",
      category: "Bikini",
      phase: "Prep",
      daysAway: "84 D Away",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      gender: "Female",
    },
    {
      name: "Mike Chen",
      status: "Enhanced",
      category: "Classic Physique",
      phase: "Peak Week",
      daysAway: "5 D Away",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      gender: "Male",
    },
    {
      name: "Alex",
      status: "Enhanced",
      category: "Bodybuilding",
      phase: "Diet Break",
      daysAway: "140 D Away",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      gender: "Male",
    },
    {
      name: "Jessica",
      status: "Natural",
      category: "Figure",
      phase: "Pre-Prep",
      daysAway: "120 D Away",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      gender: "Female",
    },
    {
      name: "James",
      status: "Natural",
      category: "Men's Physique",
      phase: "Prep",
      daysAway: "60 D Away",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      gender: "Male",
    },
  ];

  const filteredAthletes = useMemo(() => {
    return athletes.filter((athlete) => {
      // Gender filter
      if (selectedGender && athlete.gender !== selectedGender) return false;

      // Category filter - only apply if categories are selected
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(athlete.category)
      )
        return false;

      // Status filter - only apply if statuses are selected
      if (selectedStatus.length > 0 && !selectedStatus.includes(athlete.status))
        return false;

      // Phase filter - only apply if phases are selected
      if (selectedPhase.length > 0 && !selectedPhase.includes(athlete.phase))
        return false;

      // Search filter
      if (
        searchTerm &&
        !athlete.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;

      return true;
    });
  }, [
    selectedGender,
    selectedCategories,
    selectedStatus,
    selectedPhase,
    searchTerm,
  ]);

  return (
    <div className="bg-[#101021] rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Your Athletes</h2>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search Here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#08081A] border border-[#4A9E4A] rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search
            size={20}
            className="absolute right-4 top-3 text-muted-foreground"
          />
        </div>

        {/* Filter button */}
        <button
          onClick={onFilterClick}
          className="bg-[#08081A] hover:bg-green-500/90 border border-[#4A9E4A] text-primary-foreground rounded-lg px-4 py-3 flex items-center gap-2 transition-colors"
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>

      {/* Athletes List */}
      <div className="space-y-4">
        {filteredAthletes.length > 0 ? (
          filteredAthletes.map((athlete, i) => (
            <AthlatesCard key={i} {...athlete} />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No athletes found matching your filters
          </div>
        )}
      </div>
    </div>
  );
}
