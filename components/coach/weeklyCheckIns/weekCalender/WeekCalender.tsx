
"use client";

import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";

interface WeekCalendarProps {
  selectedWeek: string;
  onWeekChange: (week: string) => void;
}

export default function WeekCalender({
  selectedWeek,
  onWeekChange,
}: WeekCalendarProps) {
  const [availableWeeks, setAvailableWeeks] = useState<string[]>(["Week 1"]);
  const [maxWeek, setMaxWeek] = useState<number>(1);

  // Generate weeks based on data or current date
  useEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const days = Math.floor((currentDate.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const currentWeek = Math.ceil((days + 1) / 7);

    setMaxWeek(Math.min(currentWeek, 52)); // Cap at 52 weeks
    const weeks = [];
    for (let i = 1; i <= currentWeek && i <= 52; i++) {
      weeks.push(`Week ${i}`);
    }
    setAvailableWeeks(weeks);

    // Set default to current week if not already set
    if (!weeks.includes(selectedWeek)) {
      onWeekChange(`Week ${currentWeek}`);
    }
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center">
        <Calendar className="absolute left-3 w-4 h-4 text-gray-500 pointer-events-none" />
        <select
          value={selectedWeek}
          onChange={(e) => onWeekChange(e.target.value)}
          className="pl-10 pr-4 py-2 bg-[#08081A] border border-[#303245] rounded-lg text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer min-w-[150px]"
        >
          {availableWeeks.map((week) => {
            const weekNum = parseInt(week.replace("Week ", ""));
            const isFuture = weekNum > maxWeek;

            return (
              <option
                key={week}
                value={week}
                disabled={isFuture}
                className={isFuture ? "text-gray-500" : ""}
              >
                {week} - {new Date().getFullYear()}
              </option>
            );
          })}
        </select>
      </div>
      <div className="text-sm text-gray-400">
        {availableWeeks.length} weeks available
      </div>
    </div>
  );
}