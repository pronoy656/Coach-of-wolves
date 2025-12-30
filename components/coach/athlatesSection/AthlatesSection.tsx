/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import AthleteCard from "../athlatesCard/AthlatesCard";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getAllAthletesByCoach } from "@/redux/features/athlete/athleteSlice";

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
  const dispatch = useAppDispatch();

  // ✅ Redux state থেকে athletes
  const athletes = useAppSelector((state) => state.athlete?.athletes || []);

  // Debug log
  console.log("AthletesSection rendered, athletes:", athletes);

  // Fetch athletes on mount
  useEffect(() => {
    console.log("useEffect called: fetching athletes");
    dispatch(getAllAthletesByCoach());
  }, [dispatch]);

  // Filter athletes based on search & selected filters
  const filteredAthletes = useMemo(() => {
    console.log("Filtering athletes, total:", athletes.length);
    return athletes.filter((athlete: any) => {
      if (selectedGender && athlete.gender !== selectedGender) return false;
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(athlete.category)
      )
        return false;
      if (selectedStatus.length > 0 && !selectedStatus.includes(athlete.status))
        return false;
      if (selectedPhase.length > 0 && !selectedPhase.includes(athlete.phase))
        return false;
      if (
        searchTerm &&
        !athlete.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      return true;
    });
  }, [
    athletes,
    selectedGender,
    selectedCategories,
    selectedStatus,
    selectedPhase,
    searchTerm,
  ]);

  return (
    <div className="bg-[#101021] rounded-xl p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-white mb-8">Your Athletes</h2>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search athletes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#08081A] border border-[#4A9E4A] rounded-lg px-5 py-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4A9E4A]"
          />
          <Search
            size={22}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        <button
          onClick={onFilterClick}
          className="bg-[#08081A] hover:bg-[#4A9E4A]/20 border border-[#4A9E4A] text-white rounded-lg px-6 py-4 flex items-center gap-3 transition-all"
        >
          <SlidersHorizontal size={22} />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Athletes List */}
      <div className="space-y-5">
        {filteredAthletes.length > 0 ? (
          filteredAthletes.map((athlete: any) => (
            <AthleteCard key={athlete._id} {...athlete} />
          ))
        ) : (
          <div className="text-center py-16 text-gray-500 text-lg">
            No athletes found matching your filters
          </div>
        )}
      </div>
    </div>
  );
}
