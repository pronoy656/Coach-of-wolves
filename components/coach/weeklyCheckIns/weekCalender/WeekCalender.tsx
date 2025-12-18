"use client";

import { Calendar } from "lucide-react";

interface WeekCalendarProps {
  selectedWeek: string;
  onWeekChange: (week: string) => void;
}

export default function WeekCalender({
  selectedWeek,
  onWeekChange,
}: WeekCalendarProps) {
  const currentYear = new Date().getFullYear(); // << auto year

  // Generate weeks for the current year
  const generateWeeks = () => {
    const weeks = [];
    for (let i = 1; i <= 52; i++) {
      weeks.push(`Week ${i}`);
    }
    return weeks;
  };

  const weeks = generateWeeks();

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center ">
        <Calendar className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none " />
        <select
          value={selectedWeek}
          onChange={(e) => onWeekChange(e.target.value)}
          className="pl-10 pr-4 py-2 bg-[#08081A] border border-[#303245] rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer scrollbar-none"
        >
          {weeks.map((week) => (
            <option key={week} value={week}>
              {week} - {currentYear}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
