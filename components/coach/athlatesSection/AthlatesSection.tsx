// "use client";

// import { useState, useMemo } from "react";
// import { Search, SlidersHorizontal } from "lucide-react";
// import AthlatesCard from "../athlatesCard/AthlatesCard";

// interface Props {
//   selectedGender: string | null;
//   selectedCategories: string[];
//   selectedStatus: string[];
//   selectedPhase: string[];
//   onFilterClick: () => void;
// }

// export default function AthletesSection({
//   selectedGender,
//   selectedCategories,
//   selectedStatus,
//   selectedPhase,
//   onFilterClick,
// }: Props) {
//   const [searchTerm, setSearchTerm] = useState("");

//   const athletes = [
//     {
//       id: "1",
//       name: "Sarah",
//       status: "Natural",
//       category: "Bikini",
//       phase: "Prep",
//       daysAway: "84 D Away",
//       image: "/avater-1.jpg",
//       gender: "Female",
//     },
//     {
//       id: "2 ",
//       name: "Mike Chen",
//       status: "Enhanced",
//       category: "Classic Physique",
//       phase: "Peak Week",
//       daysAway: "5 D Away",
//       image: "/avater-1.jpg",
//       gender: "Male",
//     },
//     {
//       id: "3",
//       name: "Alex",
//       status: "Enhanced",
//       category: "Bodybuilding",
//       phase: "Diet Break",
//       daysAway: "140 D Away",
//       image: "/avater-1.jpg",
//       gender: "Male",
//     },
//     {
//       id: "4",
//       name: "Jessica",
//       status: "Natural",
//       category: "Figure",
//       phase: "Pre-Prep",
//       daysAway: "120 D Away",
//       image: "/avater-1.jpg",
//       gender: "Female",
//     },
//     {
//       id: "5",
//       name: "James",
//       status: "Natural",
//       category: "Men's Physique",
//       phase: "Prep",
//       daysAway: "60 D Away",
//       image: "/avater-1.jpg",
//       gender: "Male",
//     },
//   ];

//   const filteredAthletes = useMemo(() => {
//     return athletes.filter((athlete) => {
//       // Gender filter
//       if (selectedGender && athlete.gender !== selectedGender) return false;

//       // Category filter - only apply if categories are selected
//       if (
//         selectedCategories.length > 0 &&
//         !selectedCategories.includes(athlete.category)
//       )
//         return false;

//       // Status filter - only apply if statuses are selected
//       if (selectedStatus.length > 0 && !selectedStatus.includes(athlete.status))
//         return false;

//       // Phase filter - only apply if phases are selected
//       if (selectedPhase.length > 0 && !selectedPhase.includes(athlete.phase))
//         return false;

//       // Search filter
//       if (
//         searchTerm &&
//         !athlete.name.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//         return false;

//       return true;
//     });
//   }, [
//     selectedGender,
//     selectedCategories,
//     selectedStatus,
//     selectedPhase,
//     searchTerm,
//   ]);

//   return (
//     <div className="bg-[#101021] rounded-lg p-6">
//       <h2 className="text-2xl font-bold mb-6">Your Athletes</h2>

//       <div className="flex gap-3 mb-6">
//         <div className="flex-1 relative">
//           <input
//             type="text"
//             placeholder="Search Here..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full bg-[#08081A] border border-[#4A9E4A] rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//           />
//           <Search
//             size={20}
//             className="absolute right-4 top-3 text-muted-foreground"
//           />
//         </div>

//         {/* Filter button */}
//         <button
//           onClick={onFilterClick}
//           className="bg-[#08081A] hover:bg-green-500/90 border border-[#4A9E4A] text-primary-foreground rounded-lg px-4 py-3 flex items-center gap-2 transition-colors"
//         >
//           <SlidersHorizontal size={20} />
//         </button>
//       </div>

//       {/* Athletes List */}
//       <div className="space-y-4">
//         {filteredAthletes.length > 0 ? (
//           filteredAthletes.map((athlete, i) => (
//             <AthlatesCard key={i} {...athlete} />
//           ))
//         ) : (
//           <div className="text-center py-8 text-muted-foreground">
//             No athletes found matching your filters
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import AthleteCard from "../athlatesCard/AthlatesCard";

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
      id: "1",
      name: "Sarah",
      status: "Natural" as const,
      category: "Bikini",
      phase: "Prep",
      daysAway: "84 D Away",
      image: "/avater-1.jpg",
      gender: "Female",
    },
    {
      id: "2",
      name: "Mike Chen",
      status: "Enhanced" as const,
      category: "Classic Physique",
      phase: "Peak Week",
      daysAway: "5 D Away",
      image: "/avater-1.jpg",
      gender: "Male",
    },
    {
      id: "3",
      name: "Alex",
      status: "Enhanced" as const,
      category: "Bodybuilding",
      phase: "Diet Break",
      daysAway: "140 D Away",
      image: "/avater-1.jpg",
      gender: "Male",
    },
    {
      id: "4",
      name: "Jessica",
      status: "Natural" as const,
      category: "Figure",
      phase: "Pre-Prep",
      daysAway: "120 D Away",
      image: "/avater-1.jpg",
      gender: "Female",
    },
    {
      id: "5",
      name: "James",
      status: "Natural" as const,
      category: "Men's Physique",
      phase: "Prep",
      daysAway: "60 D Away",
      image: "/avater-1.jpg",
      gender: "Male",
    },
  ];

  const filteredAthletes = useMemo(() => {
    return athletes.filter((athlete) => {
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
    selectedGender,
    selectedCategories,
    selectedStatus,
    selectedPhase,
    searchTerm,
  ]);

  return (
    <div className="bg-[#101021] rounded-xl p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-white mb-8">Your Athletes</h2>

      <div className="flex flex-col sm:flex-row gap-4 gap-4 mb-8">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search athletes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#08081A] border border-[#4A9E4A] rounded-lg px-5 py-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4A9E4A] focus:border-transparent"
          />
          <Search
            size={22}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        <button
          onClick={onFilterClick}
          className="bg-[#08081A] hover:bg-[#4A9E4A]/20 border border-[#4A9E4A] text-white rounded-lg px-6 py-4 flex items-center justify-center gap-3 transition-all"
        >
          <SlidersHorizontal size={22} />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      <div className="space-y-5">
        {filteredAthletes.length > 0 ? (
          filteredAthletes.map((athlete) => (
            <AthleteCard key={athlete.id} {...athlete} />
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
