// import React from "react";

// export default function CheckInTab() {
//   return <div>CheckInTab</div>;
// }

"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import DeleteModal from "../../exerciseDatabase/deleteModal/DeleteModal";
import CheckInDetailsPage from "./CheckInDetailsPage";
// import { Input } from "@/components/ui/input"
// import CheckInDetail from "@/components/check-in-detail"
// import { DeleteModal } from "@/components/delete-modal"

interface CheckIn {
  id: string;
  date: string;
  weight: number;
  notes: string;
  status: "Completed" | "In Progress";
  wellBeing: {
    energyLevel: number;
    stressLevel: number;
    moodLevel: number;
    sleepQuality: number;
  };
  nutrition: {
    dietLevel: number;
    digestion: number;
    challengeDiet: string;
  };
  training: {
    feelStrength: number;
    pumps: number;
    trainingCompleted: boolean;
    cardioCompleted: boolean;
    feedbackTraining: string;
  };
  questions: Array<{ id: string; question: string; answer: string }>;
  images?: string[];
  videos?: string[];
}

const mockCheckIns: CheckIn[] = [
  {
    id: "1",
    date: "12/10/2022",
    weight: 52.8,
    notes: "Feeling Good, No Issues To Report",
    status: "Completed",
    wellBeing: {
      energyLevel: 7,
      stressLevel: 3,
      moodLevel: 8,
      sleepQuality: 8,
    },
    nutrition: {
      dietLevel: 7,
      digestion: 8,
      challengeDiet: "Intermittent Fasting",
    },
    training: {
      feelStrength: 8,
      pumps: 7,
      trainingCompleted: true,
      cardioCompleted: false,
      feedbackTraining: "Great session today",
    },
    questions: [
      {
        id: "1",
        question: "What went well last week?",
        answer: "AI: Training went well and my routine was pretty solid.",
      },
      {
        id: "2",
        question: "What are you proud of?",
        answer:
          "A2: I'm proud that I stayed consistent and showed up even on the days I didn't feel like it.",
      },
      {
        id: "3",
        question: "What do you want to share with me?",
        answer: "A3: I'm proud of my hard work and perseverance.",
      },
      {
        id: "4",
        question: "What went well last week?",
        answer: "A4: I completed all my tasks on time.",
      },
    ],
    images: [
      "/workout-image-1.jpg",
      "/workout-image-2.jpg",
      "/workout-image-3.jpg",
      "/workout-image-4.jpg",
    ],
    videos: ["/workout-video-thumbnail.jpg"],
  },
];

export default function CheckInTab() {
  const [selectedCheckIn, setSelectedCheckIn] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [checkIns, setCheckIns] = useState(mockCheckIns);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleUpdateCheckIn = (updatedCheckIn: CheckIn) => {
    setCheckIns(
      checkIns.map((c) => (c.id === updatedCheckIn.id ? updatedCheckIn : c))
    );
  };

  const handleDeleteCheckIn = () => {
    if (deleteId) {
      setCheckIns(checkIns.filter((c) => c.id !== deleteId));
      setDeleteId(null);
    }
  };

  const filteredCheckIns = checkIns.filter(
    (c) =>
      c.date.includes(searchQuery) ||
      c.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentCheckIn = checkIns.find((c) => c.id === selectedCheckIn);

  return (
    <div className="min-h-screen  p-6">
      <div className="">
        <h1 className="text-4xl font-bold text-white mb-8">Check-Ins</h1>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            placeholder="Search Here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 bg-[#08081A] border border-[#303245] rounded-lg text-white placeholder-gray-500 focus:border-[#00A63E]focus:ring-1 focus:ring-[#00A63E]"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - Weight Card & Check-in Detail */}
          <div className="lg:col-span-4">
            {currentCheckIn && (
              <>
                <div className="bg-gradient-to-br bg-[#08081A] border border-[#303245] rounded-xl p-6 mb-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm mb-3">
                        Check-in Date
                      </p>
                      <p className="text-white font-semibold text-lg mb-6">
                        {currentCheckIn.date}
                      </p>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-gray-400 uppercase tracking-wider mb-1">
                            Current Weight
                          </p>
                          <p className="text-[#69B427] text-2xl font-bold">
                            {currentCheckIn.weight} kg
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 uppercase tracking-wider mb-1">
                            Average Weight
                          </p>
                          <p className="text-[#69B427] text-2xl font-bold">
                            {currentCheckIn.weight.toFixed(1)} kg
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-sm font-medium rounded-lg">
                        {currentCheckIn.status}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-slate-700/50 pt-4 mt-4">
                    <p className="text-gray-300 text-sm">
                      {currentCheckIn.notes}
                    </p>
                  </div>
                </div>

                <CheckInDetailsPage
                  checkIn={currentCheckIn}
                  onUpdate={handleUpdateCheckIn}
                  onDelete={() => setDeleteId(currentCheckIn.id)}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {deleteId && (
        <DeleteModal
          isOpen={!!deleteId}
          title="Delete Check-In"
          message="Are you sure you want to delete this check-in? This action cannot be undone."
          onConfirm={handleDeleteCheckIn}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
