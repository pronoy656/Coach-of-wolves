"use client";

import React, { useState } from "react";
import PedTab from "../tab/pedTab/PedTab";
import TimelineTab from "../tab/timelineTab/TimelineTab";
import SupplementsTab from "../tab/supplementsTab/SupplementsTab";
import NutritionTab from "../tab/nutritionTab/NutritionTab";
import TrainingTab from "../tab/trainingTab/TrainingTab";
import CheckInTab from "../tab/checkInTab/CheckInTab";
import DailyTrackingTab from "../tab/dailyTrackingTab/DailyTrackingTab";

// Define the tab types
type Tab =
  | "Daily Tracking"
  | "Check-Ins"
  | "Training"
  | "Nutrition"
  | "Supplements"
  | "Timeline"
  | "PED";

const tabs: Tab[] = [
  "Daily Tracking",
  "Check-Ins",
  "Training",
  "Nutrition",
  "Supplements",
  "Timeline",
  "PED",
];

interface CoachDashboardProps {
  athleteId: string;
}

export default function CoachDashboard({ athleteId }: CoachDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Daily Tracking");

  const renderContent = () => {
    switch (activeTab) {
      case "Daily Tracking":
        return (
          <div className="text-gray-400">
            <DailyTrackingTab />
          </div>
        );
      case "Check-Ins":
        return (
          <div className="text-gray-400">
            <CheckInTab athleteId={athleteId} />
          </div>
        );
      case "Training":
        return (
          <div className="text-gray-400">
            <TrainingTab athleteId={athleteId} />
          </div>
        );
      case "Nutrition":
        return (
          <div className="">
            <NutritionTab athleteId={athleteId} />
          </div>
        );
      case "Timeline":
        return (
          <div>
            <TimelineTab athleteId={athleteId} />
          </div>
        );
      case "Supplements":
        return (
          <div className="">
            <SupplementsTab athleteId={athleteId} />
          </div>
        );
      case "PED":
        return (
          <div className="">
            <PedTab />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full font-sans">
      {/* --- User's ID Display Section --- */}
      {/* <div className="border-b border-white/20 pb-6 mb-8">
        <p className="text-gray-300 text-lg">
          <span className="text-[#8CCA4D] font-medium">ID from URL:</span>{" "}
          <span className="mx-3 inline-block rounded-lg bg-[#16213e] px-4 py-2 text-2xl text-[#8CCA4D]">
            {athleteId}
          </span>
        </p>
      </div> */}

      {/* --- Navigation Tabs --- */}
      <div className="inline-flex w-full items-center rounded-full bg-[#0d0d18] px-2 py-2 sm:w-auto border border-white/5">
        <div className="flex w-full flex-row items-center justify-between gap-2 overflow-x-auto no-scrollbar sm:justify-start">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                whitespace-nowrap rounded-full px-12 py-3 text-sm font-medium transition-all duration-200 min-w-[120px] text-center
                ${activeTab === tab
                  ? "bg-[#4f961f] text-white shadow-sm"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* --- Content Area --- */}
      <div className="mt-8 min-h-[200px] w-full rounded-2xl bg-[#0d0d18] border border-white/5 p-8">
        {renderContent()}
      </div>
    </div>
  );
}
